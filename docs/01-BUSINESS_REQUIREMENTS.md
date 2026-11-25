# Business Requirements Document (BRD) — v3.0 (Consolidated)
## WCD Protection Intelligence Platform (Suraksha Sentinel & Sahyog)

**Proposed for:** Ministry of Women & Child Development (MoWCD), Government of India  
**Status:** Baseline Approved for Step 1–3 Governance Gates  
**Scope:** Broad Research Taxonomy (Women `W01–W12` + Child `C01–C16`); Narrow Operational MVP (**Domain A: Women Protection Intelligence** only; Child live workflows deferred post-legal approval).

---

## 1. Executive Summary & Core Shift

### 1.1 The Problem
MoWCD operates Mission Shakti (OSCs, Helpline 181), Mission Vatsalya (1098, CWC, DCPU, CCI), and POSHAN 2.0. Existing portals capture aggregate counts, yet protection fails because:
1. **Handoff Failures:** Survivors cross 6–12 disconnected institutions (OSC → Police → Hospital → DLSA → Shelter → Court) without shared status or SLA accountability.
2. **Process ≠ Outcome:** Referrals can complete on paper while survivors return to abusers due to economic dependence or delayed legal representation.
3. **Action Gap:** Officials already have statistics; they lack evidence-backed investigation linking **stalled workflows → named owner → corrective intervention → verified 90-day outcome**.

### 1.2 Core Lifecycle & Identity
* **Lifecycle:** `DISCOVER → INVESTIGATE → VALIDATE → ASSIGN → ACT → VERIFY → LEARN`
* **Gap Chain:** `Problem → Evidence → Law/Policy/Scheme → Expected Service → Observed Failure → Hypothesis → Responsible Authority → Intervention → Outcome`
* **What it is NOT:** Not a generic dashboard, not a district leaderboard, not an MIS replacement, not an individual risk-scoring/surveillance tool, and not an autonomous legal decision system.

---

## 2. Domain Architecture & Issue Taxonomies

### 2.1 Independent Protection Domains + Shared Layer
* **Domain A — Women Protection Intelligence (MVP Active):** `Safety → Support → Legal → Shelter → Economic/Social → Rehabilitation`.
  * *Research Taxonomy (`W01–W12`):* `W01` Physical safety (DV/dowry), `W02` Sexual offences, `W03` Workplace protection, `W04` Digital safety (cyberstalking/deepfakes), `W05` Trafficking, `W06` Economic vulnerability, `W07` Health, `W08` Legal protection, `W09` Service accessibility, `W10` Social welfare, `W11` Rehabilitation, `W12` Emerging vulnerabilities.
* **Domain B — Child Protection Intelligence (Phase 2/3 Architecture-Ready Only):** `Identification → Protection → Statutory Process → Care → Rehabilitation → Reintegration`.
  * *Research Taxonomy (`C01–C16`):* `C01` Child safety, `C02` Sexual protection (POCSO), `C03` Missing children, `C04` Child marriage, `C05` Child labour, `C06` Trafficking, `C07` Digital safety, `C08` Education, `C09` Health/nutrition, `C10` Disability, `C11` Institutional care (CCI), `C12` Family-based care, `C13` Juvenile justice, `C14` Rehabilitation, `C15` Aftercare, `C16` Welfare accessibility.
  * *Safeguards:* Public-source research & taxonomy only in v1. **Zero** live child case workflows, child risk scoring, custody/adoption decisions, or unrestricted linkage with parental/police/health records.
* **Shared Intelligence Layer:** Evidence Library, Policy/Law Knowledge, Gap Explorer, Investigation Workspace, Intervention Engine, Outcome Verification, Audit & Governance.

---

## 3. Product Capability Catalogue (M01–M20)

| ID | Capability | Classification | ID | Capability | Classification |
|---|---|---|---|---|---|
| **M01** | Attention Centre | MVP | **M11** | Government Convergence | Conditional |
| **M02** | Women Protection Intelligence | MVP | **M12** | Intervention Workspace | MVP |
| **M03** | Child Protection Intelligence | Architecture-Ready | **M13** | Outcome Verification | MVP |
| **M04** | Issue Explorer | MVP | **M14** | Geographic Intelligence | Post-MVP |
| **M05** | Evidence Library | MVP | **M15** | Government Knowledge Assistant | MVP |
| **M06** | Policy and Law Intelligence | MVP | **M16** | Government Decision Briefs | Conditional |
| **M07** | Scheme Intelligence | Conditional (Research) | **M17** | Ground Truth Verification | Post-MVP |
| **M08** | Service Intelligence | Conditional | **M18** | Protection Continuity (CCP v2) | Conditional (G02–G04) |
| **M09** | Gap Explorer | MVP | **M19** | AI Explainability | MVP |
| **M10** | Investigation Workspace | MVP | **M20** | Administration and Audit | MVP |

