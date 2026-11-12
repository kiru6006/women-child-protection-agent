# MASTER BUILD PROMPT FOR ANTIGRAVITY

## Project: WCD Protection Intelligence Platform

Build a serious, production-oriented prototype for the **Ministry of Women & Child Development, Government of India**.

This is NOT a generic women's safety app.

This is NOT a child tracking app.

This is NOT another government dashboard.

This is NOT a case-management replacement for existing government systems.

The product should be designed as:

> **An AI-assisted Government Protection Intelligence and Action Platform that identifies where existing women and child protection policies and services are failing in implementation, helps officials investigate why, supports practical interventions, and verifies whether Government action actually improved the outcome.**

The core principle is:

> **Do not build technology because Government has a problem. Build technology only where it removes a specific bottleneck that existing policy, process, people and systems have failed to remove.**

---

# 1. IMPORTANT: RED-TEAM THE PRODUCT BEFORE BUILDING

Before writing application code, critically evaluate the product concept.

Do not blindly implement the requirements.

The existing WCD ecosystem already contains significant programmes, institutions, schemes and digital systems, including:

- Mission Shakti
- One Stop Centres
- Women Helpline
- Mission Vatsalya
- Child Helpline
- Child Welfare Committees
- District Child Protection Units
- Child Care Institutions
- POSHAN-related systems
- State WCD systems
- District administration
- Police
- DLSA/legal aid
- Health services
- Other government systems

Therefore, the application must NOT assume:

> "Government does not have a system."

Instead investigate:

> **"Where do existing systems fail to provide Government with sufficient intelligence to identify, investigate, act on and learn from protection failures?"**

The application must complement existing systems rather than duplicate them.

---

# 2. MOST IMPORTANT PRODUCT DECISION

## WOMEN AND CHILDREN MUST BE SEPARATE DOMAINS

Do NOT create one common case workflow for women and children.

Do NOT treat "women and children" as one operational category.

The system must have:

## DOMAIN A: WOMEN PROTECTION INTELLIGENCE

and

## DOMAIN B: CHILD PROTECTION INTELLIGENCE

These domains must have separate:

- workflows
- terminology
- permissions
- case states
- service models
- legal references
- protection journeys
- KPIs
- risk models
- intervention models

However, they should share a common:

# GOVERNMENT PROTECTION INTELLIGENCE LAYER

Shared capabilities:

- Evidence
- Government knowledge
- Policy mapping
- Gap detection
- Investigation
- Intervention design
- Outcome verification
- Audit
- Security
- AI infrastructure

Architecture:

```text
                    WCD PROTECTION INTELLIGENCE
                              |
                +-------------+-------------+
                |                           |
        WOMEN PROTECTION             CHILD PROTECTION
           DOMAIN                       DOMAIN
                |                           |
       Women workflows              Child workflows
       Women services               Child services
       Women policies               Child policies
       Women evidence               Child evidence
                |                           |
                +-------------+-------------+
                              |
                 SHARED INTELLIGENCE LAYER
                              |
        +---------------------+---------------------+
        |                     |                     |
    Evidence              Policy/Gov            Gap Engine
    Engine                 Knowledge             + Investigation
        |                     |                     |
        +---------------------+---------------------+
                              |
                    Intervention Engine
                              |
                    Outcome Verification
```

---

# 3. FAMILY / HOUSEHOLD CONTEXT

There may be cases involving both a woman and a child.

Example:

A mother experiences domestic violence and her children are also affected.

Do NOT merge the records.

Instead support:

```text
Family / Household Context
          |
          +---- Woman Case
          |
          +---- Child Case
```

The relationship must be controlled by strict access rules.

A Women Protection user must NOT automatically see child-protection information.

A Child Protection user must NOT automatically see sensitive information about the woman.

Access must be based on:

- role
- purpose
- legal authority
- need-to-know
- case relationship

Do not create unrestricted family profiles.

---

# 4. PRODUCT NORTH STAR

The system must answer five questions:

### 1. WHAT IS HAPPENING?

### 2. WHERE IS THE SYSTEM FAILING?

### 3. WHY MIGHT IT BE FAILING?

### 4. WHAT CAN GOVERNMENT DO?

### 5. DID THE INTERVENTION WORK?

The core operational loop is:

# DISCOVER → INVESTIGATE → ACT → VERIFY → LEARN

NOT:

# COLLECT → ANALYSE → SHOW DASHBOARD

---

# 5. DO NOT BUILD A DASHBOARD-FIRST APPLICATION

The primary user experience should NOT be a page containing:

- 20 charts
- pie charts
- colourful cards
- generic statistics
- AI-generated summaries
- district leaderboards

The most important interface should be:

# INVESTIGATION WORKSPACE

Example:

```text
Potential Protection Gap

Problem:
Women referred for legal assistance in District X appear
to experience repeated delays.

Evidence:
- Government source
- Reporting period
- Dataset
- Field observation

What we know:
Verified facts.

What we do not know:
Missing evidence.

Possible explanations:
1. Referral process failure
2. Legal-aid capacity
3. Geography
4. Awareness
5. Data quality

Evidence supporting each:
...

Field verification required:
...

Existing Government programme:
...

Possible interventions:
1. Process correction
2. Staffing/capacity
3. Training
4. Coordination
5. Technology support
6. Policy modification

Decision:
Human government official

After intervention:
Outcome measurement
```

This workspace is more important than a dashboard.

---

# 6. TWO SPECIALISED DOMAINS

# DOMAIN A: WOMEN PROTECTION INTELLIGENCE

Design around:

**Safety → Support → Legal → Shelter → Economic/Social Support → Rehabilitation**

Potential workflows:

- Domestic violence
- Sexual violence
- Women in distress
- Trafficking
- Shelter
- Legal assistance
- Counselling
- Rehabilitation
- Economic/social support
- Relevant government schemes

