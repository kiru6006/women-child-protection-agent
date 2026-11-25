from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

ProtectionDomain = Literal["WOMEN", "CHILD"]
SourceOrigin = Literal["OFFICIAL", "OPERATIONAL", "FIELD", "SYNTHETIC"]
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
    source_origin: SourceOrigin = "SYNTHETIC"
    applicable_domain: ProtectionDomain
    epistemic_class: EpistemicClass
    extracted_claim: str
    confidence_score: float


class EvidenceCreateRequest(BaseModel):
    title: str
    source_org: str
    publication_date: str
    document_type: str
    source_url_or_ref: str
    credibility_category: str = "OFFICIAL_GOVERNMENT"
    source_origin: SourceOrigin = "SYNTHETIC"
    applicable_domain: ProtectionDomain = "WOMEN"
    epistemic_class: EpistemicClass = "HYPOTHESIS"
    extracted_claim: str
    confidence_score: float = Field(default=0.8, ge=0.0, le=1.0)


class GapStatusUpdateRequest(BaseModel):
    status: GapStatus
    rationale: Optional[str] = None


class GapCreateRequest(BaseModel):
    gap_type: GapTaxonomy
    title: str
    domain: ProtectionDomain = "WOMEN"
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
    kpi_frequency: str = "MONTHLY"
    estimated_cost_inr: float = 0.0
    deadline_date: str
    severity: SeverityLevel = "HIGH"
    confidence: str = "MEDIUM"
    evidence_ids: List[str] = []

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
    conflicting_evidence: List[str] = []
    data_gaps: List[str]
    hypotheses: List[HypothesisModel]
    possible_interventions: List[str]
    legal_references: List[str]
    scheme_references: List[str] = []
    dependencies: List[str] = []
    assigned_investigator_role: str
    status: str
    updated_at: str


class InvestigationUpdateRequest(BaseModel):
    problem_summary: Optional[str] = None
    verified_facts: Optional[List[str]] = None
    conflicting_evidence: Optional[List[str]] = None
    data_gaps: Optional[List[str]] = None
    hypotheses: Optional[List[HypothesisModel]] = None
    possible_interventions: Optional[List[str]] = None
    legal_references: Optional[List[str]] = None
    scheme_references: Optional[List[str]] = None
    dependencies: Optional[List[str]] = None
    status: Optional[str] = None

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


class InterventionCreateRequest(BaseModel):
    gap_id: str
    type: str
    description: str
    owner_role: str
    target_date: str
    kpi_metric: str
    kpi_baseline: float
    kpi_target: float


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


OutcomeStatus = Literal[
    "NOT_STARTED",
    "IN_PROGRESS",
    "PARTIALLY_EFFECTIVE",
    "EFFECTIVE",
    "INEFFECTIVE",
    "INSUFFICIENT_DATA",
]


class OutcomeCreateRequest(BaseModel):
    intervention_id: str
    gap_id: str
    baseline: float
    target: float
    observed_result: float
    unit: str = "%"
    measurement_date: str
    evidence_notes: str


class OutcomeVerifyRequest(BaseModel):
    status: OutcomeStatus
    observed_result: Optional[float] = None
    evidence_notes: Optional[str] = None

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

