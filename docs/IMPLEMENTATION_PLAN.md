# Implementation Plan & Architectural Blueprint
## Project Suraksha Sentinel & Sahyog: Gap-Closure & Case Continuity Operating System for Women & Child Protection

---

## 1. Executive Multi-Stakeholder Panel Analysis

To build an actionable, legally resilient, and operationally viable system, the project team assembled a composite panel representing every critical link in the governance chain. Below is their synthesized analysis and debate resolving the contradictions across `PLANS.md` (v1 Dashboard), `PRD.md` (v2 Case Continuity), and `PRD2.md` (Gap-Closure OS & Suraksha Sentinel).

### Panel Members
1. **Dr. Rajeshwari Sen, IAS (Retd.)** — Former Joint Secretary, Ministry of Women & Child Development (MoWCD)
2. **Arjun Varma** — Principal GovTech Systems Architect (Ex-NIC MeghRaj / Open-Source Gov Architect)
3. **Adv. Meera Swaminathan** — Senior Litigator (POCSO, PWDVA, JJ Act, Supreme Court of India)
4. **Vikramaditya Rao, IAS** — Serving District Collector & District Magistrate
5. **Sunita Devi** — Frontline Lead & Administrator, One Stop Centre (OSC / Sakhi)
6. **Dr. Ananya Roy** — Lead Public Policy Business Analyst & Social Impact Auditor

---

### 1.1 The Cross-Examination: Resolving the Contradictions

```
+----------------------------------------------------------------------------------------------------+
|                               THE MULTI-STAKEHOLDER DIALECTIC                                      |
+----------------------------------------------------------------------------------------------------+
|  [v1: PLANS.md]                      [v2: PRD.md]                       [v2.5: PRD2.md]            |
|  16 LLM Agents                       4 Assistive Utilities              3 Core Architectural Layers|
|  6 Analytics Dashboards      -->     Case Continuity Layer      -->     Gap Contracts (Macro) +    |
|  For Senior Ministers/Secs           For Frontline Workers              Case Tokens (Micro Sentinel|
|  (REJECTED AS DASHBOARD BLOAT)       (GROUND-LEVEL CONTINUITY)          (UNIFIED HYBRID OS)        |
+----------------------------------------------------------------------------------------------------+
```

#### Debate 1: "Who is the primary user, and what is the deliverable?"
* **Dr. Rajeshwari Sen (Former JS, WCD):** "In v1 (`PLANS.md`), engineers gave me 16 AI agents and district heatmaps. I already have the Nirbhaya dashboard, the Poshan Tracker, and NCRB reports. If you give me another dashboard, I will nod at it in a review and never open it again. What I need before a Parliamentary Standing Committee or an Expenditure Finance Committee (EFC) meeting is: *Which statutory mandate is failing, who owns the post in that district, what executive order unblocks it, and how much does it cost?*"
* **Vikramaditya Rao, IAS (District Collector):** "At the district level, national gap scores are useless. My Monday morning District Convergence Meeting lasts 90 minutes. I cannot review 500 pages of text. I need an unvarnished list: *How many POCSO victims have been waiting over 24 hours for medical examination? How many domestic violence victims at the OSC have not had a Protection Officer assigned after 48 hours?* I need names of officers, overdue hours, and pre-drafted show-cause notices."
* **Sunita Devi (Frontline OSC Lead):** "Both of you are talking from air-conditioned offices. My staff is drowning. When a battered woman arrives at 2:00 AM, she has to narrate her trauma to me, then to the constable at the police station, then to the duty doctor, then to the DLSA lawyer. Each repetition is cruelty. If this system makes me type 50 fields into another tablet like the Poshan Tracker did, my counsellors will revolt. The system must reduce my typing, autofill the legal referral, and track whether the police officer actually acknowledged the case."
* **Consensus Resolution:** The system operates on a **Twin-Engine Model**:
  1. **Micro-Level (Operational Engine):** *Suraksha Sentinel* tracks anonymized case journeys using deterministic statutory state machines. Zero PII, offline-first mobile PWA for field workers, automated statutory deadline tracking.
  2. **Macro-Level (Governance Engine):** *Gap-Closure OS* aggregates micro-level handoff failures into stateful **Gap Contracts** for the District Collector and Joint Secretary, with assigned owners, measurable KPIs, and pre-drafted e-Office orders.

