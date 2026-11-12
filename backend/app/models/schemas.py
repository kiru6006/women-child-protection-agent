from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

ProtectionDomain = Literal["WOMEN", "CHILD"]
EpistemicClass = Literal["VERIFIED_FACT", "INFERENCE", "HYPOTHESIS", "RECOMMENDATION", "DATA_NOT_AVAILABLE"]
GapTaxonomy = Literal[
    "POLICY", "IMPLEMENTATION", "ACCESS", "AWARENESS", "CAPACITY",
    "GEOGRAPHIC", "COORDINATION", "PROCESS", "OUTCOME", "DATA", "EMERGING_THREAT"
]
GapStatus = Literal[
    "CANDIDATE", "UNDER_INVESTIGATION", "VALIDATED",
    "INTERVENTION_PLANNED", "INTERVENTION_ACTIVE", "VERIFIED", "CLOSED", "REJECTED"
]
SeverityLevel = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

class LocationModel(BaseModel):
    state: str
    state_code: str
    district: str
    district_id: str
    block: Optional[str] = None

class EvidenceItemModel(BaseModel):
    id: str
    title: str
    source_org: str
    publication_date: str
    document_type: str
    source_url_or_ref: str
    credibility_category: str
    applicable_domain: ProtectionDomain
    epistemic_class: EpistemicClass
    extracted_claim: str
    confidence_score: float

class GapContractModel(BaseModel):
    id: str
    gap_type: GapTaxonomy
    title: str
    domain: ProtectionDomain
    location: LocationModel
    affected_cohort: str
    root_cause_hypothesis: str
    statutory_basis: str
    named_owner_role: str
    mandated_intervention: str
    kpi_metric: str
    kpi_baseline: float
    kpi_target: float
    kpi_source: str
    kpi_frequency: str
    estimated_cost_inr: float
    deadline_date: str
    status: GapStatus
    severity: SeverityLevel
    confidence: str
    evidence_ids: List[str]
    created_at: str
    updated_at: str

class HypothesisModel(BaseModel):
    id: str
    explanation: str
    supporting_evidence_ids: List[str]
    contradicting_evidence_ids: List[str]
    field_verification_required: str
    plausibility_score: float

class InvestigationModel(BaseModel):
    id: str
    gap_id: str
    domain: ProtectionDomain
    problem_summary: str
    verified_facts: List[str]
    data_gaps: List[str]
    hypotheses: List[HypothesisModel]
    possible_interventions: List[str]
    legal_references: List[str]
    assigned_investigator_role: str
    status: str
    updated_at: str

class InterventionModel(BaseModel):
    id: str
    gap_id: str
    type: str
    description: str
    owner_role: str
    target_date: str
    kpi_metric: str
    kpi_baseline: float
    kpi_target: float
    status: str
    approval_role: Optional[str] = None
    approved_at: Optional[str] = None

class OutcomeModel(BaseModel):
    id: str
    intervention_id: str
    gap_id: str
    baseline: float
    target: float
    observed_result: float
    unit: str
    measurement_date: str
    status: str
    evidence_notes: str

class BreachAlertModel(BaseModel):
    token_id: str
    offence_type: str
    district: str
    breach_stage: str
    responsible_role: str
    statutory_limit_hours: float
    hours_overdue: float
    statutory_citation: str
    auto_draft_available: bool = True
    draft_type: str = "SHOW_CAUSE_NOTICE"

class RAGQueryRequest(BaseModel):
    query: str
    district: Optional[str] = "Patna"
    domain: ProtectionDomain = "WOMEN"

class RAGQueryResponse(BaseModel):
    answer: str
    citations: List[str]
    epistemic_class: EpistemicClass
    confidence: float
    model_temperature: float = 0.0

class ShowCauseDraftRequest(BaseModel):
    token_id: str
    target_officer_role: str
    breach_type: str
    district: str

class ShowCauseDraftResponse(BaseModel):
    draft_id: str
    document_title: str
    content: str
    citations: List[dict]
    confidence_score: float
    human_gate_required: bool = True

class AuditBlockModel(BaseModel):
    id: str
    timestamp: str
    actor_role: str
    action: str
    entity_type: str
    entity_id: str
    details: str
    sha256_hash: str

