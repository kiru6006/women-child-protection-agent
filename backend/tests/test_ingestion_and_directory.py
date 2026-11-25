from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_official_dataset_catalog_no_fabricated_imports():
    res = client.get("/api/v1/datasets")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 9
    # Discovered datasets must not falsely claim VALIDATED import when record_count == 0
    for ds in items:
        assert ds["status"] in {"DISCOVERED", "ACCESS RESTRICTED"}
        assert ds["record_count"] == 0


def test_official_directory_marks_unverified_officeholders():
    res = client.get("/api/v1/officials?hierarchy_level=Central%20Ministry")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 2
    for off in items:
        assert off["verification_status"] == "UNVERIFIED_OFFICEHOLDER"
        assert "wcd.gov.in" in off["source_url"]


def test_alerts_lifecycle_transitions():
    res = client.get("/api/v1/alerts")
    assert res.status_code == 200
    alerts = res.json()
    assert len(alerts) >= 4

    patch = client.patch(
        "/api/v1/alerts/ALT-2026-004/status",
        headers={"X-User-Role": "DISTRICT_COLLECTOR"},
        json={"status": "ACKNOWLEDGED"},
    )
    assert patch.status_code == 200
    assert patch.json()["status"] == "ACKNOWLEDGED"
