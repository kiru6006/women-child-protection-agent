from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.app.core.auth import ActorContext, HUMAN_VALIDATOR_ROLES, enforce_domain_a_write, get_actor_context
from backend.app.core.pii_guard import reject_raw_pii
from backend.app.db.database import get_db
from backend.app.db.models import (
    ActionItemDB,
    ContinuityTokenDB,
    DecisionRecordDB,
    DependencyDB,
    GroundTruthCallbackDB,
    MatterDB,
    NotificationDB,
    RecognitionNominationDB,
)
from backend.app.services.audit_service import audit_service
from backend.app.services.execution_engine import (
    detect_dependency_cycles,
    detect_recurring_problems,
    emit_notification_dedup,
    now_iso,
    validate_action_transition,
    validate_matter_closure,
)

exec_router = APIRouter(tags=["Execution Engine"])


def _get_or_404(db: Session, model, entity_id: str, label: str):
    """Fetch primary-key entity or raise 404 consistently across execution endpoints."""
    row = db.query(model).filter(model.id == entity_id).first()
    if not row:
        raise HTTPException(status_code=404, detail=f"{label} not found")
    return row


class MatterCreate(BaseModel):
    title: str = Field(..., min_length=4, max_length=256)
    domain: str = Field("WOMEN", pattern="^(WOMEN|CHILD)$")
    category: str = "SYSTEMIC_GAP"
    jurisdiction: str = "Patna, Bihar"
    severity: str = "HIGH"
    coordinating_authority: str = "DISTRICT_COLLECTOR_PATNA"
    responsible_authority: str = "DWCD_PATNA"
    responsible_department: str = "Women & Child Development"


class MatterStatusPatch(BaseModel):
    matter_status: Optional[str] = None
    outcome_status: Optional[str] = None
    court_compliance_status: Optional[str] = None
    financial_status: Optional[str] = None


class ActionCreate(BaseModel):
    matter_id: str
    intervention_id: Optional[str] = None
    title: str = Field(..., min_length=3, max_length=256)
    description: str = Field(..., min_length=3)
    responsible_department: str = Field(..., min_length=2)
    responsible_role: str = Field(..., min_length=2)
    accountable_authority: str = "DISTRICT_COLLECTOR_PATNA"
    coordinating_authority: str = "DISTRICT_COLLECTOR_PATNA"
    required_deliverable: str = "Verified service delivery report"
    timeline_date: str = "2026-12-15"
    completion_criteria: str = "Deliverable verified with supporting evidence"
    required_evidence: str = "Signed inspection / receipt"
    dependency_ids: List[str] = Field(default_factory=list)
    escalation_authority: str = "STATE_WCD_SECRETARY"


class ActionTransitionPayload(BaseModel):
    target_status: str
    progress_note: Optional[str] = None
    completion_evidence_ref: Optional[str] = None


class ActionDisputePayload(BaseModel):
    reason: str = Field(..., min_length=4)


class ActionTransferPayload(BaseModel):
    new_role: str = Field(..., min_length=2)
    reason: str = Field(..., min_length=3)


class DependencyCreate(BaseModel):
    matter_id: str
    dep_type: str = "DEPARTMENTAL_APPROVAL"
    predecessor_action_id: Optional[str] = None
    dependent_action_id: Optional[str] = None
    predecessor_node: str
    dependent_node: str
    owner_role: str
    supporting_authority: str = "DISTRICT_COLLECTOR_PATNA"
    reason: str
    is_lawful_wait: bool = False
    due_date: str = "2026-12-10"
    escalation_authority: str = "STATE_WCD_SECRETARY"


class DependencyStatusPatch(BaseModel):
    status: str


class DecisionCreate(BaseModel):
    matter_id: str
    queue_type: str
    title: str
    decision_action: str = Field(..., pattern="^(APPROVED|REJECTED|RETURNED|INFO_REQUESTED|ESCALATED|SCHEDULED)$")
    rationale: str = Field(..., min_length=4)


