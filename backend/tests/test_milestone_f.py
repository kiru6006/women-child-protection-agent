from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings

client = TestClient(app)


def test_bearer_jwt_token_issue_and_verification():
    tok_res = client.post(
        "/api/v1/auth/token",
        json={"role": "DISTRICT_COLLECTOR", "district": "Patna", "domain": "WOMEN"},
    )
    assert tok_res.status_code == 200
    token = tok_res.json()["access_token"]

    # Valid Bearer token works even if DEV_HEADER_AUTH_ENABLED is disabled
    orig = settings.DEV_HEADER_AUTH_ENABLED
    settings.DEV_HEADER_AUTH_ENABLED = False
    try:
        # Missing Bearer rejected 401
        no_auth = client.post(
            "/api/v1/interventions",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "gap_id": "GAP-W-PATNA-001",
                "type": "TRAINING",
                "description": "Test",
                "owner_role": "OSC_ADMIN",
                "target_date": "2026-12-31",
                "kpi_metric": "Rate",
                "kpi_baseline": 10,
                "kpi_target": 50,
            },
        )
        assert no_auth.status_code == 401

        # Forged Bearer rejected 401
        forged = client.post(
            "/api/v1/interventions",
            headers={"Authorization": "Bearer forged.token.sig"},
            json={
                "gap_id": "GAP-W-PATNA-001",
                "type": "TRAINING",
                "description": "Test",
                "owner_role": "OSC_ADMIN",
                "target_date": "2026-12-31",
                "kpi_metric": "Rate",
                "kpi_baseline": 10,
                "kpi_target": 50,
            },
        )
        assert forged.status_code == 401

        # Valid Bearer succeeds
        ok = client.post(
            "/api/v1/interventions",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "gap_id": "GAP-W-PATNA-001",
                "type": "TRAINING",
                "description": "Bearer-authenticated intervention",
                "owner_role": "OSC_ADMIN",
                "target_date": "2026-12-31",
                "kpi_metric": "Rate",
                "kpi_baseline": 10,
                "kpi_target": 50,
            },
        )
        assert ok.status_code == 201
    finally:
        settings.DEV_HEADER_AUTH_ENABLED = orig
