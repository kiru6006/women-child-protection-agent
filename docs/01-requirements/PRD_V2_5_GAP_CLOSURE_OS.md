# PROJECT BRIEF: GAP-CLOSURE OPERATING SYSTEM FOR WOMEN & CHILD PROTECTION (WCD, INDIA)

You are a combined senior team: a former WCD Joint Secretary, a software architect who has built government case-management systems, a business analyst, a POCSO/PWDVA litigator, and a former High Court judge. You have collectively rejected the "AI dashboard for WCD" framing as a failure mode. Your task is to design and specify a real AI application — not a dashboard — delivered in phases.

## THE PROBLEM (do not re-describe it; solve it)

India's WCD ecosystem (Mission Shakti, Mission Vatsalya, Mission Saksham Anganwadi & POSHAN 2.0) reaches crores of beneficiaries but cannot answer: *for a woman or child who enters the system, where does the journey break, which department owns that break, and what is the smallest intervention that would move the outcome?*

Existing dashboards (POSHAN Tracker, Mission Vatsalya Portal, Nirbhaya Dashboard, SHe-Box, Sakhi Dashboard) solve scheme administration. They do not solve gap closure. Audits document the failures: 54% CCI staff shortage, Mission Vatsalya awareness below 50% everywhere, OSC medical-report delays, 3.5-year adoption waits, <40% helpline call-to-assistance conversion.

## THE REFRAME (non-negotiable)

This is NOT a dashboard. It is a **Gap-Closure Operating System**.

- **Unit of work:** the **Gap Contract** — a structured, stateful record with: gap ID, gap type (from an 11-type taxonomy), evidence (source, date, confidence), affected cohort, root-cause hypothesis, current response, missing intervention, named owner (role, not department), intervention, KPI (baseline, target, source, frequency), deadline, cost estimate, status (proposed → approved → in-progress → blocked → verified / failed), verification result, escalation path.
- **AI's role:** draft gap contracts from documents and aggregate data; suggest owner and KPI; monitor status; flag stalled contracts; propose escalation; verify outcome at deadline. The AI never decides, never scores an individual, never determines guilt or eligibility.
- **Official's role:** approve, fund, execute, escalate, verify.
- **Success metric:** contracts closed with KPI movement — not briefs viewed, not sessions, not "insights generated."

## THE TWO USERS (v1 only)

1. **Joint Secretary / Director, WCD.** JTBD: *"When the Minister asks for my top five child-protection priorities in 48 hours, I need five defensible Gap Contracts with owners, KPIs, cost, and a draft letter to the Chief Secretary."*
2. **District Collector / DPO.** JTBD: *"At my monthly review, I need the Gap Contracts assigned to my district, which are off-track, why, and what I must do this week."*

No other personas in v1. Resist scope creep.

## HARD CONSTRAINTS (violating any is a design failure)

**Legal:**
- No individual-level data in the intelligence layer.
- No individual risk scoring — not in any phase. Individual risk scoring of children or women is legally indefensible under Puttaswamy and the DPDP Act 2023 absent explicit statutory authorization, which does not exist.
- Any future individual-level workflow must be: on-premise, role-restricted, logged, non-decisional, non-training, and preceded by a DPIA.
- Comply with POCSO s.23, JJ Act s.74, PWDVA s.12(4), DPDP Act 2023, and Aadhaar Act s.29.
- No AI output is admissible as evidence. No AI identifies a victim. No AI makes a finding of fact.

**Engineering:**
- Three components, not sixteen agents: (1) Evidence & Graph Layer, (2) Gap Detection Engine, (3) Gap Contract Workflow.
- Evaluation harness from day one: labeled gap set, precision/recall, hallucination rate, citation accuracy.
- Versioned scheme rules (they change quarterly).
- Human-in-the-loop on every contract approval and every escalation.
- Latency: 3 min for a gap brief, 30 s for a query.
- Offline-capable for district deployment (poor connectivity).
- Open standards; no vendor lock-in; model-agnostic LLM interface; government-hosted data layer.

**Policy:**
- Every contract has a named owner at a named role, not "the department."
- Every KPI has baseline, target, source, frequency.
- Every contract has a deadline and an escalation path.
- Every recommendation has a counter-evidence field.

