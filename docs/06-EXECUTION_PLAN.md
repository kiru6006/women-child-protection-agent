# Execution Plan — Phased Delivery & Step-by-Step Engineering Roadmap
## WCD Protection Intelligence Platform (Suraksha Sentinel & Sahyog)

**Derived From:** [`00-BUSINESS_REQUIREMENT.md`](./00-BUSINESS_REQUIREMENT.md) (Full Proposal & Vibe-Coding Sequence) + [`01-BUSINESS_REQUIREMENTS.md`](./01-BUSINESS_REQUIREMENTS.md) (Canonical BRD v3.0) + [`05-AUDIT_AND_TRACEABILITY.md`](./05-AUDIT_AND_TRACEABILITY.md) (Verified Codebase Baseline)

> **Demo Mode / Mock Data Note:** The working application runs in self-contained **Synthetic Mock Data Mode** (`src/data/mockData.ts` + `src/store/demoStore.ts` + FastAPI SQLite seed) so all screens, workflows, forms, and cross-screen navigations operate end-to-end without live government data or APIs.

---

## 1. Reconciliation Summary (`00` vs `01`)

| Dimension | `00-BUSINESS_REQUIREMENT.md` (Origin) | `01-BUSINESS_REQUIREMENTS.md` (Canonical v3.0) | Execution Decision |
|---|---|---|---|
| **Agents / AI** | 14–15 specialized agents (lines 423–505, 1395–1760) | 4 bounded AI capabilities (`A1–A4`) + deterministic code | **Build 4 bounded AI adapters only**; deterministic Python for deadlines, state, RBAC, KPIs. |
| **Domain Scope** | Broad Women + Child issues simultaneously | **Domain A (Women)** active MVP; **Domain B (Child)** architecture-ready only | **MVP builds Domain A only** (1 validated Women protection gap end-to-end). |
| **Primary UI** | Decision Centre + Investigation Workspace | Investigation Workspace (`DISCOVER → INVESTIGATE → VALIDATE → ASSIGN → ACT → VERIFY → LEARN`) | **Make Investigation Workspace & Attention Centre primary**; no 20-chart dashboards or district leaderboards. |
| **Data & Infra** | Data Lake + Knowledge Graph + Kafka | React/Vite + FastAPI + PostgreSQL (`pgvector` + RLS) modular monolith | **Modular monolith only**; defer Kafka/K8s/Neo4j until verified scale. |
| **Build Protocol** | 16-Step Vibe-Coding + 4-Role Loop (lines 5402–5567) | Steps 1–16 + `G01–G10` Governance Gates | **Stop-and-verify after every milestone**; synthetic data only until `G01–G10` pass. |

---

## 2. Current Baseline & Milestone Status (Done vs Pending)

