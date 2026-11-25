from fastapi.testclient import TestClient
from backend.app.main import app


def test_p0_action_without_owner_rejected_422():
    with TestClient(app) as client:
        res = client.post(
            "/api/v1/actions",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "matter_id": "MTR-2026-W-001",
                "title": "Orphan action",
                "description": "Missing owner",
                "responsible_department": "WCD",
                "responsible_role": "",
            },
        )
        assert res.status_code == 422


def test_p0_blocked_action_cannot_start_and_dispute_returns_to_draft():
    with TestClient(app) as client:
        # Ensure DEP-001 is unresolved and create a fresh blocked action for idempotency
        client.patch(
            "/api/v1/dependencies/DEP-001/status",
            headers={"X-User-Role": "TREASURY_OFFICER"},
            json={"status": "WAITING_FOR_FUNDS"},
        )
        blocked_act = client.post(
            "/api/v1/actions",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "matter_id": "MTR-2026-W-001",
                "title": "Blocked disbursement action",
                "description": "Depends on DEP-001",
                "responsible_department": "WCD",
                "responsible_role": "DWCD_OFFICER",
                "dependency_ids": ["DEP-001"],
            },
        ).json()
        client.post(f"/api/v1/actions/{blocked_act['id']}/acknowledge", headers={"X-User-Role": "DWCD_OFFICER"})
        res = client.post(
            f"/api/v1/actions/{blocked_act['id']}/transition",
            headers={"X-User-Role": "DWCD_OFFICER"},
            json={"target_status": "IN_PROGRESS"},
        )
        assert res.status_code == 409

        disp = client.post(
            "/api/v1/actions/ACT-101/dispute",
            headers={"X-User-Role": "TREASURY_OFFICER"},
            json={"reason": "Jurisdiction belongs to SNA State Cell"},
        )
        assert disp.status_code == 200
        assert disp.json()["status"] == "DRAFT"


def test_p0_circular_dependency_rejected_and_resolution_notifies():
    with TestClient(app) as client:
        r1 = client.post(
            "/api/v1/dependencies",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "matter_id": "MTR-2026-W-001",
                "predecessor_node": "DeptA",
                "dependent_node": "DeptB",
                "owner_role": "DWCD_OFFICER",
                "reason": "Step 1",
            },
        )
        assert r1.status_code == 201

        r2 = client.post(
            "/api/v1/dependencies",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "matter_id": "MTR-2026-W-001",
                "predecessor_node": "DeptB",
                "dependent_node": "DeptA",
                "owner_role": "DWCD_OFFICER",
                "reason": "Circular step",
            },
        )
        assert r2.status_code == 422

        res = client.patch(
            "/api/v1/dependencies/DEP-001/status",
            headers={"X-User-Role": "TREASURY_OFFICER"},
            json={"status": "RESOLVED"},
        )
        assert res.status_code == 200
        notifs = client.get("/api/v1/notifications").json()
        assert any(n["event_type"] == "DEPENDENCY_RESOLVED" and n["action_id"] == "ACT-102" for n in notifs)


def test_p0_completion_requires_evidence_and_matter_closure_requires_outcome():
    with TestClient(app) as client:
        act = client.post(
            "/api/v1/actions",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "matter_id": "MTR-2026-W-001",
                "title": "Verify OSC Roster",
                "description": "Publish December roster",
                "responsible_department": "WCD",
                "responsible_role": "DWCD_OFFICER",
            },
        ).json()
        aid = act["id"]
        assert client.post(f"/api/v1/actions/{aid}/acknowledge", headers={"X-User-Role": "DWCD_OFFICER"}).status_code == 200
        assert client.post(f"/api/v1/actions/{aid}/transition", headers={"X-User-Role": "DWCD_OFFICER"}, json={"target_status": "IN_PROGRESS"}).status_code == 200
        assert client.post(f"/api/v1/actions/{aid}/transition", headers={"X-User-Role": "DWCD_OFFICER"}, json={"target_status": "COMPLETION_REPORTED"}).status_code == 200

        no_ev = client.post(
            f"/api/v1/actions/{aid}/transition",
            headers={"X-User-Role": "DWCD_OFFICER"},
            json={"target_status": "VERIFICATION_REQUIRED"},
        )
        assert no_ev.status_code == 422

        with_ev = client.post(
            f"/api/v1/actions/{aid}/transition",
            headers={"X-User-Role": "DWCD_OFFICER"},
            json={"target_status": "VERIFICATION_REQUIRED", "completion_evidence_ref": "ROSTER-SIGNED-01"},
        )
        assert with_ev.status_code == 200

        close_fail = client.patch(
            "/api/v1/matters/MTR-2026-W-001/status",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={"matter_status": "CLOSED"},
        )
        assert close_fail.status_code == 409


def test_p0_ngo_isolation_role_transfer_notification_dedup_and_decision_gate():
    with TestClient(app) as client:
        ngo_res = client.get("/api/v1/matters/MTR-2026-W-001", headers={"X-User-Role": "NGO_PARTNER"})
        assert ngo_res.status_code == 403

        ai_dec = client.post(
            "/api/v1/decisions",
            headers={"X-User-Role": "AI_AGENT"},
            json={
                "matter_id": "MTR-2026-W-001",
                "queue_type": "FINANCIAL",
                "title": "Approve release",
                "decision_action": "APPROVED",
                "rationale": "Automated check",
            },
        )
        assert ai_dec.status_code == 403

        tr = client.post(
            "/api/v1/actions/ACT-102/transfer",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={"new_role": "ADDL_DWCD_OFFICER", "reason": "Cadre transfer"},
        )
        assert tr.status_code == 200
        assert len(tr.json()["transfer_history"]) >= 1

        n1 = client.post(
            "/api/v1/notifications/emit",
            params={"dedup_key": "DEDUP-TEST-1", "target_role": "DWCD_OFFICER", "event_type": "REMINDER", "message": "Check SLA"},
        ).json()
        n2 = client.post(
            "/api/v1/notifications/emit",
            params={"dedup_key": "DEDUP-TEST-1", "target_role": "DWCD_OFFICER", "event_type": "REMINDER", "message": "Check SLA"},
        ).json()
        assert n1["id"] == n2["id"]


def test_p2_recurring_problem_detection_and_recognition_gates():
    with TestClient(app) as client:
        rec_patterns = client.get("/api/v1/recurring-problems").json()
        assert len(rec_patterns) >= 1
        assert rec_patterns[0]["matter_count"] >= 2

        # Perverse arrest/closure metric rejected 422
        bad = client.post(
            "/api/v1/recognition",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "candidate_name": "Test Unit",
                "evidence_summary": "Closed 100 cases fast",
                "quality_metric": "Total arrests and raw case closure volume",
            },
        )
        assert bad.status_code == 422

        # Quality metric accepted and human-approved
        good = client.post(
            "/api/v1/recognition",
            headers={"X-User-Role": "DISTRICT_COLLECTOR"},
            json={
                "candidate_name": "Sakhi OSC Joint Desk",
                "evidence_summary": "Verified single-window intake cut repeat statements",
                "quality_metric": "92% Day-90 quality-verified intake",
            },
        )
        assert good.status_code == 201
        nom_id = good.json()["id"]

        ai_app = client.post(f"/api/v1/recognition/{nom_id}/approve", headers={"X-User-Role": "AI_AGENT"})
        assert ai_app.status_code == 403

        dm_app = client.post(f"/api/v1/recognition/{nom_id}/approve", headers={"X-User-Role": "DISTRICT_COLLECTOR"})
        assert dm_app.status_code == 200
        assert dm_app.json()["status"] == "APPROVED"