**Evidence:**
- No claim without a retrievable source (document, date, page/paragraph).
- No confidence without a stated calibration basis.
- "DATA NOT AVAILABLE" is a valid and required output. Never invent statistics.

## WHAT YOU MUST PRODUCE

For each phase below, produce:

1. **Objective** (one sentence, outcome-framed)
2. **Scope** (what is built)
3. **Deliverables** (concrete artifacts: schemas, API contracts, UI wireframes, test plans, code module specs)
4. **Acceptance criteria** (testable, falsifiable — e.g., "precision of gap detection ≥ 0.7 on a held-out labeled set of 50 gaps")
5. **Explicitly out of scope**
6. **Risks and kill criteria** (what would make us stop this phase)
7. **What a skeptical reviewer will attack, and your response**

Also produce, once, across all phases:

- **Data schemas** for: Gap, Gap Contract, KPI, Evidence, Owner, Escalation.
- **API contracts** for the three components.
- **The evaluation plan** (labeled set construction, metrics, human audit sample).
- **The legal compliance checklist** mapped to each phase.

## PHASES

### Phase 0 — Evidence Base & Gap Hypothesis (4 weeks)

Objective: Prove that the gap taxonomy is real and actionable before building anything.

Scope: Ingest 10–15 high-value public documents (WCD Annual Report 2024-25, Mission Shakti/Vatsalya/POSHAN guidelines, CAG performance audit, UNFPA OSC assessment, NCRB 2024 summary, Mission Vatsalya awareness study, CARA data, NFHS-5 district factsheets). Build the Gap taxonomy. Produce 20 candidate Gap Contracts for one state, each with evidence, proposed owner, KPI, and confidence.

Deliverables: taxonomy document, 20 gap contracts, evidence register, human-validation protocol.

Acceptance: two serving officials and one lawyer independently rate ≥15 of 20 gaps as "real and actionable." Kill criterion: <12/20 validated.

Out of scope: any software. This phase is documents and experts.

### Phase 1 — Gap Detection Engine v1 (8 weeks)

Objective: Given a corpus and a district query, produce a ranked list of gaps with evidence, owner, and KPI — at measurable precision.

Scope: RAG over the Phase 0 corpus; gap classifier over the 11-type taxonomy; owner-mapping from scheme rules; KPI suggestion from scheme guidelines; evidence passport on every output. Build the evaluation harness: 50-gap held-out labeled set, precision/recall, citation accuracy, hallucination rate.

Deliverables: detection engine spec + working prototype, evaluation report, failure-mode analysis.

Acceptance: precision ≥0.7, recall ≥0.6 on held-out set; citation accuracy ≥0.9; hallucination rate ≤0.05 on audited sample of 100 claims. Kill criterion: hallucination rate >0.15 after two iterations.

Out of scope: workflow, individual data, real-time APIs, multi-state.

### Phase 2 — Gap Contract Workflow (12 weeks)

Objective: Turn gaps into stateful, owned, tracked contracts with deadlines and escalation.

Scope: Contract schema, state machine, assignment to named roles, notification and escalation, status dashboard (as a byproduct, not the product), audit log. Integrate with Phase 1 engine. Human approval gate on every contract.

Deliverables: workflow spec, API contracts, UI wireframes for the two users only, escalation policy document, pilot deployment plan for one district.

Acceptance: a Joint Secretary can go from query to five approved contracts with owners and KPIs in under 30 minutes; a District Collector can see off-track contracts and required actions in under 5 minutes. Kill criterion: <50% of pilot contracts reach "approved" status within 60 days.

Out of scope: outcome verification, cross-ministry data, individual data.

### Phase 3 — Outcome Verification (12 weeks)

Objective: Prove that closed contracts moved KPIs. This is where the system earns its keep — or fails.

Scope: KPI ingestion from public/aggregate sources (NCRB, NFHS, UDISE+, NJDG aggregate); verification workflow at contract deadline; attribution caveats; learning loop that feeds verified/failed contracts back into the detection engine.

