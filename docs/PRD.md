# Case Continuity Platform (CCP) v2: Women & Child Protection

**Status:** Revised after self-critique and simulated expert panel review.
**Confidence:** [Likely] on problem framing. [Guessing] on feasibility of data access and adoption. Nothing here is validated with real officials yet.
**Caveat:** The panel below is simulated. It reflects known failure patterns in such programmes, not testimony from real people. Real validation is required before any build.

---

## 1. Self-Critique: Why v1 Was Wrong

v1 was a dashboard-first analytics prompt pack. Fails the brief in five ways:

| # | Flaw | Why it matters |
|---|---|---|
| 1 | Built for analysts, not for the person handling the case | A woman in distress does not benefit from a district heatmap. The OSC counsellor and CWC member do. |
| 2 | Treats the problem as visibility | Officials already have reports (NCRB, MIS). Known data does not fix missed handoffs. The gap is action, not sight. |
| 3 | 16 agents, 6 dashboard views, 10 scenarios | Overbuilt. Maintenance cost exceeds value. No pilot can run it. |
| 4 | Central AI over sensitive victim data | Creates a surveillance and breach target. Contradicts data minimisation. Worst risk in the design. |
| 5 | Relied on LLM web research and unverified figures | Source access and existing systems were assumed, not verified. Output could mislead officials. |

**Core correction:** The problem is continuity. A woman or child moves through 6–12 institutions. Each handoff can fail silently. Nobody owns the whole journey. The product must **own the case thread across institutions**, track deadlines, and surface the next required action to the right human. AI assists the handoffs. Humans decide.

---

## 2. The Real Problem (Stated Plainly)

- Survivor repeats her account at each institution (police, medical, OSC, court). Repeated statements harm and slow the process.
- Referrals happen by phone, paper, or verbal note. No shared status. No escalation when a referral stalls.
- Nobody knows, at a given moment, which step is pending for a specific case, who owns it, and how long it has waited.
- Supervisors learn of failures only after harm or media coverage.
- Survivor has no reliable way to know what is happening to her case.

**Not the problem:** lack of statistics. Data exists in fragments.

---

## 3. Product Definition

**What it is:** A secure, consent-based case continuity system. One shared case thread per survivor/child, visible only to the institutions with a legal or service role in that case. Tracks referrals, deadlines, and status. AI reduces clerical load and flags stalled steps.

**What it is NOT:**
- Not a public analytics dashboard
- Not a risk-scoring engine for individuals
- Not a replacement for police, courts, CWC, or doctors
- Not a central national database of victims in v1

---

## 4. Users and Their Actual Need

| User | Daily need | What CCP gives |
|---|---|---|
| OSC/Sakhi staff (frontline) | Intake, referrals, follow-up | One intake form, auto-generated referral, reminders |
| Police Women's Cell / station officer | Receive referral, record FIR, track action | Incoming referral with consented minimum facts, status reply |
| Medical officer | Medical exam within required window | Pending-exam alert, record upload |
| CWC member (child cases) | Production, orders, rehab steps | Child thread, order tracking, due dates |
| DLSA legal aid | Assignment, hearing dates | Legal-aid referral, next hearing reminder |
| District Child Protection / WCD officer | Supervise stalled cases | Stalled-case queue with reasons |
| Survivor / guardian | Know status, reduce repetition | Phone/SMS status via helpline, no app required |
| State/national official | Trends, system health | Aggregate only, minimum cell size enforced |

---

## 5. Scope Decision: One Journey First

**Pilot journey:** Women's domestic violence via One Stop Centre (OSC) → Police → Medical → Legal aid → Shelter.

**Why this one (not child cases first):**
- OSC is an existing, named government service with defined services. Lower institutional friction than CWC/CCI.
- Child cases involve CWC orders, POCSO timelines, and custody decisions. Higher legal and harm risk for a first pilot.
- Clear referral chain can be modelled without changing court procedure.

**Phase 2:** CWC + CCI + POCSO thread (only after legal review and CWC consent protocol).

---

## 6. AI Components (Four Only)

Reduced from 16 agents. Each has a human gate.

