from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.database import SessionLocal
from backend.app.db.models import AuditChainDB
from backend.app.services.audit_service import audit_service

client = TestClient(app)


def test_intervention_human_approval_gate():
    create = client.post(
        "/api/v1/interventions",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "gap_id": "GAP-W-PATNA-001",
            "type": "PROCESS_IMPROVEMENT",
            "description": "Mandate 24h DLSA digital receipt",
            "owner_role": "SECRETARY_DLSA_PATNA",
            "target_date": "2026-12-31",
            "kpi_metric": "Ack Rate",
            "kpi_baseline": 36.0,
            "kpi_target": 90.0,
        },
    )
    assert create.status_code == 201
    int_id = create.json()["id"]

    # AI_AGENT blocked from approving
    ai_try = client.post(f"/api/v1/interventions/{int_id}/approve", headers={"X-User-Role": "AI_AGENT"})
    assert ai_try.status_code == 403

    # Collector can approve
    dm_ok = client.post(f"/api/v1/interventions/{int_id}/approve", headers={"X-User-Role": "DISTRICT_COLLECTOR"})
    assert dm_ok.status_code == 200
    assert dm_ok.json()["status"] == "APPROVED"
    assert dm_ok.json()["approval_role"] == "DISTRICT_COLLECTOR"


def test_outcome_verification_human_gate():
    create = client.post(
        "/api/v1/outcomes",
        headers={"X-User-Role": "OSC_ADMIN"},
        json={
            "intervention_id": "INT-PAT-001",
            "gap_id": "GAP-W-PATNA-001",
            "baseline": 36.0,
            "target": 85.0,
            "observed_result": 88.0,
            "measurement_date": "2026-12-31",
            "evidence_notes": "90-day OSC audit shows 88% DLSA appearance.",
        },
    )
    assert create.status_code == 201
    out_id = create.json()["id"]

    # AI cannot declare EFFECTIVE
    ai_try = client.post(
        f"/api/v1/outcomes/{out_id}/verify",
        headers={"X-User-Role": "AI_AGENT"},
        json={"status": "EFFECTIVE"},
    )
    assert ai_try.status_code == 403

    # Collector can verify
    dm_ok = client.post(
        f"/api/v1/outcomes/{out_id}/verify",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={"status": "EFFECTIVE"},
    )
    assert dm_ok.status_code == 200
    assert dm_ok.json()["status"] == "EFFECTIVE"


def test_db_audit_chain_tamper_detection():
    # Ensure chain is valid first
    assert audit_service.verify_integrity()["valid"] is True

    # Tamper directly with a non-genesis DB row, verify detection, then restore
    with SessionLocal() as db:
        row = db.query(AuditChainDB).filter(AuditChainDB.block_index > 1).first()
        assert row is not None
        original_details = row.details
        row.details = "TAMPERED_RECORD"
        db.commit()

        tampered_check = audit_service.verify_integrity()
        assert tampered_check["valid"] is False
        assert tampered_check["reason"] == "hash_mismatch"

        # Restore original value so subsequent tests see clean chain
        row.details = original_details
        db.commit()

    assert audit_service.verify_integrity()["valid"] is True