Deliverables: verification spec, attribution methodology (with explicit limitations), learning-loop design, evaluation of ≥10 closed contracts.

Acceptance: ≥5 contracts with defensible KPI movement attributable (with stated caveats) to the intervention. Kill criterion: <3 contracts show movement after 12 months.

Out of scope: individual-level outcome tracking, predictive modeling, individual risk scoring (permanently out of scope).

### Phase 4 — Scale (only if Phases 0–3 pass)

Objective: Extend to 5 states, add cross-ministry aggregate feeds under MoU, harden security, and publish the methodology.

Scope: state onboarding playbook, MoU templates, DPIA, security audit, methodology publication.

Deliverables: scale plan, compliance pack, public methodology note.

Acceptance: 5 states live; independent security audit passed; methodology published and peer-reviewed by at least two external experts.

## EXPLICIT PROHIBITIONS (design failures if violated)

- Do not design a dashboard. If your output contains the words "dashboard," "view," or "screen" as the primary deliverable, you have failed.
- Do not propose 16 agents. Propose 3 components with defined contracts.
- Do not use "evidence passport" as a substitute for verification. Verification = retrieval-grounded + human audit sample.
- Do not propose individual risk scoring in any phase.
- Do not propose individual-level data linkage without a named statutory basis and a completed DPIA.
- Do not invent statistics. Use "DATA NOT AVAILABLE" where true.
- Do not produce a taxonomy without a corresponding workflow that uses it.
- Do not produce success metrics that are usage metrics. Success = contracts closed + KPI movement.

## OUTPUT FORMAT

Return:

1. A one-page reframe statement (what this is, what it is not).
2. The three-component architecture with API contracts and data schemas.
3. Phase 0 through Phase 4, each in the seven-part format above.
4. The evaluation plan.
5. The legal compliance checklist mapped to phases.
6. A one-paragraph "what a skeptical reviewer will say, and our response" for the whole project.
7. The final product vision in one sentence — outcome-framed, not feature-framed.

Begin.


# MASTER PROMPT: PROJECT SURAKSHA SENTINEL
## Event-Driven Systemic Accountability & Intervention Engine for Women & Child Protection

---

## ROLE & CONTEXT

You are building **Project Suraksha Sentinel**, a production-grade AI application for the Ministry of Women and Child Development (WCD), Government of India. This is NOT a dashboard or analytics tool. It is an **event-driven, privacy-preserving, deterministic state machine** that tracks anonymized case journeys across disconnected government departments and auto-escalates statutory failures in real-time.

**Core Problem:** Women and children fall through the cracks because government departments operate in silos. Police register FIRs, but WCD Protection Officers are never informed. Health departments treat victims, but legal aid clinics don't know. Cases expire at handoff points because no one is watching the clock.

**Your Solution:** Build an AI system that:
1. Tracks anonymized case tokens (NO PII) through legally mandated workflows
2. Monitors time elapsed against statutory deadlines (POCSO, JJ Act, PWDVA, BNSS)
3. Auto-escalates breaches to responsible authorities with pre-drafted, legally sound communications
4. Verifies ground truth via anonymous citizen feedback (SMS/IVR)
5. Identifies systemic chokepoints and generates policy correction recommendations

---

## NON-NEGOTIABLE REQUIREMENTS

### 1. Privacy & Compliance (DPDP Act 2023)
- **ZERO PII in AI layers.** No names, Aadhaar, addresses, or phone numbers enter the LLM or vector database.
- Use **Anonymized Case Tokens** (e.g., `CASE-POCSO-BIH-9921`) with only metadata: Event Type, Timestamp, Current Department, Next Statutory Deadline, Required Action.
- All AI outputs must be auditable. Every claim must cite a specific source document (PDF + page number).
- If the AI cannot find evidence, it must output: `"DATA NOT AVAILABLE: Please consult the physical file"` — never hallucinate.

### 2. Technological Realism
- **No multi-agent LLM swarms.** Use a deterministic state machine + lightweight RAG for drafting.
- Deploy on **NIC MeghRaj** (Government of India cloud). Use open-source, auditable components.
- Frontend must be **offline-first, mobile-optimized PWA** (field workers use ₹8,000 Android phones with spotty 2G/3G).
- Backend must handle **event-driven architecture** (Apache Kafka or RabbitMQ) for real-time state changes.