---

## 4. Functional & Non-Functional Requirements

### 4.1 Functional Requirements (Macro Gap-Closure + Conditional Micro Continuity)
* **FR-01 (Gap Contract State Machine):** Primary entity supporting `gap_id`, domain, issue category, geography, cohort, evidence refs, existing response, expected vs observed failure, 11-type taxonomy (`POLICY`, `IMPLEMENTATION`, `ACCESS`, `AWARENESS`, `CAPACITY`, `GEOGRAPHIC`, `COORDINATION`, `PROCESS`, `OUTCOME`, `DATA`, `EMERGING_THREAT`), severity, hypotheses, named `owner_role`, dependencies, intervention options, baseline/target, review date, closure evidence. Deterministic transitions: `CANDIDATE → UNDER_INVESTIGATION → VALIDATED → INTERVENTION_PLANNED → INTERVENTION_ACTIVE → VERIFIED → CLOSED / REJECTED`.
* **FR-02 (Investigation Workspace):** Answers 10 core questions across Facts, Evidence, Conflicting Evidence, Data Gaps, Competing Hypotheses, Legal/Scheme Refs, Dependencies, and Next Actions.
* **FR-03 (Evidence Provenance & Epistemic Tagging):** Distinguish official public records, authorised operational records, field observations, and synthetic demo records. Tag every claim `VERIFIED_FACT`, `INFERENCE`, `HYPOTHESIS`, `RECOMMENDATION`, or `DATA_NOT_AVAILABLE`.
* **FR-04 (Interventions & Human Approval):** Capture owner, resources, constraints, legal review, baseline, target, measurement method, review date. Prioritize process/capacity/coordination fixes before new software. Mandatory human approval.
* **FR-05 (Outcome Verification):** Track `NOT_STARTED`, `IN_PROGRESS`, `PARTIALLY_EFFECTIVE`, `EFFECTIVE`, `INEFFECTIVE`, `INSUFFICIENT_DATA` with alternative explanations and human sign-off before closure.
* **FR-06 (Conditional Micro Continuity — M18, Pilot Gated):** For 1 pilot district (1 OSC → Police → Medical → DLSA → Shelter, Women's DV): capture consent (`scope`, `given_at`, `withdrawn_at`, `witness`), pseudonymous tokens (no caste/religion/sexual orientation/Aadhaar), pointers-only storage, address-masking, repeat-statement counter, non-gating parallel referrals, and status-code SMS (no PII).

### 4.2 Non-Functional Requirements
* **NFR-01 (Architecture & Residency):** React + TypeScript + Vite frontend; Python + FastAPI + PostgreSQL + SQLAlchemy + Alembic + pgvector modular monolith; State Data Centre / NIC MeghRaj hosting; zero foreign SaaS for victim data.
* **NFR-02 (Security & RBAC):** Minimum necessary data; role/domain/jurisdiction RLS; AES-256 at rest, TLS 1.3 in transit; env-managed secrets; input validation, output sanitisation, prompt-injection defense, and immutable SHA-256 audit logging.
* **NFR-03 (UX & Accessibility):** Desktop, tablet, mobile responsive; accessible contrast; never rely on colour alone for status; explicit synthetic-data labeling.

---

## 5. Pre-Build & Pre-Pilot Governance Gates (G01–G10)

Synthetic prototyping may proceed; **real data processing and live district deployment MUST NOT bypass these gates:**

| Gate | Requirement | Gate | Requirement |
|---|---|---|---|
| **G01** | Product validation (evidence gap not solved by existing MIS) | **G06** | Privacy assessment (DPIA, access risks) |
| **G02** | Duplication review (existing WCD/ICPS/MIS examined) | **G07** | AI governance (allowed/prohibited behaviours locked) |
| **G03** | Operational ownership (written WCD/Police data-sharing protocol + named owner) | **G08** | Frontline usability (10–15 staff interviews; net workload reduced) |
| **G04** | Legal review (DPDP fiduciary/processor opinion, PWDVA/POCSO/JJ Act) | **G09** | Security validation (RBAC, audit, VAPT passed) |
| **G05** | Data governance (necessity, permissions, retention) | **G10** | Outcome readiness (paper baseline, target, measurement locked) |

---

## 6. Success Measurement (Process & Outcome Only)
* **Allowed KPIs:** Missed handoffs/unresolved actions, time to receive support, intake-to-referral time, referral acknowledgement SLA %, repeat-statement count, time from validated gap to approved intervention, verified improvement vs documented baseline, AI citation accuracy & human correction rate, security breach count (`0` target).
* **Banned KPIs:** Conviction counts, arrest counts, FIR counts, public district leaderboards. Zero percentage improvement claims without documented baselines.