| # | Component | Does | Does NOT | Human gate |
|---|---|---|---|---|
| A1 | Intake Assistant | Speech-to-text (Indic), drafts structured intake summary from notes | Decide severity, assess credibility | Staff confirms every field before save |
| A2 | Referral Router | Suggests next institution from rule table (e.g., DV + injury → medical) | Auto-send referrals | Staff approves each referral |
| A3 | Deadline & Stall Monitor | Tracks SLA timers per step (configured by law/SOP), flags breaches | Judge delay cause or blame staff | Supervisor triages flags |
| A4 | Duplicate & Linkage Check | Flags possible same-person or linked cases using consented identifiers | Merge records automatically | Records officer confirms |

**Explicitly removed from v1:** Root cause agent, Policy Gap score on individuals, Emerging Threat agent, Legal Research agent (replaced by a curated, versioned rule library reviewed by lawyers), Scenario engine.

**Aggregate analytics (kept, minimised):** Monthly counts per district, step-level SLA breach rates. Minimum cell size [N, to set with data owner]. Not per-case.

---

## 7. Core Workflow

```
Intake (OSC)
  → Consent captured (survivor, recorded)
  → Minimum case record created
  → Referral(s) generated from rule table → staff approves
  → Receiving agency acknowledges within SLA
  → Step completion logged with evidence reference
  → Deadline monitor flags stalls to supervisor
  → Survivor receives status via helpline/SMS (no PII in SMS)
  → Case closes with outcome category (not a risk score)
```

**Rules:**
- Survivor is asked to repeat her account once. Later steps read the shared thread. Staff must mark when a repeat is unavoidable.
- Every access is logged with reason.
- Survivor can withdraw consent for sharing (except where law requires a report; the system shows which parts are legally mandatory).

---

## 8. Data Model (Minimum)

| Entity | Fields | Sensitivity |
|---|---|---|
| Case | case_id (internal, not national ID), opened_at, pilot_district, status | Restricted |
| Person (survivor/child) | pseudonymous ID, age band, consent records | Victim-sensitive |
| Referral | from, to, step, sent_at, acknowledged_at, sla_due | Restricted |
| Step event | type, actor role, timestamp, evidence reference (document stored in source system, not CCP) | Restricted |
| Consent | scope, given_at, withdrawn_at, witness | Victim-sensitive |
| Audit | actor, action, case_id, reason, timestamp | Internal |

**Not stored:** Full narrative in shared thread beyond what the receiving step needs. Raw medical details beyond "exam done / not done / report reference". Caste, religion, and sexual orientation fields are excluded in v1 (not needed for the referral function, and misuse risk is high). Verify with DPDP Act 2023 requirements before finalising.

**Storage principle:** CCP holds pointers and status, not the underlying police or medical file. Source remains with the owning institution. Reduces breach impact.

---

## 9. Architecture (Lean)

| Layer | Choice | Why |
|---|---|---|
| Deployment | State data centre or NIC-hosted, district pilot | Data residency. Avoid foreign SaaS for victim data. |
| Frontend | Angular standalone, offline-tolerant PWA for field staff | Low-connectivity districts. Tablet use. |
| API | FastAPI | Typed, fast to audit, simple to containerise |
| Database | PostgreSQL with row-level security per institution | Mature, auditable, open source |
| Workflow/SLA | Simple state machine + scheduled jobs (not a general orchestrator) | Fewer moving parts |
| Speech/Language | Bhashini (Government of India language platform) or self-hosted open ASR | Native Indic support, verify API terms |
| LLM (A1 only) | Small self-hosted open-weights model, quantised, PyTorch/Hugging Face tooling | Data never leaves premises. Summaries only. Not decision-making. |
| Identity | Government SSO (state-level) with role-based access per institution | Known auth pattern. Audit per user. |
| Observability | OpenTelemetry → Prometheus/Grafana. Audit log immutable (append-only table + hash chain) | Required for accountability |
| SMS/helpline | Via existing government channel; status codes only | No narrative in messages |

**Scaling:** Per-district deployment, not single national cluster in v1. Limits blast radius. Federation later only if governance allows.

