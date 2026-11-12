from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from backend.app.models.schemas import (
    GapContractModel, EvidenceItemModel, InvestigationModel,
    InterventionModel, OutcomeModel, BreachAlertModel,
    RAGQueryRequest, RAGQueryResponse, ShowCauseDraftRequest,
    ShowCauseDraftResponse, AuditBlockModel
)
from backend.app.data.seed_data import (
    SEED_GAPS, SEED_EVIDENCE, SEED_INVESTIGATIONS, SEED_BREACHES
)
from backend.app.services.sentinel_service import sentinel_service
from backend.app.services.rag_service import rag_service
from backend.app.services.audit_service import audit_service

api_router = APIRouter()

# ----------------- Gaps -----------------
@api_router.get("/gaps", response_model=List[GapContractModel])
def list_gaps(
    district: Optional[str] = None,
    status: Optional[str] = None,
    gap_type: Optional[str] = None
):
    results = SEED_GAPS
    if district:
        results = [g for g in results if g["location"]["district"].lower() == district.lower()]
    if status and status != "ALL":
        results = [g for g in results if g["status"] == status]
    if gap_type and gap_type != "ALL":
        results = [g for g in results if g["gap_type"] == gap_type]
    return results

@api_router.get("/gaps/{gap_id}", response_model=GapContractModel)
def get_gap(gap_id: str):
    for g in SEED_GAPS:
        if g["id"] == gap_id:
            return g
    raise HTTPException(status_code=404, detail="Gap Contract not found")

# ----------------- Evidence -----------------
@api_router.get("/evidence", response_model=List[EvidenceItemModel])
def list_evidence(
    epistemic_class: Optional[str] = None,
    document_type: Optional[str] = None
):
    results = SEED_EVIDENCE
    if epistemic_class and epistemic_class != "ALL":
        results = [e for e in results if e["epistemic_class"] == epistemic_class]
    if document_type and document_type != "ALL":
        results = [e for e in results if e["document_type"] == document_type]
    return results

# ----------------- Investigations -----------------
@api_router.get("/investigations/{gap_id}", response_model=InvestigationModel)
def get_investigation(gap_id: str):
    if gap_id in SEED_INVESTIGATIONS:
        return SEED_INVESTIGATIONS[gap_id]
    raise HTTPException(status_code=404, detail="Investigation record not found for this gap ID")

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
        model_temperature=0.0
    )

@api_router.post("/rag/drafts/generate", response_model=ShowCauseDraftResponse)
def generate_draft(request: ShowCauseDraftRequest):
    draft = rag_service.generate_show_cause_draft(
        token_id=request.token_id,
        target_role=request.target_officer_role,
        breach_type=request.breach_type,
        district=request.district
    )
    # Log to audit
    audit_service.append_event(
        actor_role="DISTRICT_MAGISTRATE",
        action="GENERATE_SHOW_CAUSE",
        entity_type="DRAFT",
        entity_id=draft["draft_id"],
        details=f"Generated statutory show cause notice for {request.token_id}"
    )
    return draft

# ----------------- Audit -----------------
@api_router.get("/audit/ledger", response_model=List[dict])
def get_audit_ledger():
    return audit_service.chain

@api_router.get("/audit/verify")
def verify_audit_chain():
    return audit_service.verify_integrity()
