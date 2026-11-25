# Integrated Governance, Protection, Welfare & Accountability Enhancement Audit
## Phase 1 Repository Audit, Traceability Matrix & Integration Feasibility

**Baseline Audited:** `050993d` (`women-child-protection-agent`, React 19 + Vite + TypeScript + FastAPI + SQLAlchemy/SQLite + Vitest + Pytest).  
**Constraint:** Preserve existing working MVP (Domain A Women Protection, Gap Contracts, Investigation Workspace, Zero-PII guard, SHA-256 WORM audit, Domain B `403` write lock). No fabricated official statistics; all operational case/financial/NGO/court demos are explicitly labeled `SYNTHETIC DEMONSTRATION`.

---

## 1. Existing Repository Audit Summary

| Existing Asset | Current State | Audit Verdict |
|---|---|---|
| **Routes (`src/App.tsx`)** | 31 routes (`/`, `/command-centre`, `/attention`, `/alerts`, `/women`, `/child`, `/ai-intelligence`, `/knowledge-assistant`, `/gaps`, `/investigation`, `/interventions`, `/outcomes`, `/geography`, `/ecosystem`, `/schemes`, `/knowledge`, `/evidence`, `/governance`, `/audit`, `/matter-360`, `/convergence`, `/dependencies`, `/ownership`, `/finance`, `/ngo-community`, `/excellence`, `/dashboards`, `/my-work`, `/decompose`, `/demo-flow`, `/help`) | Implemented & verified (`0` errors, `0` overflows) |
| **Domain Models (`src/types/index.ts`, `backend/app/db/models.py`)** | `EvidenceItem`, `GapContract`, `GapInvestigation`, `Intervention`, `Outcome`, `AuditEvent`, `OfficialRecord`, `AlertItem`, `DatasetEntry`, `SchemeInfo` | Extended with `Matter360`, `MatterAction`, `Dependency360`, `ResponsibilityAssignment (RACI)`, `FinancialRecord`, `NGOOrganisation`, `CommunityPartner`, `RecognitionNomination`, `DemoScenario`, and Help Knowledge Centre models |
| **Auth & Safeguarding (`backend/app/core/auth.py`, `pii_guard.py`)** | `X-User-Role` + Bearer JWT, Domain B `CHILD` `403` write lock, Zero-PII regex guard (`422`) | Preserved; role-scoped visibility enforced across Police/Litigation/NGO/Finance views |
| **Design System (`DESIGN.md`, `design-tokens.css`)** | Civic Intelligence Light + Women/Girl Child Pink + B/W high-contrast toggle, `MoreInfoButton` popups, compact icon-only header | Preserved & applied uniformly across all 31 routes |
| **Tests (`domain.test.ts`, `help.test.ts`, `backend/tests/`)** | `10/10` Vitest + `26/26` Pytest + `21/21` Playwright screenshots passing | All demo verification suites passing |

---

## 2. Enhancement Classification & Traceability Matrix

