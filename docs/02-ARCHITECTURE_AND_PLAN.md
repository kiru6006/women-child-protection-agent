# System Architecture, Statutory DAGs & Execution Plan
## WCD Protection Intelligence Platform (Suraksha Sentinel & Sahyog)

---

## 1. Architecture Overview (Modular Monolith)

```
+---------------------------------------------------------------------------------------------------+
|                        FRONTEND: React 19 + TypeScript + Vite + Tailwind (src/)                   |
|                        Civic Intelligence Light Tokens (DESIGN.md, design-tokens.css)         |
|  Attention Centre | Women Workspace | Gap Explorer | Investigation | Evidence | Interventions     |
|  Outcomes | Knowledge Assistant | Audit & Explainability | Child Protection (Phase 2 Preview)     |
+---------------------------------------------------------------------------------------------------+
                                                 │ REST API (/api/v1) + RBAC JWT/Session
                                                 ▼
+---------------------------------------------------------------------------------------------------+
|                   BACKEND MODULAR MONOLITH: Python + FastAPI + SQLAlchemy (backend/)              |
|  ┌──────────────────────┐  ┌──────────────────────────┐  ┌─────────────────────────────────────┐  |
|  │ Evidence & Knowledge │  │ Deterministic DAG Engine │  │ Bounded AI Adapter (A1–A4, temp=0)  │  |
|  │ Provenance + pgvector│  │ Gap State + SLA Timers   │  │ Provider-agnostic + Citation Guard  │  |
|  └──────────────────────┘  └──────────────────────────┘  └─────────────────────────────────────┘  |
+---------------------------------------------------------------------------------------------------+
                                                 │
                                                 ▼
+---------------------------------------------------------------------------------------------------+
|             PERSISTENCE: PostgreSQL (RLS + pgvector) + Alembic Migrations + WORM Audit            |
+---------------------------------------------------------------------------------------------------+
```

* **No Premature Complexity:** No microservices, Kafka, Kubernetes, Neo4j, or separate data lake in MVP unless verified scale requires them.
* **Domain Boundaries:** Domain A (Women) and Domain B (Child) enforce separate rules, permissions, and workflows over a shared intelligence layer. Household linkage uses a restricted `family_contexts` junction — never merged profiles.
* **Demo Mode / Mock Data Note:** This application is built as an interactive **Synthetic Demonstration App** using mock government datasets ([`src/data/mockData.ts`](../src/data/mockData.ts), [`src/store/demoStore.ts`](../src/store/demoStore.ts), and [`backend/app/data/seed_data.py`](../backend/app/data/seed_data.py)). All screens connect end-to-end with zero real government MIS or beneficiary PII; live government integration remains gated behind `G01–G10`.

---

## 2. Deterministic Statutory State Machines (DAGs)

Statutory timelines are enforced in deterministic Python code, **never** by LLM estimation.

### 2.1 Domain A — Women Protection (PWDVA 2005 & BNSS 2023)
```
[OSC / 181 Intake] (T0)
   ├── [24h Window] ──> [Medical Exam Completed] (PWDVA s.7)     ──(Breach >24h)──> CMO Escalation Draft
   └── [48h Window] ──> [DIR Prepared by PO] (PWDVA s.9(1)(b))   ──(Breach >48h)──> PO Escalation Draft
                              │
                              ▼
                  [Magistrate Filing] (s.12) ──> [DLSA Legal Aid] (s.12(c)) ──> [3-Month Outcome Audit]
```

### 2.2 Domain B — Child Protection (JJ Act 2015 & POCSO 2012) — Phase 2/3 Blueprint
```
[Rescue / Reporting] (T0)
   ├── [24h Window] ──> [Forensic Medical Exam] (POCSO s.27)
   └── [24h Window] ──> [CWC Production] (JJ Act s.31(1)) ──> [Fit Facility / ICP] ──> [Aftercare]
```

---

## 3. Core Database Schema (PostgreSQL + Alembic)