Do not assume every workflow needs to be implemented in the MVP.

The application must support adding workflows later.

---

# DOMAIN B: CHILD PROTECTION INTELLIGENCE

Design around:

**Identification → Protection → Statutory Process → Care → Rehabilitation → Reintegration**

Potential workflows:

- Child in need of care and protection
- Missing children
- Child sexual abuse
- Child labour
- Child marriage
- Trafficking
- Institutional care
- Foster care
- Sponsorship
- Rehabilitation
- Family reintegration
- After-care

Child workflows must have stronger privacy and access controls.

Do NOT implement child protection simply by copying the Women workflow.

---

# 7. MVP DECISION

DO NOT build both domains fully in Version 1.

Start with:

# WOMEN PROTECTION INTELLIGENCE

But do NOT assume domestic violence or OSC is automatically the first workflow.

The application must support a discovery process that identifies the highest-value operational problem.

The MVP should prove:

> **One real Government protection gap can be discovered, investigated, assigned, acted upon and measured.**

---

# 8. PHASE 0: DISCOVERY MODE

Build a discovery/research workspace first.

The user should be able to create:

## Candidate Protection Gap

Fields:

- Gap ID
- Domain
- Problem statement
- Location
- Affected population
- Evidence
- Source
- Source date
- Reporting period
- Existing policy/programme
- Existing service
- Current process
- Observed failure
- Possible causes
- Confidence
- Data availability
- Verification status

Use statuses:

- Candidate
- Evidence Required
- Under Investigation
- Verified
- Intervention Proposed
- Approved
- Implemented
- Outcome Review
- Closed
- Rejected

---

# 9. EVIDENCE MODEL

Every significant claim must distinguish:

## VERIFIED FACT

Supported by an authoritative source.

## INFERENCE

Reasonable interpretation from available evidence.

## HYPOTHESIS

Possible explanation that requires verification.

## RECOMMENDATION

Suggested Government action.

## DATA NOT AVAILABLE

Evidence is insufficient.

Never allow the AI to silently convert a hypothesis into a fact.

---

# 10. SOURCE MANAGEMENT

Create an Evidence Library.

Sources may include:

- WCD documents
- Government scheme guidelines
- Annual reports
- SOPs
- Government datasets
- CAG reports
- Parliamentary material
- Official reports
- Relevant research
- Relevant judicial decisions
- State government documents

Every source should store:

- title
- organisation
- publication date
- reporting period
- document type
- source URL/reference
- uploaded document
- credibility category
- applicable domain
- applicable programme

AI responses should cite the source.

Never invent sources.

Never invent statistics.

Never invent legal provisions.

---

# 11. GOVERNMENT KNOWLEDGE ASSISTANT

Create an AI assistant that answers questions such as:

> Which existing government programme addresses this problem?

> What service should be available?

> Which department is responsible?

> What does the relevant guideline require?

> What is the documented process?

> What evidence exists that the service is working?

> What gaps have government reports already identified?

The assistant must provide:

- Answer
- Source
- Date
- Relevant section
- Confidence
- Limitations

If information is unavailable:

# DATA NOT AVAILABLE

Do not hallucinate.

---

# 12. GAP DETECTION

The Gap Engine should identify possible patterns such as:

- Repeated service delays
- Repeated referral failures
- Service availability gaps
- Under-utilisation despite apparent need
- Capacity mismatch
- Geographic access gaps
- Policy/service mismatch
- Coordination failures
- Duplicate programmes
- Emerging issues not clearly covered
- Data inconsistencies

Do NOT automatically declare a systemic failure.

Use:

# POTENTIAL GAP

until verified.

---

# 13. INVESTIGATION ENGINE

When a potential gap is detected, the system should ask:

### What do we know?

### What don't we know?

### What evidence supports the gap?

### What alternative explanations exist?

### What evidence would distinguish those explanations?

### Who should verify this?

### What should be checked in the field?

This is one of the most important AI capabilities.

AI should generate competing hypotheses.

Example:

```text
Potential Gap:
Low utilisation of a protection service.

Possible explanations:

A. Low awareness
B. Service unavailable
C. Referral failure
D. Capacity shortage
E. Geographic barrier
F. Eligibility confusion
G. Data quality problem
```

The AI must NOT arbitrarily select one.

---

# 14. GAP CONTRACT

When a gap becomes verified, create:

# GAP CONTRACT

Fields:

- Gap ID
- Domain
- Problem
- Location
- Affected population
- Evidence
- Existing programme
- Existing service
- Responsible organisation
- Responsible role
- Root-cause hypotheses
- Severity
- Confidence
- Intervention options
- Legal review required
- Resource implications
- Decision
- Action owner
- Target date
- Status
- Outcome measure
- Outcome
- Closure reason

A Gap Contract must result in an actual government decision.

Possible outcomes:

1. Existing process changed
2. Existing resources reallocated
3. Existing scheme modified
4. Training/intervention introduced
5. Coordination mechanism introduced
6. Technology support introduced
7. Pilot programme created
8. Legal/policy review initiated
9. No action required, with documented justification

Do NOT turn Gap Contracts into bureaucratic status tracking.

---

# 15. INTERVENTION ENGINE

Before recommending a new programme, the AI must evaluate:

### OPTION 1
Improve existing process.

### OPTION 2
Improve implementation.

### OPTION 3
Improve staffing/capacity.

### OPTION 4
Improve referral/coordination.

### OPTION 5
Modify existing scheme.

### OPTION 6
Introduce technology support.

### OPTION 7
Pilot a new programme.

### OPTION 8
Legal/regulatory review.

The simplest effective intervention should be preferred.

---

# 16. OUTCOME VERIFICATION

Do not stop at:

> "The Government completed the action."

The system must ask:

> "Did the problem improve?"

Track:

- baseline
- intervention
- target
- measurement period
- result
- evidence
- beneficiary feedback where appropriate
- staff feedback
- unresolved issues

Do not invent improvement percentages.

If baseline does not exist:

# BASELINE NOT AVAILABLE

---

# 17. IMPORTANT: DO NOT BUILD A SURVIVOR SURVEILLANCE SYSTEM

Do not collect unnecessary:

- Aadhaar
- passport
- biometrics
- full medical records
- unnecessary family information
- unnecessary sensitive attributes
- unnecessary identity documents

Prefer:

- pseudonymous identifiers
- minimum necessary information
- role-based access
- purpose-based access
- audit logs
- data retention controls

Every data field must answer:

> "Why does the system need this?"

If there is no strong operational reason, do not collect it.

---

# 18. SAFE COMMUNICATION

Do NOT automatically implement SMS/WhatsApp communication.

Domestic violence and other protection cases may involve monitored phones.

The system must support:

- communication preference
- safe channel
- safe contact time where applicable
- no-sensitive-information messaging
- opt-out
- assisted communication

The system must never expose sensitive case information through unsafe communication channels.

---

# 19. AI SAFETY

AI MUST NOT:

- Decide guilt
- Decide innocence
- Determine victim credibility
- Predict individual criminal behaviour
- Decide child placement
- Make final child protection decisions
- Make final legal decisions
- Automatically deny services
- Automatically initiate punitive action
- Replace police
- Replace doctors
- Replace social workers
- Replace lawyers
- Replace CWCs
- Replace courts
- Invent facts
- Invent statistics
- Invent legal provisions

AI MAY:

- Search
- Retrieve
- Summarise
- Classify
- Identify missing information
- Compare policy and implementation evidence
- Detect patterns
- Generate hypotheses
- Draft internal documents
- Suggest intervention options
- Support human investigation

All consequential AI output requires human review.

---

# 20. LEGAL LAYER

Create a legal reference layer.

The system should support:

- legislation
- rules
- government guidelines
- SOPs
- circulars
- judicial decisions
- policy documents

For each legal statement show:

- source
- section/paragraph where available
- date
- applicability
- confidence

If legal interpretation is uncertain:

# LEGAL REVIEW REQUIRED

Do not present AI interpretation as final legal advice.

---

# 21. ROLE-BASED EXPERIENCE

Create different interfaces.

## WOMEN FRONTLINE WORKER

Question:

> What do I need to do next?

Show:

- assigned actions
- pending actions
- referrals
- due dates
- minimal case information

Do not overwhelm them with analytics.

---

## WOMEN DISTRICT OFFICER

Question:

> What is stuck and why?

Show:

- unresolved actions
- recurring failures
- evidence
- responsible unit
- intervention options

---

## CHILD PROTECTION OFFICER

Question:

> What protection action is required?

Use child-specific workflow and permissions.

---

## DISTRICT COLLECTOR

Question:

> What requires my intervention?

Show:

- critical verified gaps
- cross-department failures
- resource issues
- intervention options
- decision status

---

## STATE WCD

Question:

> What systemic problem needs attention?

Show:

- recurring gaps
- district patterns
- policy implementation issues
- capacity gaps
- intervention outcomes

---

## MINISTRY

Question:

> What policy/programme problem requires national attention?

Show:

- verified systemic gaps
- evidence
- affected population
- existing policy
- implementation problem
- intervention options
- outcome history

---

# 22. DO NOT CREATE DISTRICT LEADERBOARDS

Do not rank districts as:

1. Best
2. Worst
3. Top performers

This can create perverse incentives.

Instead show:

- verified gaps
- unresolved problems
- improvement trends
- contextual comparisons
- transferable practices

Use comparisons for learning, not punishment.

---

# 23. ARCHITECTURE

Keep the architecture simple.

## Frontend

React 18+
TypeScript
Vite
Tailwind CSS
shadcn/ui

Use a clean government-grade interface.

## Backend

Python
FastAPI

## Database

PostgreSQL

## Documents

Secure object storage.

## AI

LLM + RAG.

Use deterministic rules for:

- deadlines
- workflow state
- permissions
- calculations
- compliance rules

Use LLMs for:

- reasoning assistance
- summarisation
- document interpretation
- hypothesis generation
- drafting

Do not make the LLM the source of truth.

---

# 24. DO NOT OVER-ENGINEER

For the MVP DO NOT introduce:

- Kafka
- Kubernetes
- Microservice explosion
- Neo4j
- complex event buses
- multiple autonomous agents
- massive vector infrastructure
- nationwide integration
- blockchain
- facial recognition
- predictive policing

Start with a modular monolith.

Use:

```text
React
   ↓
FastAPI
   ↓
PostgreSQL
   ↓
Document Storage
   ↓
RAG / AI Service
```

Add complexity only after a real scale requirement appears.

---

# 25. AI COMPONENTS

Start with only three logical AI capabilities.

## AI 1: Evidence Assistant

Find and explain relevant evidence.

## AI 2: Investigation Assistant

Analyse a potential gap and generate competing hypotheses.

## AI 3: Intervention Assistant

Suggest practical government intervention options.

Do NOT create 15 separate agents.

If a future agent is proposed, first explain:

- Why the existing capability cannot handle it
- What new capability it provides
- What data it needs
- What risk it introduces
- Why it is worth the complexity

---

# 26. DATA MODEL

Start small.

### ProtectionDomain

```text
id
name
description
active
```

Values:

- WOMEN
- CHILD

### Gap

```text
id
domain
title
description
location
affected_population
status
severity
confidence
created_at
updated_at
```

### Evidence

```text
id
gap_id
source
source_date
reporting_period
evidence_type
content
verification_status
confidence
```

### Investigation

```text
id
gap_id
question
hypothesis
supporting_evidence
contradicting_evidence
verification_required
status
```

