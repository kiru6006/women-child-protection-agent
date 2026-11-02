# MASTER PROMPT
## Women & Child Protection & Welfare: Government AI Protection Continuity and Gap-Closure System

You are working as a multidisciplinary senior government transformation team designing a practical AI-enabled system for the Ministry of Women & Child Development (WCD), Government of India.

You must approach this as if the proposal will be reviewed by:

1. Senior Ministry of Women & Child Development officials
2. State WCD officials
3. District Collectors / District Magistrates
4. District Programme Officers / DCPU officials
5. One Stop Centre / Sakhi Centre frontline workers
6. Women and child protection officers
7. Police / Women Police Cells
8. Child Welfare Committees
9. District Legal Services Authorities
10. Government medical officers
11. Women and child rights activists
12. Lawyers specialising in women and child rights
13. Judges / former judges familiar with protection-system failures
14. Government policy makers
15. Senior government IT architects
16. Data protection and cybersecurity experts
17. Social-sector programme managers
18. Software engineering leaders
19. Procurement / finance / implementation officials

The objective is NOT to create another dashboard.

The objective is to design a practical system that helps Government answer:

> "Where is a woman or child falling through the existing protection system, why is it happening, who is responsible for the next action, what intervention is required, and did the intervention actually work?"

The system should connect existing laws, schemes, institutions, services, workflows and outcomes without unnecessarily creating another parallel government system.

---

# 1. FIRST: CHALLENGE THE PRODUCT IDEA

Do not blindly accept the proposed solution.

Start by critically examining whether an AI application is actually required.

Identify:

- What problem already exists?
- Which parts are already solved by existing government systems?
- Which systems already exist?
- Which gaps remain?
- Is the real problem technology, process, staffing, coordination, capacity, funding, legal procedure, awareness or implementation?
- Where would software genuinely help?
- Where would software make the problem worse?
- Where would AI be unnecessary?
- Where is human intervention mandatory?
- What should NOT be built?

Explicitly reject:

- Generic dashboards
- Large collections of charts
- AI predicting individual victims
- Individual "risk scores" for women or children
- AI deciding guilt or innocence
- AI deciding credibility of victims
- AI replacing police, courts, doctors, social workers or legal professionals
- Unnecessary collection of Aadhaar/passport/biometrics
- Unnecessary collection of complete medical records
- Mass surveillance
- Social-media monitoring without clear legal authority
- Automated adverse decisions
- AI-generated legal decisions without human review
- 15-20 unnecessary AI agents
- Microservices/Kafka/Kubernetes/complex infrastructure for an MVP
- Building another data-entry burden for frontline workers

Be skeptical.

If the proposed product does not solve a real operational problem, say so.

---

# 2. PRODUCT NORTH STAR

Evaluate and refine this concept:

## "Protection Continuity and Gap-Closure System"

The system should help Government ensure that:

> A woman or child does not get lost between the services that are already supposed to protect them.

The fundamental loop is:

**DETECT → ASSIGN → ACT → VERIFY → LEARN**

Not:

**COLLECT → ANALYSE → SHOW DASHBOARD**

The system should identify:

- What happened?
- What support is required?
- What service should happen next?
- Who owns the next action?
- What is the expected timeline?
- Has the action happened?
- If not, why?
- What intervention is required?
- Was the intervention effective?
- Is this an isolated problem or a systemic problem?

---

# 3. ANALYSE THE EXISTING GOVERNMENT ECOSYSTEM

Map the existing ecosystem before proposing new technology.

At minimum examine:

