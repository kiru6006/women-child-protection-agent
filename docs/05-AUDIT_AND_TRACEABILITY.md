# Repository Audit, Traceability Matrix & Verification Baseline
## WCD Protection Intelligence Platform — Verified Baseline (2026-11-25)

---

## 1. Current Application Inventory & Architecture
* **Frontend (`src/`):** React 19.3.1, TypeScript 5.6, Vite 5.4, Tailwind CSS 3.4, Zustand 5.0 ([`package.json`](../package.json)), Civic Intelligence Light + Pink & B/W tokens ([`DESIGN.md`](../DESIGN.md), [`design-tokens.css`](../src/styles/design-tokens.css)). `10/10` `vitest` invariant & route-integrity tests passing ([`domain.test.ts`](../src/tests/domain.test.ts), [`help.test.ts`](../src/tests/help.test.ts)), plus `21/21` Playwright screenshots & full `31`-route × `4`-viewport audit (`1920x1080`, `1280x800`, `768x1024`, `375x812`, `0` errors, `0` overflows). Explicit `"SYNTHETIC / OFFLINE FALLBACK"` banner via [`api.ts`](../src/services/api.ts) + [`AppLayout.tsx`](../src/components/layout/AppLayout.tsx) when backend is offline.
* **Backend (`backend/`):** FastAPI modular monolith ([`main.py`](../backend/app/main.py), [`router.py`](../backend/app/api/v1/router.py), [`execution_router.py`](../backend/app/api/v1/execution_router.py)) with SQLAlchemy 2.0 ORM ([`models.py`](../backend/app/db/models.py)), Alembic migration baseline ([`0001_initial_schema.py`](../backend/alembic/versions/0001_initial_schema.py)), SQLite dev DB (`DATABASE_URL` env-configurable to PostgreSQL), signed HMAC Bearer JWT + dev header RBAC ([`auth.py`](../backend/app/core/auth.py)), Zero-PII guard ([`pii_guard.py`](../backend/app/core/pii_guard.py)), deterministic Gap & Action State Machines ([`gap_state_machine.py`](../backend/app/services/gap_state_machine.py), [`execution_engine.py`](../backend/app/services/execution_engine.py)), bounded cosine-similarity RAG ([`rag_service.py`](../backend/app/services/rag_service.py)), DB-backed SHA-256 audit ledger ([`audit_service.py`](../backend/app/services/audit_service.py)), and `26/26` `pytest` passing.
* **Pending Production / Governance Items (Post-Demo):** PostgreSQL + `pgvector` + RLS on NIC MeghRaj, external Government SSO IdP wiring, local quantised LLM adapter, and `G01–G10` government sign-offs.

---

## 2. Done vs Pending Summary & Traceability Matrix

### 2.1 Done vs Pending Overview
| Area | Done (Verified in Repo) | Pending (Before Live Pilot) |
|---|---|---|
| **Frontend (`src/`)** | React 19 upgrade, mobile drawer/domain switcher, compact icon header + B&W theme, 19-Step Demo (`/demo-flow`), Help Knowledge Centre (`/help`), Playwright `21/21` (`0` errors, `0` overflows at `1280px`/`768px`/`375px`), `10/10` Vitest | Offline-tolerant PWA service worker (post-demo) |
| **Backend & DB (`backend/`)** | SQLAlchemy ORM + Alembic (`0001_initial_schema`), `POST/PATCH` endpoints, deterministic Gap state machine, Zero-PII `422` guard, DB SHA-256 WORM audit (`26/26` Pytest) | Production PostgreSQL + RLS on NIC MeghRaj, external LLM + `pgvector` embeddings |
| **Auth & Security** | Explicit CORS origins, env-based `SECRET_SALT`, signed Bearer JWT (`POST /auth/token`), `DEV_HEADER_AUTH_ENABLED` toggle, Domain B (`CHILD`) `403` write lock | External Government SSO IdP integration, independent VAPT certification (`G09`) |
| **Governance & Pilot (`G01–G10`)** | Clean `docs/` baseline + `DESIGN.md` + `HELP_CONTENT_INDEX.md` + `SCREENSHOT_INDEX.md`, `10/10` Vitest + `26/26` Pytest + E2E synthetic gap lifecycle | `G03` WCD/Police data-sharing protocol, `G04` DPDP legal opinion, `G08` 10–15 staff interviews, `G10` paper baseline |
| **Conditional / Phase 2–3** | Domain B blueprint (`ChildProtectionPage.tsx`) + `M18` Synthetic Continuity Tracker (`WomenWorkspacePage.tsx`) | Live `M18` DB persistence (`G03/G04` gated), `M17` Ground-Truth IVR, Domain B live activation |