### Intervention

```text
id
gap_id
type
description
owner
resource_requirement
legal_review
risk
status
```

### Outcome

```text
id
intervention_id
baseline
target
measurement
result
evidence
status
```

### User

```text
id
role
organisation
domain_access
location_scope
```

Implement strict domain-level access.

---

# 27. SECURITY

Implement:

- RBAC
- domain-level access
- location-level access
- audit logging
- encrypted sensitive data
- secure authentication
- session management
- API authorization
- document access control
- AI prompt/output logging for governance
- data retention configuration

Never expose sensitive case information to users without authorised access.

---

# 28. AUDITABILITY

For every AI-generated recommendation store:

- user
- timestamp
- question
- source documents
- retrieved evidence
- AI output
- confidence
- human reviewer
- reviewer decision
- final action

The system must be able to answer:

> "Why did the system make this recommendation?"

---

# 29. DESIGN LANGUAGE

The interface must feel like a serious Government decision-support system.

Avoid:

- flashy gradients
- excessive animations
- consumer social-media styling
- gamification
- leaderboards
- unnecessary charts
- AI gimmicks

Use:

- clear typography
- strong hierarchy
- accessible colours
- tables
- evidence panels
- status indicators
- action queues
- investigation timelines
- source citations
- confidence indicators

Prioritise usability over visual decoration.

---

# 30. HOME PAGE

Do NOT make the homepage a generic dashboard.

The homepage should immediately show:

# WHAT NEEDS ATTENTION?

Sections:

### Verified Protection Gaps

### Investigations in Progress

### Government Decisions Pending

### Interventions Underway

### Outcomes Requiring Review

### Evidence / Data Warnings

Each item should lead to the investigation/action workflow.

---

# 31. CORE USER JOURNEY

The primary journey should be:

```text
Potential Gap
      ↓
Evidence Review
      ↓
Verification
      ↓
Investigation
      ↓
Root-Cause Hypotheses
      ↓
Human Review
      ↓
Intervention Options
      ↓
Government Decision
      ↓
Action
      ↓
Outcome Measurement
      ↓
Close / Continue / Escalate
```

This is the heart of the product.

---

# 32. DEMO DATA

Create clearly labelled synthetic demo data.

Never imply that fictional data is real Government data.

Use labels:

# DEMONSTRATION DATA

Create realistic examples covering:

### Women

- Domestic violence service referral
- Legal aid delay
- Shelter access gap
- Service availability gap

### Child

Create only a limited demonstration view initially.

Examples:

- Child protection referral delay
- Rehabilitation follow-up gap

Clearly mark:

# CHILD DEMONSTRATION MODULE

Do not create realistic personally identifiable information.

---

# 33. DO NOT CLAIM REAL GOVERNMENT INTEGRATION

The prototype must clearly distinguish:

### DEMO DATA

### CONNECTOR READY

### FUTURE GOVERNMENT INTEGRATION

Never claim that the prototype is connected to:

- Police databases
- CWC systems
- Aadhaar
- Health systems
- WCD internal systems
- Government MIS

unless an actual integration exists.

---

# 34. MVP SCREENS

Build these screens first:

### 1. Home / Attention Centre

### 2. Protection Domain Selector

- Women
- Child

### 3. Women Protection Workspace

### 4. Child Protection Workspace

### 5. Gap Explorer

### 6. Gap Detail

### 7. Investigation Workspace

### 8. Evidence Library

### 9. Government Knowledge Assistant

### 10. Intervention Workspace

### 11. Outcome Verification

### 12. Audit / AI Explainability

Do not build dozens of screens.

---

# 35. IMPLEMENTATION PHASES

## Phase 0

Research and problem validation.

No production workflow.

Goal:

Identify real protection gaps.

---

## Phase 1

Evidence and investigation MVP.

Build:

- evidence library
- RAG
- gap management
- investigation workspace
- policy mapping
- AI assistants

---

## Phase 2

One validated Women protection workflow.

One district.

One specific operational problem.

---

## Phase 3

Intervention and outcome verification.

---

## Phase 4

Expand Women domain.

---

## Phase 5

Introduce Child Protection domain with its own workflow architecture.

---

## Phase 6

Controlled connection between Women and Child domains through shared intelligence and carefully governed family context.

---

# 36. SUCCESS CRITERIA

Do NOT measure success by:

- number of screens
- number of AI agents
- number of users
- number of dashboards
- number of documents ingested

The MVP succeeds if:

### 1.
It identifies a real protection gap.

### 2.
The evidence is verifiable.

### 3.
The system distinguishes fact from hypothesis.

### 4.
A human investigator can validate the issue.

### 5.
An accountable owner can be identified.

### 6.
A realistic intervention can be selected.

### 7.
Government actually takes an action.

### 8.
The outcome can be measured.

### 9.
The intervention produces measurable improvement OR produces evidence that the hypothesis was wrong.

The last point is important.

A failed intervention is not necessarily a failed system if the system helped Government learn why it failed.

---

# 37. RED-TEAM THE IMPLEMENTATION

Before completing each major module, ask:

### Could this duplicate an existing government system?

### Does this create additional frontline work?

### Is this collecting unnecessary data?

### Could this expose a survivor or child?

### Could an AI hallucination cause harm?

### Could an official misuse this metric?

### Could this encourage gaming?

### Is there enough evidence?

### Is AI actually necessary?

### Could a simple rule solve this?

### Could this be solved through policy/process instead of software?

If yes, prefer the simpler solution.

---

# 38. FINAL PRODUCT PRINCIPLE

The platform must NOT be positioned as:

> "AI for women and children."

Position it as:

> **"Government Protection Intelligence: finding where existing protection systems are failing, helping Government investigate why, supporting practical intervention, and verifying whether the intervention worked."**

---

# 39. FINAL ANTIGRAVITY BUILD INSTRUCTION

