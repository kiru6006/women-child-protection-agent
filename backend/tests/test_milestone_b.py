from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_create_evidence_and_reject_ai_verified_fact():
    # AI cannot mark VERIFIED_FACT directly
    bad = client.post(
        "/api/v1/evidence",
        headers={"X-User-Role": "AI_AGENT"},
        json={
            "title": "AI Extracted Note",
            "source_org": "Test",
            "publication_date": "2026-11-25",
            "document_type": "SOP",
            "source_url_or_ref": "REF-1",
            "source_origin": "SYNTHETIC",
            "applicable_domain": "WOMEN",
            "epistemic_class": "VERIFIED_FACT",
            "extracted_claim": "Claim",
        },
    )
    assert bad.status_code == 403

    # Human officer can add evidence with provenance
    ok = client.post(
        "/api/v1/evidence",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={
            "title": "District Review Note",
            "source_org": "Patna WCD",
            "publication_date": "2026-11-25",
            "document_type": "FIELD_STUDY",
            "source_url_or_ref": "PAT/WCD/2026/09",
            "source_origin": "FIELD",
            "applicable_domain": "WOMEN",
            "epistemic_class": "HYPOTHESIS",
            "extracted_claim": "Evening shifts at OSC lack female constable escort.",
        },
    )
    assert ok.status_code == 201
    assert ok.json()["source_origin"] == "FIELD"


def test_domain_b_child_write_locked_in_mvp():
    res = client.post(
        "/api/v1/gaps",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={
            "gap_type": "PROCESS",
            "title": "Child CWC delay",
            "domain": "CHILD",
            "location": {"state": "Bihar", "state_code": "BR", "district": "Patna", "district_id": "PATNA"},
            "affected_cohort": "Children",
            "root_cause_hypothesis": "Delay",
            "statutory_basis": "JJ Act s.31",
            "named_owner_role": "CWC_CHAIR",
            "mandated_intervention": "Fix roster",
            "kpi_metric": "Hours",
            "kpi_baseline": 48,
            "kpi_target": 24,
            "kpi_source": "CWC",
            "deadline_date": "2026-12-31",
        },
    )
    assert res.status_code == 403


def test_gap_contract_deterministic_state_machine_and_human_gate():
    create = client.post(
        "/api/v1/gaps",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "gap_type": "COORDINATION",
            "title": "Test DV Referral Delay",
            "domain": "WOMEN",
            "location": {"state": "Bihar", "state_code": "BR", "district": "Patna", "district_id": "PATNA"},
            "affected_cohort": "DV survivors",
            "root_cause_hypothesis": "Manual handoff",
            "statutory_basis": "PWDVA s.9",
            "named_owner_role": "PROTECTION_OFFICER",
            "mandated_intervention": "Ack SLA",
            "kpi_metric": "Ack hours",
            "kpi_baseline": 72,
            "kpi_target": 24,
            "kpi_source": "OSC Log",
            "deadline_date": "2026-12-31",
        },
    )
    assert create.status_code == 201
    gap_id = create.json()["id"]
    assert create.json()["status"] == "CANDIDATE"

    # Invalid jump CANDIDATE -> CLOSED rejected
    bad_jump = client.patch(
        f"/api/v1/gaps/{gap_id}/status",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={"status": "CLOSED"},
    )
    assert bad_jump.status_code == 400

    # Valid transition CANDIDATE -> UNDER_INVESTIGATION
    step1 = client.patch(
        f"/api/v1/gaps/{gap_id}/status",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={"status": "UNDER_INVESTIGATION"},
    )
    assert step1.status_code == 200

    # AI_AGENT / AUDITOR blocked from VALIDATED
    blocked = client.patch(
        f"/api/v1/gaps/{gap_id}/status",
        headers={"X-User-Role": "AI_AGENT"},
        json={"status": "VALIDATED"},
    )
    assert blocked.status_code == 403

    # DISTRICT_COLLECTOR can validate
    validated = client.patch(
        f"/api/v1/gaps/{gap_id}/status",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={"status": "VALIDATED", "rationale": "Confirmed in district review"},
    )
    assert validated.status_code == 200
    assert validated.json()["status"] == "VALIDATED"