| Capability | Prompt Ref | Classification | Target Implementation |
|---|---|---|---|
| **Matter 360°** (Overview, Police, Litigation, Welfare, Finance, Ownership, NGO, Outcome) | §5 | `Requires new implementation` + `Synthetic demonstration` + `Requires data-sharing agreement` (live) | `Matter360Page.tsx` + `governanceData.ts` + 10 synthetic E2E demos |
| **Interdepartmental Convergence & Dependency Graph** | §6 | `Requires new implementation` + `Synthetic demonstration` | `ConvergencePage.tsx` (10 WCD↔Dept relationships, directional graph, cycle detection) |
| **Dependency 360°** (17 types, 10 statuses, lawful wait distinction) | §7 | `Requires new implementation` + `Synthetic demonstration` | `Dependency360Page.tsx` + `governanceStore.ts` |
| **RACI Responsibility & Ownership Centre** (Role-attached, transfer history) | §8 | `Requires new implementation` + `Synthetic demonstration` | `OwnershipPage.tsx` (Unassigned/Assigned/Overdue/Transfer history) |
| **Financial & Fund Allocation Intelligence** | §9 | `Requires new implementation` + `Synthetic demonstration` + `Requires government integration` (PFMS/Treasury) | `FinancePage.tsx` (`Allocated → Sanctioned → Released → Disbursed → Utilised → Verified`, candidate gaps without fraud labels) |
| **NGO & Community Collaboration** | §10–11 | `Requires new implementation` + `Synthetic demonstration` + `Requires legal approval` (live NGO data sharing) | `NgoCommunityPage.tsx` (Empaneled NGOs, Local Bodies/SHGs, approved activities, zero auto-PII sharing) |
| **Governance Excellence & Recognition** | §12 | `Requires new implementation` + `Synthetic demonstration` | `ExcellencePage.tsx` (Quality-gated nominations; blocks raw case-closure/arrest metrics) |
| **Independent Status Dimensions (7)** | §14 | `Requires enhancement` | `src/types/governance.ts` + `MatterStatusBadge` / independent chips |
| **Role-Based Dashboards (10 Roles)** | §15 | `Requires enhancement` + `UI only` (demo role switcher) | `RoleDashboardsPage.tsx` (Minister, Secretary, Commissioner, Collector, DWCD, Police, Legal, Finance, NGO, Auditor) |
| **Home & Command Centre Redesign** | §13, §16 | `Requires enhancement` | `HomePage.tsx` (Sections A–I compact) + `CommandCentrePage.tsx` (16 metrics + 10 filters) |
| **AI Intelligence Extension (14 Domains)** | §17 | `Requires enhancement` + `Synthetic demonstration` | `AIIntelligencePage.tsx` (evidence, source, limitations, alt explanations, human review status) |
| **10 Synthetic E2E Demos (DEMO 01–10)** | §22 | `Synthetic demonstration` | `src/data/governanceData.ts` (`DEMO-01`..`DEMO-10` linked to Matter 360°) |
| **Live CCTNS / ICJS / PFMS / e-Office APIs** | §21 | `Requires government integration` + `Requires legal approval` + `Out of current MVP scope` | Adapter registry & feasibility matrix only (no mock claims as live) |
| **Live Individual Child Case Tracking** | §24–25 | `Out of current MVP scope` + `Requires legal approval` | Disabled (`403` locked); `DEMO-05` uses aggregate/synthetic records only |

---

## 3. Integration Feasibility Matrix (§21)

| External System | Data / Scope | Feasibility Classification |
|---|---|---|
| **MoWCD Mission Shakti / OSC / 181** | Aggregate counts, OSC capacity | `Requires departmental approval` + `Requires data-sharing agreement` |
| **Police / CCTNS** | Minimum authorised FIR/investigation status | `Requires legal approval` + `Requires data-sharing agreement` + `Not currently accessible` |
| **e-Courts / ICJS / NALSA** | Public order metadata, DLSA legal aid | `Public data available` (cause lists) / `Requires legal approval` (case linkage) |
| **PFMS / State Treasury** | Scheme sanction, release, utilisation | `Requires government integration` + `File-based integration possible` |
| **data.gov.in / NCRB / UDISE+ / Census** | Official aggregate datasets | `Public data available` / `Official API available` |
| **NGO Darpan / Empaneled Registry** | Registration, empanelment, grant status | `Public data available` / `Requires departmental approval` |

---

## 4. Role & Permission Matrix (§15, §24)

| Role | Scope & Visibility | Write / Approval Authority | Restricted Data |
|---|---|---|---|
| **Minister / Principal Secretary** | Aggregate strategic KPIs, bottlenecks, briefs | Policy & escalated inter-dept decisions | No raw survivor/child PII |
| **District Collector / DM** | District Matter 360°, convergence, escalations | Sanction interventions, certify outcomes, nominate recognition | Cannot direct police investigation |
| **District WCD Officer** | Assigned matters, welfare, referrals, NGO tasks | Update administrative actions & follow-ups | Read-only on court/police status |
| **Police / Legal Coordinator** | Minimum authorised police/litigation milestones | Update police/legal coordination refs | Cannot alter WCD financial sanctions |
| **Finance Officer** | Budgets, sanctions, releases, utilisation | Record sanction/release milestones | Cannot approve payments autonomously via AI |
| **NGO Partner** | Assigned approved activities only | Submit activity delivery evidence | Zero access to unrelated matters or PII |
| **Auditor** | WORM SHA-256 ledger, financial & evidence trail | Flag compliance exceptions | Read-only on operational workflows |
