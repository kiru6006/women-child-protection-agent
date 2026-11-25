from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_m18_continuity_lifecycle_and_zero_pii():
    res = client.post(
        "/api/v1/continuity",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={
            "token": "CASE-DV-2026-TEST-101",
            "domain": "WOMEN",
            "consent_status": "GRANTED (Zero-PII Token)",
            "paper_baseline": 4,
        },
    )
    assert res.status_code == 201
    assert res.json()["token"] == "CASE-DV-2026-TEST-101"

    patch_res = client.patch(
        "/api/v1/continuity/CASE-DV-2026-TEST-101",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={"consent_status": "WITHDRAWN (Non-Statutory Sharing Paused)", "current_stage_index": 2},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["current_stage_index"] == 2
    assert patch_res.json()["consent_status"].startswith("WITHDRAWN")

    pii_res = client.post(
        "/api/v1/continuity",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={
            "token": "CASE-BAD-999",
            "domain": "WOMEN",
            "consent_status": "Call 9876543210",
        },
    )
    assert pii_res.status_code == 422


def test_m17_ground_truth_and_integrations_status():
    res = client.post(
        "/api/v1/ground-truth",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={
            "case_token": "CASE-DV-2026-TEST-101",
            "channel": "IVR_VOICE",
            "code": "2_DELAYED",
            "note": "Beneficiary reported interim relief delay.",
        },
    )
    assert res.status_code == 201
    assert res.json()["discrepancy_flag"] == 1

    status_res = client.get("/api/v1/integrations/status")
    assert status_res.status_code == 200
    adapters = status_res.json()["adapters"]
    assert any(a["id"] == "pfms" and a["status"] == "REQUIRES_GOV_INTEGRATION" for a in adapters)
