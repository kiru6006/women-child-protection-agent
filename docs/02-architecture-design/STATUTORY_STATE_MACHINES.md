# Statutory State Machines & Deadline DAGs
## Deterministic Timelines for Domestic Violence, POCSO, and Child Protection

---

### 1. Rationale: Deterministic DAGs vs. Probabilistic LLMs
Statutory deadlines are established by parliamentary statutes. Permitting an LLM to hallucinate or probabilistically estimate legal limitation periods creates critical judicial vulnerabilities. All workflow states, handoff countdowns, and escalation triggers are modeled as deterministic Directed Acyclic Graphs (DAGs) in Python/Celery.

---

### 2. Domain A: Women Protection (PWDVA 2005 & BNSS 2023)

```
[OSC / 181 Distress Intake] (T0)
           |
           +----> [Statutory Window: 24h] ---> [Medical Examination Completed] (s.7 PWDVA)
           |                                             |
           +----> [Statutory Window: 48h] ---> [DIR Form 1 Prepared by PO] (s.9(1)(b))
                                                         |
                                                         v
                                              [Filing before Judicial Magistrate] (s.12)
                                                         |
                                                         v
                                              [DLSA Legal Aid Appearance] (s.12(c))
                                                         |
                                                         v
                                              [Interim Protection Order Issued] (s.18/19/20)
                                                         |
                                                         v
                                              [3-Month Outcome & Safety Audit]
```

#### Statutory SLA Failure Thresholds:
* **Medical Exam Breach:** If $t > T_0 + 24\text{ hours}$ without completion entry, event `BREACH_MEDICAL_24H` fires $\to$ Show-cause draft generated to Chief Medical Officer.
* **DIR Filing Breach:** If $t > T_0 + 48\text{ hours}$ without magistrate filing, event `BREACH_DIR_48H` fires $\to$ Show-cause notice generated to Protection Officer.

---

### 3. Domain B: Child Protection (JJ Act 2015 & POCSO 2012) — Phase 2 Blueprint

```
[Apprehension / Rescue / Reporting] (T0)
           |
           +----> [Statutory Window: 24h] ---> [Forensic Medical Exam] (POCSO s.27)
           |
           +----> [Statutory Window: 24h] ---> [Mandatory CWC Production] (JJ Act s.31(1))
                                                         |
                                                         v
                                              [Fit Facility / Shelter Placement] (s.37)
                                                         |
                                                         v
                                              [Individual Care Plan (ICP) Audit] (s.38)
                                                         |
                                                         v
                                              [Family Rehabilitation or Aftercare] (s.46)
```

#### Statutory SLA Failure Thresholds:
* **CWC Production Delay:** Non-production within 24h (excluding travel) generates a Critical Judicial Escalation directly to the Principal Magistrate / District Magistrate under JJ Act Section 31.

