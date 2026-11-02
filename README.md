# Project Suraksha Sentinel & Sahyog (सुरक्षा सेंटिनल एवं सहयोग)
### Event-Driven Case Continuity & Gap-Closure Operating System for Women & Child Protection

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Compliance: DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP%20Act%202023-green.svg)](#legal--regulatory-compliance)
[![Statutory Framework: POCSO / PWDVA / JJ Act](https://img.shields.io/badge/Law-POCSO%20%7C%20PWDVA%20%7C%20JJ%20Act%20%7C%20BNSS-orange.svg)](#statutory-state-machines)
[![Architecture: Zero-PII Event Bus](https://img.shields.io/badge/Architecture-Zero--PII%20Event%20Bus-purple.svg)](#architecture-overview)

---

## 1. Project Overview & The Paradigm Shift

### The Problem
India's Ministry of Women and Child Development (MoWCD) ecosystem—encompassing **Mission Shakti** (One Stop Centres, Women Helpline 181), **Mission Vatsalya** (Child Protection Services, Child Helpline 1098, CWCs, CCIs), and **Mission Saksham Anganwadi & POSHAN 2.0**—reaches hundreds of millions of citizens. Yet, systemic handoff failures persistently derail justice and rehabilitation:
- **Fragmented Institutional Silos:** A survivor of violence interacts with 6 to 12 disconnected bodies (Police, One Stop Centre, District Hospital, DLSA Legal Aid, Protection Officers, Family Courts, Child Welfare Committees). Each handoff can fail silently without mutual visibility.
- **The Dashboard Fallacy:** Traditional government IT investments produce static dashboards (Poshan Tracker, Nirbhaya Dashboard, SHe-Box). These platforms show inputs and aggregate numbers but leave frontline workers with 150+ daily data fields, while senior officials remain unable to pinpoint why a victim dropped out between hospital examination and court representation.
- **The Retraumatization Loop:** Survivors are repeatedly forced to recount traumatic incidents at each departmental desk due to the absence of a shared, privacy-preserving case thread.

### The Solution: A Twin-Engine Operating System
**Project Suraksha Sentinel & Sahyog** is **NOT** another passive analytics dashboard. It is a dual-layered, deterministic accountability machine:

```
+--------------------------------------------------------------------------------------------------+
|                                    THE TWIN-ENGINE ARCHITECTURE                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. OPERATIONAL MICRO LAYER: SURAKSHA SENTINEL                                                  |
|      - Unit of Work: Anonymized Case Token (e.g., CASE-DV-2026-PAT-0842)                         |
|      - Zero PII in AI / Vector Layers (HMAC-SHA256 Tokenization)                                 |
|      - Deterministic Statutory State Machine (Hardcoded DAGs for POCSO, PWDVA, JJ Act, BNSS)    |
|      - Active SLA Timer: Detects statutory delays and triggers automated alerts                  |
|      - Citizen Ground-Truth: Outbound anonymous IVR/SMS verification to prevent falsified MIS    |
|                                                                                                  |
|                                       | Handoff Failures & SLA Breaches Rollup                   |
|                                       v                                                          |
|                                                                                                  |
|   2. STRATEGIC MACRO LAYER: GAP-CLOSURE OS                                                       |
|      - Unit of Governance: The Gap Contract (11-type taxonomy, bound to named official roles)   |
|      - Contextual RAG: Auto-drafts e-Office Note-Sheets and statutory Show-Cause notices         |
|      - Verification Loop: Connects closed contracts to real district-level outcome KPI movement  |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Core Personas & User Interfaces

| User Persona | Key Daily Problem | What Suraksha Sentinel Delivers |
|:---|:---|:---|
| **OSC / Frontline Staff** | Drowning in paperwork; manual chasing of doctors and police | **Mobile PWA Action Queue**: 1-tap intake, speech-to-text drafting (Indic languages), automated digital handoffs, and instant status updates. |
| **District Magistrate / Collector** | Unaware of inter-departmental stalls until a crisis hits the media | **District Action Console**: Real-time list of statutory SLA breaches with 1-click generation of pre-drafted, cited Show-Cause notices to responsible officers. |
| **Joint Secretary / State Director (WCD)** | Confronted with abstract data when asked for urgent policy priorities | **Policy Gap-Closure Console**: Top 5 binding Gap Contracts with assigned role owners, required budget, baseline/target KPIs, and draft inter-ministerial orders. |
| **Survivor / Guardian** | In the dark about case progression; repeatedly narrating trauma | **Helpline/SMS Status Updates**: Consent-based, non-PII milestone alerts and closed-loop feedback verification without installing an app. |

---

## 3. Repository File and Folder Structure

```
women-child-protection-agent/
│
├── apps/                                   # User-facing applications
│   ├── field-pwa/                          # Frontline mobile-first offline PWA (OSC, Police, Doctors)
│   │   ├── public/                         # Service workers, manifest, offline assets
│   │   ├── src/
│   │   │   ├── components/                 # Accessible, low-bandwidth UI components
│   │   │   ├── hooks/                      # Offline sync, audio recorder, speech hooks
│   │   │   ├── pages/                      # Intake, Case Journey, Action Queue, Referral
│   │   │   └── services/                   # IndexedDB local cache, Bhashini Indic ASR client
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── district-portal/                    # Desktop portal for District Magistrate & DCPO
│   │   ├── src/
│   │   │   ├── components/                 # Breach tables, e-Office note preview, draft editor
│   │   │   ├── pages/                      # Active Breaches, Departmental Timers, Audits
│   │   │   └── services/                   # WebSocket breach listener, REST API client
│   │   └── package.json
│   │
│   └── state-console/                      # Strategic console for Joint Secretary / State WCD
│       ├── src/
│       │   ├── components/                 # Gap Contract cards, convergence matrix, KPI charts
│       │   └── pages/                      # Gap Contracts, Policy Voids, Resource Reallocation
│       └── package.json
│
├── services/                               # Microservices backend architecture
│   ├── sentinel-api/                       # Core FastAPI application gateway
│   │   ├── app/
│   │   │   ├── api/v1/                     # REST routers: /events, /cases, /breaches, /contracts
│   │   │   ├── core/                       # Security, config, database sessions, auth middleware
│   │   │   ├── models/                     # SQLAlchemy models for PostgreSQL
│   │   │   └── schemas/                    # Pydantic schemas for request/response validation
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── state-machine/                      # Deterministic statutory workflow engine
│   │   ├── workflows/                      # Hardcoded legal DAGs: POCSO, PWDVA, JJ Act, BNSS
│   │   ├── engine.py                       # State transition validator and state graph runner
│   │   └── timer.py                        # Celery beat scheduler for statutory SLA countdowns
│   │
│   ├── rag-drafter/                        # Constrained RAG administrative drafting service
│   │   ├── knowledge_base/                 # Vetted gazette notifications, SOPs, and manual acts
│   │   ├── vector_store/                   # Qdrant / Milvus connection and indexing logic
│   │   ├── prompt_templates/               # Zero-temperature e-Office Note-Sheets and SCN templates
│   │   └── generator.py                    # Citation-enforced generation with fallback to "DATA NOT AVAILABLE"
│   │
│   └── ground-truth-ivr/                   # Citizen-in-the-loop telephony service
│       ├── providers/                      # NIC SMS Gateway, Exotel/Telephony webhooks
│       ├── workflows/                      # Multi-lingual IVR survey trees (7-day post-service)
│       └── discrepancy_engine.py           # Logic comparing citizen feedback with MIS entries
│
├── packages/                               # Shared cross-cutting libraries
│   ├── zero-pii-tokenizer/                 # Cryptographic anonymization, HMAC-SHA256, salt rotators
│   ├── legal-rules-engine/                 # Statutory deadline constants, citation verifiers
│   └── audit-chain/                        # Immutable SHA-256 tamper-evident log manager
│
├── schemas/                                # Canonical JSON-LD & SQL data specifications
│   ├── case_token.json                     # JSON Schema for Anonymized Case Token
│   ├── event_payload.json                  # JSON Schema for Ingestion Event Bus
│   ├── gap_contract.json                   # JSON Schema for Stateful Gap Contract
│   └── statutory_deadlines.json            # Machine-readable legal deadlines (hours/days)
│
├── docs/                                   # Project documentation & compliance
│   ├── compliance/                         # DPDP Act 2023 DPIA, JJ Act s.74, POCSO s.23 compliance
│   ├── legal/                              # Legal research, statutory citations, high court precedents
│   ├── architecture/                       # System diagrams, sequence graphs, data flows
│   ├── CLAUDE.md                           # Agent guidelines & strict operational rules
│   ├── IMPLEMENTATION_PLAN.md              # Comprehensive implementation roadmap & architectural blueprint
│   ├── PLANS.md                            # v1 Strategic Foundation & Gap Taxonomy Archive
│   ├── PRD.md                              # v2 Self-Critique & Frontline Re-Grounding
│   └── PRD2.md                             # Master Brief: Gap-Closure OS & Suraksha Sentinel
│
├── tests/                                  # Automated test suites & evaluation harness
│   ├── unit/                               # Unit tests for tokenizers, DAGs, and APIs
│   ├── integration/                        # End-to-end event ingestion and breach alert tests
│   └── evaluation/                         # 50-case benchmark harness for RAG citation & precision
│
├── deploy/                                 # Production deployment & infrastructure
│   ├── k8s/                                # Kubernetes manifests for NIC MeghRaj cloud
│   ├── helm/                               # Helm charts for multi-district deployment
│   └── docker-compose.yml                  # Local development environment stack
│
└── README.md                               # Project documentation & quickstart guide
```

---

## 4. Key Statutory Workflows (Deterministic DAGs)

The system rejects stochastic LLM decision-making for legal transitions. Workflows are encoded as deterministic state machines derived directly from Indian statutes:

### A. Domestic Violence (PWDVA 2005 / BNSS 2023)
```
[Incident / 181 Call] 
       │
       ▼ (Immediate)
[OSC Intake & Consent Tokenization] 
       │
       ├────────────────────────────────────────┐
       ▼ (Max 24h)                              ▼ (Max 48h)
[Medical Examination]                  [Domestic Incident Report (DIR)]
       │                                        │
       └──────────────────┬─────────────────────┘
                          ▼ (Max 72h)
          [Filing before Judicial Magistrate]
                          │
                          ▼ (Max 7 days)
          [DLSA Legal Aid Assignment & Representation]
                          │
                          ▼ (Day 30)
          [Anonymous Citizen IVR Ground-Truth Check]
```

### B. Child Protection & POCSO Act 2012 / JJ Act 2015
```
[FIR Registered / Child Rescued]
       │
       ▼ (Immediate)
[Case Token Created (Zero PII)]
       │
       ├────────────────────────────────────────┐
       ▼ (Statutory Limit: 24h)                 ▼ (Statutory Limit: 24h)
[Forensic Medical Examination]         [Production before CWC]
 (POCSO Act s.27)                       (JJ Act 2015 s.31)
       │                                        │
       └──────────────────┬─────────────────────┘
                          ▼ (Max 72h)
          [Fit Facility / Shelter Placement Order]
                          │
                          ▼ (Max 30 days)
          [Interim Victim Compensation Assessed]
```

---

## 5. Technology Stack & Infrastructure

| Layer | Technology | Justification |
|:---|:---|:---|
| **Frontend PWA** | Next.js 14, React 18, Tailwind CSS, Workbox | Offline-first, $<4\text{MB}$ bundle size, responsive on entry-level Android devices in low-connectivity areas. |
| **Desktop Portals** | React, TypeScript, TanStack Table, Recharts | Fast, typed, accessible UI for District Collectors and State Secretaries. |
| **Backend API** | Python 3.11, FastAPI, Pydantic v2 | High-performance asynchronous API, auto-generated OpenAPI documentation, auditable code. |
| **State Machine & Timers**| Celery, Redis 7, Python-statemachine | Distributed task queues, sub-millisecond timer lookups, resilient scheduling for statutory SLAs. |
| **Relational Database** | PostgreSQL 16 (with Row-Level Security) | ACID compliant, field-level encryption, institutional tenant isolation. |
| **Vector Database** | Qdrant / Milvus (Self-hosted) | On-premise vector search for RAG drafting; zero cloud telemetry to foreign SaaS. |
| **Local LLM Layer** | Quantized Mistral-7B / BharatLLM (Local Ollama/vLLM) | Offline inference on MeghRaj servers, strictly prompt-constrained (`temp=0.0`) for administrative drafting. |
| **Event Bus** | Apache Kafka / RabbitMQ | Decoupled event-driven architecture handling async departmental notifications. |
| **Telephony Gateway** | NIC SMS Gateway / C-DAC / Exotel | Secure, regional-language SMS and IVR for survivor verification. |
| **Deployment Cloud** | NIC MeghRaj (Govt. of India Cloud) / Docker / K8s | Strict data sovereignty, MeitY empanelment, zero third-party data transit. |

---

## 6. Legal & Regulatory Compliance

This project is built from the ground up to comply with Indian constitutional, criminal, and privacy laws:

1. **Digital Personal Data Protection (DPDP) Act, 2023:**
   - **Zero PII Storage:** Names, phone numbers, and addresses never enter the AI or vector databases.
   - **Purpose Limitation:** Data collected at intake is restricted to statutory case routing.
   - **Right to Erasure & Masking:** Immediate pseudonymization upon consent withdrawal where allowed by law.
2. **POCSO Act 2012 (Section 23) & JJ Act 2015 (Section 74):**
   - Absolute prohibition against disclosing the identity of child victims. The system automatically redacts school names, village names, and family linkages in all cross-departmental queues.
3. **Protection of Women from Domestic Violence Act (PWDVA), 2005:**
   - Maps statutory obligations of Protection Officers, Service Providers, and Medical Facilities under Sections 5, 7, and 9.
4. **Evidentiary Integrity:**
   - In accordance with the Indian Evidence Act / Bharatiya Sakshya Adhiniyam, AI-generated drafts are labeled as **"ADMINISTRATIVE DRAFT ONLY - NOT LEGAL EVIDENCE"** and require mandatory digital signature by an authorized officer.

---

## 7. Getting Started (Local Development)

### Prerequisites
- Docker & Docker Compose ($\ge v24.0$)
- Node.js ($\ge v20.0$) and pnpm / npm
- Python ($\ge v3.11$)
- Git

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/organization/women-child-protection-agent.git
   cd women-child-protection-agent
   ```

2. **Start the core infrastructure services:**
   ```bash
   docker compose up -d postgres redis qdrant rabbitmq
   ```

3. **Set up the Sentinel Backend API:**
   ```bash
   cd services/sentinel-api
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

4. **Launch the Field Worker Mobile PWA:**
   ```bash
   cd ../../apps/field-pwa
   npm install
   npm run dev
   # Open http://localhost:3000 on your mobile browser / emulator
   ```

5. **Run the Evaluation Harness:**
   ```bash
   cd ../../tests/evaluation
   pytest test_rag_precision.py --benchmark
   ```

---

## 8. Implementation Roadmap Summary

```
+---------------------------------------------------------------------------------------------------+
| Phase 0: Foundation & Legal Compliance        (Month 1-2)   | DPIA, Statutory Rules, 20 Gap Contracts
| Phase 1: Paper-to-Digital Pilot (1 District)  (Month 3-5)   | Offline PWA, RAG Drafter, DV Journey
| Phase 2: Event-Driven Sentinel Integration    (Month 6-9)   | Redis Timers, Collector Queue, Auto-SCN
| Phase 3: Ground Truth IVR & POCSO Expansion   (Month 10-12) | Telephony Loop, CWC/JJ Act Module
| Phase 4: State Scale & Policy Gap Closure     (Month 13-18) | 5 Districts, Macro Gap Contracts Loop
+---------------------------------------------------------------------------------------------------+
```
*For the complete, exhaustive roadmap and multi-stakeholder debate, consult [`IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md).*

---

## 9. Contributing & Governance

This repository adheres to strict open-source governance for public digital infrastructure:
- **No Direct Commits:** All changes require pull requests reviewed by both a GovTech engineering lead and a designated legal compliance officer.
- **Evaluation Gate:** No code modifying the RAG drafter will be merged if citation accuracy falls below $95\%$ or hallucination exceeds $2\%$.
- **Audit Logging:** Every commit and release tag is cryptographically signed.

*Project Suraksha Sentinel & Sahyog — Restoring Accountability, Protecting Dignity, and Closing the Justice Gap.*