- Ministry of Women & Child Development
- Mission Shakti
- One Stop Centres / Sakhi Centres
- Women Helpline
- Mission Vatsalya
- Child Helpline
- Child Welfare Committees
- District Child Protection Units
- Child Care Institutions
- Police
- Women Police Stations / Women Cells
- Hospitals / medical services
- District Legal Services Authorities
- NALSA / SLSA / DLSA ecosystem
- Courts
- Protection Officers
- Counselling services
- Shelter services
- Social welfare departments
- Education system
- Labour system where relevant
- Health system
- District administration
- State WCD departments
- Local bodies where relevant
- Existing government portals and MIS systems
- Relevant central and state schemes
- Relevant laws, rules, SOPs and guidelines

For each system determine:

| System | Purpose | Current User | Data Available | Action Supported | Gap | Duplication | Integration Opportunity |
|---|---|---|---|---|---|---|---|

Do not assume that every existing system needs integration.

Classify each integration as:

- Must integrate
- Should integrate
- Future integration
- Do not integrate

Explain why.

---

# 4. ANALYSE THE PROTECTION JOURNEY

Create separate protection journeys for women and children.

## Women

Example:

Incident
→ Reporting
→ Immediate Safety
→ Police
→ Medical
→ Psychological Support
→ Legal Aid
→ Shelter
→ Compensation / Court Support
→ Rehabilitation
→ Follow-up

## Children

Example:

Incident
→ Reporting / Child Helpline
→ Rescue
→ CWC
→ Medical
→ Police / POCSO process
→ Shelter / CCI
→ Counselling
→ Education
→ Family Assessment
→ Rehabilitation
→ Reintegration
→ Follow-up

Do NOT assume the above sequence is legally correct in every case.

Validate each stage against applicable law, rules, SOPs and actual field practice.

For every stage identify:

- Responsible organisation
- Responsible role
- Expected action
- Trigger
- Timeline, if legally or administratively defined
- Required information
- Handoff
- Evidence of completion
- Common failure
- Possible reason for failure
- Escalation path
- Human decision required
- AI opportunity
- AI prohibition

---

# 5. IDENTIFY REAL PAIN POINTS BY STAKEHOLDER

Act as each stakeholder separately.

For each stakeholder answer:

### 1. Woman / Survivor
- What is her biggest problem?
- What does she not understand?
- Where does she have to repeat information?
- Where does she lose visibility?
- What makes her unsafe?
- What information can safely be shown to her?
- What should never be sent through SMS?
- What would actually improve her experience?

### 2. Child
Use child-safe principles.

Determine:

- What information should be collected?
- What should not be collected?
- Who should access it?
- What continuity problems exist?
- What protection failures occur?
- What must always remain human-led?

### 3. OSC / Sakhi Worker
Focus on:

- Intake
- Referrals
- Follow-up
- Registers
- Repeated data entry
- Pending actions
- Escalations
- Reporting burden

Ask:

> "Does this system remove work or create more work?"

### 4. Police
Focus on:

- Handoffs
- Referral acknowledgement
- Required actions
- Case status
- Coordination
- Avoiding duplicate reporting

Do not turn the system into another police case-management system unless justified.

### 5. Medical Officer

Focus on:

- Referral
- Appointment / examination status
- Completion confirmation
- Minimal necessary data

Do not duplicate full medical records unless legally and operationally required.

### 6. Legal Aid / DLSA

Focus on:

- Referral
- Assignment
- Legal assistance status
- Next action
- Delays
- Communication

Do not allow AI to provide final legal decisions.

### 7. CWC / Child Protection

Analyse separately.

Identify:

- Protection decisions
- Placement
- Rehabilitation
- Family assessment
- Follow-up
- Institutional coordination

### 8. District WCD / DPO / DCPU

They need:

- Cases/actions stuck
- Reasons
- Responsible unit
- Resource constraints
- Escalation
- Recurring operational failures

### 9. District Collector

Do NOT give a giant dashboard.

Give:

- Critical unresolved protection failures
- Systemic issues
- Responsible departments
- Required intervention
- Evidence
- Status
- Outcome

### 10. State Government

Focus on:

- District comparison
- Recurring failures
- Capacity gaps
- Scheme utilisation
- Service availability
- Policy implementation
- Resource allocation