---

#### Debate 2: "Legal Admissibility, Privacy, and the LLM Trap"
* **Adv. Meera Swaminathan (Senior Litigator):** "We must kill three dangerous ideas from v1 immediately:
  1. *Individual Risk Scoring:* Predicting whether a child will drop out or be married off or whether a woman will be revictimized creates an unconstitutional, stigmatizing algorithmic registry without statutory basis (violating *K.S. Puttaswamy* and DPDP Act 2023).
  2. *AI Generating Legal Findings:* Under Section 31 of the Juvenile Justice Act and Section 12 of PWDVA, only the Magistrate or Child Welfare Committee (CWC) has fact-finding power. An AI summary cannot be placed before a court as evidence.
  3. *Central PII Database:* A centralized repository holding names, Aadhaar, and medical records of rape or domestic abuse survivors is an unacceptable breach hazard."
* **Arjun Varma (Principal Architect):** "Technically, we resolve this through strict architectural segregation:
  - **Zero PII in AI/Storage:** The operational bus only sees cryptographically generated tokens (`CASE-DV-2026-DL-0842`). PII stays strictly local on device or within the source institution under Row-Level Security (RLS).
  - **Deterministic State Machines over LLM Hallucinations:** Timelines are not determined by prompt engineering. They are hardcoded DAGs (Directed Acyclic Graphs) enforcing statutory deadlines (e.g., POCSO s.27 medical exam within 24 hours; JJ Act s.31 CWC production within 24 hours).
  - **Constrained RAG with Citation Enforcement:** LLMs are restricted strictly to drafting administrative memos (show-cause notices, inter-departmental letters) using pre-vetted SOP templates. Strict `temperature=0.0`. If a reference is missing, the system outputs `'DATA NOT AVAILABLE'`."
* **Consensus Resolution:** Strict compliance with DPDP Act 2023, JJ Act s.74, POCSO s.23, and PWDVA s.12(4). AI has zero judicial or predictive power; its sole role is clerical drafting and statutory timer auditing.

---

#### Debate 3: "Ground Truth vs. MIS Falsification"
* **Dr. Ananya Roy (Lead Auditor):** "Government MIS systems are notorious for paper compliance. An OSC dashboard might report '100% counselling completed', yet ground surveys reveal counsellors were absent or victims were turned away. How does this system prevent false reporting?"
* **Sunita Devi (OSC Lead):** "The only person who knows if the service happened is the survivor herself."
* **Arjun Varma (Principal Architect):** "We implement the **Citizen-in-the-Loop Ground Truth Verification Service**:
  - An automated, anonymous outbound IVR/SMS triggers 7 days after service logging in the survivor's regional language: *'Did an officer contact you regarding your shelter request? Press 1 for Yes, 2 for No.'*
  - No PII is spoken or recorded.
  - If citizen responses systematically contradict departmental status updates, the system flags an **Integrity Breach Gap Contract** directly to the District Magistrate's confidential log."
* **Consensus Resolution:** Integrate closed-loop citizen verification to check official claims against actual beneficiary experience.

---

## 2. Unified System Architecture: The Twin-Engine Model

