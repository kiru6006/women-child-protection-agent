from sqlalchemy import Column, String, Float, Integer, Text, JSON, DateTime
from datetime import datetime, timezone
from backend.app.db.database import Base


class EvidenceItemDB(Base):
    __tablename__ = "evidence_library"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    source_org = Column(String(128), nullable=False)
    publication_date = Column(String(32), nullable=False)
    document_type = Column(String(64), nullable=False)
    source_url_or_ref = Column(Text, nullable=False)
    credibility_category = Column(String(64), nullable=False)
    source_origin = Column(String(32), nullable=False, default="SYNTHETIC")
    applicable_domain = Column(String(16), nullable=False)
    epistemic_class = Column(String(32), nullable=False)
    extracted_claim = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=False, default=1.0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class GapContractDB(Base):
    __tablename__ = "gap_contracts"

    id = Column(String(64), primary_key=True, index=True)
    gap_type = Column(String(32), nullable=False)
    title = Column(String(256), nullable=False)
    domain = Column(String(16), nullable=False)
    location = Column(JSON, nullable=False)
    affected_cohort = Column(String(256), nullable=False)
    root_cause_hypothesis = Column(Text, nullable=False)
    statutory_basis = Column(String(256), nullable=False)
    named_owner_role = Column(String(128), nullable=False)
    mandated_intervention = Column(Text, nullable=False)
    kpi_metric = Column(String(128), nullable=False)
    kpi_baseline = Column(Float, nullable=False)
    kpi_target = Column(Float, nullable=False)
    kpi_source = Column(String(128), nullable=False)
    kpi_frequency = Column(String(32), nullable=False)
    estimated_cost_inr = Column(Float, nullable=False, default=0.0)
    deadline_date = Column(String(32), nullable=False)
    status = Column(String(32), nullable=False, default="CANDIDATE")
    severity = Column(String(16), nullable=False)
    confidence = Column(String(16), nullable=False)
    evidence_ids = Column(JSON, nullable=False, default=list)
    created_at = Column(String(64), nullable=False)
    updated_at = Column(String(64), nullable=False)


class GapInvestigationDB(Base):
    __tablename__ = "gap_investigations"

    id = Column(String(64), primary_key=True, index=True)
    gap_id = Column(String(64), nullable=False, index=True)
    domain = Column(String(16), nullable=False)
    problem_summary = Column(Text, nullable=False)
    verified_facts = Column(JSON, nullable=False, default=list)
    conflicting_evidence = Column(JSON, nullable=False, default=list)
    data_gaps = Column(JSON, nullable=False, default=list)
    hypotheses = Column(JSON, nullable=False, default=list)
    possible_interventions = Column(JSON, nullable=False, default=list)
    legal_references = Column(JSON, nullable=False, default=list)
    scheme_references = Column(JSON, nullable=False, default=list)
    dependencies = Column(JSON, nullable=False, default=list)
    assigned_investigator_role = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="UNDER_INVESTIGATION")
    updated_at = Column(String(64), nullable=False)


class InterventionDB(Base):
    __tablename__ = "interventions"

    id = Column(String(64), primary_key=True, index=True)
    gap_id = Column(String(64), nullable=False, index=True)
    type = Column(String(64), nullable=False)
    description = Column(Text, nullable=False)
    owner_role = Column(String(128), nullable=False)
    target_date = Column(String(32), nullable=False)
    kpi_metric = Column(String(128), nullable=False)
    kpi_baseline = Column(Float, nullable=False)
    kpi_target = Column(Float, nullable=False)
    status = Column(String(32), nullable=False, default="PROPOSED")
    approval_role = Column(String(128), nullable=True)
    approved_at = Column(String(64), nullable=True)


class OutcomeDB(Base):
    __tablename__ = "outcomes"

    id = Column(String(64), primary_key=True, index=True)
    intervention_id = Column(String(64), nullable=False, index=True)
    gap_id = Column(String(64), nullable=False, index=True)
    baseline = Column(Float, nullable=False)
    target = Column(Float, nullable=False)
    observed_result = Column(Float, nullable=False)
    unit = Column(String(32), nullable=False)
    measurement_date = Column(String(32), nullable=False)
    status = Column(String(32), nullable=False, default="NOT_STARTED")
    evidence_notes = Column(Text, nullable=False)


class AuditChainDB(Base):
    __tablename__ = "audit_chain"

    block_index = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String(64), nullable=False, unique=True)
    timestamp = Column(String(64), nullable=False)
    actor_role = Column(String(64), nullable=False)
    action = Column(String(64), nullable=False)
    entity_type = Column(String(64), nullable=False)
    entity_id = Column(String(64), nullable=False)
    details = Column(Text, nullable=False)
    previous_hash = Column(String(64), nullable=False)
    sha256_hash = Column(String(64), nullable=False)


class DatasetCatalogDB(Base):
    __tablename__ = "datasets"

    dataset_code = Column(String(64), primary_key=True, index=True)
    name = Column(String(256), nullable=False)
    publishing_department = Column(String(128), nullable=False)
    protection_domain = Column(String(16), nullable=False)
    category = Column(String(64), nullable=False)
    geographic_coverage = Column(String(128), nullable=False)
    reporting_period = Column(String(64), nullable=False)
    publication_date = Column(String(32), nullable=False)
    retrieval_date = Column(String(32), nullable=True)
    available_format = Column(String(64), nullable=False)
    record_count = Column(Integer, nullable=False, default=0)
    source_url = Column(Text, nullable=False)
    license_terms = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="DISCOVERED")
    limitations = Column(Text, nullable=False)
    version = Column(String(32), nullable=False, default="v1.0")