### 2.2 Requirements Traceability Matrix
| Req ID | Requirement | Status | File References | Verification Evidence | Gap / Next Action |
|---|---|---|---|---|---|
| **FR-01..03, FR-06** | Consent, Zero-PII tokens, pointers-only, repeat counter | `PENDING (GOVERNANCE GATED)` | `schemas.py`, `pii_guard.py` | Zero-PII `422` guard tested; micro tables deferred | Gate behind `G03`/`G04`/`G10`; add `Consent`/`Referral`/`StepEvent` |
| **FR-04..05** | Deterministic Gap/SLA state machine | `IMPLEMENTED AND TESTED` | `gap_state_machine.py`, `router.py` | `test_milestone_b.py` + `test_milestone_e.py` pass | Wire live statutory SLA cron/Redis timers for M18 |
| **FR-07** | Ground-truth SMS/IVR verification | `OUT OF MVP SCOPE` | — | Deferred to Phase 3 | Keep out of MVP |
| **FR-08** | Evidence Library & source provenance | `IMPLEMENTED AND TESTED` | `EvidenceLibraryPage.tsx`, `router.py`, `models.py` | `POST/GET /evidence` + `source_origin` + Gazette preview modal | Add file-attachment storage in prod |
| **FR-09** | Investigation Workspace | `IMPLEMENTED AND TESTED` | `InvestigationPage.tsx`, `router.py`, `models.py` | `PATCH /investigations/{gap_id}` + hypothesis plausibility/add UI | Add server DB persistence for custom hypotheses in prod |
| **FR-10** | Stateful Gap Contracts (11 taxonomy) | `IMPLEMENTED AND TESTED` | `GapExplorerPage.tsx`, `router.py`, `gap_state_machine.py` | Full `CANDIDATE -> CLOSED` E2E + `"Propose Gap"` UI form | Add production PostgreSQL RLS |
| **FR-11** | Intervention approval & Outcome verification | `IMPLEMENTED AND TESTED` | `InterventionsPage.tsx`, `OutcomesPage.tsx`, `router.py` | `test_milestone_d.py` + `"Propose Intervention"` / `"Record Outcome"` + 90-day cadence | Add live 90-day field reminder jobs in prod |
| **FR-12** | Bounded RAG & Show-Cause draft | `PARTIALLY IMPLEMENTED` | `rag_service.py`, `KnowledgeAssistantPage.tsx` | Cosine retrieval + prompt-injection refusal tested | Replace in-memory chunks with `pgvector` + local LLM adapter |
| **M20 / NFR-02..03** | RBAC, CORS/secrets, WORM audit | `IMPLEMENTED AND TESTED` | `config.py`, `auth.py`, `audit_service.py`, `AuditPage.tsx` | `17/17` pytest including Bearer JWT & tamper detection pass | Wire Gov SSO IdP + PostgreSQL RLS |

---

## 3. Contradictions Resolved & Key Risks
1. **A1–A4 AI Conflict:** Macro intelligence uses `A1` Evidence, `A2` Gap/Investigation, `A3` Intervention, `A4` Outcome; Micro continuity (`G02`–`G04` gated) uses `C1`–`C4` (Intake, Router, Stall Monitor, Duplicate Check).
2. **Stack Alignment:** Target stack is **React + Vite + FastAPI + PostgreSQL + pgvector modular monolith** (no Kafka/Milvus/K8s/microservices unless verified load demands).
3. **Technical & Security Risks:**
   * Wildcard `CORS_ORIGINS` + `allow_credentials=True` and hardcoded `SECRET_SALT` in `config.py`.
   * Silent mock fallback in `api.ts` without UI indicator (risks confusing synthetic data with real data).
   * Mobile responsiveness gaps: `hidden md:flex` hides domain switcher in `Header.tsx`; `Sidebar.tsx` lacks mobile drawer.