```
+-------------------------------------------------------------------------------------------------------+
|                                  PROJECT SURAKSHA SENTINEL & SAHYOG                                   |
|                                                                                                       |
|  +-------------------------------------------------------------------------------------------------+  |
|  |                       FRONTEND INTERFACES (Offline-First React/Next.js PWA)                     |  |
|  |   [Field Worker Action Queue]        [District Collector Queue]       [Secretary Policy Console] |  |
|  |   - 1-tap case token update          - Overdue statutory breaches     - Stateful Gap Contracts   |  |
|  |   - Indic voice notes (Bhashini)     - 1-click Show-Cause notices     - Inter-dept convergence   |  |
|  +-------------------------------------------------------------------------------------------------+  |
|                                                  |                                                    |
|                                                  v REST / WebSocket API Gateways                       |
|  +-------------------------------------------------------------------------------------------------+  |
|  |                         ENGINE 1: SURAKSHA SENTINEL (Operational Micro Layer)                   |  |
|  |  +---------------------------+  +----------------------------+  +----------------------------+  |  |
|  |  |   Case Ingestion & Token  |  | Deterministic State Machine|  | Citizen Ground-Truth (IVR) |  |  |
|  |  |   Zero PII Tokenizer      |  | Statutory DAG (POCSO/DV)   |  | Verification Loop          |  |  |
|  |  |   HMAC-SHA256 Masking     |  | Celery/Redis SLA Timers    |  | Telephony Webhooks (Exotel)|  |  |
|  |  +---------------------------+  +----------------------------+  +----------------------------+  |  |
|  +-------------------------------------------------------------------------------------------------+  |
|                                                  |                                                    |
|                                                  v Handoff Failures & SLA Breaches (Kafka / RabbitMQ) |
|  +-------------------------------------------------------------------------------------------------+  |
|  |                         ENGINE 2: GAP-CLOSURE OS (Strategic Macro Layer)                         |  |
|  |  +---------------------------+  +----------------------------+  +----------------------------+  |  |
|  |  |   Gap Detection Engine    |  | Stateful Contract Engine   |  | Constrained RAG Drafter    |  |  |
|  |  |   11-Taxonomy Classifier  |  | State: Proposed->Verified  |  | Qdrant/Milvus Vector DB    |  |  |
|  |  |   Pattern Matcher         |  | KPI & Owner Binder         |  | e-Office Note-Sheet Gen    |  |  |
|  +-------------------------------------------------------------------------------------------------+  |
|                                                  |                                                    |
|                                                  v                                                    |
|  +-------------------------------------------------------------------------------------------------+  |
|  |                                  SECURE DATA & AUDIT LAYER                                      |  |
|  |   [PostgreSQL 16 with RLS]       [Redis 7 Deadline Cache]       [WORM Immutable Audit Chain]    |  |
|  |   Case Tokens & Gap Contracts    Real-Time Microsecond Timers   Cryptographic SHA-256 Logs      |  |
|  +-------------------------------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------------------------------+
```

### 2.1 Component 1: Sentinel Operational Engine (Micro Level)
* **Zero PII Ingestion:** When a survivor contacts an OSC, Helpline 181, or Police Women's Cell, an irreversible anonymized hash token is created (`token_id`). No name, Aadhaar, phone number, or street address enters the state machine.
* **Statutory State Machine:** A deterministic workflow engine running in Python/Celery that tracks statutory milestones:
  - *Domestic Violence (PWDVA 2005):* OSC Intake (T0) $\rightarrow$ Medical Exam ($T_0 + 24\text{h}$) $\rightarrow$ DIR by Protection Officer ($T_0 + 48\text{h}$) $\rightarrow$ Magistrate Filing ($T_0 + 72\text{h}$) $\rightarrow$ Legal Aid Appearance ($T_0 + 7\text{d}$).
  - *POCSO / JJ Act:* FIR Registration ($T_0$) $\rightarrow$ Forensic Medical Exam ($T_0 + 24\text{h}$) $\rightarrow$ CWC Production ($T_0 + 24\text{h}$) $\rightarrow$ Fit Facility / Shelter Order ($T_0 + 72\text{h}$) $\rightarrow$ Compensation Recommendation ($T_0 + 30\text{d}$).
