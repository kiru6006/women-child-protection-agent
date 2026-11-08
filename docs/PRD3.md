# MWCD Governance Intelligence System (MWCD-GIS)
## Phase 0: Repository Discovery and Technical Assessment

### ROLE

Act as a Principal Software Architect, Government Digital Transformation Architect, Financial Systems Auditor and AI/ML Engineering Lead.

You are preparing a national-level Women and Child Development Governance Intelligence Platform for the Government of India.

The application must support all Indian States and Union Territories.

Its primary objective is to improve governance, trace public funds, monitor project delivery, identify financial leakages and improve beneficiary outcomes.

### 1. EXECUTION RULE

This is Phase 0 only.

Do not start implementing application features.

Do not create placeholder dashboards.

Do not modify or overwrite existing working application files.

First inspect the entire existing repository and establish its current technical condition.

If the repository is empty, document that finding and prepare a clean implementation foundation plan.

### 2. REPOSITORY INSPECTION

Inspect:

- Root directory and folder structure.
- Existing frontend implementation.
- Existing backend implementation.
- Package dependencies.
- Python dependencies.
- Database configuration.
- Existing database schema and migrations.
- API endpoints.
- Authentication and authorisation.
- Existing UI components.
- Routing configuration.
- Charts and mapping libraries.
- AI integrations.
- Environment configuration.
- Existing test suites.
- Docker and deployment configuration.
- README and technical documentation.

Identify reusable components and existing functionality.

Do not assume that an existing screen is functional just because its route exists.

### 3. TARGET APPLICATION ARCHITECTURE

Prepare the architecture using:

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- React Leaflet

Backend:
- Python
- FastAPI
- SQLAlchemy
- Pydantic

Database:
- PostgreSQL
- PostGIS

AI:
- Python
- Pandas
- Scikit-learn
- LangGraph

Testing:
- Pytest
- Vitest
- Playwright

Architecture:
- Modular monolith initially.
- Domain-based backend modules.
- REST API.
- Role-based and attribute-based access control.
- Centralised audit logging.
- Data provenance and verification tracking.

If the repository already uses a compatible alternative, document the trade-offs before recommending a migration.

### 4. FUNCTIONAL DOMAIN ANALYSIS

Prepare the complete domain breakdown for:

A. Ministry and governance
- Ministry
- Bureaus
- Officials
- Reporting hierarchy
- Associated organisations

B. Geographic administration
- States
- Union Territories
- Districts
- Blocks
- Institutions

C. Programmes
- Saksham Anganwadi and POSHAN 2.0
- Mission Shakti
- Mission Vatsalya

D. Financial management
- Budget
- Sanctions
- Central releases
- State contributions
- Agency releases
- Expenditure
- Utilisation certificates
- Unspent balances

E. Procurement
- Tenders
- Bidders
- Vendors
- Contracts
- Purchase orders
- Invoices
- Payments
- Delivery verification

F. Beneficiaries
- Eligibility
- Registration
- Entitlements
- Payments
- Service delivery

G. Monitoring and audit
- Project progress
- Inspections
- Audit findings
- Leakage alerts
- Corrective actions

H. AI intelligence
- Anomaly detection
- Financial reconciliation
- Duplicate detection
- Procurement intelligence
- Investigation workflows

### 5. DATA INTEGRITY REQUIREMENTS

Every dataset must support:

- Source organisation.
- Source URL.
- Source document.
- Extraction date.
- Effective date.
- Financial year.
- Verification status.
- Provenance classification.
- Data owner.
- Last updated timestamp.

Implement these classifications in the design:

1. VERIFIED OFFICIAL
2. OFFICIAL DATA, UNVERIFIED
3. SECONDARY SOURCE
4. SIMULATED
5. AI-INFERRED
6. UNDER VERIFICATION
7. DISPUTED
8. REJECTED

Never combine simulated financial transactions with actual government expenditure.

Never represent an AI-generated risk alert as confirmed fraud.

### 6. SECURITY AND ACCESS CONTROL DESIGN

Prepare the proposed permission architecture for:

- Super Administrator
- Minister
- Secretary
- Financial Adviser
- Joint Secretary
- Director
- State Secretary
- State Programme Director
- District Collector
- District Programme Officer
- CDPO
- DCPU Officer
- Project Manager
- Procurement Officer
- Internal Auditor
- External Auditor
- Data Analyst
- Public Viewer

Support national, state, district, block, project and departmental scope.

Permissions must be enforced by the backend, not only by frontend navigation.

Document special restrictions for beneficiary personal information and child protection records.

### 7. REQUIRED OUTPUT DOCUMENTS

Create a technical assessment report containing:

1. Executive summary.
2. Existing repository architecture.
3. Current implementation status.
4. Technology stack assessment.
5. Reusable components.
6. Missing functionality.
7. Database architecture proposal.
8. Domain entity relationship proposal.
9. API module proposal.
10. RBAC and ABAC design.
11. Data source and integration strategy.
12. Data provenance strategy.
13. AI leakage detection architecture.
14. Security and privacy risks.
15. Testing strategy.
16. Deployment architecture.
17. Technical risks and dependencies.
18. Recommended implementation sequence.

Save the report as:

docs/PHASE_00_REPOSITORY_ASSESSMENT.md

Also prepare:

docs/MASTER_IMPLEMENTATION_ROADMAP.md

This roadmap must contain all 26 phases, from Phase 0 to Phase 25, with dependencies and measurable acceptance criteria.

### 8. VERIFICATION

Before completing this phase:

- Confirm that repository inspection is complete.
- Verify existing frontend and backend commands.
- Identify whether the database is configured.
- Identify existing test coverage.
- Identify broken or incomplete modules.
- Confirm whether the application can currently start.
- Do not claim a test passed without executing it.
- Do not claim an integration exists without verifying it.

### 9. FINAL EXECUTION REPORT

At the end, provide:

A. What was inspected.

B. Existing functionality found.

C. What can be reused.

D. What is missing.

E. Files created.

F. Files modified, if any.

G. Commands executed and their actual results.

H. Risks and blockers.

I. Phase 0 acceptance criteria and status.

J. Phase 1 implementation scope.

Use the following status values:

- COMPLETED
- PARTIALLY COMPLETED
- PLACEHOLDER
- PENDING
- BLOCKED

Do not begin Phase 1 automatically.

Stop after Phase 0 and wait for explicit approval.

The objective is to establish a reliable technical foundation for a national government financial accountability and leakage intelligence platform, not merely generate a collection of dashboard screens.