### 3. Workflow Integration
- The system must **replace existing physical registers**, not add to them.
- Output must be in **government-standard formats**: Note Sheets (Noting), Draft Letters, Show-Cause Notices — ready to copy-paste into e-Office.
- Every escalation must include **specific legal sections** (e.g., "Section 31 of JJ Act mandates CWC production within 24 hours").

---

## TECHNICAL ARCHITECTURE

### Core Components

#### 1. Privacy-First Event Bus
- **Input:** When a case is registered (FIR, Helpline call, OSC visit), generate an Anonymized Case Token.
- **Data Structure:**
  ```json
  {
    "token": "CASE-POCSO-BIH-9921",
    "event_type": "FIR_REGISTERED",
    "timestamp": "2026-11-03T10:30:00Z",
    "current_department": "POLICE",
    "next_statutory_deadline": "2026-11-04T10:30:00Z",
    "required_action": "CWC_PRODUCTION",
    "metadata": {
      "district": "PATNA",
      "state": "BIHAR",
      "offence_type": "POCSO"
    }
  }
  ```

#### 2. Deterministic State Machine
- Hardcoded, legally vetted workflow graph for each offence type.
- **Example POCSO Workflow:**
  ```
  FIR_REGISTERED → MEDICAL_EXAM (24 hrs) → CWC_PRODUCTION (24 hrs) → 
  LEGAL_AID (7 days) → SHELTER_PLACEMENT (if needed) → 
  COUNSELING_INITIATED (7 days) → TRIAL_COMMENCED (60 days)
  ```
- Track time elapsed between states. If `Time > Statutory Limit`, trigger escalation.

#### 3. Sentinel Engine (Rule-Based + LLM)
- **Rule Engine:** Monitor deadlines, detect breaches, trigger escalations.
- **LLM Layer (RAG):** Generate pre-drafted communications (show-cause notices, inter-departmental memos) with strict citation enforcement.
- **Knowledge Sources:** Mission Shakti/Vatsalya Guidelines, POCSO Act, JJ Act, PWDVA, BNSS, State SOPs, CAG Reports, NCRB Data.

#### 4. Ground-Truth Verification (Citizen-in-the-Loop)
- Automated, anonymous SMS/IVR in local languages at critical milestones.
- **Example:** 7 days post-OSC visit: *"Did a counselor speak with you? Press 1 for Yes, 2 for No. Your identity is secret."*
- If ground truth contradicts MIS data (e.g., MIS says "Counseling Done", IVR says "No"), auto-escalate.

#### 5. Action Queue Interface
- **Field Worker View (Mobile PWA):** Prioritized list of "Today's Mandatory Actions" with one-tap status updates.
- **District Administrator View (Desktop):** Real-time list of active, expiring statutory breaches with one-click generation of required communications.
- **Ministry/High Court View (Strategic):** Systemic chokepoint analysis and policy correction recommendations.

---

## DATA MODELS

### 1. Case Token Table
```sql
CREATE TABLE case_tokens (
  token_id VARCHAR(50) PRIMARY KEY,
  offence_type VARCHAR(50),
  state VARCHAR(50),
  district VARCHAR(50),
  created_at TIMESTAMP,
  current_state VARCHAR(50),
  next_deadline TIMESTAMP,
  metadata JSONB
);
```

### 2. Event Log Table
```sql
CREATE TABLE event_log (
  event_id SERIAL PRIMARY KEY,
  token_id VARCHAR(50) REFERENCES case_tokens(token_id),
  event_type VARCHAR(50),
  timestamp TIMESTAMP,
  department VARCHAR(50),
  action_taken TEXT,
  officer_id VARCHAR(50),
  notes TEXT
);
```

### 3. Escalation Log Table
```sql
CREATE TABLE escalation_log (
  escalation_id SERIAL PRIMARY KEY,
  token_id VARCHAR(50) REFERENCES case_tokens(token_id),
  breach_type VARCHAR(50),
  escalation_level INT,
  escalated_to VARCHAR(100),
  communication_draft TEXT,
  sent_at TIMESTAMP,
  response_received BOOLEAN
);
```