* **Deadline Sentinel:** Redis-backed active timer monitoring every open step. When $t > t_{\text{statutory}}$, the engine fires an alert event.

### 2.2 Component 2: Gap-Closure Operating System (Macro Level)
* **Unit of Governance:** The **Gap Contract**. Rather than abstract analytics, gaps are formalized contracts between the District Magistrate / WCD Secretary and a designated official role.
* **11-Type Gap Taxonomy:**
  1. *Policy Gap* | 2. *Implementation Gap* | 3. *Access Gap* | 4. *Awareness Gap* | 5. *Capacity Gap* | 6. *Geographic Gap* | 7. *Coordination Gap* | 8. *Process Gap* | 9. *Outcome Gap* | 10. *Data Gap* | 11. *Emerging Threat Gap*.
* **RAG Drafting & Convergence Engine:** When a breach pattern surfaces (e.g., 15 cases in Block A lack CWC production within 24 hours due to transport shortages), RAG generates an e-Office compliant Note-Sheet and Show-Cause Notice citing exact sections of the JJ Act 2015 and State Child Protection Rules.

---

## 3. Data Schemas & API Specifications

### 3.1 PostgreSQL Database Schemas

```sql
-- 1. Anonymized Case Token (Zero PII)
CREATE TABLE case_tokens (
    token_id VARCHAR(64) PRIMARY KEY, -- SHA-256 hash
    offence_type VARCHAR(32) NOT NULL, -- 'DOMESTIC_VIOLENCE', 'POCSO', 'CHILD_MARRIAGE'
    state_code VARCHAR(8) NOT NULL,
    district_id VARCHAR(32) NOT NULL,
    block_id VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_state VARCHAR(64) NOT NULL,
    current_department VARCHAR(32) NOT NULL, -- 'WCD_OSC', 'POLICE', 'HEALTH', 'DLSA', 'CWC'
    next_statutory_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    sla_status VARCHAR(16) DEFAULT 'ON_TRACK', -- 'ON_TRACK', 'EXPIRING_SOON', 'BREACHED'
    repeat_statement_count INT DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Immutable Event Log
CREATE TABLE event_log (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id VARCHAR(64) REFERENCES case_tokens(token_id) ON DELETE RESTRICT,
    from_state VARCHAR(64) NOT NULL,
    to_state VARCHAR(64) NOT NULL,
    department VARCHAR(32) NOT NULL,
    acting_role VARCHAR(64) NOT NULL, -- e.g. 'PROTECTION_OFFICER', 'DUTY_DOCTOR', 'CW_MEMBER'
    actor_id_hash VARCHAR(64) NOT NULL,
    action_taken VARCHAR(128) NOT NULL,
    statutory_reference VARCHAR(128), -- e.g. 'PWDVA_SEC_9_1_B'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes_hash VARCHAR(64), -- SHA-256 of physical register record
    verification_status VARCHAR(32) DEFAULT 'PENDING' -- 'PENDING', 'VERIFIED', 'CONTRADICTED'
);

-- 3. Stateful Gap Contract Table (Macro Engine)
CREATE TABLE gap_contracts (
    contract_id VARCHAR(64) PRIMARY KEY,
    gap_type VARCHAR(32) NOT NULL, -- 1 of 11 Taxonomy Types
    title VARCHAR(256) NOT NULL,
    district_id VARCHAR(32) NOT NULL,
    state_code VARCHAR(8) NOT NULL,
    affected_cohort VARCHAR(128) NOT NULL,
    root_cause_hypothesis TEXT NOT NULL,
    statutory_basis VARCHAR(256) NOT NULL,
    named_owner_role VARCHAR(128) NOT NULL, -- Role, NOT department (e.g. 'CHIEF_MEDICAL_OFFICER')
    mandated_intervention TEXT NOT NULL,
    kpi_metric VARCHAR(128) NOT NULL,
    kpi_baseline NUMERIC(10, 2) NOT NULL,
    kpi_target NUMERIC(10, 2) NOT NULL,
    kpi_source VARCHAR(128) NOT NULL,
    kpi_frequency VARCHAR(32) NOT NULL, -- 'MONTHLY', 'QUARTERLY'
    estimated_cost_inr NUMERIC(12, 2) DEFAULT 0.00,
    deadline_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'PROPOSED', -- 'PROPOSED', 'APPROVED', 'IN_PROGRESS', 'BLOCKED', 'VERIFIED', 'FAILED'
    approved_by_role VARCHAR(128),
    approved_at TIMESTAMP WITH TIME ZONE,
    escalation_path JSONB NOT NULL,
    evidence_passport JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cryptographic Audit Chain (WORM / Tamper-Evident)
CREATE TABLE audit_chain (
    block_index BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    previous_block_hash VARCHAR(64) NOT NULL,
    block_hash VARCHAR(64) NOT NULL
);
```

