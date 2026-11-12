# WCD Protection Intelligence Platform — System Rules & Invariants

## Core Principles
1. **NOT a generic dashboard**: Investigation Workspace is the primary operational UI, not 20-card vanity dashboards or district leaderboards.
2. **Domain Separation**:
   - **Domain A**: Women Protection Intelligence (Functional MVP)
   - **Domain B**: Child Protection Intelligence (Architecture-Ready Placeholder only in Phase 1)
   - **Shared Intelligence Layer**: Evidence Library, Gap Intelligence, Investigation Workspace, Intervention Engine, Outcome Verification, Audit & Explainability.
3. **Epistemic Classification**:
   - `VERIFIED_FACT`: Supported by authoritative government documents / statutory record.
   - `INFERENCE`: Reasonable interpretation from available evidence.
   - `HYPOTHESIS`: Possible explanation that requires verification.
   - `RECOMMENDATION`: Suggested government or policy action.
   - `DATA_NOT_AVAILABLE`: Evidence is insufficient (mandatory fallback, no hallucinations).
4. **Zero PII in Central / AI Storage**:
   - All references pseudonymous (e.g. `CASE-DV-2026-PAT-0842`).
   - No individual risk scoring, no predictive policing, no guilt/credibility determinations.
5. **Golden Loop**:
   - Plan -> Implement -> Run -> Test -> Break -> Review -> Fix -> Commit.