---

## API SPECIFICATIONS

### 1. Event Ingestion API
```
POST /api/v1/events
{
  "token": "CASE-POCSO-BIH-9921",
  "event_type": "FIR_REGISTERED",
  "timestamp": "2026-11-03T10:30:00Z",
  "department": "POLICE",
  "officer_id": "SHO-PATNA-001",
  "metadata": {...}
}
```

### 2. Status Update API (Field Worker)
```
POST /api/v1/cases/{token_id}/status
{
  "new_state": "MEDICAL_EXAM_COMPLETED",
  "timestamp": "2026-11-03T14:00:00Z",
  "officer_id": "PO-BIH-042",
  "notes": "Medical exam conducted at District Hospital"
}
```

### 3. Escalation Query API (District Admin)
```
GET /api/v1/escalations?district=PATNA&status=PENDING
Response:
{
  "escalations": [
    {
      "token_id": "CASE-POCSO-BIH-9921",
      "breach_type": "CWC_PRODUCTION_DELAY",
      "hours_overdue": 6,
      "required_action": "Draft show-cause notice to DCPO"
    }
  ]
}
```

### 4. Draft Generation API (RAG)
```
POST /api/v1/drafts/generate
{
  "type": "SHOW_CAUSE_NOTICE",
  "token_id": "CASE-POCSO-BIH-9921",
  "breach_details": "CWC production delayed by 6 hours",
  "responsible_officer": "DCPO-PATNA"
}
Response:
{
  "draft": "No. F.12-34/2026-WCD...\n\nSubject: Show-cause notice regarding delay in CWC production...\n\nReference: Section 31 of JJ Act...\n\n[Full draft with citations]",
  "citations": [
    {"source": "JJ Act 2015", "section": "31", "page": 12}
  ]
}
```

---

## FRONTEND REQUIREMENTS

### 1. Field Worker PWA (Mobile)
- **Framework:** React + Next.js with Service Workers for offline-first capability.
- **Size:** Under 5MB total bundle size.
- **Features:**
  - Prioritized action queue (sorted by deadline urgency).
  - One-tap status updates with offline queuing.
  - Auto-sync when connectivity restored.
  - Local language support (Hindi, Tamil, Bengali, etc.).
  - GPS location capture (optional, for verification).

### 2. District Administrator Dashboard (Desktop)
- **Framework:** React + Next.js.
- **Features:**
  - Real-time escalation matrix (not charts, but actionable items).
  - One-click draft generation for show-cause notices.
  - Filter by offence type, breach severity, officer.
  - Audit trail of all escalations and responses.

### 3. Ministry/High Court View (Strategic)
- **Framework:** React + Next.js.
- **Features:**
  - Systemic chokepoint analysis (e.g., "40% of DV cases stall at police mediation").
  - Root cause recommendations (e.g., "Lack of female constables in 60% of rural stations").
  - Policy correction briefs with evidence citations.
  - Read-only, anonymized data only.

---

## BACKEND REQUIREMENTS

### 1. Core Services
- **Event Ingestion Service:** Receives events from departmental MIS, generates/updates case tokens.
- **State Machine Service:** Tracks case progression, monitors deadlines, triggers escalations.
- **RAG Service:** Retrieves relevant guidelines/SOPs, generates cited drafts.
- **Escalation Service:** Manages escalation matrix, sends communications, tracks responses.
- **Ground Truth Service:** Sends SMS/IVR, collects responses, flags discrepancies.

### 2. Tech Stack
- **Backend:** Python + FastAPI (microservices architecture).
- **Database:** PostgreSQL (relational) + Redis (real-time deadline tracking).
- **Event Bus:** Apache Kafka or RabbitMQ.
- **Vector DB:** Milvus or Qdrant (for RAG document embeddings).
- **LLM:** Fine-tuned Mistral or BharatLLM (open-source, auditable).
- **Infrastructure:** Kubernetes on NIC MeghRaj.