| Milestone | Steps | Status | Verified Artifacts & Pending Production Gaps |
|---|---|---|---|
| **Pre-Build** | Steps 1–3 | **DONE** | Audit (`05`), contradictions resolved (`01`, `02`), `G01–G10` gates locked. |
| **Milestone A** | Steps 4–5 | **DONE** | CORS/env hygiene, SQLAlchemy ORM, React 19, mobile drawer, fallback banner (`vitest` 4/4). |
| **Milestone B** | Steps 6–8 | **DONE** | Evidence DB + `source_origin`, `X-User-Role` RBAC, Domain B `403` lock, Gap state machine. |
| **Milestone C** | Steps 9–10 | **DONE** | Investigation `PATCH` persistence, cosine RAG + prompt-injection refusal (`10/10` pytest). |
| **Milestone D** | Steps 11–13 | **DONE** | Interventions/Outcomes human gates, DB-backed SHA-256 WORM audit + tamper detection (`13/16` pytest). |
| **Milestone E** | Steps 14–16 | **DONE** | Zero-PII `422` guard, 1-gap synthetic E2E lifecycle (`16/16` pytest), `G01–G10` gap report. |
| **Milestone F** | Auth & UI Forms | **DONE** | Alembic `0001_initial_schema`, signed Bearer JWT (`/auth/token`), Gap/Intervention/Outcome UI forms (`17/17` pytest). |
| **Milestone G** | Civic Light UX | **DONE** | `DESIGN.md`, `design-tokens.css`, `:focus-visible`, Domain/Severity/StatCard/CTA & Investigation light refactor (`5/5` Vitest, `20/20` Pytest). |
| **Milestone H** | P0–P3 Execution | **DONE** | `Matter`/`Action` (12-state)/`Dependency`/`Decision`/`Notification`/`Recognition` backend + `MyWork`/`ProblemDecompose`/`Matter360`/`Convergence`/`Finance`/`NGO`/`Excellence` UI (`6/6` Vitest, `26/26` Pytest). |
| **Milestone I** | Demo, Help & QA | **DONE** | Compact icon header + B&W theme toggle, bottom-docked `Ask AI` assistant, `19-Step End-to-End Demo` (`/demo-flow`), 30-category `Help & Platform Knowledge Centre` (`/help`), M17/M18 mock simulators, `10/10` Vitest, `26/26` Pytest, Playwright `21/21` (`31` routes × `4` viewports: `1920px`/`1280px`/`768px`/`375px`, `0` errors, `0` overflows). |
| **Milestone J** | Phased Infra & M17/M18 DB | **DONE** | Alembic `0002` (`continuity_tokens`, `ground_truth_callbacks`, PostgreSQL RLS DDL), M17/M18 Zero-PII REST APIs, offline PWA `sw.js` + `offlineQueue.ts`, `PgVectorAdapter` & `LocalLLMAdapter` scaffolds, `/integrations/status` registry (`28/28` Pytest). |
| **Prod & Pilot** | Post-Demo | **PENDING** | Managed PostgreSQL + `pgvector` on NIC MeghRaj, local LLM weights, Gov SSO IdP, `G03`/`G04`/`G08`/`G10` government sign-offs. |
| **Continuity M18** | Conditional | **PENDING (`G03/G04`)** | `case_tokens`, `consents`, `referrals`, `step_events`, repeat-statement UI, offline PWA sync. |

---

## 3. Concrete Execution Plan (Milestones 4–16)

Every milestone runs the **4-Role Loop** (`Architect → Developer → Tester → Reviewer`) and **Golden Loop** (`Plan → Implement → Run → Test → Break → Review → Fix → Commit`). **Stop at each gate.**

### Milestone A — Foundation, Security Hygiene & Responsive Shell (Steps 4–5)
* **Step 4 (Backend Baseline & DB):**
  * Fix `backend/app/core/config.py`: remove `"*"` from `CORS_ORIGINS` when `allow_credentials=True`; load `SECRET_SALT` & DB URL from `.env`.
  * Add SQLAlchemy + Alembic (`backend/alembic/`) + PostgreSQL schema (`evidence_library`, `gap_contracts`, `gap_investigations`, `interventions`, `outcomes`, `audit_chain`).
  * Add `pytest` + `httpx` test harness (`backend/tests/`).
* **Step 5 (UX, Mobile Nav & Fallback Transparency):**
  * Fix `src/components/layout/Header.tsx` (remove `hidden md:flex` hiding domain switcher on mobile).
  * Fix `src/components/layout/Sidebar.tsx` (add responsive mobile drawer for 10 nav items).
  * Update `src/pages/AttentionCentrePage.tsx` (clear platform purpose + active vs planned module badges).
  * Update `src/services/api.ts` + layout banner to show explicit `"SYNTHETIC / OFFLINE FALLBACK"` indicator whenever API is unreachable.
* **Exit Gate A:** `npm run build`, `npm test`, `pytest`, and mobile (`375px`) / tablet (`768px`) / desktop (`1280px`) layout check pass.

### Milestone B — Domain Separation, Evidence & Gap Lifecycle (Steps 6–8)
* **Step 6 (Evidence Library & Provenance):**
  * Persist `evidence_library` in PostgreSQL; add `POST /api/v1/evidence` and `source_origin` (`OFFICIAL` | `OPERATIONAL` | `FIELD` | `SYNTHETIC`).
  * Wire `src/pages/EvidenceLibraryPage.tsx` to live API + upload modal + epistemic filter.
* **Step 7 (Domain A/B Isolation & RBAC):**
  * Add server-side JWT/session RBAC middleware (`backend/app/core/auth.py`) enforcing `role`, `domain`, and `district_id`.
  * Lock `Domain B (CHILD)` endpoints/UI to read-only research/architecture preview; reject live child case writes with `403`.