---

## 4. Preserve / Refactor / Defer Decisions
* **Preserve:** Domain & epistemic types (`src/types/index.ts`, `schemas.py`), high-contrast badges, `vitest` invariants (`domain.test.ts`), SHA-256 audit hash-chain logic, `"DATA NOT AVAILABLE"` fallback.
* **Refactor:** Align `README.md` to actual `src/` + `backend/` structure; add explicit `"SYNTHETIC / OFFLINE FALLBACK"` banner in UI; replace in-memory `SEED_*` with PostgreSQL + SQLAlchemy + Alembic + RBAC; make `Header.tsx` & `Sidebar.tsx` mobile-responsive.
* **Defer:** Live Child Protection workflows (**M03**), Citizen SMS/IVR (**M17**), Kafka/K8s/Neo4j, live NIC/NCRB/Poshan APIs.

---

## 5. Acceptance Criteria (Milestone Gate)
1. `npm run build`, `npm test`, `pytest` (unit + integration + negative auth), and Playwright responsive checks (`1280px`, `768px`, `375px`) pass with 0 errors.
2. 0 hardcoded secrets, 0 wildcard CORS, 100% protected endpoints enforce role/domain/district RBAC, 0 PII in central DB or AI payloads.
3. 100% claims carry epistemic class + source ref + synthetic/official tag; unsupported queries return `"DATA NOT AVAILABLE"`; AI never auto-validates or auto-closes a Gap Contract or Outcome.

---

## 6. Milestone A–E Execution Status & `G01–G10` Pilot-Readiness Gaps (Step 16)

### 6.1 Completed Software Milestones (Synthetic / Local Prototype)
* **Milestone A (Steps 4–5):** Hardened CORS/secrets, SQLAlchemy ORM + SQLite/PostgreSQL setup, `pytest` baseline, responsive mobile drawer & domain switcher, explicit `"SYNTHETIC / OFFLINE FALLBACK"` banner.
* **Milestone B (Steps 6–8):** DB-persisted Evidence Library (`source_origin`), `X-User-Role` RBAC, Domain B (`CHILD`) `403` write lock, deterministic Gap Contract state machine with human validation gate.
* **Milestone C (Steps 9–10):** DB-persisted Investigation Workspace (`PATCH /investigations/{gap_id}`), bounded cosine-similarity RAG adapter (`DATA NOT AVAILABLE` fallback), prompt-injection refusal.
* **Milestone D (Steps 11–13):** DB-persisted Interventions & Outcomes with human approval/certification gates, DB-backed SHA-256 WORM Audit Chain with tamper detection.
* **Milestone E (Steps 14–15):** Server-side Zero-PII guard (`422` on Aadhaar/phone/email), negative RBAC tests, and full 1-gap synthetic E2E lifecycle test.

### 6.2 Pilot-Readiness Gaps (`G01–G10` Hard Stops Before Live District Deployment)
| Gate | Status | Remaining Gap Before Live Pilot |
|---|---|---|
| `G01–G02` | Pending Field Sign-Off | Verify existing state WCD / Mission Shakti / ICPS MIS overlap in pilot district. |
| `G03–G04` | **HARD STOP (Blocked)** | Obtain written WCD/Police/Health/DLSA data-sharing protocol & formal DPDP Act 2023 fiduciary/processor legal opinion. |
| `G05–G06` | Synthetic Verified / Live Pending | Migrate local SQLite dev DB to NIC MeghRaj PostgreSQL with DB-level RLS policies + complete formal DPIA. |
| `G07–G09` | Implemented in Prototype | Swap header-based dev RBAC for Government SSO/JWT, run independent VAPT, and complete 10–15 frontline staff interviews (`G08`). |
| `G10` | **HARD STOP (Blocked)** | Measure paper baseline in pilot district (intake-to-referral time, repeat-statement count, stall rate) prior to go-live. |
