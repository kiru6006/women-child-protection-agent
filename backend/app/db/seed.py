from sqlalchemy.orm import Session
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
from backend.app.data.seed_data import SEED_EVIDENCE, SEED_GAPS, SEED_INVESTIGATIONS
from backend.app.ingestion.adapters import discover_all_official_datasets


def seed_db_if_empty(db: Session) -> None:
    if db.query(EvidenceItemDB).count() == 0:
        for item in SEED_EVIDENCE:
            db.add(EvidenceItemDB(**item, source_origin="SYNTHETIC"))

    if db.query(GapContractDB).count() == 0:
        for gap in SEED_GAPS:
            db.add(GapContractDB(**gap))

    if db.query(GapInvestigationDB).count() == 0:
        for inv in SEED_INVESTIGATIONS.values():
            db.add(
                GapInvestigationDB(
                    id=inv["id"],
                    gap_id=inv["gap_id"],
                    domain=inv["domain"],
                    problem_summary=inv["problem_summary"],
                    verified_facts=inv.get("verified_facts", []),
                    conflicting_evidence=[],
                    data_gaps=inv.get("data_gaps", []),
                    hypotheses=inv.get("hypotheses", []),
                    possible_interventions=inv.get("possible_interventions", []),
                    legal_references=inv.get("legal_references", []),
                    scheme_references=[],
                    dependencies=[],
                    assigned_investigator_role=inv["assigned_investigator_role"],
                    status=inv["status"],
                    updated_at=inv["updated_at"],
                )
            )

    if db.query(InterventionDB).count() == 0:
        db.add(
            InterventionDB(
                id="INT-PAT-001",
                gap_id="GAP-W-PATNA-001",
                type="COORDINATION_MECHANISM",
                description="Deploy daily DLSA panel lawyer rotation desk inside Sakhi OSC Patna + auto-referral ack SLA.",
                owner_role="SECRETARY_DLSA_PATNA",
                target_date="2026-06-30",
                kpi_metric="Legal Aid Access Rate",
                kpi_baseline=36.0,
                kpi_target=85.0,
                status="PROPOSED",
            )
        )

    if db.query(OutcomeDB).count() == 0:
        db.add(
            OutcomeDB(
                id="OUT-PAT-001",
                intervention_id="INT-PAT-001",
                gap_id="GAP-W-PATNA-001",
                baseline=36.0,
                target=85.0,
                observed_result=62.0,
                unit="%",
                measurement_date="2026-09-30",
                status="PARTIALLY_EFFECTIVE",
                evidence_notes="DLSA desk active 4 days/week; Friday backlog remains due to duty roster gap.",
            )
        )

    if db.query(DatasetCatalogDB).count() == 0:
        for ds in discover_all_official_datasets():
            db.add(
                DatasetCatalogDB(
                    dataset_code=ds.dataset_code,
                    name=ds.name,
                    publishing_department=ds.publishing_department,
                    protection_domain=ds.protection_domain,
                    category=ds.category,
                    geographic_coverage=ds.geographic_coverage,
                    reporting_period=ds.reporting_period,
                    publication_date=ds.publication_date,
                    retrieval_date=None,
                    available_format=ds.available_format,
                    record_count=0,
                    source_url=ds.source_url,
                    license_terms=ds.license_terms,
                    status=ds.status,
                    limitations=ds.limitations,
                    version="v1.0",
                )
            )

    if db.query(OfficialDirectoryDB).count() == 0:
        officials = [
            OfficialDirectoryDB(
                id="OFF-MWCD-JS-SHAKTI",
                designation="Joint Secretary (Mission Shakti)",
                officeholder_name="UNVERIFIED (Designation Only)",
                verification_status="UNVERIFIED_OFFICEHOLDER",
                hierarchy_level="Central Ministry",
                department="Ministry of Women & Child Development",
                organisation="Government of India (Shastri Bhawan, New Delhi)",
                jurisdiction="National (All States & UTs)",
                domain="WOMEN",
                responsibilities="National policy oversight, fund release & convergence for One Stop Centres and Women Helpline 181.",
                associated_schemes=["Mission Shakti (Sambal & Samarthya)", "One Stop Centres", "Women Helpline 181"],
                official_email="min-wcd@nic.in",
                official_phone="181 (Public Women Helpline)",
                source_url="https://www.wcd.gov.in/",
                last_verified_date="2026-11-25",
            ),
            OfficialDirectoryDB(
                id="OFF-MWCD-JS-VATSALYA",
                designation="Joint Secretary (Mission Vatsalya)",
                officeholder_name="UNVERIFIED (Designation Only)",
                verification_status="UNVERIFIED_OFFICEHOLDER",
                hierarchy_level="Central Ministry",
                department="Ministry of Women & Child Development",
                organisation="Government of India (Shastri Bhawan, New Delhi)",
                jurisdiction="National (All States & UTs)",
                domain="CHILD",
                responsibilities="Statutory child protection policy, Mission Vatsalya norms, CWC/JJB/CCI oversight.",
                associated_schemes=["Mission Vatsalya", "Child Helpline 1098", "CARA"],
                official_email="min-wcd@nic.in",
                official_phone="1098 (Public Child Helpline)",
                source_url="https://www.wcd.gov.in/",
                last_verified_date="2026-11-25",
            ),
            OfficialDirectoryDB(
                id="OFF-PAT-DM",
                designation="District Magistrate & Collector (District Convergence Chair)",
                officeholder_name="UNVERIFIED (Designation Only)",
                verification_status="UNVERIFIED_OFFICEHOLDER",
                hierarchy_level="District Administration",
                department="District Administration",
                organisation="Office of the District Magistrate, Patna",
                jurisdiction="Patna District, Bihar",
                domain="SHARED",
                responsibilities="District convergence reviews, statutory escalation enforcement, OSC & DCPU oversight.",
                associated_schemes=["Mission Shakti", "Mission Vatsalya", "Saksham Anganwadi & POSHAN 2.0"],
                official_email="dm-patna.bih@nic.in",
                official_phone="0612-2219810 (Public District Control Room)",
                source_url="https://patna.nic.in/",
                last_verified_date="2026-11-25",
            ),
            OfficialDirectoryDB(
                id="OFF-PAT-DLSA-SEC",
                designation="Secretary, District Legal Services Authority (DLSA)",
                officeholder_name="UNVERIFIED (Designation Only)",
                verification_status="UNVERIFIED_OFFICEHOLDER",
                hierarchy_level="District Programme Authorities",
                department="Legal Services Authority",
                organisation="DLSA Patna (Civil Court Campus)",
                jurisdiction="Patna District, Bihar",
                domain="WOMEN",
                responsibilities="Panel lawyer assignment under Section 12(c) LSA Act & timely legal aid representation.",
                associated_schemes=["Free Legal Aid (NALSA / DLSA)", "PWDVA 2005 Legal Support"],
                official_email="dlsa.patna@aij.gov.in",
                official_phone="15100 (NALSA Public Legal Aid Helpline)",
                source_url="https://nalsa.gov.in/",
                last_verified_date="2026-11-25",
            ),
            OfficialDirectoryDB(
                id="OFF-PAT-OSC-ADMIN",
                designation="Centre Administrator, Sakhi One Stop Centre",
                officeholder_name="UNVERIFIED (Designation Only)",
                verification_status="UNVERIFIED_OFFICEHOLDER",
                hierarchy_level="Women Protection Institutions",
                department="State WCD / Social Welfare",
                organisation="Sakhi One Stop Centre, Patna",
                jurisdiction="Patna District, Bihar",
                domain="WOMEN",
                responsibilities="24x7 intake, emergency shelter, medical/police/legal referral coordination.",
                associated_schemes=["Mission Shakti — One Stop Centre"],
                official_email=None,
                official_phone="181 (Women Helpline)",
                source_url="https://www.wcd.gov.in/osc-dashboard",
                last_verified_date="2026-11-25",
            ),
            OfficialDirectoryDB(
                id="OFF-PAT-CWC-CHAIR",
                designation="Chairperson, Child Welfare Committee (CWC)",
                officeholder_name="UNVERIFIED (Designation Only)",
                verification_status="UNVERIFIED_OFFICEHOLDER",
                hierarchy_level="Child Protection Institutions",
                department="State WCD / DCPU",
                organisation="Child Welfare Committee, Patna",
                jurisdiction="Patna District, Bihar",
                domain="CHILD",
                responsibilities="Statutory orders under JJ Act 2015 Section 31 & Individual Care Plan oversight.",
                associated_schemes=["Mission Vatsalya — CWC & CCI"],
                official_email=None,
                official_phone="1098 (Child Helpline)",
                source_url="https://ncpcr.gov.in/",
                last_verified_date="2026-11-25",
            ),
        ]
        db.add_all(officials)

    if db.query(AlertRecordDB).count() == 0:
        alerts = [
            AlertRecordDB(
                id="ALT-2026-001",
                title="Hospital Medical Exam SLA Breach > 18.5h (CASE-DV-2026-PAT-0842)",
                category="Operational Alert",
                severity="CRITICAL",
                domain="WOMEN",
                geography="Patna, Bihar",
                source="Suraksha Sentinel SLA Monitor (Synthetic)",
                reason="Pending medical examination beyond 24h statutory limit under PWDVA Sec. 7.",
                responsible_role="Chief Medical Officer / Duty MO",
                status="ACTION_REQUIRED",
                linked_entity_type="GAP",
                linked_entity_id="GAP-W-PATNA-002",
                created_at="2026-11-25T06:30:00Z",
            ),
            AlertRecordDB(
                id="ALT-2026-002",
                title="DIR Form 1 Filing Overdue > 11h (CASE-DV-2026-PAT-0839)",
                category="Protection Service Alert",
                severity="HIGH",
                domain="WOMEN",
                geography="Patna, Bihar",
                source="Protection Officer Queue (Synthetic)",
                reason="Domestic Incident Report pending submission to Judicial Magistrate (PWDVA Sec. 9(1)(b)).",
                responsible_role="Protection Officer (PWDVA)",
                status="ASSIGNED",
                linked_entity_type="GAP",
                linked_entity_id="GAP-W-PATNA-001",
                created_at="2026-11-25T07:15:00Z",
            ),
            AlertRecordDB(
                id="ALT-2026-003",
                title="64% DLSA Legal-Aid Drop-Off Pattern Flagged",
                category="AI Candidate Finding",
                severity="HIGH",
                domain="WOMEN",
                geography="Patna, Bihar",
                source="MoWCD OSC Audit + NCRB Cross-Check (Synthetic)",
                reason="Absence of co-located DLSA duty lawyer roster at Sakhi OSC Patna.",
                responsible_role="Secretary, DLSA Patna",
                status="UNDER_REVIEW",
                linked_entity_type="INVESTIGATION",
                linked_entity_id="GAP-W-PATNA-001",
                created_at="2026-11-24T14:00:00Z",
            ),
            AlertRecordDB(
                id="ALT-2026-004",
                title="data.gov.in API Key Not Configured — Automated Ingestion Restricted",
                category="Data Quality Alert",
                severity="MEDIUM",
                domain="SHARED",
                geography="National",
                source="DataGovInAdapter",
                reason="DATA_GOV_IN_API_KEY env var absent; dataset marked ACCESS RESTRICTED.",
                responsible_role="Data Engineering Lead",
                status="NEW",
                linked_entity_type="DATASET",
                linked_entity_id="DS-OGD-WCD-SCHEMES",
                created_at="2026-11-25T08:00:00Z",
            ),
        ]
        db.add_all(alerts)
    db.commit()