**Latency target:** Referral creation < 2 s. SLA alert delivery < 1 min. Offline intake syncs when connected.

---

## 10. Legal and Governance Basis (Verify All)

All section numbers below must be checked against official text before use. I may be wrong on specifics.

| Instrument | Relevance | Note |
|---|---|---|
| Protection of Women from Domestic Violence Act, 2005 | Protection orders, Protection Officers, service providers | Defines Protection Officer and service provider roles that CCP maps to |
| POCSO Act, 2012 | Mandatory reporting, child-friendly procedures | Mandatory reporting duty affects consent model for child cases (Phase 2) |
| Juvenile Justice (Care and Protection) Act, 2015 | CWC, CCI, child care | Phase 2 |
| Bharatiya Nagarik Suraksha Sanhita, 2023 | Replaces CrPC: FIR, victim compensation, statements | Verify victim-statement and compensation sections |
| Bharatiya Nyaya Sanhita, 2023 | Replaces IPC: sexual offences | Verify offence mapping |
| Digital Personal Data Protection Act, 2023 | Consent, purpose limitation, state exemptions, retention | Confirm which exemptions apply to State functions and whether they extend to victim data |
| Information Technology Act, 2000 | Security, intermediary duties | Context only |
| Vishaka v. State of Rajasthan (1997) | Workplace sexual harassment guidelines (later codified in POSH Act, 2013) | Landmark. Relevant for workplace cases, not core pilot |
| Lalita Kumari v. Government of Uttar Pradesh (2013) | Mandatory FIR registration for cognisable offences; preliminary enquiry limits | Landmark. Basis for police-delay SLA logic |
| Bachpan Bachao Andolan v. Union of India (2011) | Child trafficking and child labour directions | Phase 2 reference |

**Governance requirement before pilot:** Written data-sharing protocol per institution. Legal opinion on whether CCP is a "processor" or "fiduciary" under DPDP. Ministry-level sign-off. Nodal officer per district.

---

## 11. Simulated Expert Panel Review

Each reviewer objects. Then the fix is recorded. Verdict at end. Reviewers are composite roles, not named individuals.