class OfficialDirectoryDB(Base):
    __tablename__ = "official_directory"

    id = Column(String(64), primary_key=True, index=True)
    designation = Column(String(128), nullable=False)
    officeholder_name = Column(String(128), nullable=False, default="UNVERIFIED (Designation Only)")
    verification_status = Column(String(32), nullable=False, default="UNVERIFIED_OFFICEHOLDER")
    hierarchy_level = Column(String(64), nullable=False)
    department = Column(String(128), nullable=False)
    organisation = Column(String(128), nullable=False)
    jurisdiction = Column(String(128), nullable=False)
    domain = Column(String(16), nullable=False)
    responsibilities = Column(Text, nullable=False)
    associated_schemes = Column(JSON, nullable=False, default=list)
    official_email = Column(String(128), nullable=True)
    official_phone = Column(String(64), nullable=True)
    source_url = Column(Text, nullable=False)
    last_verified_date = Column(String(32), nullable=False)


class AlertRecordDB(Base):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    category = Column(String(64), nullable=False)
    severity = Column(String(24), nullable=False)
    domain = Column(String(16), nullable=False)
    geography = Column(String(128), nullable=False)
    source = Column(String(128), nullable=False)
    reason = Column(Text, nullable=False)
    responsible_role = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="NEW")
    linked_entity_type = Column(String(32), nullable=True)
    linked_entity_id = Column(String(64), nullable=True)
    created_at = Column(String(64), nullable=False)


class MatterDB(Base):
    __tablename__ = "matters"

    id = Column(String(64), primary_key=True, index=True)
    demo_code = Column(String(32), nullable=False)
    title = Column(String(256), nullable=False)
    domain = Column(String(16), nullable=False)
    category = Column(String(64), nullable=False)
    jurisdiction = Column(String(128), nullable=False)
    severity = Column(String(16), nullable=False)
    matter_status = Column(String(32), nullable=False, default="OPEN")
    admin_status = Column(String(32), nullable=False, default="NOT_STARTED")
    police_status = Column(String(32), nullable=False, default="NOT_APPLICABLE")
    litigation_status = Column(String(32), nullable=False, default="NOT_APPLICABLE")
    court_compliance_status = Column(String(32), nullable=False, default="NOT_APPLICABLE")
    financial_status = Column(String(32), nullable=False, default="NOT_APPLICABLE")
    outcome_status = Column(String(32), nullable=False, default="NOT_MEASURED")
    coordinating_authority = Column(String(128), nullable=False)
    responsible_authority = Column(String(128), nullable=False)
    responsible_department = Column(String(128), nullable=False)
    is_synthetic = Column(Integer, nullable=False, default=1)
    created_at = Column(String(64), nullable=False)
    updated_at = Column(String(64), nullable=False)


class ActionItemDB(Base):
    __tablename__ = "actions"

    id = Column(String(64), primary_key=True, index=True)
    matter_id = Column(String(64), nullable=False, index=True)
    intervention_id = Column(String(64), nullable=True)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    responsible_department = Column(String(128), nullable=False)
    responsible_role = Column(String(128), nullable=False)
    accountable_authority = Column(String(128), nullable=False)
    coordinating_authority = Column(String(128), nullable=False)
    assigned_date = Column(String(32), nullable=False)
    acknowledged = Column(Integer, nullable=False, default=0)
    acknowledged_at = Column(String(64), nullable=True)
    required_deliverable = Column(String(256), nullable=False)
    timeline_date = Column(String(32), nullable=False)
    completion_criteria = Column(Text, nullable=False)
    required_evidence = Column(String(256), nullable=False)
    completion_evidence_ref = Column(Text, nullable=True)
    dependency_ids = Column(JSON, nullable=False, default=list)
    escalation_authority = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="ASSIGNED")
    progress_updates = Column(JSON, nullable=False, default=list)
    transfer_history = Column(JSON, nullable=False, default=list)
    dispute_reason = Column(Text, nullable=True)


class DependencyDB(Base):
    __tablename__ = "dependencies"

    id = Column(String(64), primary_key=True, index=True)
    matter_id = Column(String(64), nullable=False, index=True)
    dep_type = Column(String(64), nullable=False)
    predecessor_action_id = Column(String(64), nullable=True)
    dependent_action_id = Column(String(64), nullable=True)
    predecessor_node = Column(String(128), nullable=False)
    dependent_node = Column(String(128), nullable=False)
    owner_role = Column(String(128), nullable=False)
    supporting_authority = Column(String(128), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(32), nullable=False, default="OPEN")
    is_lawful_wait = Column(Integer, nullable=False, default=0)
    due_date = Column(String(32), nullable=False)
    escalation_authority = Column(String(128), nullable=False)
    evidence_ref = Column(String(128), nullable=True)


class DecisionRecordDB(Base):
    __tablename__ = "decisions"

    id = Column(String(64), primary_key=True, index=True)
    matter_id = Column(String(64), nullable=False, index=True)
    queue_type = Column(String(64), nullable=False)
    title = Column(String(256), nullable=False)
    decision_action = Column(String(32), nullable=False)
    rationale = Column(Text, nullable=False)
    decided_by_role = Column(String(128), nullable=False)
    decided_at = Column(String(64), nullable=False)


class NotificationDB(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, index=True)
    dedup_key = Column(String(128), nullable=False, unique=True, index=True)
    matter_id = Column(String(64), nullable=True)
    action_id = Column(String(64), nullable=True)
    target_role = Column(String(128), nullable=False)
    event_type = Column(String(64), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Integer, nullable=False, default=0)
    created_at = Column(String(64), nullable=False)
