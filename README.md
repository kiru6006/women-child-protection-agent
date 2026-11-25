# WCD Protection Intelligence Platform (Suraksha Sentinel & Sahyog)

AI-assisted Government Protection, Policy, Service Delivery and Intervention Intelligence Platform for the **Ministry of Women & Child Development (MoWCD), Government of India**.

**Navigation:** [1. Project Overview](#1-project-overview) · [2. Structure by Features](#2-structure-by-features) · [3. Repository Structure](#3-repository-structure) · [4. Documentation Index](#4-documentation-index) · [5. Quickstart](#5-local-development-quickstart)

---

## 1. Project Overview

### The Problem
India's WCD ecosystem (Mission Shakti, Mission Vatsalya, POSHAN 2.0) already runs large MIS portals, yet protection fails between institutions:
1. **Institutional Silos:** A survivor interacts with 6–12 disconnected authorities (OSC, Police, Hospital, DLSA, Shelter, CWC) with no shared continuity or SLA accountability.
2. **Process ≠ Outcome:** Referrals can complete on paper while survivors return to unsafe environments due to missing legal aid, shelter, or economic support.
3. **Action Gap:** Senior officials have aggregate statistics, not an investigation mechanism linking **observed failure → verified evidence → named owner → corrective action → measured 90-day outcome**.

### How This Platform Solves It
The platform runs a **Twin-Domain + Shared Intelligence** architecture across the lifecycle:
`DISCOVER → INVESTIGATE → VALIDATE → ASSIGN → ACT → VERIFY → LEARN`

* **Domain A — Women Protection Intelligence (Active MVP):** Covers `Safety → Support → Legal → Shelter → Economic/Livelihood → Rehabilitation` (`W01–W12`), focusing on proving 1 real protection gap end-to-end.
* **Domain B — Child Protection Intelligence (Phase 2/3 Architecture-Ready):** Covers `C01–C16` (POCSO, JJ Act, CWC, CCI, aftercare) as public-source research and taxonomy only in MVP; live child case workflows remain locked behind separate statutory approvals.
* **Shared Protection Intelligence Layer:** Evidence Library, Gap Contracts, Investigation Workspace, Bounded AI (`A1–A4` at `temperature=0.0` with `"DATA NOT AVAILABLE"` fallback), Intervention Approval, Outcome Verification, and Immutable SHA-256 Audit Chain.
* **Non-Negotiable Guardrails:** Zero PII in central/AI storage (HMAC-SHA256 tokens), no individual risk scoring, no AI judicial/fact findings, no public district leaderboards, and mandatory human validation/approval gates. See [`AGENTS.md`](./AGENTS.md).

---

## 2. Structure by Features

```
WCD Protection Intelligence Platform
├── Domain A: Women Protection (MVP Active) ──> src/pages/WomenWorkspacePage.tsx
├── Domain B: Child Protection (Phase 2 Ready) ─> src/pages/ChildProtectionPage.tsx
└── Shared Protection Intelligence Layer
    ├── 1. Attention Centre (M01) ──────────────> src/pages/AttentionCentrePage.tsx
    ├── 2. Evidence Library (M05) ──────────────> src/pages/EvidenceLibraryPage.tsx
    ├── 3. Gap Explorer (M04, M09) ─────────────> src/pages/GapExplorerPage.tsx
    ├── 4. Investigation Workspace (M10) ───────> src/pages/InvestigationPage.tsx
    ├── 5. Interventions & Outcomes (M12, M13) ─> src/pages/InterventionsPage.tsx + OutcomesPage.tsx
    ├── 6. Statutory RAG Assistant (M15, M19) ──> src/pages/KnowledgeAssistantPage.tsx
    └── 7. WORM Audit & Explainability (M20) ───> src/pages/AuditPage.tsx
```

| Feature Module | Purpose | MVP Status | Frontend (`src/`) | Backend (`backend/`) |
|---|---|---|---|---|
| **Attention Centre** | Prioritised stalled-case & statutory breach queue for District Collectors / WCD officers | MVP | [`AttentionCentrePage.tsx`](./src/pages/AttentionCentrePage.tsx) | [`sentinel_service.py`](./backend/app/services/sentinel_service.py) |
| **Women Protection Workspace** | Domain A 6-stage continuum (`Safety → Rehabilitation`) & operational entry point | MVP | [`WomenWorkspacePage.tsx`](./src/pages/WomenWorkspacePage.tsx) | [`router.py`](./backend/app/api/v1/router.py) |
| **Child Protection Preview** | Domain B research taxonomy & JJ Act / POCSO DAG blueprint (no live child data) | Architecture-Ready | [`ChildProtectionPage.tsx`](./src/pages/ChildProtectionPage.tsx) | [`02-ARCHITECTURE_AND_PLAN.md`](./docs/02-ARCHITECTURE_AND_PLAN.md) |
| **Evidence Library** | Source provenance & epistemic tagging (`VERIFIED_FACT`, `INFERENCE`, `HYPOTHESIS`, `DATA_NOT_AVAILABLE`) | MVP | [`EvidenceLibraryPage.tsx`](./src/pages/EvidenceLibraryPage.tsx) | [`router.py`](./backend/app/api/v1/router.py) |
| **Gap Explorer** | 11-type Gap Contracts (`POLICY`..`EMERGING_THREAT`) with named owner role & KPIs | MVP | [`GapExplorerPage.tsx`](./src/pages/GapExplorerPage.tsx) | [`schemas.py`](./backend/app/models/schemas.py) |
| **Investigation Workspace** | Core UI: facts, conflicting evidence, data gaps, competing hypotheses & legal refs | MVP (Primary UI) | [`InvestigationPage.tsx`](./src/pages/InvestigationPage.tsx) | [`router.py`](./backend/app/api/v1/router.py) |
| **Intervention & Outcome Loop** | Human-approved corrective actions + 90-day baseline vs observed verification | MVP | [`InterventionsPage.tsx`](./src/pages/InterventionsPage.tsx), [`OutcomesPage.tsx`](./src/pages/OutcomesPage.tsx) | [`schemas.py`](./backend/app/models/schemas.py) |
| **Statutory Knowledge Assistant** | Bounded RAG query & cited e-Office Show-Cause Notice drafting (`DATA NOT AVAILABLE` fallback) | MVP | [`KnowledgeAssistantPage.tsx`](./src/pages/KnowledgeAssistantPage.tsx) | [`rag_service.py`](./backend/app/services/rag_service.py) |
| **Audit & Explainability** | Tamper-evident SHA-256 hash-chain ledger for all actions & AI outputs | MVP | [`AuditPage.tsx`](./src/pages/AuditPage.tsx) | [`audit_service.py`](./backend/app/services/audit_service.py) |
| **Protection Continuity (CCP v2)** | District pilot consent, Zero-PII tokens, referrals & repeat-statement counter | Conditional (`G01–G10`) | [`01-BUSINESS_REQUIREMENTS.md`](./docs/01-BUSINESS_REQUIREMENTS.md) | [`06-EXECUTION_PLAN.md`](./docs/06-EXECUTION_PLAN.md) |

### Implementation Status (Done vs Pending)

| Category | Done (Verified Prototype) | Pending (Live Pilot & Scale) |
|---|---|---|
| **Frontend (`src/`)** | React `19.3.1`, TypeScript, Vite, Civic Intelligence Light design tokens ([`DESIGN.md`](./DESIGN.md)), 10+ pages, mobile drawer & domain switcher, `"SYNTHETIC / OFFLINE FALLBACK"` banner, live API + create/update forms (`5/5` Vitest) | Playwright responsive E2E suite, offline PWA service-worker sync |
| **Backend (`backend/`)** | FastAPI + SQLAlchemy ORM + Alembic (`0001_initial_schema`), Gap/Evidence/Investigation/Intervention/Outcome CRUD, deterministic state machine, Zero-PII `422` guard, DB SHA-256 audit chain (`20/20` Pytest) | Production PostgreSQL + RLS on NIC MeghRaj, `pgvector` + local quantised LLM |
| **Governance & Security** | Explicit CORS origins, signed Bearer JWT (`/api/v1/auth/token`), `DEV_HEADER_AUTH_ENABLED` toggle, Domain B (`CHILD`) `403` write lock, prompt-injection refusal | External Gov SSO IdP, VAPT (`G09`), `G03` WCD/Police protocol, `G04` DPDP opinion, `G10` paper baseline |

---

## 3. Repository Structure

```
women-child-protection-agent/
├── README.md                                  # Master project overview & quickstart (single README)
├── AGENTS.md                                  # System invariants & agent execution rules
├── DESIGN.md                                  # Civic Intelligence Light design system & colour tokens
├── package.json                               # React + Vite + TypeScript + Vitest frontend config
├── src/                                       # Frontend SPA (React 19, TypeScript, Tailwind, Zustand)
│   ├── App.tsx                                # Router (10 pages)
│   ├── pages/                                 # Feature screens mapped in Section 2
│   ├── components/                            # Layout (Header, Sidebar) & epistemic/severity badges
│   ├── services/api.ts                        # Backend REST client (with mock fallback)
│   ├── store/appStore.ts                      # Role, domain, and district state
│   ├── types/index.ts                         # Canonical domain & Gap Contract types
│   └── tests/domain.test.ts                   # Vitest domain & invariant suite
├── backend/                                   # FastAPI modular monolith
│   ├── requirements.txt                       # Python dependencies
│   ├── run.py                                 # Local Uvicorn launcher (run from repo root)
│   └── app/
│       ├── main.py                            # FastAPI entrypoint & CORS
│       ├── core/config.py                     # Settings
│       ├── api/v1/router.py                   # REST API endpoints
│       ├── models/schemas.py                  # Pydantic schemas
│       ├── services/                          # sentinel_service, rag_service, audit_service
│       └── data/seed_data.py                  # Synthetic demonstration seed data
└── docs/                                      # Clean, audit-ready documentation (7 files)
    ├── 00-BUSINESS_REQUIREMENT.md             # Origin proposal, Protection Chain & 16-step build notes
    ├── 01-BUSINESS_REQUIREMENTS.md            # Canonical BRD v3.0 (W01–W12, C01–C16, M01–M20, G01–G10, FR/NFR, KPIs)
    ├── 02-ARCHITECTURE_AND_PLAN.md            # Modular monolith, Statutory DAGs, DB schema, 16-step build plan
    ├── 03-AI_SAFETY_AND_GOVERNANCE.md         # Epistemic standards, bounded A1–A4 AI, SDLC gates, VAPT matrix
    ├── 04-DATA_GOVERNANCE_AND_SECURITY.md     # DPDP Act 2023, Zero-PII tokenization, RLS, retention & erasure
    ├── 05-AUDIT_AND_TRACEABILITY.md           # Verified codebase audit, traceability matrix & acceptance criteria
    └── 06-EXECUTION_PLAN.md                   # Phased engineering execution plan (Milestones A–E, Steps 4–16)
```

**Core Entrypoints:** [`package.json`](./package.json) · [`src/App.tsx`](./src/App.tsx) · [`src/services/api.ts`](./src/services/api.ts) · [`src/tests/domain.test.ts`](./src/tests/domain.test.ts) · [`backend/run.py`](./backend/run.py) · [`backend/app/main.py`](./backend/app/main.py)

---

## 4. Documentation Index

| Document | Scope |
|---|---|
| [`DESIGN.md`](./DESIGN.md) | Civic Intelligence Light colour audit, semantic CSS tokens, WCAG 2.1 AA focus & component map |
| [`docs/00-BUSINESS_REQUIREMENT.md`](./docs/00-BUSINESS_REQUIREMENT.md) | Origin proposal, Protection Chain Intelligence, Investigation Workspace & 16-step build sequence |
| [`docs/01-BUSINESS_REQUIREMENTS.md`](./docs/01-BUSINESS_REQUIREMENTS.md) | Canonical BRD v3.0: problem framing, domains, M01–M20 catalogue, FR/NFRs, G01–G10 gates, KPIs |
| [`docs/02-ARCHITECTURE_AND_PLAN.md`](./docs/02-ARCHITECTURE_AND_PLAN.md) | React/FastAPI/PostgreSQL/pgvector modular monolith, PWDVA/JJ/POCSO DAGs, schema, 16-step plan |
| [`docs/03-AI_SAFETY_AND_GOVERNANCE.md`](./docs/03-AI_SAFETY_AND_GOVERNANCE.md) | Golden invariant, prohibited AI decisions, epistemic tags, bounded A1–A4 AI, VAPT benchmarks |
| [`docs/04-DATA_GOVERNANCE_AND_SECURITY.md`](./docs/04-DATA_GOVERNANCE_AND_SECURITY.md) | Zero-PII HMAC tokenization, DPDP 2023 / JJ Act s.74 / POCSO s.23 / PWDVA s.12 controls, RLS |
| [`docs/05-AUDIT_AND_TRACEABILITY.md`](./docs/05-AUDIT_AND_TRACEABILITY.md) | Current repo inventory, verified Requirements Traceability Matrix, risks, preserve/refactor/defer |
| [`docs/06-EXECUTION_PLAN.md`](./docs/06-EXECUTION_PLAN.md) | Concrete Milestones A–E (Steps 4–16), exact file targets, exit gates, conditional M18 continuity |

---

## 5. Local Development Quickstart

### Frontend (`src/`)
```bash
npm install
npm run dev        # Start Vite dev server (http://localhost:5173)
npm test           # Run Vitest domain invariant suite
npm run build      # Type-check and production build
```

### Backend (`backend/`)
Run from the repository root:
```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
python backend/run.py
```
API docs available at `http://127.0.0.1:8000/api/v1/docs` and health check at `http://127.0.0.1:8000/health`.