| Reviewer (role) | Objection | Resolution in v2 |
|---|---|---|
| Senior WCD Secretary-level official | "We have MIS, NCRB, dashboards. Why another system?" | Shifted from analytics to case continuity. Dashboard limited to aggregate SLA view. |
| Ministry joint secretary (programme) | "Who pays and who maintains it? States run OSCs, not the Centre." | District pilot with state co-funding. State owns deployment. Centre sets standard, not operation. |
| District Collector | "I cannot act on a national model. Show me my district's stalled cases today." | Supervisor queue with stalled cases by district within the first screen. |
| Senior police officer (Women's Cell) | "Police cannot wait for a portal. FIR must not depend on software." | CCP never gates FIR. Referral is parallel, not a precondition. Lalita Kumari rule preserved. |
| Medical officer (district hospital) | "I will not type into a third system during an emergency." | Pending-exam status only. Voice intake optional. Forms under 60 seconds. |
| Senior software engineer (government platforms) | "Single central DB of victims is a breach magnet. Why is the LLM centralised?" | Per-district deployment, pointers not files, on-prem LLM, row-level security. Accepted. |
| Senior business analyst | "What is the measurable outcome, and does it reward the wrong thing?" | Outcome KPIs are process KPIs (time to exam, time to ack, repeat statements). Convictions NOT used as primary KPI, because pressure on convictions can distort reporting. |
| Senior child-rights lawyer (Supreme Court practice) | "Mandatory reporting under POCSO cannot be subject to consent withdrawal. Your consent model is wrong for children." | Agreed. Child consent model is Phase 2, with legal mapping of mandatory duties. v2 excludes children from pilot. |
| Senior women's rights lawyer (DV practice) | "Survivors fear that information will reach the abuser through a shared system." | Role-based access. No abuser-accessible channel. Address and contact details not in shared thread. Address-masking option. |
| Retired High Court judge (criminal/family) | "A summary generated by AI could be produced in court. Who is responsible for its accuracy?" | A1 output is a draft. Human-signed record is the only evidentiary document. Model output is never evidence. Audit trail of who edited. |
| Survivor-centred counsellor | "Asking a survivor to repeat her story is re-traumatisation. The system should reduce that." | Repeat-statement counter is a core KPI. Shared thread prevents repeats where lawful. |
| Child-rights activist | "Aggregate data by village can expose children in small communities." | Minimum cell size enforced. Village-level data suppressed in v1. |

**Panel verdict:** Viable as a pilot **only** if: (1) state co-funds and owns operation, (2) data-sharing protocol is signed per institution, (3) police and medical integration is voluntary but supported by SOP, (4) model output is never evidence, (5) child cases are excluded until Phase 2 legal review. Without these, the pilot will fail for governance reasons, not technical ones.

---

## 12. Things v2 Still Gets Wrong or Does Not Solve

[INFERENCE] Mark these as open risks:

- **Adoption:** Staff with heavy caseloads will skip entry. Mitigation: make the form shorter than current paper process. Measure before scaling. [Guessing]
- **Police non-compliance:** Stations may not acknowledge referrals. CCP detects it but cannot force it. Escalation path depends on state policy. [Likely]
- **Data quality at source:** Garbage intake, garbage referrals. A1 summaries reduce clerical time but cannot fix missing facts. [Likely]
- **Court delay:** CCP tracks steps, not judicial timelines. Outcome delay remains outside control. [Likely]
- **Political risk:** Public dashboards of stalled cases can be used to blame districts rather than fix capacity. Keep supervisor views internal. [Likely]
- **Cost:** No cost estimate yet. [DATA NOT AVAILABLE]
- **Existing systems:** Some states may already run case-management tools (e.g., ICPS-related MIS for child protection, Mission Shakti reporting). Overlap and data-sharing feasibility must be verified before design lock. [DATA GAP]

---

## 13. MVP (Pilot Scope)

**Duration:** 6 months, 1 district, 1 OSC, 1 police station (Women's Cell), 1 district hospital, 1 DLSA.

| Capability | In | Out |
|---|---|---|
| Consent capture | Yes | Biometric consent |
| Intake (form + A1 draft) | Yes | Voice-only intake, multi-language beyond 2 languages |
| Referral generation and tracking | Yes | Automated sending without staff approval |
| SLA timers and stall queue | Yes | Predictive risk scores |
| Survivor status via helpline | Yes | Survivor app |
| Duplicate check (A4) | Yes | Cross-state matching |
| Aggregate district SLA view | Yes | Public dashboard |
| Audit log | Yes | Blockchain (not needed) |

**Success gate to scale (all required):**
- Median time from intake to referral acknowledgment reduced vs baseline [baseline to measure, DATA NOT AVAILABLE]
- Repeat-statement count per case reduced vs baseline
- Zero confirmed data breaches
- Staff adoption above threshold set jointly with OSC lead
- Survivor-reported satisfaction on status updates

---

## 14. Success Metrics (Process, Not Political)

| Metric | Definition | Type |
|---|---|---|
| Intake-to-referral time | Minutes from intake to referral sent | Process |
| Acknowledgment SLA compliance | % referrals acknowledged within SLA | Process |
| Medical exam window compliance | % exams within configured window | Process |
| Repeat-statement count | Number of times survivor gives account per case | Survivor-centred |
| Stalled case count | Open steps past SLA | Process |
| Survivor status awareness | % survivors who report knowing next step | Survivor-centred |
| Breach count | Confirmed unauthorised access | Safety (target 0) |
| Model error rate on A1 | % summary fields corrected by staff | AI quality |

**Not KPIs:** Convictions, arrest counts, FIR count. Reason: these reward the wrong behaviour and are influenced by factors outside CCP.

---

## 15. Risk Register (Top 8)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Data breach of victim records | Medium | Critical | Pointers only, row-level security, on-prem, pen test before pilot |
| Abuser access via shared channel | Low | Critical | Role-based access, no abuser-facing channel, address masking |
| Staff non-adoption | High | High | Shorter than paper, supervisor champions, measure weekly |
| Institution non-cooperation | High | High | State-level SOP and nodal officer before go-live |
| AI summary error used as evidence | Medium | High | Draft-only labelling, human signature, audit trail |
| Misuse of stall data to blame districts | Medium | Medium | Internal-only supervisor view, capacity context required |
| Vendor lock-in | Medium | Medium | Open standards, self-hosted, documented data export |
| Legal challenge on data sharing | Medium | High | Legal opinion before pilot, consent-based design |

---

## 16. Final Product Vision

**CCP is a case continuity layer for OSC, police, medical, and legal aid institutions handling women's domestic violence cases in one pilot district.** It keeps the survivor's journey visible to the people who need to act, reduces repeated retelling, flags stalled steps to supervisors, and gives the survivor a status channel. AI reduces clerical work and surfaces missed handoffs. Humans decide everything that matters.

**Phase 2:** Child cases (CWC, CCI, POCSO) after legal mapping of mandatory duties and consent.
**Phase 3:** Multi-district federation only if governance, audit, and data-sharing mature.

**Overall thesis confidence:** [Likely] that continuity failure is a real, important gap. [Guessing] that CCP is the right fix versus strengthening existing systems and staffing. Test this in the pilot before scaling. If pilot shows the bottleneck is staffing or court capacity, not handoffs, CCP is the wrong product.

---

## 17. Immediate Next Steps (Before Any Build)

1. Map existing WCD/state case-management tools in the pilot district. Verify what already exists. [DATA GAP]
2. Obtain written data-sharing position from state WCD and police. [Required]
3. Legal opinion on DPDP fiduciary/processor status and consent model. [Required]
4. Baseline measurement: current time from intake to referral, repeat-statement frequency, stall rate. Measure on paper first. [Required]
5. Interview 10–15 frontline staff (OSC, police, medical, DLSA) before any screen design. [Required]
6. Survivor advisory group (with support organisations) to review consent, status messages, and address-masking. [Required]

**Do not build until steps 2, 3, and 4 are complete.**


The previous answer was rejected by the expert panel. Not because it was badly researched or poorly structured—but because it solved the wrong problem. It designed an intelligence system for the people who already have power to see data, rather than an application for the people who have neither power nor data: the woman in a violent household, the girl about to be married, the child out of school, the mother turned away by a facial-recognition failure.

What follows is the destruction of that answer and the construction of what the panel—senior ministry officials, software engineers, business analysts, lawyers, and judges—would actually approve.

---

# The Expert Panel's Verdict: Why the Previous Answer Fails

## The core indictment

The previous answer proposed a "Gap-to-Decision Intelligence System" for senior officials. The panel's unanimous finding: **senior officials are not the bottleneck.** They have dashboards, reviews, coordination committees, and the power to summon any officer. What they lack is not intelligence about gaps. What they lack is **a mechanism that forces a response at the point where a woman or child is falling out of the system**—and that measures whether the response actually reached her.

The previous answer built a better map for people already holding the map. It did not build a vehicle.

## The evidence the panel used to destroy it

**1. The dashboard already exists, and it harms the intended beneficiary.**

POSHAN Tracker was meant to be a monitoring tool. Instead, its facial-recognition system failed to recognise mothers, excluding eligible families from meals, preschool education, and health monitoring; government data cited only a **52.7% ration delivery rate by end-2025**. The CAG found that the abrupt transition from ICDS-CAS to Poshan Tracker disrupted data management, made outcome tracking impossible, and left Anganwadi workers without compatible smartphones. Anganwadi workers now enter over 150 data points daily, often with poor connectivity, and delays can cost them incentives.

**The lesson for the panel:** a system that measures the woman but does not serve her will, at scale, **exclude her while appearing to govern her**. The previous answer's "data architecture" had no answer for this.

**2. Decision-support tools for officials are systematically ignored.**

Behavioural research on Indian government AI adoption is unambiguous: "An official who follows an AI recommendation that departs from standard procedure" faces scrutiny; "an official who ignores the recommendation faces no such scrutiny". The officials who most need analytical support—ward officers, inspectors, junior engineers—are "often the least served by the systems built in their name".

**The lesson for the panel:** a tool whose primary user is the Secretary will be viewed, nodded at, and ignored. A tool that changes what a **frontline worker can do tomorrow morning** will be used.

**3. The service journey is not broken because officials lack intelligence. It is broken because no actor is accountable for the transition.**

The CPPR study of OSCs in three states found the absence of in-house Police Facilitating Officers, the absence of psychosocial counsellors in several districts, and **a lack of robust MIS to track case progress or conduct vulnerability mapping**. One Stop Centres are often perceived as "counselling or mediation centres" rather than medical and legal hubs; funding delays of six months to a year force staff to use personal funds.

**The lesson for the panel:** the gap is not a "coordination gap" to be visualised. It is a **missing accountable handoff** that no dashboard can create.

**4. The law says what the panel already knew: legal aid is a right, not a referral.**

The Chhattisgarh High Court held that merely advising a woman to approach the District Legal Services Authority, without ensuring actual and timely legal representation, violates Article 21. Family courts cannot treat legal aid as a formality; they must maintain panels of lawyers who can be appointed immediately. Yet UNDP data shows **87% of married women who experienced violence never sought help of any kind**, and **72% of women who faced a dispute and took no action said they did not know what to do**.

**The lesson for the panel:** the problem is not that officials lack a "journey model." The problem is that the woman does not know her rights, does not have a lawyer when she needs one, and the system treats a referral as a solution. Any AI application must **close the distance between the right and the remedy**, not describe it.

**5. The one AI application that works does something specific, for someone specific, with a clear response pathway.**

Gujarat's AI-based Early Warning System predicted dropout risk with **72% accuracy** and helped prevent over **1.67 lakh students** from dropping out while re-enrolling over **90,000**; in Uttar Pradesh, attendance in pilot schools rose from **48.8% to 62.8%**. It works because it predicts a **specific event** (dropout), triggers a **tiered response** by a **named actor** (teacher/school), and connects the child to **education, health, and social protection services** where needed. It does not give officials a "gap score." It gives a teacher a list and a protocol.

**The lesson for the panel:** the previous answer's "Gap Score" and "Decision Centre" were abstractions. The Gujarat system is an **intervention trigger**.

---

# The Rebuilt Product: What the Panel Would Actually Approve

## The reframing

The previous answer positioned the product as "AI-Powered Women & Child Protection, Policy & Service Gap Intelligence." The panel rejects that category. It is a **governance intelligence product**—useful for the Ministry's own planning, but not a solution to the problem women and children face.

The rebuilt product is a **Frontline Action and Accountability Engine**. Its primary users are not the Minister or Secretary. Its primary users are:

1. **The woman or child herself** (or a trusted intermediary acting for her: Anganwadi worker, ASHA, paralegal volunteer, NGO worker, teacher).
2. **The frontline official who must act** (OSC manager, CWC chairperson, Protection Officer, PFO, DLSA panel lawyer, school head).
3. **The district-level convergence owner** (Collector/DM) who is accountable for whether the handoff actually happened.

The senior official is a **secondary user**, who sees not "gaps" but **unresolved cases and unanswered handoffs**—a list of women and children for whom the system has failed to close the loop.

## The product's three irreducible functions

### Function 1: A rights-and-remedy navigator that reaches the woman where she is

**What it does:** A multilingual, voice-first, WhatsApp-based assistant that (a) helps a woman understand whether what is happening to her is recognised by law, (b) tells her the **one next step** that is actionable today, and (c) with her consent, **creates a case record that triggers a human follow-up** by a named official.

**Why this is not another chatbot:** existing legal chatbots (Jagrit, Nyaya Setu, Jann16) provide information. They do not create accountability. This system's output is not an answer—it is a **timed handoff**: "A Protection Officer must contact you within 48 hours. If she does not, this case escalates."

**The legal basis the judges on the panel insisted on:** the right to legal aid under Article 21 is not satisfied by information or referral; it requires **timely representation**. The assistant must therefore connect to a **named panel lawyer**, not a generic DLSA office, and the case record must show whether the lawyer actually appeared.

**The evidence base:** 72% of women who took no action did not know what to do; 87% of abused married women never sought help. The first barrier is **invisibility of the remedy**, not absence of a scheme.

### Function 2: An unignorable case record that forces the handoff

**What it does:** every interaction that enters the system—whether through the woman's assistant, a helpline, an OSC, a CWC, a school, or a police station—creates a **single case token**. The token travels with her. At each handoff point (police → medical → legal → shelter → court → follow-up), the receiving actor must **accept or reject the handoff with a timestamp and a reason**. The case cannot be closed by the referring actor; it can only be closed by the **receiving actor confirming that the service was delivered or the case was resolved**.

**Why this is different from an MIS:** the CPPR study found that OSCs lack robust MIS to track case progress. But an MIS is a reporting tool; officials can leave fields blank. A **handoff-acceptance protocol** is an accountability tool: an unaccepted handoff is visible not as a "gap" but as a **pending case with a named overdue officer**. The district Collector's view is not a heatmap; it is a list: "These 47 women are waiting for a medical report; these 23 children are waiting for a CWC order; these 12 cases have no legal aid lawyer assigned after 7 days."

**The evidence base:** the CPPR study documented the absence of in-house PFOs and counsellors, funding delays, and the perception of OSCs as mediation centres. These are not knowledge gaps; they are **handoff failures**. A system that makes the handoff visible and attributable changes the incentive structure that behavioural research shows otherwise defaults to inaction.

### Function 3: Outcome verification, not service counting

**What it does:** the system asks a different question at closure: not "Was a service delivered?" but "**Did the woman or child reach the intended outcome?**" For a domestic violence case: Is she safe at 3 months? Does she have legal representation? Has the protection order been complied with? For a child in CCI: Is she in school? Has family reunification been assessed? For a dropout-prevention case: Is the child still enrolled at 6 months?

**Why this matters:** the previous answer proposed an "Outcome Analysis Agent." The panel rejected this as an analytical exercise. Outcome verification must be a **field function**: a structured follow-up call or visit, recorded by the frontline worker, with the woman's or child's own assessment where possible. The data generated is not for a national dashboard; it is for the **district convergence meeting**, where unresolved outcomes are assigned to the officer responsible for the next action.

**The evidence base:** the CAG found that convergence between ICDS and NHM could not be assessed because there were no beneficiary-level service records. POSHAN Tracker measures attendance and growth monitoring, not whether the child's nutrition outcome improved. The system must measure **what happened to the person**, not what was recorded about her.

---

## How the application changes the frontline worker's day

The panel was emphatic: if the system adds work without removing work, it will fail like POSHAN Tracker did. The application must **reduce the frontline burden** while increasing the accountability of the system around her.

| Frontline actor | What they do today | What the application does for them | What it asks of them |
|---|---|---|---|
| **Anganwadi worker** | Enters 150+ data points; identifies at-risk children informally; has no formal channel to escalate a girl she suspects is at risk of marriage | Gives her a **one-tap escalation** for a girl at risk; the system creates a CWC/CMPO handoff and tracks acceptance; she does not need to write a report | Confirm the child's identity and the risk signal (school dropout, sibling marriage, etc.) |
| **OSC manager** | Manages cases on paper or fragmented systems; chases medical reports and PFOs manually | Gives her a **handoff dashboard**: which cases are waiting for medical, police, legal, shelter, and for how long; auto-escalates overdue handoffs to the District Collector | Accept or reject handoffs with a reason; record follow-up outcome |
| **CWC chairperson** | Processes children produced before it; has no visibility of children who never reached it | Gives her a **pending-production list** from Anganwadi, school, helpline, and police; flags children at risk of falling out before production | Record the CWC order and the next handoff (CCI, family, sponsorship) |
| **DLSA panel lawyer** | Receives referrals that may or may not be actionable; has no case history | Gives her a **pre-briefed case packet** with the woman's account, the legal issue, and the hearing date; requires confirmation of appearance | Confirm appearance and outcome; flag if the woman did not appear and why |
| **District Collector** | Reviews aggregate dashboards; chairs coordination meetings | Gives a **named-case list of overdue handoffs and unresolved outcomes**, by department and officer; the meeting agenda is the list | Assign resolution owners; record decisions |

---

## The legal architecture the judges required

The panel's legal members insisted that the application must be built **inside the existing legal framework**, not as a parallel techno-system.

1. **Consent and confidentiality.** Every case record must be created with informed consent, in the woman's or child's language, with a clear explanation of who will see what. For children, the JJ Act confidentiality provisions apply; the system must enforce role-based access at the **field level**, not just at the dashboard level.

2. **No automated decision.** The system may flag a handoff as overdue; it may not determine eligibility, credibility, custody, or guilt. The CWC, the court, the Protection Officer, and the lawyer decide.

3. **Legal aid as a right, not a referral.** The system's legal module must connect to **named panel lawyers** and record whether representation was actually provided. The Chhattisgarh High Court's standard—that referral without timely representation violates Article 21—must be the system's design requirement.

4. **Evidence preservation for emerging threats.** For cyberstalking, image-based abuse, deepfake CSAM, and sextortion, the system must include a **one-touch evidence preservation** function that creates a hash-stamped record and routes it to the cybercrime cell, without requiring the victim to repeatedly view or describe the material.

---

## What the system does *not* do (and why the panel insisted on these exclusions)

| Excluded feature | Why the panel rejected it |
|---|---|
| **National "gap score" dashboard** | It measures the system's self-image, not the woman's outcome. It will be reviewed, praised, and ignored. |
| **Predictive risk scoring of individual women/children** | Ethically and legally hazardous; creates liability without accountability; no statutory basis for individual risk classification. |
| **Cross-departmental individual data linkage in Phase 1** | Legally complex, privacy-invasive, and unnecessary for the first version. The handoff protocol works with **case tokens and consent**, not with merged databases. |
| **Automated benefit denial or eligibility determination** | Violates natural justice; the POSHAN Tracker facial-recognition failure shows what happens when automation is placed between a woman and her entitlement. |
| **A "policy recommendation engine" as the primary output** | Policy recommendations are a by-product of unresolved cases, not the product itself. The product is the resolution of cases; the policy insight emerges when the same handoff fails repeatedly across districts. |

---

## The MVP the panel would fund

**MVP name:** *Sahyog* (working title)—a case-token handoff and follow-up system for **one high-burden district**, covering **one journey**: a woman or child who has experienced violence or is at risk of child marriage, from first contact to a verified outcome at 3 months.

**MVP components:**

1. **A WhatsApp/voice assistant for the woman or trusted intermediary** to create a case and receive the first actionable step.
2. **A handoff console for the OSC, CWC, police, DLSA, and health facility** to accept or reject handoffs with timestamps.
3. **A district Collector view** that lists overdue handoffs and unresolved outcomes, by officer.
4. **A 3-month follow-up module** that records whether the woman is safe, has legal representation, and has a resolved legal or protection outcome; for a child, whether she is in school, in a safe placement, and has a CWC order.
5. **An evidence log** on every case, so that when the same handoff fails repeatedly, the district can see the pattern and escalate it to the state as a **policy or capacity problem**—not a "gap score," but a documented failure of a specific handoff.

**What the MVP deliberately does not do:** no national dashboard, no individual risk prediction, no cross-departmental database merger, no policy recommendation engine, no "AI agent" that speaks to the Minister. The AI's role is narrow and auditable: (a) understand the woman's account in her language, (b) map it to a legal issue and a service pathway, (c) create the correct handoff, and (d) detect when the handoff is overdue. That is enough to change the outcome for the first woman who uses it.

---

## The test the panel set for success

The previous answer's success metric was "percentage of AI claims with full evidence passport." The panel rejected that as a metric of the system's own elegance.

The panel's success metric is simpler and harder:

> **Of the women and children who enter the system, how many reach a verified safe and legally resolved outcome at 3 months, and how many handoffs were overdue for more than 7 days without a named officer being held accountable?**

If that number improves, the application is working. If it does not, no amount of gap scoring, agent architecture, or decision-brief formatting will matter.

The product is not an intelligence platform. It is an **accountability machine for the last mile**—and its first user is the woman who, until now, had no way to make the system respond.