### 3. Security
- **Authentication:** Integrated with NIC e-Office IAM (AADHAAR/PAN-based).
- **Authorization:** Role-Based Access Control (RBAC) — District officials see only their district.
- **Encryption:** AES-256 at rest, TLS 1.3 in transit.
- **Audit Logs:** Immutable WORM storage for all AI decisions and data access.

---

## IMPLEMENTATION PHASES

### Phase 0: Foundation & Compliance (Months 1-2)
- DPDP Act compliance framework.
- Statutory workflow graph (legally vetted).
- Infrastructure blueprint (NIC MeghRaj).
- Security audit sign-off.

### Phase 1: Paper-to-Digital Pilot (Months 3-5)
- RAG drafting engine (ingest 50+ documents).
- Offline-first field worker PWA.
- Pilot in 2 districts using manual CSV uploads.
- Prove time-saving value.

### Phase 2: Event-Driven Integration (Months 6-9)
- Secure data ingestion gateways (Helpline, OSC, CWC MIS).
- Activate Sentinel state machine.
- Deploy District Action Queue.
- Real-time breach monitoring.

### Phase 3: Ground Truth & Auto-Escalation (Months 10-12)
- Anonymous citizen feedback (SMS/IVR).
- Automated escalation matrix.
- Judicial dashboard (High Court monitoring).
- Detect MIS falsification.

### Phase 4: State-Wide Scale & Policy Feedback (Months 13-18)
- Systemic chokepoint analyzer.
- Dynamic budget reallocation recommendations.
- Full state rollout with localized language support.

---

## SUCCESS CRITERIA

### Operational Metrics
- **Time Savings:** 30% reduction in time to draft inter-departmental briefs.
- **Breach Reduction:** 50% reduction in statutory deadline violations in pilot districts within 6 months.
- **Ground Truth Accuracy:** >90% correlation between MIS data and citizen feedback.

### Outcome Metrics
- **Case Resolution:** 20% increase in cases reaching intended outcomes (shelter, legal aid, counseling).
- **Systemic Fixes:** At least 3 policy corrections implemented based on AI-identified chokepoints.

### Compliance Metrics
- **Privacy:** Zero PII breaches. 100% audit trail coverage.
- **Citations:** 100% of AI outputs include verifiable source citations.

---

## CRITICAL RISKS & MITIGATIONS

### Risk 1: Departmental Resistance
- **Mitigation:** Frame system as "compliance shield" that protects officers from audit objections. Provide audit trail proving they acted within statutory limits.

### Risk 2: Data Quality ("Garbage In, Garbage Out")
- **Mitigation:** Ground truth verification via citizen feedback. Flag districts with high MIS-vs-reality discrepancy for manual audit.

### Risk 3: AI Hallucination
- **Mitigation:** Strict `temperature=0` in LLM. Fallback to "DATA NOT AVAILABLE" if citation missing. Human review required for all high-risk escalations.

### Risk 4: Field Worker Adoption
- **Mitigation:** System must replace physical register, not add to it. One-tap updates that auto-generate mandatory reports.

---

## FINAL DELIVERABLE

Build a production-ready, privacy-compliant, event-driven AI application that:
1. Tracks anonymized case journeys through legally mandated workflows.
2. Auto-escalates statutory breaches with pre-drafted, cited communications.
3. Verifies ground truth via anonymous citizen feedback.
4. Identifies systemic chokepoints and generates policy correction recommendations.
5. Integrates seamlessly with existing government workflows (e-Office, physical files, monthly reviews).

**This is not a dashboard. This is a systemic accountability engine that prevents the next tragedy by forcing the system to follow its own laws.**

---

## YOUR TASK

Using this master prompt, build the complete Project Suraksha Sentinel system. Start with Phase 0 (Foundation & Compliance), then proceed through each phase systematically. Provide:
1. Detailed technical specifications for each component.
2. Code implementation for core services (Event Ingestion, State Machine, RAG, Escalation).
3. Frontend implementation for all three views (Field Worker, District Admin, Ministry).
4. Database schemas and API endpoints.
5. Security and compliance documentation.
6. Testing strategy and deployment plan.

**Remember:** This system must be legally defensible, technically realistic, and relentlessly focused on the only outcome that matters — the safety and justice of women and children.