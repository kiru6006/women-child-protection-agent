from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings

client = TestClient(app)


def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "HEALTHY"
    assert body["mode"] == "ZERO_PII_COMPLIANT"


def test_cors_no_wildcard_with_credentials():
    assert "*" not in settings.CORS_ORIGINS


def test_gaps_and_evidence_endpoints():
    gaps_res = client.get("/api/v1/gaps")
    assert gaps_res.status_code == 200
    assert isinstance(gaps_res.json(), list)
    assert len(gaps_res.json()) > 0

    ev_res = client.get("/api/v1/evidence")
    assert ev_res.status_code == 200
    assert isinstance(ev_res.json(), list)
    assert len(ev_res.json()) > 0


def test_rag_data_not_available_fallback():
    res = client.post("/api/v1/rag/query", json={"query": "completely unrelated quantum rocket physics"})
    assert res.status_code == 200
    body = res.json()
    assert body["epistemic_class"] == "DATA_NOT_AVAILABLE"
    assert "DATA NOT AVAILABLE" in body["answer"]
    assert body["confidence"] == 0.0


def test_audit_chain_integrity():
    res = client.get("/api/v1/audit/verify")
    assert res.status_code == 200
    assert res.json()["valid"] is True
