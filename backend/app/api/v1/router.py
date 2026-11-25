from datetime import datetime, timezone
from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.auth import ActorContext, HUMAN_VALIDATOR_ROLES, enforce_domain_a_write, get_actor_context, issue_access_token
from backend.app.core.pii_guard import reject_raw_pii
from pydantic import BaseModel
from backend.app.db.database import get_db
from backend.app.db.models import (
    AlertRecordDB,
    DatasetCatalogDB,
    EvidenceItemDB,
    GapContractDB,
    GapInvestigationDB,
    InterventionDB,
    OfficialDirectoryDB,
    OutcomeDB,
)
from backend.app.models.schemas import (
    BreachAlertModel,
    EvidenceCreateRequest,
    EvidenceItemModel,
    GapContractModel,
    GapCreateRequest,
    GapStatusUpdateRequest,
    InterventionCreateRequest,
    InterventionModel,
    InvestigationModel,
    InvestigationUpdateRequest,
    OutcomeCreateRequest,
    OutcomeModel,
    OutcomeVerifyRequest,
    RAGQueryRequest,
    RAGQueryResponse,
    ShowCauseDraftRequest,
    ShowCauseDraftResponse,
)
from backend.app.services.audit_service import audit_service
from backend.app.services.gap_state_machine import validate_gap_transition
from backend.app.services.rag_service import rag_service
from backend.app.services.sentinel_service import sentinel_service

api_router = APIRouter()


class TokenRequest(BaseModel):
    role: str = "DISTRICT_COLLECTOR"
    district: str = "Patna"
    domain: str = "WOMEN"


@api_router.post("/auth/token")
def issue_dev_or_sso_token(payload: TokenRequest):
    token = issue_access_token(payload.role, payload.district, payload.domain)
    return {"access_token": token, "token_type": "bearer"}


def _evidence_to_dict(row: EvidenceItemDB) -> dict:
    return {
        "id": row.id,
        "title": row.title,
        "source_org": row.source_org,
        "publication_date": row.publication_date,
        "document_type": row.document_type,
        "source_url_or_ref": row.source_url_or_ref,
        "credibility_category": row.credibility_category,
        "source_origin": row.source_origin,
        "applicable_domain": row.applicable_domain,
        "epistemic_class": row.epistemic_class,
        "extracted_claim": row.extracted_claim,
        "confidence_score": row.confidence_score,
    }


def _gap_to_dict(row: GapContractDB) -> dict:
    return {
        "id": row.id,
        "gap_type": row.gap_type,
        "title": row.title,
        "domain": row.domain,
        "location": row.location,
        "affected_cohort": row.affected_cohort,
        "root_cause_hypothesis": row.root_cause_hypothesis,
        "statutory_basis": row.statutory_basis,
        "named_owner_role": row.named_owner_role,
        "mandated_intervention": row.mandated_intervention,
        "kpi_metric": row.kpi_metric,
        "kpi_baseline": row.kpi_baseline,
        "kpi_target": row.kpi_target,
        "kpi_source": row.kpi_source,
        "kpi_frequency": row.kpi_frequency,
        "estimated_cost_inr": row.estimated_cost_inr,
        "deadline_date": row.deadline_date,
        "status": row.status,
        "severity": row.severity,
        "confidence": row.confidence,
        "evidence_ids": row.evidence_ids,
        "created_at": row.created_at,
        "updated_at": row.updated_at,
    }


# ----------------- Gaps -----------------
@api_router.get("/gaps", response_model=List[GapContractModel])
def list_gaps(
    district: Optional[str] = None,
    status: Optional[str] = None,
    gap_type: Optional[str] = None,
    domain: Optional[str] = None,
    db: Session = Depends(get_db),
):
    rows = db.query(GapContractDB).all()
    results = [_gap_to_dict(r) for r in rows]
    if district:
        results = [g for g in results if g["location"]["district"].lower() == district.lower()]
    if status and status != "ALL":
        results = [g for g in results if g["status"] == status]
    if gap_type and gap_type != "ALL":
        results = [g for g in results if g["gap_type"] == gap_type]
    if domain and domain != "ALL":
        results = [g for g in results if g["domain"] == domain]
    return results