---

### 3.2 Core API Contracts

#### API 1: Event Ingestion (Micro Sentinel)
```http
POST /api/v1/sentinel/events
Content-Type: application/json
Authorization: Bearer <JWT_ROLE_TOKEN>

{
  "token_id": "CASE-DV-2026-PAT-0842",
  "event_type": "MEDICAL_EXAM_COMPLETED",
  "department": "HEALTH",
  "acting_role": "MEDICAL_OFFICER",
  "actor_id": "MO-DH-PATNA-04",
  "statutory_reference": "PWDVA_2005_SECTION_7",
  "timestamp": "2026-11-03T10:15:00Z",
  "next_state_transition": "DIR_PREPARATION_PENDING",
  "evidence_doc_ref": "MED-REG-VOL3-PG42",
  "metadata": {
    "exam_window_hours_elapsed": 18,
    "injury_report_filed": true
  }
}
```
**Response (201 Created):**
```json
{
  "status": "ACCEPTED",
  "token_id": "CASE-DV-2026-PAT-0842",
  "current_state": "DIR_PREPARATION_PENDING",
  "next_statutory_deadline": "2026-11-04T10:15:00Z",
  "hours_remaining": 24.0,
  "sla_status": "ON_TRACK",
  "audit_block_hash": "a8f5b28d9c..."
}
```

#### API 2: District Breach Queue (Collector / Admin)
```http
GET /api/v1/sentinel/breaches?district_id=PATNA&severity=CRITICAL
Authorization: Bearer <JWT_DISTRICT_MAGISTRATE>
```
**Response (200 OK):**
```json
{
  "district": "PATNA",
  "total_active_breaches": 3,
  "breaches": [
    {
      "token_id": "CASE-POCSO-2026-PAT-0119",
      "offence_type": "POCSO",
      "breach_stage": "CWC_PRODUCTION",
      "responsible_role": "STATION_HOUSE_OFFICER_GANDHI_MAIDAN",
      "statutory_limit_hours": 24,
      "hours_overdue": 14.5,
      "statutory_citation": "Juvenile Justice Act 2015, Section 31(1)",
      "auto_draft_available": true,
      "draft_type": "SHOW_CAUSE_NOTICE",
      "draft_id": "DRAFT-SCN-2026-904"
    }
  ]
}
```