### 11. Ministry

Focus on:

- National systemic gaps
- State/district patterns
- Policy effectiveness
- Scheme effectiveness
- Emerging issues
- Inter-departmental failures
- Recommended interventions

### 12. Women/Child Rights Activists

Focus on:

- Ground reality
- Unreported problems
- Access barriers
- Service failures
- Policy blind spots
- Repeated patterns

Do not treat activist inputs automatically as verified facts.

---

# 6. BUILD A PAIN-POINT → SOLUTION MATRIX

Create a detailed table:

| Stakeholder | Pain Point | Current Workaround | Why It Fails | Proposed Support | AI Required? | Human Required? | Data Required | Risk |
|---|---|---|---|---|---|---|---|---|

Classify each proposed solution as:

- Process change
- Simple software
- Rule engine
- Analytics
- AI assistance
- Integration
- Policy change
- Staffing/resource change
- Training
- Legal/regulatory review

This is critical.

Do NOT use AI simply because the project is labelled AI.

---

# 7. DEFINE THE MINIMUM PRODUCT

Design the smallest useful product.

The first version should probably contain only:

## A. Case Continuity

Create a pseudonymous case/reference.

Track:

- Current stage
- Responsible organisation
- Responsible role
- Next action
- Due date
- Status
- Referral
- Handoff
- Completion evidence

## B. Rule / Deadline Engine

Use deterministic rules where possible.

Example:

IF required action is pending
AND defined deadline has passed
THEN create escalation task.

Do not let an LLM calculate legally important deadlines when a deterministic rule can do it.

## C. AI Case Assistant

Use AI for:

- Summarising case history
- Identifying missing information
- Explaining the next expected workflow step
- Drafting internal notes
- Preparing referral summaries
- Finding relevant government guidelines
- Finding relevant legal provisions
- Highlighting possible workflow gaps

Every important AI answer must show evidence/source.

## D. Government Knowledge Assistant

Allow officials to ask:

- What scheme applies?
- What service should be available?
- What is the responsible authority?
- What is the applicable procedure?
- What policy covers this issue?
- What are the documented implementation requirements?

Use RAG over approved government/legal sources.

## E. Gap Detection

Identify patterns such as:

- Repeated stalled referrals
- Repeated service shortages
- Repeated missed handoffs
- Under-utilised services despite high need
- District capacity mismatch
- Repeated coordination failures
- Policy/service mismatch

---

# 8. DEFINE THE "GAP CONTRACT"

Introduce a structured concept called:

## GAP CONTRACT

A Gap Contract represents a real, evidence-backed government problem that has an owner and an action.

Example:

**Gap ID:** GC-2026-001  
**Problem:** Women referred for legal assistance are repeatedly waiting beyond the expected service window.  
**Location:** District X  
**Evidence:** X cases / X period  
**Current Service:** DLSA referral  
**Observed Failure:** Referral acknowledgement delay  
**Likely Cause:** Manual handoff  
**Owner:** Responsible district authority  
**Severity:** High  
**Confidence:** Medium  
**Intervention Options:**  
1. Process modification  
2. Digital referral acknowledgement  
3. Additional staff  
4. SOP modification  

**Decision:** Human official decision  
**Action:** Approved intervention  
**Target Date:** X  
**Outcome:** Measured after implementation

The AI must never create a false "gap" simply because data is incomplete.

Use:

**DATA NOT AVAILABLE**

when evidence is insufficient.

---

# 9. ROOT-CAUSE ANALYSIS

Do not stop at:

> "District X has poor performance."

Investigate:

- Staffing
- Funding
- Infrastructure
- Awareness
- Accessibility
- Geography
- Referral process
- Coordination
- Training
- Technology
- Policy ambiguity
- Legal constraints
- Capacity
- Data quality
- Social barriers
- Institutional behaviour

Classify findings as:

1. No policy
2. Policy exists but implementation weak
3. Access gap
4. Capacity gap
5. Coordination gap
6. Process gap
7. Data gap
8. Policy overlap
9. Emerging issue not covered
10. Legal/procedural issue requiring review

AI should present these as hypotheses unless evidence proves them.

---

# 10. COMPARE SIMILAR DISTRICTS

Do not rank districts simply from highest to lowest.

Instead compare similar districts based on:

- Population
- Rural/urban profile
- Service availability
- Socio-economic characteristics
- Caseload
- Infrastructure
- Staffing
- Geography

Ask:

> "Why is District A achieving better service continuity than a similar District B?"

Identify practices that may be transferable.

Do not use comparison to shame or punish districts.

---

# 11. POLICY GAP ENGINE

The system should answer:

### What policy already exists?

### Is it reaching the intended population?

### Where is implementation weak?

### Is there a service capacity problem?

### Are multiple schemes solving the same problem?

### Are departments working in isolation?

### Is an emerging problem not covered?

### Does the existing policy need modification?

### Is a completely new programme actually required?

Before recommending a new policy, evaluate:

1. Improve existing process
2. Improve implementation
3. Improve staffing
4. Improve referral mechanism
5. Improve coordination
6. Modify existing scheme
7. Create technology support
8. Pilot new intervention
9. Create new programme
10. Legal/regulatory review

The system should prefer the simplest effective intervention.

---

# 12. OUTCOME VERIFICATION

Do not measure success using only:

- Number of cases
- Number of FIRs
- Number of arrests
- Number of dashboard users
- Number of AI queries

Instead measure:

- Time to first support
- Referral completion
- Missed handoffs
- Stalled actions
- Repeat explanation burden
- Survivor status awareness
- Service access
- Follow-up completion
- Rehabilitation continuity
- Staff workload
- Correction rate of AI outputs
- Unauthorised access
- Intervention effectiveness

Do not claim a percentage improvement before baseline data exists.

Define baseline first.

---

# 13. GROUND-TRUTH VERIFICATION

Government MIS may not always reflect field reality.

Design a controlled mechanism for verifying service delivery.

Possible channels:

- SMS
- IVR
- Assisted phone call
- Frontline confirmation
- Periodic field verification

But do not automatically label a discrepancy as fraud or MIS manipulation.

Use categories:

- Confirmed
- Probably correct
- Discrepancy detected
- Unable to verify
- Data unavailable

High-risk discrepancies require human investigation.

---

# 14. PRIVACY AND SAFETY BY DESIGN

Design the minimum data model.

Prefer:

- Pseudonymous case IDs
- Role-based access
- Purpose-based access
- Minimal personal data
- Full audit logs
- Encryption
- Data retention rules
- Access monitoring
- Segregation of sensitive information
- Survivor-safe communication

Do not unnecessarily collect:

- Aadhaar
- Passport
- Biometrics
- Full medical records
- Unrelated family information
- Unnecessary demographic information
- Sensitive information that does not support a specific workflow

For every data field ask:

> "Why does the system need this?"

If there is no strong answer, remove the field.

---

# 15. AI SAFETY RULES

AI MUST NOT:

- Decide guilt
- Decide innocence
- Determine victim credibility
- Determine legal liability
- Predict individual criminal behaviour
- Generate individual danger scores without a strong legal and ethical basis
- Automatically deny services
- Automatically trigger punitive action
- Replace professionals
- Invent facts
- Invent laws
- Invent statistics
- Treat missing data as negative evidence

AI SHOULD:

- Retrieve
- Summarise
- Classify documents
- Identify missing workflow steps
- Find applicable policies
- Highlight possible delays
- Detect patterns
- Generate hypotheses
- Draft communications
- Support human decision-making

Every high-risk recommendation must have:

- Evidence
- Source
- Date
- Confidence
- Limitations
- Human approval