* **Step 8 (Gap Contract State Machine):**
  * Add `POST /api/v1/gaps` and `PATCH /api/v1/gaps/{gap_id}/status` with deterministic state machine (`CANDIDATE → UNDER_INVESTIGATION → VALIDATED → INTERVENTION_PLANNED → INTERVENTION_ACTIVE → VERIFIED → CLOSED / REJECTED`).
  * Enforce human validation gate (AI/non-official role cannot set `VALIDATED` or `CLOSED`).
* **Exit Gate B:** `pytest` negative RBAC & invalid-transition tests pass; `vitest` + `npm run build` pass.

### Milestone C — Investigation Workspace & Bounded AI (Steps 9–10)
* **Step 9 (Investigation Workspace Persistence):**
  * Add `PATCH /api/v1/investigations/{gap_id}` persisting `verified_facts`, `conflicting_evidence`, `data_gaps`, `hypotheses`, `legal_references`, `scheme_references`, `dependencies`.
  * Update `src/pages/InvestigationPage.tsx` so investigators can edit hypotheses, record field verification questions, and save to DB.
* **Step 10 (Bounded AI `A1–A4` & pgvector Retrieval):**
  * Replace keyword `if/elif` in `backend/app/services/rag_service.py` with provider-agnostic LLM adapter (`temperature=0.0`) + `pgvector` chunk retrieval.
  * Enforce citation check + similarity threshold ($\tau \ge 0.78$) returning `"DATA NOT AVAILABLE"` when unsupported.
* **Exit Gate C:** Evaluation harness tests pass ($\ge 95\%$ citation accuracy, $0\%$ invented law on negative queries).

### Milestone D — Interventions, Outcomes & Immutable Audit (Steps 11–13)
* **Step 11 (Intervention Ownership & Human Approval):**
  * Add `GET/POST /api/v1/interventions` and `POST /api/v1/interventions/{id}/approve` in `router.py`; wire `src/pages/InterventionsPage.tsx`.
  * Require `owner_role`, `resources`, `constraints`, `legal_considerations`, `baseline`, `target`, `review_date`, and executive approval.
* **Step 12 (Outcome Verification):**
  * Add `GET/POST /api/v1/outcomes` and `POST /api/v1/outcomes/{id}/verify`; wire `src/pages/OutcomesPage.tsx`.
  * Support `NOT_STARTED`, `IN_PROGRESS`, `PARTIALLY_EFFECTIVE`, `EFFECTIVE`, `INEFFECTIVE`, `INSUFFICIENT_DATA` + `alternative_explanations` + human sign-off.
* **Step 13 (DB-Backed WORM Audit Chain):**
  * Persist `audit_service.py` SHA-256 chain in `audit_chain` PostgreSQL table; log all auth, evidence, gap, AI, intervention, and outcome events.
* **Exit Gate D:** Tamper-detection test flags altered DB rows; `npm run build` + `pytest` pass.

### Milestone E — Hardening, Synthetic E2E & Pilot Gate (Steps 14–16)
* **Step 14 (Security, Privacy & Red-Team Testing):**
  * Run `pytest` security suite: prompt-injection refusal ($100\%$), Zero-PII payload rejection, cross-district/cross-domain `403` isolation, SQL/XSS input validation.
* **Step 15 (End-to-End Synthetic Demo):**
  * Execute 1 complete Women Protection workflow (Legal-aid referral delay in synthetic District X): `Discover → Investigate → Validate → Assign → Act → Verify` using Playwright + API.
* **Step 16 (Pilot-Readiness Gap Sign-Off):**
  * Produce final `G01–G10` readiness checklist. **Hard Stop:** No real beneficiary data or live district deployment until `G03` (written WCD/Police data-sharing protocol), `G04` (DPDP legal opinion), and `G10` (paper baseline) are signed.

---

## 4. Conditional Track: Micro Case Continuity (`M18` / CCP v2)
Activated **only after** Milestone E passes and Governance Gates `G03`, `G04`, `G08`, `G10` are signed:
* Add `case_tokens`, `consents`, `referrals`, `step_events`, `family_contexts` tables with PostgreSQL RLS per institution.
* Upgrade `src/pages/WomenWorkspacePage.tsx` to offline-tolerant PWA intake + consent capture + `C1–C4` bounded continuity assistants + repeat-statement counter + status-code SMS webhook.