#### API 3: RAG Administrative Draft Generation
```http
POST /api/v1/rag/drafts/generate
Content-Type: application/json

{
  "draft_type": "SHOW_CAUSE_NOTICE",
  "token_id": "CASE-POCSO-2026-PAT-0119",
  "target_officer_role": "STATION_HOUSE_OFFICER_GANDHI_MAIDAN",
  "breach_type": "CWC_PRODUCTION_DELAY",
  "district": "PATNA"
}
```
**Response (200 OK):**
```json
{
  "draft_id": "DRAFT-SCN-2026-904",
  "document_title": "OFFICE OF THE DISTRICT MAGISTRATE, PATNA - SHOW CAUSE NOTICE",
  "content": "No. WCD/PAT/2026/SCN-119\n\nTo:\nThe Station House Officer,\nGandhi Maidan Police Station, Patna.\n\nSUBJECT: Non-compliance with Section 31 of the Juvenile Justice (Care and Protection of Children) Act, 2015 in Case Ref: CASE-POCSO-2026-PAT-0119.\n\nWHEREAS, in accordance with Section 31(1) of the Juvenile Justice Act, 2015, any child in need of care and protection or in conflict with law must be produced before the Child Welfare Committee (CWC) within 24 hours of apprehension/reporting, excluding travel time;\n\nAND WHEREAS, records indicate that Case Token CASE-POCSO-2026-PAT-0119 was registered on 02-11-2026 at 08:00 hrs, yet production before the Patna CWC has not occurred after 38.5 hours;\n\nNOW THEREFORE, you are hereby directed to SHOW CAUSE within 24 hours of receipt of this notice explaining the reasons for statutory non-compliance, failing which disciplinary and administrative action under the relevant service rules shall be initiated.\n\nIssued under the hand and seal of the District Magistrate, Patna.",
  "citations": [
    {
      "act": "Juvenile Justice (Care and Protection of Children) Act, 2015",
      "section": "Section 31(1)",
      "gazette_page": 18
    },
    {
      "act": "Model JJ Rules 2016",
      "rule": "Rule 18(2)",
      "gazette_page": 24
    }
  ],
  "confidence_score": 0.98,
  "human_gate_required": true
}
```

---

## 4. Five-Phase Implementation Roadmap

```
+-----------------------------------------------------------------------------------------------------------------+
|                                    PROJECT ROADMAP & MILESTONES (18 MONTHS)                                     |
+-----------------------------------------------------------------------------------------------------------------+
| PHASE 0: FOUNDATION & STATUTORY GRAPH   [Weeks 1-4]    --> Legal audit, DPDP DPIA, 20 pilot Gap Contracts       |
| PHASE 1: PAPER-TO-DIGITAL PILOT         [Weeks 5-12]   --> Offline PWA, RAG Drafter, 1 District (DV First)      |
| PHASE 2: EVENT-DRIVEN SENTINEL          [Weeks 13-24]  --> Live Redis timers, auto Show-Cause, District Queue   |
| PHASE 3: GROUND TRUTH & ESCALATION      [Weeks 25-36]  --> Telephony IVR verification, CWC/POCSO module         |
| PHASE 4: STATE SCALE & POLICY FEEDBACK  [Weeks 37-52]  --> Multi-district federation, Macro Gap Contracts loop  |
+-----------------------------------------------------------------------------------------------------------------+
```

### Phase 0: Foundation, Statutory Graph & Compliance (Weeks 1–4)
* **Objective:** Establish the legal and conceptual baseline; formulate and independently validate 20 real-world Gap Contracts and statutory DAGs before shipping code.
* **Scope:** 
  1. Complete formal Data Protection Impact Assessment (DPIA) under DPDP Act 2023.
  2. Encode statutory timeline rules (POCSO, PWDVA, JJ Act, BNSS) into machine-readable JSON-LD graph.
  3. Formulate 20 candidate Gap Contracts for 1 pilot state using CAG, NCRB, and state WCD reports.
* **Deliverables:**
  - `docs/compliance/DPIA_DPDP_2023.pdf`
  - `schemas/statutory_rules_v1.json` (Machine-readable statutory deadlines)
  - `contracts/phase0_20_gap_contracts.json`
* **Acceptance Criteria:** Independent verification by 2 serving IAS/WCD officers and 1 High Court advocate confirming $\ge 15/20$ Gap Contracts are legally valid and actionable.
* **Kill Criteria:** Failure to secure legal sign-off on the Zero-PII anonymization protocol or $< 12/20$ validated contracts.