---

# 16. LEGAL AND HUMAN RIGHTS LAYER

Evaluate relevant:

- Constitutional rights
- Women and child protection laws
- Criminal law
- Procedural law
- POCSO
- Juvenile Justice framework
- Domestic violence framework
- Legal Services Authorities framework
- Data protection/privacy law
- Applicable rules
- Government schemes
- State SOPs
- Relevant judicial principles

Do not provide fake legal certainty.

Where legal interpretation is uncertain, explicitly state:

**LEGAL REVIEW REQUIRED**

The system should help officials find relevant legal material, not replace legal professionals or courts.

---

# 17. ARCHITECTURE

Design a lean architecture.

Preferred MVP:

Frontend:
- React
- TypeScript
- Responsive/PWA

Backend:
- FastAPI
- Python

Database:
- PostgreSQL

Document storage:
- Secure object storage

AI:
- Approved LLM provider
- RAG
- Embeddings only where genuinely required

Core modules:

1. Case Service
2. Workflow / Rule Engine
3. Referral Service
4. Evidence Service
5. AI Assistant
6. Government Knowledge Service
7. Gap Detection
8. Audit Service

Avoid initially:

- Kafka
- Kubernetes
- Microservice explosion
- Neo4j
- Milvus
- Complex event-driven infrastructure
- 15+ autonomous agents

Use modular architecture first.

Introduce complexity only when scale or reliability requires it.

---

# 18. DATA MODEL

Design a minimal schema for:

### Case
- case_id
- pseudonymous reference
- case_type
- current_stage
- responsible_unit
- status
- created_at
- updated_at

### Referral
- referral_id
- case_id
- from_unit
- to_unit
- required_action
- due_date
- status
- acknowledged_at
- completed_at

### Action
- action_id
- case_id
- owner
- action
- due_date
- status
- completion_evidence

### Evidence
- evidence_id
- case_id / gap_id
- source
- source_date
- evidence_type
- confidence
- verification_status

### Gap Contract
- gap_id
- problem
- affected_population
- location
- evidence
- existing_policy
- owner
- root_cause_hypothesis
- intervention_options
- severity
- confidence
- decision
- target_date
- outcome

Do not build a huge enterprise schema before validating the workflow.

---

# 19. IMPLEMENTATION PLAN

Create a realistic phased implementation.

## PHASE 0: DISCOVERY AND VALIDATION
Duration: approximately 4 weeks.

No production software.

Activities:

- Map current systems
- Map protection journeys
- Review laws/SOPs
- Interview frontline workers
- Interview district officials
- Interview women/child rights organisations
- Identify real cases/workflows
- Identify duplication
- Identify data availability
- Identify legal constraints
- Identify integration constraints
- Define 10-20 high-value gaps

Deliverables:

- Current-state process map
- Stakeholder pain-point map
- Data inventory
- Legal constraint map
- Candidate Gap Contracts
- MVP requirements
- Go/no-go decision

---

# PHASE 1: LEAN MVP

Duration: 6-8 weeks.

Build:

- Case creation
- Pseudonymous reference
- Referral
- Action tracking
- Deadline/rule engine
- Basic escalation
- Evidence capture
- Audit log
- AI case assistant
- Government knowledge assistant

Use controlled/manual data initially.

Do not start with integrations to every government system.

---

# PHASE 2: REAL DISTRICT PILOT

Duration: approximately 3-4 months.

Pilot only one narrowly defined workflow.

Recommended starting point:

**Women + Domestic Violence + One Stop Centre**

Possible participants:

- OSC
- Police/Women's Cell
- District hospital
- DLSA
- District WCD/DPO
- District administration

Measure baseline before implementation.

Measure actual improvement.

---

# PHASE 3: GROUND-TRUTH AND DISCREPANCY VERIFICATION

Introduce:

- SMS
- IVR
- Assisted verification
- Field verification

Compare:

Government record
vs
Service confirmation
vs
Actual beneficiary experience

Do not automatically accuse any institution.

---

# PHASE 4: GAP CONTRACT SYSTEM

Introduce:

- Gap discovery
- Root-cause analysis
- Owner assignment
- Intervention options
- Decision workflow
- Action tracking
- Outcome measurement

This is where the platform evolves from case continuity to systemic improvement.

---

# PHASE 5: CHILD PROTECTION

Only after the women-focused pilot demonstrates:

- workflow validity
- safety
- adoption
- legal compliance
- measurable improvement

Then expand carefully into:

- Child Helpline
- CWC
- DCPU
- POCSO-related workflows
- CCI
- Rehabilitation
- Reintegration

Child protection must have additional privacy and access controls.

---

# PHASE 6: MULTI-DISTRICT / STATE SCALE

Only scale after proving:

- Real operational value
- Staff adoption
- Data quality
- Security
- Legal compliance
- Measurable outcomes

Do not scale simply because the prototype works.

---

# 20. MVP SUCCESS TEST

The MVP succeeds only if it can demonstrate all of the following:

### 1. Real problem

A real protection/service continuity problem exists.

### 2. Real gap

The system identifies where the workflow is failing.

### 3. Evidence

The finding is supported by evidence.

### 4. Explanation

The system can explain why the problem may be happening.

### 5. Ownership

A responsible organisation/role can be identified.

### 6. Intervention

A realistic intervention can be proposed.

### 7. Human decision

A government official can approve/reject/modify the intervention.

### 8. Outcome

The system can measure whether the intervention worked.

If these eight conditions are not met, do not claim success.

---

# 21. RISK REGISTER

Create a detailed risk register:

| Risk | Probability | Impact | Early Warning | Mitigation | Owner |
|---|---|---|---|---|---|

At minimum include:

- Privacy breach
- Abuser access
- Child data misuse
- AI hallucination
- Incorrect legal interpretation
- Poor data quality
- Staff non-adoption
- Increased data-entry burden
- Departmental resistance
- Integration failure
- Vendor lock-in
- False discrepancy detection
- Misuse of district comparisons
- Political misuse
- Wrong policy recommendation
- Lack of statutory authority
- Poor beneficiary trust

---

# 22. IMPLEMENTATION GOVERNANCE

Define:

- Ministry owner
- State owner
- District owner
- Product owner
- Data steward
- Legal reviewer
- Security officer
- AI governance owner
- Frontline champion
- Vendor/technology team

Define decision rights.

Do not allow the technology team to decide policy questions.

---

# 23. HUMAN-IN-THE-LOOP MODEL

Define exactly where humans must approve:

- High-risk case escalation
- Legal interpretation
- Policy recommendation
- Individual service decision
- Child protection decision
- Sensitive communication
- Discrepancy investigation
- Adverse action
- Government intervention

AI should assist.

Government officials decide.

---

# 24. USER EXPERIENCE

Design different interfaces for:

### Frontline Worker
"What do I need to do next?"

### District Officer
"What is stuck and why?"

### Collector
"What requires my intervention?"

### State WCD
"What recurring problem requires systemic action?"

### Ministry
"What policy or programme change should we consider?"

### Survivor
"What is my next step and where can I get help?"

Do not give everyone the same dashboard.

---

# 25. AI AGENT DESIGN

Do NOT create an unnecessary multi-agent system.

Start with three logical AI capabilities:

### Agent 1: Case Assistant
Case summary, missing steps, next action, drafting.

### Agent 2: Government Knowledge Assistant
Schemes, laws, SOPs, procedures and government documents.

### Agent 3: Gap Assistant
Patterns, root-cause hypotheses and intervention options.

Only introduce additional specialised agents when there is a proven need.

For every agent define:

- Purpose
- Input
- Output
- Tools
- Data access
- Decision boundary
- Human approval
- Failure mode
- Audit requirement