You are not merely generating UI.

You are designing a realistic government decision-support prototype.

Before writing code:

1. Inspect the entire existing project.
2. Understand current architecture.
3. Identify reusable components.
4. Do not overwrite working functionality unnecessarily.
5. Create a concise implementation plan.
6. Identify assumptions.
7. Identify unresolved questions.
8. Define the smallest buildable milestone.
9. Then implement incrementally.

After each milestone:

- test
- review
- fix
- document
- move to the next milestone

Do not build the entire application in one generation.

---

# 40. REQUIRED FIRST RESPONSE FROM ANTIGRAVITY

Before implementing anything, produce:

## A. Product Verdict

What should be built and what should not.

## B. Architecture

Show:

```text
Women Domain
Child Domain
Shared Intelligence Layer
```

## C. MVP Scope

Clearly state what is inside and outside the first version.

## D. Screen Map

Show the minimum screens.

## E. Data Model

Show the minimum entities.

## F. AI Capability Map

Show exactly where AI is used and where it is prohibited.

## G. Security Model

Show domain and role-based access.

## H. Implementation Phases

Show Phase 0 through Phase 6.

## I. Risks

Identify the top 10 risks.

## J. First Build Milestone

Specify exactly what should be implemented first.

Do NOT start coding until this plan is internally consistent.

---

# FINAL PRINCIPLE

The system exists for one reason:

> **To help Government convert evidence of protection failures into better decisions and measurable action.**

If the application cannot do that, remove the feature.

If AI does not improve that process, remove the AI.

If a dashboard does not help make a decision, remove the dashboard.

If collecting data does not improve protection, do not collect it.

If a workflow creates more work for frontline staff than it removes, redesign it.

If a feature cannot be legally, ethically and operationally defended, do not build it.

Build a smaller system that solves a real Government problem rather than a large system that looks impressive.


# RESOLVED MVP SCOPE

The previous scope contained a contradiction between building a two-domain Women & Child platform and keeping the MVP small.

Resolve this as follows.

## MVP DEFINITION

The MVP is:

> **A WCD Protection Intelligence Platform with a fully implemented Women Protection domain, one validated women-protection operational use case, and a shared evidence/gap/investigation/intervention/outcome intelligence layer.**

The Child Protection domain must be represented architecturally but must NOT be functionally implemented in the MVP.

---

# 1. PHASE 0 IS DISCOVERY, NOT MVP

Before implementing the operational workflow:

1. Study the WCD ecosystem.
2. Review existing systems and schemes.
3. Identify candidate women-protection gaps.
4. Identify 10-20 candidate gaps.
5. Narrow them to approximately 3 evidence-backed gaps.
6. Select ONE gap for the MVP.
7. Define the exact workflow required to solve that gap.

Do not hard-code the pilot workflow before this discovery.

For demonstration purposes, OSC referral continuity may be used as an example, but it must remain configurable until the actual pilot problem is selected.

---

# 2. MVP HAS ONLY ONE FUNCTIONAL PROTECTION DOMAIN

## WOMEN PROTECTION

Implement:

- Women domain navigation
- Women-specific terminology
- Women-specific workflow
- Women-specific evidence
- Women-specific policy references
- Women-specific gap analysis
- Women-specific intervention tracking

Do not implement every women-protection programme.

Implement only the selected MVP workflow.

---

# 3. CHILD PROTECTION IS ARCHITECTURE-READY, NOT FUNCTIONAL

Create a Child Protection module placeholder:

**Child Protection Intelligence**

Status:

**Phase 2**

The module may show:

- purpose
- planned capabilities
- planned architecture
- planned integration points

But it must NOT contain:

- real child records
- child case management
- CWC workflow
- POCSO workflow
- child risk scoring
- child-specific automated decisions
- child personal data

Do not create fake child case functionality merely to make the prototype appear complete.

---

# 4. SHARED INTELLIGENCE LAYER IS PART OF THE MVP

The following are core MVP capabilities:

## Evidence Library

Store:

- government documents
- policy documents
- schemes
- guidelines
- reports
- approved research
- relevant legal materials

Every important claim must have a source.

## Government Knowledge Assistant

Allow users to ask:

- What policy applies?
- What service exists?
- Who is responsible?
- What procedure is documented?
- What evidence exists?

Use RAG.

## Gap Detection

Identify:

- potential service gaps
- process failures
- referral failures
- access gaps
- capacity gaps
- coordination problems
- policy/implementation mismatches

Do not automatically classify a potential gap as a confirmed systemic failure.

## Investigation Workspace

For every potential gap show:

- What we know
- What we don't know
- Evidence
- Evidence quality
- Possible explanations
- Supporting evidence
- Contradicting evidence
- Verification required

## Intervention Workspace

Show possible options:

1. Process improvement
2. Capacity improvement
3. Coordination improvement
4. Training
5. Scheme modification
6. Technology support
7. Pilot programme
8. Legal/policy review

The human official decides.

## Outcome Verification

Track:

- baseline
- intervention
- target
- result
- evidence
- status

Never invent outcome improvement.

---

# 5. MVP HOME PAGE

Do not create a traditional analytics dashboard.

Create an:

# ATTENTION CENTRE

Show:

- Verified Gaps
- Investigations
- Decisions Pending
- Interventions Underway
- Outcomes Due for Review
- Evidence/Data Warnings

The user should immediately understand:

> What needs attention?

---

# 6. MVP SCREENS

Build only:

1. Attention Centre
2. Women Protection Workspace
3. Gap Explorer
4. Gap Detail
5. Investigation Workspace
6. Evidence Library
7. Government Knowledge Assistant
8. Intervention Workspace
9. Outcome Verification
10. Audit / AI Explainability
11. Child Protection Phase 2 placeholder

Do not build a large collection of dashboards.

---