@exec_router.get("/matters")
def list_matters(
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    rows = db.query(MatterDB).all()
    if actor.role == "NGO_PARTNER":
        rows = [r for r in rows if "NGO" in r.responsible_department.upper()]
    return rows


@exec_router.get("/matters/{matter_id}")
def get_matter(
    matter_id: str,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    matter = db.query(MatterDB).filter(MatterDB.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found")
    if actor.role == "NGO_PARTNER" and "NGO" not in matter.responsible_department.upper():
        raise HTTPException(status_code=403, detail="NGO partner cannot access unrelated matter records.")
    return matter


@exec_router.post("/matters", status_code=201)
def create_matter(
    payload: MatterCreate,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    enforce_domain_a_write(payload.domain)
    reject_raw_pii(payload.title, payload.jurisdiction)
    new_id = f"MTR-2026-{payload.domain[0]}-{db.query(MatterDB).count() + 101}"
    now = now_iso()
    row = MatterDB(
        id=new_id,
        demo_code=f"DEMO-{db.query(MatterDB).count() + 1:02d}",
        title=payload.title,
        domain=payload.domain,
        category=payload.category,
        jurisdiction=payload.jurisdiction,
        severity=payload.severity,
        matter_status="OPEN",
        admin_status="NOT_STARTED",
        coordinating_authority=payload.coordinating_authority,
        responsible_authority=payload.responsible_authority,
        responsible_department=payload.responsible_department,
        is_synthetic=1,
        created_at=now,
        updated_at=now,
    )
    db.add(row)
    audit_service.append_event(actor.role, "CREATE_MATTER", "MATTER", new_id, payload.title)
    db.commit()
    db.refresh(row)
    return row


@exec_router.patch("/matters/{matter_id}/status")
def update_matter_status(
    matter_id: str,
    payload: MatterStatusPatch,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    matter = db.query(MatterDB).filter(MatterDB.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found")
    enforce_domain_a_write(matter.domain)
    if payload.outcome_status:
        matter.outcome_status = payload.outcome_status
    if payload.court_compliance_status:
        matter.court_compliance_status = payload.court_compliance_status
    if payload.financial_status:
        matter.financial_status = payload.financial_status
    if payload.matter_status:
        validate_matter_closure(matter, payload.matter_status, db)
        matter.matter_status = payload.matter_status
    matter.updated_at = now_iso()
    audit_service.append_event(actor.role, "UPDATE_MATTER_STATUS", "MATTER", matter_id, f"Status={matter.matter_status}")
    db.commit()
    db.refresh(matter)
    return matter


@exec_router.get("/actions")
def list_actions(
    role_filter: Optional[str] = Query(None),
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    rows = db.query(ActionItemDB).all()
    if actor.role == "NGO_PARTNER":
        rows = [a for a in rows if "NGO" in a.responsible_department.upper() or a.responsible_role == "NGO_PARTNER"]
    elif role_filter:
        rows = [a for a in rows if a.responsible_role == role_filter]
    return rows


@exec_router.post("/actions", status_code=201)
def create_action(
    payload: ActionCreate,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    matter = db.query(MatterDB).filter(MatterDB.id == payload.matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Parent matter not found")
    enforce_domain_a_write(matter.domain)
    reject_raw_pii(payload.title, payload.description, payload.completion_criteria)

    new_id = f"ACT-{db.query(ActionItemDB).count() + 101}"
    row = ActionItemDB(
        id=new_id,
        matter_id=payload.matter_id,
        intervention_id=payload.intervention_id,
        title=payload.title,
        description=payload.description,
        responsible_department=payload.responsible_department,
        responsible_role=payload.responsible_role,
        accountable_authority=payload.accountable_authority,
        coordinating_authority=payload.coordinating_authority,
        assigned_date=now_iso()[:10],
        acknowledged=0,
        required_deliverable=payload.required_deliverable,
        timeline_date=payload.timeline_date,
        completion_criteria=payload.completion_criteria,
        required_evidence=payload.required_evidence,
        dependency_ids=payload.dependency_ids,
        escalation_authority=payload.escalation_authority,
        status="ASSIGNED",
        progress_updates=[],
        transfer_history=[],
    )
    db.add(row)
    emit_notification_dedup(
        db,
        dedup_key=f"ASSIGN:{new_id}:{payload.responsible_role}",
        target_role=payload.responsible_role,
        event_type="ACTION_ASSIGNED",
        message=f"Action {new_id} assigned: {payload.title}",
        matter_id=payload.matter_id,
        action_id=new_id,
    )
    audit_service.append_event(actor.role, "CREATE_ACTION", "ACTION", new_id, f"Assigned to {payload.responsible_role}")
    db.commit()
    db.refresh(row)
    return row


@exec_router.post("/actions/{action_id}/acknowledge")
def acknowledge_action(
    action_id: str,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(ActionItemDB).filter(ActionItemDB.id == action_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Action not found")
    validate_action_transition(db, row, "ACKNOWLEDGED")
    row.acknowledged = 1
    row.acknowledged_at = now_iso()
    row.status = "ACKNOWLEDGED"
    audit_service.append_event(actor.role, "ACKNOWLEDGE_ACTION", "ACTION", action_id, "Assignment acknowledged")
    db.commit()
    db.refresh(row)
    return row


@exec_router.post("/actions/{action_id}/transition")
def transition_action(
    action_id: str,
    payload: ActionTransitionPayload,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(ActionItemDB).filter(ActionItemDB.id == action_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Action not found")
    if payload.target_status == "VERIFIED" and actor.role not in HUMAN_VALIDATOR_ROLES:
        raise HTTPException(status_code=403, detail="Only human authority can verify action completion.")
    validate_action_transition(db, row, payload.target_status, payload.completion_evidence_ref)
    if payload.completion_evidence_ref:
        row.completion_evidence_ref = payload.completion_evidence_ref
    if payload.progress_note:
        reject_raw_pii(payload.progress_note)
        updates = list(row.progress_updates or [])
        updates.append({"timestamp": now_iso(), "actor": actor.role, "note": payload.progress_note})
        row.progress_updates = updates
    row.status = payload.target_status
    audit_service.append_event(actor.role, "TRANSITION_ACTION", "ACTION", action_id, f"Status={payload.target_status}")
    db.commit()
    db.refresh(row)
    return row


@exec_router.post("/actions/{action_id}/dispute")
def dispute_action_assignment(
    action_id: str,
    payload: ActionDisputePayload,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(ActionItemDB).filter(ActionItemDB.id == action_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Action not found")
    reject_raw_pii(payload.reason)
    row.status = "DRAFT"
    row.dispute_reason = payload.reason
    emit_notification_dedup(
        db,
        dedup_key=f"DISPUTE:{action_id}:{row.coordinating_authority}",
        target_role=row.coordinating_authority,
        event_type="ASSIGNMENT_DISPUTED",
        message=f"Action {action_id} returned by {actor.role}: {payload.reason}",
        matter_id=row.matter_id,
        action_id=action_id,
    )
    audit_service.append_event(actor.role, "DISPUTE_ACTION", "ACTION", action_id, payload.reason)
    db.commit()
    db.refresh(row)
    return row


@exec_router.post("/actions/{action_id}/transfer")
def transfer_action_role(
    action_id: str,
    payload: ActionTransferPayload,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(ActionItemDB).filter(ActionItemDB.id == action_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Action not found")
    history = list(row.transfer_history or [])
    history.append({"date": now_iso()[:10], "from_role": row.responsible_role, "to_role": payload.new_role, "reason": payload.reason})
    row.transfer_history = history
    row.responsible_role = payload.new_role
    audit_service.append_event(actor.role, "TRANSFER_ACTION_ROLE", "ACTION", action_id, f"To {payload.new_role}")
    db.commit()
    db.refresh(row)
    return row


@exec_router.get("/dependencies")
def list_dependencies(db: Session = Depends(get_db)):
    rows = db.query(DependencyDB).all()
    cycles = detect_dependency_cycles(rows)
    return {"items": rows, "cycles": cycles}


@exec_router.post("/dependencies", status_code=201)
def create_dependency(
    payload: DependencyCreate,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    reject_raw_pii(payload.reason)
    new_id = f"DEP-{db.query(DependencyDB).count() + 101}"
    candidate = DependencyDB(
        id=new_id,
        matter_id=payload.matter_id,
        dep_type=payload.dep_type,
        predecessor_action_id=payload.predecessor_action_id,
        dependent_action_id=payload.dependent_action_id,
        predecessor_node=payload.predecessor_node,
        dependent_node=payload.dependent_node,
        owner_role=payload.owner_role,
        supporting_authority=payload.supporting_authority,
        reason=payload.reason,
        status="OPEN",
        is_lawful_wait=1 if payload.is_lawful_wait else 0,
        due_date=payload.due_date,
        escalation_authority=payload.escalation_authority,
    )
    existing = db.query(DependencyDB).all()
    cycles = detect_dependency_cycles(existing + [candidate])
    if cycles:
        raise HTTPException(status_code=422, detail=f"Circular dependency rejected: {cycles[0]}")
    db.add(candidate)
    audit_service.append_event(actor.role, "CREATE_DEPENDENCY", "DEPENDENCY", new_id, f"{payload.predecessor_node}->{payload.dependent_node}")
    db.commit()
    db.refresh(candidate)
    return candidate


@exec_router.patch("/dependencies/{dep_id}/status")
def update_dependency_status(
    dep_id: str,
    payload: DependencyStatusPatch,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(DependencyDB).filter(DependencyDB.id == dep_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Dependency not found")
    row.status = payload.status
    if payload.status == "RESOLVED" and row.dependent_action_id:
        act = db.query(ActionItemDB).filter(ActionItemDB.id == row.dependent_action_id).first()
        if act:
            emit_notification_dedup(
                db,
                dedup_key=f"DEP_RESOLVED:{dep_id}:{act.id}",
                target_role=act.responsible_role,
                event_type="DEPENDENCY_RESOLVED",
                message=f"Dependency {dep_id} resolved; {act.id} is now eligible to proceed.",
                matter_id=act.matter_id,
                action_id=act.id,
            )
    audit_service.append_event(actor.role, "UPDATE_DEPENDENCY", "DEPENDENCY", dep_id, f"Status={payload.status}")
    db.commit()
    db.refresh(row)
    return row


@exec_router.get("/decisions")
def list_decisions(db: Session = Depends(get_db)):
    return db.query(DecisionRecordDB).all()


@exec_router.post("/decisions", status_code=201)
def record_decision(
    payload: DecisionCreate,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    if payload.decision_action == "APPROVED" and actor.role not in HUMAN_VALIDATOR_ROLES:
        raise HTTPException(status_code=403, detail="AI/non-official role cannot approve statutory or financial decisions.")
    reject_raw_pii(payload.title, payload.rationale)
    new_id = f"DEC-{db.query(DecisionRecordDB).count() + 101}"
    row = DecisionRecordDB(
        id=new_id,
        matter_id=payload.matter_id,
        queue_type=payload.queue_type,
        title=payload.title,
        decision_action=payload.decision_action,
        rationale=payload.rationale,
        decided_by_role=actor.role,
        decided_at=now_iso(),
    )
    db.add(row)
    audit_service.append_event(actor.role, "RECORD_DECISION", "DECISION", new_id, f"{payload.decision_action}: {payload.title}")
    db.commit()
    db.refresh(row)
    return row


@exec_router.get("/notifications")
def list_notifications(db: Session = Depends(get_db)):
    return db.query(NotificationDB).all()


@exec_router.post("/notifications/emit")
def emit_notification_endpoint(
    dedup_key: str,
    target_role: str,
    event_type: str,
    message: str,
    matter_id: Optional[str] = None,
    action_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    reject_raw_pii(message)
    notif = emit_notification_dedup(db, dedup_key, target_role, event_type, message, matter_id, action_id)
    db.commit()
    db.refresh(notif)
    return notif


class RecognitionCreate(BaseModel):
    candidate_name: str = Field(..., min_length=3)
    candidate_type: str = "DISTRICT_TEAM"
    category: str = "Effective Interdepartmental Coordination"
    geography: str = "Patna, Bihar"
    evidence_summary: str = Field(..., min_length=6)
    quality_metric: str = Field(..., min_length=4)
    independent_verifier: str = "State WCD Quality Audit Cell"


@exec_router.get("/recurring-problems")
def list_recurring_problems(db: Session = Depends(get_db)):
    return detect_recurring_problems(db)


@exec_router.get("/recognition")
def list_recognition_nominations(db: Session = Depends(get_db)):
    return db.query(RecognitionNominationDB).all()


@exec_router.post("/recognition", status_code=201)
def create_recognition_nomination(
    payload: RecognitionCreate,
    actor: AuthenticatedActor = Depends(get_current_actor) if False else Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    reject_raw_pii(payload.candidate_name, payload.evidence_summary, payload.quality_metric)
    metric_lower = payload.quality_metric.lower()
    if any(bad in metric_lower for bad in ["arrest count", "total arrests", "raw case closure", "crime reduction only"]):
        raise HTTPException(
            status_code=422,
            detail="Recognition cannot be based solely on raw arrest counts, closure volume, or crime reduction.",
        )
    new_id = f"REC-{db.query(RecognitionNominationDB).count() + 101}"
    row = RecognitionNominationDB(
        id=new_id,
        candidate_name=payload.candidate_name,
        candidate_type=payload.candidate_type,
        category=payload.category,
        geography=payload.geography,
        evidence_summary=payload.evidence_summary,
        quality_metric=payload.quality_metric,
        independent_verifier=payload.independent_verifier,
        status="NOMINATED",
    )
    db.add(row)
    audit_service.append_event(actor.role, "CREATE_RECOGNITION", "RECOGNITION", new_id, payload.candidate_name)
    db.commit()
    db.refresh(row)
    return row


@exec_router.post("/recognition/{nom_id}/approve")
def approve_recognition_nomination(
    nom_id: str,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    if actor.role not in HUMAN_VALIDATOR_ROLES:
        raise HTTPException(status_code=403, detail="Only human authority can approve governance recognition.")
    row = _get_or_404(db, RecognitionNominationDB, nom_id, "Nomination")
    row.status = "APPROVED"
    audit_service.append_event(actor.role, "APPROVE_RECOGNITION", "RECOGNITION", nom_id, row.candidate_name)
    db.commit()
    db.refresh(row)
    return row


class ContinuityCreate(BaseModel):
    token: str = Field(..., min_length=6, max_length=64)
    domain: str = Field("WOMEN", pattern="^(WOMEN|CHILD)$")
    consent_status: str = "GRANTED (Zero-PII Token)"
    paper_baseline: int = 4
    steps: List[str] = Field(default_factory=lambda: ["OSC Intake", "Medical 24h", "PO DIR Filed", "DLSA Legal Aid", "Shakti Sadan"])


class ContinuityPatch(BaseModel):
    consent_status: Optional[str] = None
    current_stage_index: Optional[int] = None


class GroundTruthCreate(BaseModel):
    case_token: str = Field(..., min_length=6, max_length=64)
    channel: str = Field(..., pattern="^(IVR_VOICE|SMS_CODE)$")
    code: str = Field(..., pattern="^(1_RECEIVED|2_DELAYED|3_NOT_RECEIVED)$")
    note: str = Field(..., min_length=4)


@exec_router.get("/continuity")
def list_continuity_tokens(db: Session = Depends(get_db)):
    return db.query(ContinuityTokenDB).all()


@exec_router.post("/continuity", status_code=201)
def create_continuity_token(
    payload: ContinuityCreate,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    enforce_domain_a_write(payload.domain)
    reject_raw_pii(payload.token, payload.consent_status)
    row = ContinuityTokenDB(
        token=payload.token,
        domain=payload.domain,
        consent_status=payload.consent_status,
        repeat_statements=1,
        paper_baseline=payload.paper_baseline,
        current_stage_index=0,
        steps=payload.steps,
        updated_at=now_iso(),
    )
    db.add(row)
    audit_service.append_event(actor.role, "CREATE_CONTINUITY_TOKEN", "CONTINUITY", payload.token, payload.consent_status)
    db.commit()
    db.refresh(row)
    return row


@exec_router.patch("/continuity/{token}")
def update_continuity_token(
    token: str,
    payload: ContinuityPatch,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(ContinuityTokenDB).filter(ContinuityTokenDB.token == token).first()
    if not row:
        raise HTTPException(status_code=404, detail="Continuity token not found")
    enforce_domain_a_write(row.domain)
    if payload.consent_status is not None:
        reject_raw_pii(payload.consent_status)
        row.consent_status = payload.consent_status
    if payload.current_stage_index is not None:
        row.current_stage_index = max(0, min(len(row.steps or []) - 1, payload.current_stage_index))
    row.updated_at = now_iso()
    audit_service.append_event(actor.role, "UPDATE_CONTINUITY", "CONTINUITY", token, row.consent_status)
    db.commit()
    db.refresh(row)
    return row


@exec_router.get("/ground-truth")
def list_ground_truth_callbacks(db: Session = Depends(get_db)):
    return db.query(GroundTruthCallbackDB).order_by(GroundTruthCallbackDB.reported_at.desc()).all()


@exec_router.post("/ground-truth", status_code=201)
def create_ground_truth_callback(
    payload: GroundTruthCreate,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    reject_raw_pii(payload.case_token, payload.note)
    new_id = f"GT-{db.query(GroundTruthCallbackDB).count() + 1:03d}"
    row = GroundTruthCallbackDB(
        id=new_id,
        case_token=payload.case_token,
        channel=payload.channel,
        code=payload.code,
        discrepancy_flag=1 if payload.code != "1_RECEIVED" else 0,
        note=payload.note,
        reported_at=now_iso(),
    )
    db.add(row)
    audit_service.append_event(actor.role, "RECORD_GROUND_TRUTH", "OUTCOME_CALLBACK", new_id, payload.code)
    db.commit()
    db.refresh(row)
    return row


@exec_router.get("/integrations/status")
def get_integrations_status():
    """Explicit readiness registry for external government & infrastructure adapters."""
    return {
        "mode": "PROTOTYPE_MODULAR_MONOLITH",
        "adapters": [
            {"id": "db-orm", "name": "SQLAlchemy + Alembic (SQLite / PostgreSQL RLS)", "status": "CONFIGURED_LOCAL_SQLITE", "note": "Migration 0002 includes PostgreSQL RLS policy DDL."},
            {"id": "rag-vector", "name": "Bounded Cosine RAG + Pluggable Vector Adapter", "status": "ACTIVE_IN_MEMORY", "note": "PgVectorAdapter ready when DATABASE_URL uses PostgreSQL."},
            {"id": "cctns", "name": "Police CCTNS Read-Only Milestone Adapter", "status": "REQUIRES_GOV_INTEGRATION", "note": "Gated by G03 WCD/Police protocol."},
            {"id": "ecourts", "name": "e-Courts / ICJS / NALSA Cause-List Adapter", "status": "REQUIRES_GOV_INTEGRATION", "note": "Public cause-list metadata only until legal clearance."},
            {"id": "pfms", "name": "PFMS / State Treasury Sanction Batch Adapter", "status": "REQUIRES_GOV_INTEGRATION", "note": "File-based batch ingestion ready; live API requires Treasury MoU."},
            {"id": "ivr-sms", "name": "M17 Zero-PII Citizen SMS/IVR Callback Gateway", "status": "SYNTHETIC_DEMO_ACTIVE", "note": "Persists tokenised status codes (1/2/3) locally."},
        ],
    }
