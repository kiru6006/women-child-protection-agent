from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_zero_pii_guard_blocks_aadhaar_and_phone():
    aadhaar_res = client.post(
        "/api/v1/evidence",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={
            "title": "Unsafe Record",
            "source_org": "Test",
            "publication_date": "2026-11-25",
            "document_type": "FIELD_STUDY",
            "source_url_or_ref": "REF-PII-1",
            "source_origin": "SYNTHETIC",
            "applicable_domain": "WOMEN",
            "epistemic_class": "HYPOTHESIS",
            "extracted_claim": "Survivor Aadhaar 2345 6789 0123 reported delay.",
        },
    )
    assert aadhaar_res.status_code == 422
    assert "ZERO-PII POLICY VIOLATION" in aadhaar_res.json()["detail"]

    phone_res = client.post(
        "/api/v1/gaps",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "gap_type": "ACCESS",
            "title": "Phone Leak Gap",
            "domain": "WOMEN",
            "location": {"state": "Bihar", "state_code": "BR", "district": "Patna", "district_id": "PATNA"},
            "affected_cohort": "Call +91 9876543210",
            "root_cause_hypothesis": "Test",
            "statutory_basis": "PWDVA s.7",
            "named_owner_role": "OSC_ADMIN",
            "mandated_intervention": "Fix",
            "kpi_metric": "Rate",
            "kpi_baseline": 10,
            "kpi_target": 80,
            "kpi_source": "OSC",
            "deadline_date": "2026-12-31",
        },
    )
    assert phone_res.status_code == 422


def test_unknown_role_rejected_403():
    res = client.post(
        "/api/v1/interventions",
        headers={"X-User-Role": "UNAUTHORIZED_EXTERNAL"},
        json={
            "gap_id": "GAP-W-PATNA-001",
            "type": "TRAINING",
            "description": "Unauthorized",
            "owner_role": "OSC_ADMIN",
            "target_date": "2026-12-31",
            "kpi_metric": "Rate",
            "kpi_baseline": 10,
            "kpi_target": 50,
        },
    )
    assert res.status_code == 403


def test_end_to_end_one_gap_synthetic_lifecycle():
    # 1. Discover: Add synthetic evidence
    ev = client.post(
        "/api/v1/evidence",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "title": "E2E Synthetic Legal-Aid Delay Log",
            "source_org": "Sakhi OSC Patna (Synthetic)",
            "publication_date": "2026-11-25",
            "document_type": "FIELD_STUDY",
            "source_url_or_ref": "SYNTH-E2E-001",
            "source_origin": "SYNTHETIC",
            "applicable_domain": "WOMEN",
            "epistemic_class": "VERIFIED_FACT",
            "extracted_claim": "40% of referrals lacked DLSA acknowledgment within 48h.",
        },
    )
    assert ev.status_code == 201
    ev_id = ev.json()["id"]

    # 2. Candidate Gap created
    gap = client.post(
        "/api/v1/gaps",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "gap_type": "COORDINATION",
            "title": "E2E Synthetic Legal-Aid Acknowledgment Delay",
            "domain": "WOMEN",
            "location": {"state": "Bihar", "state_code": "BR", "district": "Patna", "district_id": "PATNA"},
            "affected_cohort": "OSC DV referrals (synthetic)",
            "root_cause_hypothesis": "No acknowledgment handshake between OSC and DLSA",
            "statutory_basis": "PWDVA s.9 & LSA Act s.12",
            "named_owner_role": "SECRETARY_DLSA_PATNA",
            "mandated_intervention": "24h acknowledgment SLA",
            "kpi_metric": "48h Ack Rate",
            "kpi_baseline": 60.0,
            "kpi_target": 95.0,
            "kpi_source": "Synthetic OSC Log",
            "deadline_date": "2026-12-31",
            "evidence_ids": [ev_id],
        },
    )
    assert gap.status_code == 201
    gap_id = gap.json()["id"]

    # 3. Investigate -> Validate -> Plan -> Active -> Verify -> Close (human-gated)
    for next_status in ["UNDER_INVESTIGATION", "VALIDATED", "INTERVENTION_PLANNED", "INTERVENTION_ACTIVE"]:
        r = client.patch(
            f"/api/v1/gaps/{gap_id}/status",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={"status": next_status},
        )
        assert r.status_code == 200

    # 4. Propose & Approve Intervention
    intr = client.post(
        "/api/v1/interventions",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "gap_id": gap_id,
            "type": "COORDINATION_MECHANISM",
            "description": "Shared DLSA-OSC acknowledgment queue",
            "owner_role": "SECRETARY_DLSA_PATNA",
            "target_date": "2026-12-31",
            "kpi_metric": "48h Ack Rate",
            "kpi_baseline": 60.0,
            "kpi_target": 95.0,
        },
    )
    assert intr.status_code == 201
    int_id = intr.json()["id"]
    assert client.post(f"/api/v1/interventions/{int_id}/approve", headers={"X-User-Role": "DISTRICT_COLLECTOR"}).status_code == 200

    # 5. Record & Human-Certify Outcome
    out = client.post(
        "/api/v1/outcomes",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "intervention_id": int_id,
            "gap_id": gap_id,
            "baseline": 60.0,
            "target": 95.0,
            "observed_result": 96.0,
            "measurement_date": "2026-12-31",
            "evidence_notes": "Synthetic 90-day check passed 96% ack rate.",
        },
    )
    assert out.status_code == 201
    out_id = out.json()["id"]
    assert client.post(f"/api/v1/outcomes/{out_id}/verify", headers={"X-User-Role": "DISTRICT_COLLECTOR"}, json={"status": "EFFECTIVE"}).status_code == 200

    # 6. Verify & Close Gap + Verify Audit Chain Integrity
    assert client.patch(f"/api/v1/gaps/{gap_id}/status", headers={"X-User-Role": "DISTRICT_COLLECTOR"}, json={"status": "VERIFIED"}).status_code == 200
    closed = client.patch(f"/api/v1/gaps/{gap_id}/status", headers={"X-User-Role": "DISTRICT_COLLECTOR"}, json={"status": "CLOSED"})
    assert closed.status_code == 200
    assert closed.json()["status"] == "CLOSED"

    audit = client.get("/api/v1/audit/verify")
    assert audit.status_code == 200
    assert audit.json()["valid"] is True