---

# 26. WHAT SHOULD NOT BE BUILT IN PHASE 1

Explicitly exclude:

- Public complaint social network
- Public social feed
- Victim ranking
- District ranking/leaderboard
- Individual danger score
- Facial recognition
- Biometric identification
- Aadhaar ingestion
- Predictive policing
- Automatic legal decisions
- Automatic adverse action
- Full medical record replication
- Nationwide integration
- Complex autonomous-agent architecture

Explain why each is excluded.

---

# 27. BUSINESS CASE

Calculate the value from:

- Reduced duplicate data entry
- Reduced manual follow-up
- Faster referrals
- Reduced stalled actions
- Better service continuity
- Reduced reporting effort
- Better evidence for policy decisions
- Better utilisation of existing schemes
- Earlier detection of systemic problems

Do NOT invent financial savings.

Identify the data required to calculate them.

---

# 28. PILOT DESIGN

Propose:

- Pilot location selection criteria
- Pilot organisation selection
- Number of users
- Number of cases
- Training plan
- Support model
- Baseline measurement
- Pilot duration
- Success criteria
- Failure criteria
- Go/no-go criteria

Prefer a small controlled pilot over a national launch.

---

# 29. FINAL OUTPUT FORMAT

Produce the final implementation strategy in this exact order:

## 1. Executive Verdict

State clearly:

- What should be built
- What should not be built
- Why

## 2. Problem Definition

## 3. Current Government Ecosystem

## 4. Stakeholder Pain Points

## 5. Protection Journey

## 6. Pain Point → Solution Matrix

## 7. Product Scope

## 8. Core Features

## 9. Gap Contract Model

## 10. AI Capabilities

## 11. Legal and Human Rights Safeguards

## 12. Privacy and Security

## 13. Data Model

## 14. Technical Architecture

## 15. Phase-by-Phase Implementation Plan

## 16. Pilot Plan

## 17. Success Metrics

## 18. Risk Register

## 19. Governance Model

## 20. Cost and Resource Model

## 21. What We Should NOT Build

## 22. Government Decision Required

## 23. 90-Day Execution Plan

## 24. Final Recommendation

---

# 30. IMPORTANT REASONING RULES

Follow these rules throughout the analysis:

1. Do not over-engineer.
2. Do not assume AI is the answer.
3. Prefer process improvement over technology where appropriate.
4. Prefer deterministic rules over LLM reasoning for statutory deadlines.
5. Prefer minimum data collection.
6. Prefer existing government systems over replacement systems.
7. Prefer interoperability over duplication.
8. Never invent statistics.
9. Clearly separate evidence, inference and recommendation.
10. Mark insufficient evidence as "DATA NOT AVAILABLE".
11. Treat AI output as advisory.
12. Keep humans responsible for consequential decisions.
13. Never design technology that increases frontline workload without removing equivalent work.
14. Do not create a dashboard merely to visualise existing data.
15. Every feature must solve a specific operational pain point.
16. Every data field must have a purpose.
17. Every AI capability must have a measurable benefit.
18. Every intervention must have an owner.
19. Every intervention must have an outcome measure.
20. Every recommendation must be legally and operationally defensible.

---

# FINAL TEST

Before completing the plan, ask yourself:

> "If I remove the word AI from this proposal, does the underlying government problem and solution still make sense?"

If the answer is no, the proposal is probably over-engineered.

The final system should not be presented as:

"An AI dashboard for women and children."

Present it as:

> **A Government protection continuity and gap-closure system that connects existing services, identifies where women and children are falling through the system, explains the operational cause, assigns the required intervention, and measures whether Government action actually improved the outcome.**

The ultimate objective is not more data.

The objective is:

**Fewer protection failures.  
Fewer missed handoffs.  
Faster access to existing services.  
Better coordination.  
Better government decisions.  
Measurable improvement in outcomes.**