@api_router.get("/gaps/{gap_id}", response_model=GapContractModel)
def get_gap(gap_id: str, db: Session = Depends(get_db)):
    row = db.query(GapContractDB).filter(GapContractDB.id == gap_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Gap Contract not found")
    return _gap_to_dict(row)


@api_router.post("/gaps", response_model=GapContractModel, status_code=201)
def create_gap(
    payload: GapCreateRequest,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    enforce_domain_a_write(payload.domain)
    reject_raw_pii(payload.title, payload.affected_cohort, payload.root_cause_hypothesis, payload.mandated_intervention)
    now = datetime.now(timezone.utc).isoformat()
    gap_id = f"GAP-W-{payload.location.district_id[:3].upper()}-{uuid.uuid4().hex[:6].upper()}"
    row = GapContractDB(
        id=gap_id,
        gap_type=payload.gap_type,
        title=payload.title,
        domain=payload.domain,
        location=payload.location.model_dump(),
        affected_cohort=payload.affected_cohort,
        root_cause_hypothesis=payload.root_cause_hypothesis,
        statutory_basis=payload.statutory_basis,
        named_owner_role=payload.named_owner_role,
        mandated_intervention=payload.mandated_intervention,
        kpi_metric=payload.kpi_metric,
        kpi_baseline=payload.kpi_baseline,
        kpi_target=payload.kpi_target,
        kpi_source=payload.kpi_source,
        kpi_frequency=payload.kpi_frequency,
        estimated_cost_inr=payload.estimated_cost_inr,
        deadline_date=payload.deadline_date,
        status="CANDIDATE",
        severity=payload.severity,
        confidence=payload.confidence,
        evidence_ids=payload.evidence_ids,
        created_at=now,
        updated_at=now,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="CREATE_GAP_CANDIDATE",
        entity_type="GAP_CONTRACT",
        entity_id=gap_id,
        details=f"Created candidate gap '{payload.title}'",
    )
    return _gap_to_dict(row)


@api_router.patch("/gaps/{gap_id}/status", response_model=GapContractModel)
def update_gap_status(
    gap_id: str,
    payload: GapStatusUpdateRequest,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(GapContractDB).filter(GapContractDB.id == gap_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Gap Contract not found")
    enforce_domain_a_write(row.domain)
    validate_gap_transition(row.status, payload.status, actor.role)

    prev_status = row.status
    row.status = payload.status
    row.updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="TRANSITION_GAP_STATUS",
        entity_type="GAP_CONTRACT",
        entity_id=gap_id,
        details=f"{prev_status} -> {payload.status}. {payload.rationale or ''}".strip(),
    )
    return _gap_to_dict(row)


# ----------------- Evidence -----------------
@api_router.get("/evidence", response_model=List[EvidenceItemModel])
def list_evidence(
    epistemic_class: Optional[str] = None,
    document_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    rows = db.query(EvidenceItemDB).all()
    results = [_evidence_to_dict(r) for r in rows]
    if epistemic_class and epistemic_class != "ALL":
        results = [e for e in results if e["epistemic_class"] == epistemic_class]
    if document_type and document_type != "ALL":
        results = [e for e in results if e["document_type"] == document_type]
    return results


@api_router.post("/evidence", response_model=EvidenceItemModel, status_code=201)
def create_evidence(
    payload: EvidenceCreateRequest,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    enforce_domain_a_write(payload.applicable_domain)
    reject_raw_pii(payload.title, payload.extracted_claim, payload.source_url_or_ref)
    if actor.role == "AI_AGENT" and payload.epistemic_class == "VERIFIED_FACT":
        raise HTTPException(
            status_code=403,
            detail="AI cannot independently classify evidence as VERIFIED_FACT without human review.",
        )
    evd_id = f"EVD-{uuid.uuid4().hex[:8].upper()}"
    row = EvidenceItemDB(
        id=evd_id,
        title=payload.title,
        source_org=payload.source_org,
        publication_date=payload.publication_date,
        document_type=payload.document_type,
        source_url_or_ref=payload.source_url_or_ref,
        credibility_category=payload.credibility_category,
        source_origin=payload.source_origin,
        applicable_domain=payload.applicable_domain,
        epistemic_class=payload.epistemic_class,
        extracted_claim=payload.extracted_claim,
        confidence_score=payload.confidence_score,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="CREATE_EVIDENCE",
        entity_type="EVIDENCE",
        entity_id=evd_id,
        details=f"Added {payload.source_origin} evidence ({payload.epistemic_class}): {payload.title}",
    )
    return _evidence_to_dict(row)


# ----------------- Investigations -----------------
def _inv_to_dict(row: GapInvestigationDB) -> dict:
    return {
        "id": row.id,
        "gap_id": row.gap_id,
        "domain": row.domain,
        "problem_summary": row.problem_summary,
        "verified_facts": row.verified_facts,
        "conflicting_evidence": row.conflicting_evidence or [],
        "data_gaps": row.data_gaps,
        "hypotheses": row.hypotheses,
        "possible_interventions": row.possible_interventions,
        "legal_references": row.legal_references,
        "scheme_references": row.scheme_references or [],
        "dependencies": row.dependencies or [],
        "assigned_investigator_role": row.assigned_investigator_role,
        "status": row.status,
        "updated_at": row.updated_at,
    }


@api_router.get("/investigations/{gap_id}", response_model=InvestigationModel)
def get_investigation(gap_id: str, db: Session = Depends(get_db)):
    row = db.query(GapInvestigationDB).filter(GapInvestigationDB.gap_id == gap_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Investigation record not found for this gap ID")
    return _inv_to_dict(row)


@api_router.patch("/investigations/{gap_id}", response_model=InvestigationModel)
def update_investigation(
    gap_id: str,
    payload: InvestigationUpdateRequest,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    row = db.query(GapInvestigationDB).filter(GapInvestigationDB.gap_id == gap_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Investigation record not found for this gap ID")
    enforce_domain_a_write(row.domain)
    if payload.status in {"VALIDATED", "VERIFIED"} and actor.role in {"AI_AGENT", "AUDITOR"}:
        raise HTTPException(status_code=403, detail=f"Role '{actor.role}' cannot validate investigation.")

    for field in [
        "problem_summary",
        "verified_facts",
        "conflicting_evidence",
        "data_gaps",
        "possible_interventions",
        "legal_references",
        "scheme_references",
        "dependencies",
        "status",
    ]:
        val = getattr(payload, field)
        if val is not None:
            setattr(row, field, val)
    if payload.hypotheses is not None:
        row.hypotheses = [h.model_dump() for h in payload.hypotheses]

    row.updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="UPDATE_INVESTIGATION",
        entity_type="INVESTIGATION",
        entity_id=row.id,
        details=f"Updated investigation for {gap_id}",
    )
    return _inv_to_dict(row)


# ----------------- Interventions & Outcomes -----------------
def _intervention_to_dict(row: InterventionDB) -> dict:
    return {
        "id": row.id,
        "gap_id": row.gap_id,
        "type": row.type,
        "description": row.description,
        "owner_role": row.owner_role,
        "target_date": row.target_date,
        "kpi_metric": row.kpi_metric,
        "kpi_baseline": row.kpi_baseline,
        "kpi_target": row.kpi_target,
        "status": row.status,
        "approval_role": row.approval_role,
        "approved_at": row.approved_at,
    }


def _outcome_to_dict(row: OutcomeDB) -> dict:
    return {
        "id": row.id,
        "intervention_id": row.intervention_id,
        "gap_id": row.gap_id,
        "baseline": row.baseline,
        "target": row.target,
        "observed_result": row.observed_result,
        "unit": row.unit,
        "measurement_date": row.measurement_date,
        "status": row.status,
        "evidence_notes": row.evidence_notes,
    }


@api_router.get("/interventions", response_model=List[InterventionModel])
def list_interventions(db: Session = Depends(get_db)):
    return [_intervention_to_dict(r) for r in db.query(InterventionDB).all()]


@api_router.post("/interventions", response_model=InterventionModel, status_code=201)
def create_intervention(
    payload: InterventionCreateRequest,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    int_id = f"INT-{uuid.uuid4().hex[:6].upper()}"
    row = InterventionDB(
        id=int_id,
        gap_id=payload.gap_id,
        type=payload.type,
        description=payload.description,
        owner_role=payload.owner_role,
        target_date=payload.target_date,
        kpi_metric=payload.kpi_metric,
        kpi_baseline=payload.kpi_baseline,
        kpi_target=payload.kpi_target,
        status="PROPOSED",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="PROPOSE_INTERVENTION",
        entity_type="INTERVENTION",
        entity_id=int_id,
        details=f"Proposed intervention for {payload.gap_id} assigned to {payload.owner_role}",
    )
    return _intervention_to_dict(row)


@api_router.post("/interventions/{intervention_id}/approve", response_model=InterventionModel)
def approve_intervention(
    intervention_id: str,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    if actor.role not in HUMAN_VALIDATOR_ROLES:
        raise HTTPException(status_code=403, detail=f"Role '{actor.role}' cannot approve government interventions.")
    row = db.query(InterventionDB).filter(InterventionDB.id == intervention_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Intervention not found")
    row.status = "APPROVED"
    row.approval_role = actor.role
    row.approved_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="APPROVE_INTERVENTION",
        entity_type="INTERVENTION",
        entity_id=intervention_id,
        details=f"Sanctioned by {actor.role}",
    )
    return _intervention_to_dict(row)


@api_router.get("/outcomes", response_model=List[OutcomeModel])
def list_outcomes(db: Session = Depends(get_db)):
    return [_outcome_to_dict(r) for r in db.query(OutcomeDB).all()]


@api_router.post("/outcomes", response_model=OutcomeModel, status_code=201)
def create_outcome(
    payload: OutcomeCreateRequest,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    out_id = f"OUT-{uuid.uuid4().hex[:6].upper()}"
    row = OutcomeDB(
        id=out_id,
        intervention_id=payload.intervention_id,
        gap_id=payload.gap_id,
        baseline=payload.baseline,
        target=payload.target,
        observed_result=payload.observed_result,
        unit=payload.unit,
        measurement_date=payload.measurement_date,
        status="IN_PROGRESS",
        evidence_notes=payload.evidence_notes,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="RECORD_OUTCOME",
        entity_type="OUTCOME",
        entity_id=out_id,
        details=f"Recorded outcome for {payload.gap_id}: {payload.observed_result}{payload.unit}",
    )
    return _outcome_to_dict(row)


@api_router.post("/outcomes/{outcome_id}/verify", response_model=OutcomeModel)
def verify_outcome(
    outcome_id: str,
    payload: OutcomeVerifyRequest,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    if actor.role not in HUMAN_VALIDATOR_ROLES:
        raise HTTPException(status_code=403, detail=f"Role '{actor.role}' cannot certify outcome verification.")
    row = db.query(OutcomeDB).filter(OutcomeDB.id == outcome_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Outcome record not found")
    row.status = payload.status
    if payload.observed_result is not None:
        row.observed_result = payload.observed_result
    if payload.evidence_notes is not None:
        row.evidence_notes = payload.evidence_notes
    db.commit()
    db.refresh(row)
    audit_service.append_event(
        actor_role=actor.role,
        action="VERIFY_OUTCOME",
        entity_type="OUTCOME",
        entity_id=outcome_id,
        details=f"Human reviewer ({actor.role}) certified outcome as {payload.status}",
    )
    return _outcome_to_dict(row)


# ----------------- Breaches (Collector Queue) -----------------
@api_router.get("/breaches", response_model=List[BreachAlertModel])
def list_breaches(district: Optional[str] = None):
    return sentinel_service.get_active_breaches(district=district)


# ----------------- RAG Knowledge & Drafts -----------------
@api_router.post("/rag/query", response_model=RAGQueryResponse)
def query_knowledge_base(request: RAGQueryRequest):
    res = rag_service.answer_query(request.query)
    return RAGQueryResponse(
        answer=res["answer"],
        citations=res["citations"],
        epistemic_class=res["epistemic_class"],
        confidence=res["confidence"],
        model_temperature=0.0,
    )


@api_router.post("/rag/drafts/generate", response_model=ShowCauseDraftResponse)
def generate_draft(
    request: ShowCauseDraftRequest,
    actor: ActorContext = Depends(get_actor_context),
):
    draft = rag_service.generate_show_cause_draft(
        token_id=request.token_id,
        target_role=request.target_officer_role,
        breach_type=request.breach_type,
        district=request.district,
    )
    audit_service.append_event(
        actor_role=actor.role,
        action="GENERATE_SHOW_CAUSE",
        entity_type="DRAFT",
        entity_id=draft["draft_id"],
        details=f"Generated statutory show cause notice for {request.token_id}",
    )
    return draft


# ----------------- Data Catalogue, Officials Directory & Alerts -----------------
@api_router.get("/datasets")
def list_datasets(domain: Optional[str] = None, db: Session = Depends(get_db)):
    rows = db.query(DatasetCatalogDB).all()
    if domain and domain != "ALL":
        rows = [r for r in rows if r.protection_domain == domain]
    return [
        {
            "dataset_code": r.dataset_code,
            "name": r.name,
            "publishing_department": r.publishing_department,
            "protection_domain": r.protection_domain,
            "category": r.category,
            "geographic_coverage": r.geographic_coverage,
            "reporting_period": r.reporting_period,
            "publication_date": r.publication_date,
            "retrieval_date": r.retrieval_date,
            "available_format": r.available_format,
            "record_count": r.record_count,
            "source_url": r.source_url,
            "license_terms": r.license_terms,
            "status": r.status,
            "limitations": r.limitations,
            "version": r.version,
        }
        for r in rows
    ]


@api_router.get("/officials")
def list_officials(
    hierarchy_level: Optional[str] = None,
    domain: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
):
    rows = db.query(OfficialDirectoryDB).all()
    if hierarchy_level and hierarchy_level != "ALL":
        rows = [r for r in rows if r.hierarchy_level == hierarchy_level]
    if domain and domain != "ALL":
        rows = [r for r in rows if r.domain == domain]
    if q:
        ql = q.lower()
        rows = [
            r
            for r in rows
            if ql in r.designation.lower()
            or ql in r.department.lower()
            or ql in r.jurisdiction.lower()
            or ql in r.organisation.lower()
        ]
    return [
        {
            "id": r.id,
            "designation": r.designation,
            "officeholder_name": r.officeholder_name,
            "verification_status": r.verification_status,
            "hierarchy_level": r.hierarchy_level,
            "department": r.department,
            "organisation": r.organisation,
            "jurisdiction": r.jurisdiction,
            "domain": r.domain,
            "responsibilities": r.responsibilities,
            "associated_schemes": r.associated_schemes,
            "official_email": r.official_email,
            "official_phone": r.official_phone,
            "source_url": r.source_url,
            "last_verified_date": r.last_verified_date,
        }
        for r in rows
    ]


@api_router.get("/alerts")
def list_alerts(severity: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    rows = db.query(AlertRecordDB).all()
    if severity and severity != "ALL":
        rows = [r for r in rows if r.severity == severity]
    if status and status != "ALL":
        rows = [r for r in rows if r.status == status]
    return [
        {
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "severity": r.severity,
            "domain": r.domain,
            "geography": r.geography,
            "source": r.source,
            "reason": r.reason,
            "responsible_role": r.responsible_role,
            "status": r.status,
            "linked_entity_type": r.linked_entity_type,
            "linked_entity_id": r.linked_entity_id,
            "created_at": r.created_at,
        }
        for r in rows
    ]


class AlertStatusPatch(BaseModel):
    status: str


@api_router.patch("/alerts/{alert_id}/status")
def update_alert_status(
    alert_id: str,
    payload: AlertStatusPatch,
    actor: ActorContext = Depends(get_actor_context),
    db: Session = Depends(get_db),
):
    allowed = {"NEW", "ACKNOWLEDGED", "ASSIGNED", "UNDER_REVIEW", "ACTION_REQUIRED", "RESOLVED", "REJECTED", "FALSE_POSITIVE"}
    if payload.status not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid alert status '{payload.status}'.")
    row = db.query(AlertRecordDB).filter(AlertRecordDB.id == alert_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    row.status = payload.status
    db.commit()
    audit_service.append_event(
        actor_role=actor.role,
        action="UPDATE_ALERT_STATUS",
        entity_type="ALERT",
        entity_id=alert_id,
        details=f"Alert status -> {payload.status}",
    )
    return {"id": row.id, "status": row.status}


# ----------------- Audit -----------------
@api_router.get("/audit/ledger", response_model=List[dict])
def get_audit_ledger():
    return audit_service.chain


@api_router.get("/audit/verify")
def verify_audit_chain():
    return audit_service.verify_integrity()