* `evidence_library`: `evidence_id`, `title`, `source_org`, `publication_date`, `document_type`, `source_url_or_ref`, `credibility_category`, `source_origin` (`OFFICIAL` | `OPERATIONAL` | `FIELD` | `SYNTHETIC`), `applicable_domain`, `epistemic_class`, `extracted_claim`, `confidence_score`.
* `gap_contracts`: `contract_id`, `gap_type` (11 taxonomy), `domain`, `title`, `district_id`, `state_code`, `affected_cohort`, `root_cause_hypothesis`, `statutory_basis`, `named_owner_role`, `mandated_intervention`, `kpi_metric`, `kpi_baseline`, `kpi_target`, `deadline_date`, `status` (`CANDIDATE` → `CLOSED`), `severity`, `evidence_ids`.
* `gap_investigations`: `investigation_id`, `gap_id`, `domain`, `problem_summary`, `verified_facts`, `conflicting_evidence`, `data_gaps`, `hypotheses`, `legal_references`, `scheme_references`, `dependencies`, `possible_interventions`, `assigned_investigator_role`, `status`.
* `interventions` & `outcomes`: `intervention_id`, `gap_id`, `owner_role`, `resources`, `constraints`, `legal_considerations`, `baseline`, `target`, `measurement_method`, `review_date`, `approval_role`, `approved_at`, `observed_result`, `status` (`NOT_STARTED`..`INSUFFICIENT_DATA`), `alternative_explanations`.
* `audit_chain`: `block_index`, `timestamp`, `actor_role`, `action`, `entity_type`, `entity_id`, `payload_hash`, `previous_block_hash`, `block_hash`.
* *(Conditional M18 Continuity Tables, post-G02–G04)*: `case_tokens`, `consents`, `referrals`, `step_events`, `family_contexts`.

---

## 4. Controlled 16-Step Execution Order & Agent Protocol

Every step follows the Golden Loop (`Plan → Implement → Run → Test → Break → Review → Fix → Commit`) across 4 agent roles (**Architect → Developer → Tester → Reviewer**). **Stop after each milestone for verification.**

1. **Step 1:** Repository and requirements audit *(Baseline complete in `05-AUDIT_AND_TRACEABILITY.md`)*.
2. **Step 2:** Resolve BRD/PRD/implementation contradictions *(Complete)*.
3. **Step 3:** Document scope and governance gates *(Complete in `01-BUSINESS_REQUIREMENTS.md`)*.
4. **Step 4:** Fix backend config (`CORS_ORIGINS`, env secrets), add PostgreSQL + SQLAlchemy + Alembic + `pytest` baseline.
5. **Step 5:** Refine home screen (platform clarity, active vs planned badges), mobile nav drawer (`Sidebar.tsx`, `Header.tsx`), and explicit synthetic-data banner (`api.ts`).
6. **Step 6:** Persist Evidence Library (`POST/GET /api/v1/evidence`) with source provenance & synthetic/official tags.
7. **Step 7:** Enforce Women vs Child domain boundaries in backend RBAC and UI navigation.
8. **Step 8:** Persist Gap Contract CRUD & deterministic human-gated state transitions (`POST/PATCH /api/v1/gaps`).
9. **Step 9:** Persist Investigation Workspace (facts, conflicting evidence, data gaps, hypotheses, legal/scheme refs).
10. **Step 10:** Implement bounded AI adapter + pgvector retrieval with strict `"DATA NOT AVAILABLE"` fallback.
11. **Step 11:** Persist Intervention ownership, resources/constraints, and human approval workflow.
12. **Step 12:** Persist Outcome Verification against baselines with human closure review.
13. **Step 13:** Persist WORM SHA-256 Audit Chain in PostgreSQL and log all read/write/AI actions.
14. **Step 14:** Execute security, RBAC, Zero-PII, prompt-injection, and negative-path testing.
15. **Step 15:** Execute 1-gap end-to-end synthetic demonstration (`Discover → Investigate → Validate → Assign → Act → Verify`).
16. **Step 16:** Document pilot-readiness gaps against `G01–G10` before any live district deployment.