# 7. MVP DATA MODEL

Keep the model small.

Core entities:

- User
- Protection Domain
- Gap
- Evidence
- Investigation
- Hypothesis
- Intervention
- Outcome
- Audit Event

Do not create a full enterprise case-management schema.

Only introduce Case, Referral, Action and similar entities if the selected MVP problem genuinely requires them.

---

# 8. MVP AI

Use only three logical AI capabilities:

### Evidence Assistant

Retrieve and explain evidence.

### Investigation Assistant

Generate and compare possible explanations.

### Intervention Assistant

Suggest practical government interventions.

AI must never:

- determine guilt
- determine credibility
- make legal decisions
- make child-protection decisions
- automatically trigger punitive action
- determine individual danger
- invent facts
- invent statistics
- invent laws

---

# 9. MVP ARCHITECTURE

Use a modular monolith.

```text
React + TypeScript
        ↓
FastAPI
        ↓
PostgreSQL
        ↓
Evidence / Document Storage
        ↓
RAG / AI Service
```

Do NOT introduce:

- Kafka
- Kubernetes
- microservice sprawl
- Neo4j
- complex event buses
- 15+ AI agents
- nationwide integrations

---

# 10. MVP SUCCESS TEST

The MVP is successful only if it can demonstrate:

1. A real women-protection problem exists.
2. The system can represent the evidence.
3. The system can identify a potential gap.
4. The system distinguishes facts from hypotheses.
5. A human can investigate the gap.
6. A responsible owner can be identified.
7. A practical intervention can be selected.
8. The intervention can be tracked.
9. The outcome can be measured.

If the prototype cannot demonstrate this end-to-end flow, do not expand the product.

---

# 11. POST-MVP ROADMAP

After the Women MVP is validated:

### Phase 2

Expand Women Protection workflows.

### Phase 3

Introduce Child Protection Intelligence as a separately designed domain.

### Phase 4

Introduce controlled Family/Household Context where legally and operationally justified.

### Phase 5

Add additional government integrations only when proven necessary.

### Phase 6

Scale across districts/states only after operational value is demonstrated.

---

# 12. NON-NEGOTIABLE SCOPE RULE

Do not build functionality simply because it appears in the future roadmap.

The MVP must prove one thing:

> **Can the platform help Government discover, investigate, act on and measure one real protection-system failure?**

Everything else is secondary.

If a feature does not directly contribute to proving this, move it to the roadmap.


Yes. **Children should have a dedicated protection domain**, but I would not put it into the first functional MVP.

For the overall WCD platform, I would structure it like this:

### Child Protection Intelligence

The child side should focus on **where a child is falling out of the protection system**, rather than building another child-tracking or case-management application.

#### 1. Identify protection gaps

Examples:

- Child identified as vulnerable but no timely intervention
- School dropout with no follow-up
- Missing child cases with delayed coordination
- Child labour indicators without effective rehabilitation
- Child marriage risk signals not reaching the right authority
- POCSO cases where support services are delayed
- Children in institutional care without adequate rehabilitation/reintegration
- Foster care/adoption processes getting delayed
- Children released from institutional care without effective aftercare
- Repeated movement between institutions/services
- Benefits or entitlements not reaching eligible children
- Child protection committee/CWC processes getting delayed
- Family reintegration attempted but support is inadequate
- Children with disabilities not receiving required services

### 2. The core child workflow

**DETECT → INVESTIGATE → INTERVENE → VERIFY → LEARN**

Example:

> **Gap:** Children leaving institutional care are not receiving consistent aftercare.

The system should ask:

**What happened?**  
Evidence from programme records, reports, inspections, surveys, etc.

**Where is the failure?**  
District, programme, service, process stage, or institution.

**Why might it be happening?**  
AI generates evidence-backed hypotheses, such as:

- inadequate follow-up capacity
- unclear ownership
- missing referral
- funding/resource constraint
- geographic access problem
- coordination failure

These remain **hypotheses**, not AI-generated facts.

**What can Government change?**

For example:

> Introduce mandatory 30/90/180-day aftercare verification through the responsible department.

**Did it work?**

Measure whether the selected outcome actually improved.

### 3. Child-specific AI capabilities

I would give the child domain five tightly controlled AI functions:

| AI capability | Purpose |
|---|---|
| Evidence Assistant | Find relevant laws, schemes, guidelines, reports and evaluations |
| Gap Detection | Detect recurring implementation failures |
| Investigation Assistant | Help officials examine possible causes |
| Intervention Assistant | Propose practical government interventions |
| Outcome Verification | Compare before/after evidence |

But **AI must never decide**:

- whether a child is believable
- whether a parent is guilty
- whether a child should be removed from a family
- child placement
- adoption decisions
- CWC/JJB decisions
- POCSO/legal conclusions
- criminal culpability
- eligibility for punitive action

### 4. Important difference from the Women domain

Do **not** simply clone the Women module and rename it Child.

Child protection needs its own:

- legal framework
- actors
- workflows
- permissions
- terminology
- consent/safeguarding rules
- outcome measures
- data retention rules
- escalation rules

The platform can share the **intelligence engine**, but the protection logic should remain domain-specific.

### 5. Recommended architecture

```text
                 WCD PROTECTION INTELLIGENCE PLATFORM
                              │
              ┌───────────────┴───────────────┐
              │                               │
       WOMEN PROTECTION                 CHILD PROTECTION
          DOMAIN                           DOMAIN
              │                               │
              └───────────────┬───────────────┘
                              │
                 SHARED INTELLIGENCE LAYER
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Evidence Engine      Gap Detection       Investigation
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                     Intervention Engine
                              │
                     Outcome Verification
                              │
                         Audit / AI Safety
```

### 6. What I would build now

For the **MVP**:

**Women = functional**

**Children = architecture-ready only**

But the child domain should already have a clearly defined product boundary:

```text
Child Protection Intelligence
    │
    ├── Protection Gaps
    ├── Evidence
    ├── Investigations
    ├── Interventions
    ├── Outcomes
    ├── Legal / Policy Knowledge
    └── Audit & Safeguarding
```

No real child cases should be implemented in the MVP.

### 7. What comes after the Women MVP

I would expand Child Protection in this order:

**Phase C1: Discovery**

Research actual WCD child-protection implementation gaps.

**Phase C2: Evidence Intelligence**

Build the child-specific evidence and policy knowledge layer.

**Phase C3: One validated child problem**

Select one real problem based on evidence, not assumptions.

**Phase C4: Intervention + outcome verification**

Prove that Government action changed the outcome.

**Phase C5: Controlled expansion**

Only then add additional child-protection workflows.

The key principle remains:

> **Women and children are two separate protection domains on one shared government intelligence platform. The intelligence architecture is shared. The protection decisions and workflows are not.**

This gives you a much stronger Ministry-level proposition than claiming that WCD needs another child case-management system.

If you mean **how to use Antigravity IDE effectively for vibe coding**, the main rule is:

> **Do not ask Antigravity to build the entire application in one prompt. Give it architecture, constraints, one feature at a time, then make it test and review its own work.**

For your **WCD Protection Intelligence Platform**, I would use this workflow.

## 1. Start with the project structure

First create the project and give Antigravity a high-level architecture.

```text
wcd-protection-intelligence/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   │   ├── women/
│   │   │   ├── evidence/
│   │   │   ├── gaps/
│   │   │   ├── investigations/
│   │   │   ├── interventions/
│   │   │   └── outcomes/
│   │   └── services/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── ai/
│   │   └── core/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── AI_SAFETY.md
│   └── DOMAIN_RULES.md
│
└── README.md
```

For your stack:

```text
Frontend: React + TypeScript + Vite
UI: Tailwind + shadcn/ui
State: Zustand
API: FastAPI
Database: PostgreSQL
ORM: SQLAlchemy
AI: Python + RAG
```

## 2. Give Antigravity a permanent instruction file

Create:

```text
AGENTS.md
```

Put your project rules there.

For example:

```text
# WCD Protection Intelligence Platform

## Product principle

This is NOT:
- a generic dashboard
- a child tracking system
- a surveillance system
- a replacement for government case-management systems
- an autonomous decision-making system

The product is an AI-assisted Government Protection Intelligence
and Action Platform.

Core loop:

DISCOVER
→ INVESTIGATE
→ ACT
→ VERIFY
→ LEARN

## MVP

Women Protection is functional.

Child Protection is architecture-ready but NOT functionally implemented.

Do not implement:
- child case workflows
- CWC workflows
- POCSO decision workflows
- child risk scoring
- individual criminal-risk prediction

## AI rules

AI may:
- retrieve evidence
- summarize documents
- identify possible gaps
- generate hypotheses
- suggest interventions
- compare outcomes

AI must NOT:
- make legal decisions
- determine guilt
- determine credibility
- decide child placement
- decide whether a child should be removed
- make autonomous government decisions

Every AI conclusion must distinguish:

VERIFIED FACT
INFERENCE
HYPOTHESIS
RECOMMENDATION
DATA NOT AVAILABLE

## Engineering rules

- TypeScript strict mode
- Python type hints
- API validation
- unit tests
- integration tests for important workflows
- audit logging
- RBAC
- no hard-coded secrets
- no fake production data
- synthetic demo data only

Do not introduce unnecessary:
- microservices
- Kafka
- Kubernetes
- Neo4j
- complex event buses
- 15+ AI agents

Prefer simple modular architecture.
```

This is important because otherwise Antigravity will gradually forget your architectural constraints as the project grows.

## 3. Do not start with "build the app"

Bad prompt:

```text
Build the complete WCD AI platform.
```

Antigravity will make hundreds of assumptions.

Instead:

### Prompt 1: Analyse

```text
Read AGENTS.md and inspect the entire repository.

Do not write code yet.

Analyse the current project structure and identify:

1. What already exists
2. What is missing
3. Architectural risks
4. Contradictions with AGENTS.md
5. Recommended implementation order

Do not modify any files.

Return the analysis only.
```

Then review its answer.

## 4. Build the foundation

Next:

```text
Implement the application foundation only.

Create:

1. React application structure
2. FastAPI backend structure
3. PostgreSQL configuration
4. Environment configuration
5. API client
6. Error handling
7. Logging
8. Basic authentication architecture
9. RBAC foundation
10. Database connection

Do NOT implement business features yet.

After implementation:

- run the application
- run lint
- run type checking
- run tests
- fix all errors

Then provide:
- files created
- files modified
- tests executed
- remaining issues
```

This is much safer.

## 5. Then build ONE feature

For your platform, I would start with:

**Evidence Library**

Not AI first.

Prompt:

```text
Implement the Evidence Library feature.

Requirements:

Users must be able to:

1. Upload an evidence document
2. Store document metadata
3. Categorize the evidence
4. View document details
5. Search evidence
6. See source information
7. See evidence classification

Evidence classification:

VERIFIED FACT
INFERENCE
HYPOTHESIS
RECOMMENDATION
DATA NOT AVAILABLE

Create:

Frontend:
- Evidence Library page
- Evidence detail page
- Upload interface
- Search/filter UI

Backend:
- Evidence API
- Evidence model
- Evidence schema
- Evidence service

Database:
- evidence table

Security:
- RBAC
- audit logging

Use synthetic data only.

Do not implement RAG yet.

After implementation run:
- frontend build
- backend tests
- lint
- type checking

Fix errors before finishing.
```

Now you have a real foundation.

## 6. Then add Gap Intelligence

Once Evidence works:

```text
Implement Gap Intelligence on top of the existing Evidence Library.

Do not change the existing Evidence API unless required.

Create:

Gap:
- id
- title
- description
- domain
- geography
- evidence_ids
- severity
- status
- owner
- created_at
- updated_at

Gap statuses:

CANDIDATE
UNDER_INVESTIGATION
VALIDATED
INTERVENTION_PLANNED
INTERVENTION_ACTIVE
VERIFIED
CLOSED
REJECTED

Important:

AI must never automatically mark a gap as VERIFIED.

AI may suggest a candidate gap.

Human officials must validate it.

Show the evidence supporting every candidate gap.

Implement:
- Gap list
- Gap detail
- Create gap
- Evidence linking
- Status workflow
- Audit history

Write tests for the state transitions.
```

This is actual vibe coding with guardrails.

## 7. Then Investigation Workspace

This becomes the most important screen.

```text
Implement the Investigation Workspace.

The purpose is to help a government official answer:

1. What is happening?
2. Where is it happening?
3. What evidence supports it?
4. What do we know?
5. What don't we know?
6. What are the possible causes?
7. What additional evidence is required?
8. What intervention could address the problem?

Create sections:

FACTS
EVIDENCE
DATA GAPS
HYPOTHESES
QUESTIONS
POSSIBLE INTERVENTIONS
LEGAL/POLICY REFERENCES
NEXT ACTIONS

AI-generated content must be explicitly labelled.

Do not allow AI to silently convert a hypothesis into a fact.
```

## 8. Only then introduce RAG

Do not start with RAG.

First make the application work without AI.

Then:

```text
Implement the Government Knowledge Assistant using RAG.

Sources will include:

- WCD policies
- Government schemes
- Acts
- Rules
- Guidelines
- SOPs
- Government reports
- Parliamentary documents
- Official evaluations

Requirements:

1. Document ingestion
2. Chunking
3. Metadata
4. Embeddings
5. Retrieval
6. Source-grounded answers
7. Citation display
8. "Insufficient evidence" response

The model must never invent a government policy.

Every substantive answer must show its source.

If evidence is insufficient, explicitly state:

DATA NOT AVAILABLE
```

## 9. Then Intervention Assistant

This is where your product becomes different from a research portal.

```text
Implement Intervention Assistant.

Given a validated Gap and Investigation:

Generate possible government interventions.

For each intervention show:

- Problem addressed
- Evidence
- Proposed action
- Responsible department
- Required resources
- Dependencies
- Expected outcome
- Measurement method
- Risks
- Legal/policy considerations

AI generates recommendations only.

Human officials select and approve the intervention.

Do not automatically execute government actions.
```

## 10. Finally Outcome Verification

This is critical.

```text
Implement Outcome Verification.

For every approved intervention capture:

BASELINE
INTERVENTION
TARGET
MEASUREMENT
OBSERVED RESULT
EVIDENCE
STATUS

Possible statuses:

NOT_STARTED
IN_PROGRESS
PARTIALLY_EFFECTIVE
EFFECTIVE
INEFFECTIVE
INSUFFICIENT_DATA

Do not allow the AI to claim that an intervention worked without supporting evidence.
```

## 11. Use Antigravity as four different roles

This is the biggest improvement to your vibe-coding workflow.

Don't treat Antigravity only as a programmer.

Use it as:

### Role 1: Architect

```text
Review the architecture.
Find design problems.
Do not modify code.
```

### Role 2: Developer

```text
Implement this specific feature.
```

### Role 3: Tester

```text
Try to break this feature.

Find:
- functional bugs
- security issues
- race conditions
- invalid states
- bad UX
- missing validation
- authorization problems
- AI hallucination risks

Do not modify code yet.
```

### Role 4: Reviewer

```text
Review the implementation against AGENTS.md.

Identify:
- requirements not implemented
- unnecessary complexity
- technical debt
- security issues
- incorrect assumptions
- duplicated code

Give severity:

CRITICAL
HIGH
MEDIUM
LOW

Do not modify code.
```

Then give the fixes to the developer agent.

## 12. The golden vibe-coding loop

Use this every time:

```text
PLAN
  ↓
IMPLEMENT
  ↓
RUN
  ↓
TEST
  ↓
BREAK
  ↓
REVIEW
  ↓
FIX
  ↓
COMMIT
```

Never:

```text
PROMPT
  ↓
GENERATE 100 FILES
  ↓
HOPE IT WORKS
```

That is not vibe coding. That is uncontrolled code generation.

## 13. Commit after every working feature

For example:

```text
git commit -m "feat: add evidence library"
```

Then:

```text
git commit -m "feat: add gap intelligence"
```

Then:

```text
git commit -m "feat: add investigation workspace"
```

If Antigravity breaks the project, you can immediately return to the last working state.

## 14. Your Antigravity development sequence

For your WCD project, I recommend:

```text
STEP 01
Project foundation

STEP 02
Design system

STEP 03
Authentication + RBAC

STEP 04
Evidence Library

STEP 05
Government Knowledge Base

STEP 06
Gap Intelligence

STEP 07
Gap Detail

STEP 08
Investigation Workspace

STEP 09
AI Investigation Assistant

STEP 10
Intervention Workspace

STEP 11
Outcome Verification

STEP 12
Audit + AI Explainability

STEP 13
Security hardening

STEP 14
Red-team testing

STEP 15
Synthetic government demo scenario

STEP 16
Only then evaluate Child Protection
```

### The most important rule for your project

**Do not let Antigravity decide the product architecture while it is coding.**

You decide:

- problem
- scope
- domain boundaries
- legal constraints
- AI safety
- data model
- workflow
- success criteria

Antigravity should primarily decide:

- implementation details
- component structure
- boilerplate
- tests
- refactoring
- debugging

That separation will prevent your WCD project from becoming another impressive-looking AI dashboard with no defensible government use case.