---

### Phase 1: Paper-to-Digital Pilot & Constrained RAG (Weeks 5–12)
* **Objective:** Deploy an offline-first mobile PWA for OSC frontline staff and a constrained RAG drafting engine for 1 pilot district (DV journey first).
* **Scope:**
  1. Build React/Next.js PWA with Service Worker offline caching (bundle $< 4\text{MB}$).
  2. Implement FastAPI backend with PostgreSQL schema and Row-Level Security (RLS).
  3. Deploy local Qdrant vector database embedding 50 core WCD/MHA acts, SOPs, and manuals.
* **Deliverables:**
  - Functional Frontend PWA (`apps/field-pwa`)
  - Backend Core Service (`services/sentinel-api`)
  - Evaluation Harness with 50 held-out administrative scenarios (`tests/evaluation`)
* **Acceptance Criteria:**
  - RAG drafting precision $\ge 0.7$, citation accuracy $\ge 0.9$, hallucination rate $\le 0.05$.
  - Intake time for OSC staff reduced by $\ge 40\%$ compared to paper registers.
* **Kill Criteria:** Hallucination rate $> 0.15$ after two tuning cycles; staff refusal to use mobile PWA.

---

### Phase 2: Event-Driven Sentinel & District Action Queue (Weeks 13–24)
* **Objective:** Activate real-time statutory deadline monitoring and the District Collector Action Queue.
* **Scope:**
  1. Integrate Redis and Celery deadline monitors.
  2. Build Desktop Action Queue interface for the District Magistrate and District Programme Officer (DPO).
  3. 1-click generation of e-Office Note-Sheets and Show-Cause notices for overdue handoffs.
* **Deliverables:**
  - Real-time SLA engine (`services/sla-sentinel`)
  - District Administrator Portal (`apps/district-portal`)
  - Automated e-Office note-sheet templating module (`services/eoffice-exporter`)
* **Acceptance Criteria:**
  - District Collector can review all pending district breaches in $< 5\text{ minutes}$.
  - System captures $100\%$ of statutory SLA breaches with zero silent failures.
* **Kill Criteria:** $> 50\%$ of pilot district referrals unacknowledged due to departmental inter-silo refusal.

---

### Phase 3: Ground-Truth Verification & POCSO Expansion (Weeks 25–36)
* **Objective:** Close the verification loop via citizen IVR/SMS and activate the child protection (POCSO & CWC) thread.
* **Scope:**
  1. Integrate automated outbound telephony (Exotel/NIC SMS Gateway) in regional languages for anonymous survivor follow-up.
  2. Onboard CWC, Special Juvenile Police Unit (SJPU), and Child Care Institutions (CCIs) under JJ Act protocol.
  3. Activate Discrepancy Alert when ground-truth contradicts official MIS entries.
* **Deliverables:**
  - Citizen Verification Service (`services/ground-truth-ivr`)
  - Child Protection Module (`services/sentinel-cwc`)
  - Discrepancy Audit Dashboard (`apps/district-portal/audit`)
* **Acceptance Criteria:**
  - $\ge 85\%$ citizen response rate on anonymous IVR prompts.
  - Zero PII leaks across telephony logs.
* **Kill Criteria:** Re-identification vulnerability detected in citizen feedback channel.

---

### Phase 4: State-Wide Scale & Gap-Closure Convergence (Weeks 37–52)
* **Objective:** Scale to 5 districts across the state, linking micro handoff logs into macro Gap Contracts for the State Principal Secretary and Union Joint Secretary.
* **Scope:**
  1. Multi-tenant federation across 5 districts.
  2. Implement Macro Gap Contract lifecycle tracking (Proposed $\rightarrow$ Approved $\rightarrow$ In-Progress $\rightarrow$ Verified).
  3. Automated Annual Plan & Budgetary Reallocation recommendation briefs.
* **Deliverables:**
  - Multi-district deployment helm charts on NIC MeghRaj (`deploy/k8s`)
  - State Secretary Policy Console (`apps/state-console`)
  - Peer-reviewed methodology paper and open-source public specification.
* **Acceptance Criteria:**
  - $\ge 5$ state-level Gap Contracts successfully closed with measurable KPI improvement (e.g., $30\%$ reduction in medical exam delays).
  - External security audit and VAPT certification completed.

---

## 5. Evaluation Harness & Verification Protocol

To prevent subjective claims of "AI intelligence," the platform adheres to an uncompromising, quantitative evaluation harness:

```
+-----------------------------------------------------------------------------------------------+
|                                    EVALUATION HARNESS METRICS                                 |
+-------------------------------------+-----------------------------+---------------------------+
| METRIC                              | FORMULA / DEFINITION        | TARGET THRESHOLD          |
+-------------------------------------+-----------------------------+---------------------------+
| Citation Accuracy                   | (Correct Legal Citations) / | >= 95%                    |
|                                     | (Total Generated Citations) |                           |
+-------------------------------------+-----------------------------+---------------------------+
| Hallucination Rate                  | (Unverified Factual Claims) | <= 2% (Strict temp=0.0)   |
|                                     | / (Total Claims)            |                           |
+-------------------------------------+-----------------------------+---------------------------+
| SLA Detection Precision             | (True Statutory Breaches) / | 100% (Deterministic DAG)  |
|                                     | (Reported Breaches)         |                           |
+-------------------------------------+-----------------------------+---------------------------+
| Ground-Truth Correlation            | Correlation between MIS and | >= 90%                    |
|                                     | Citizen IVR feedback        |                           |
+-------------------------------------+-----------------------------+---------------------------+
| Frontline Time Reduction            | (Baseline Intake Time - PWA | >= 35% time savings       |
|                                     | Intake Time) / Baseline     |                           |
+-------------------------------------+-----------------------------+---------------------------+
| Gap Contract Resolution Rate        | (Contracts Closed with KPI  | >= 50% within 12 months   |
|                                     | Movement) / Total Approved  |                           |
+-------------------------------------+-----------------------------+---------------------------+
```

---

## 6. Comprehensive Risk Register & Defense

| Risk Category | Threat / Vulnerability | Likelihood | Impact | Concrete Architectural Mitigation |
|:---|:---|:---:|:---:|:---|
| **Privacy & Legal** | Re-identification of victim through combined quasi-identifiers | Low | Catastrophic | Strict k-anonymity ($k \ge 50$ for aggregate views); Zero PII stored in central engine; all case tokens use salt-rotated SHA-256 HMACs. |
| **Operational** | Frontline workers refuse to use system alongside existing paper registers | High | High | System auto-generates mandatory state Monthly Progress Reports (MPR) from 1-tap logs, eliminating double-entry. |
| **Inter-Departmental** | Police refuse to acknowledge referrals sent via WCD system | High | High | System does not gate police FIRs; it operates as an administrative audit log. Non-acknowledgment escalates directly to the District Magistrate's statutory review. |
| **Technical** | LLM invents legal sections or false precedents | Medium | High | RAG operates strictly against local vector store of verified gazette notifications; LLM temperature set to 0.0; mandatory fallback to `"DATA NOT AVAILABLE"`. |
| **Political** | District officials hide or manipulate breach data | Medium | High | Citizen-in-the-loop telephony independently audits reported outcomes; immutable hash-chain audit log prevents backdating or deletion. |

---

## 7. The Final Product Vision

> **Project Suraksha Sentinel & Sahyog is not a passive analytics dashboard; it is an event-driven accountability machine that protects the unalienable rights of women and children by tracking anonymized case handoffs across institutional silos, enforcing statutory deadlines, and converting administrative bottlenecks into binding, verifiable gap-closure contracts.**

