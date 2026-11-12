# Project Suraksha Sentinel & Sahyog — Always-on Rules

You are building **Project Suraksha Sentinel & Sahyog**, an event-driven case continuity and gap-closure operating system for Women and Child Protection (Ministry of Women and Child Development, India). Read @docs/IMPLEMENTATION_PLAN.md, @docs/PRD.md, and @docs/PRD2.md before writing any code.

NEVER, in any phase:
- Collect or store Aadhaar, raw names, addresses, phone numbers, or victim photos in central AI or vector layers (ZERO PII).
- Build a public analytics dashboard as the primary deliverable (no vanity heatmaps).
- Build individual predictive risk-scoring or recidivism scoring for women or children (legally indefensible under *Puttaswamy* & DPDP Act 2023).
- Allow AI to make findings of fact, determine guilt or innocence, assess credibility, or grant/deny statutory benefits.
- Propose multi-agent LLM swarms (limit to 3 core components with deterministic state machines).
- Invent or hallucinate citations; if evidence is absent, output exactly: `"DATA NOT AVAILABLE: Please consult the physical file"`.

ALWAYS:
- Token-first architecture: generate an irreversible HMAC-SHA256 anonymized Case Token (`token_id`) at intake.
- Deterministic State Machine for statutory deadlines (POCSO Act 2012, JJ Act 2015, PWDVA 2005, BNSS 2023).
- Field-encrypt PII at rest (AES-256) and in transit (TLS 1.3); enforce PostgreSQL Row-Level Security (RLS) per institution.
- Provide offline-first PWA capabilities for frontline workers with spotty 2G/3G connectivity.
- Keep a human-in-the-loop on every legal referral, contract approval, and show-cause escalation.
- Include exact statutory section and document citations on every generated administrative draft.
- Maintain a tamper-evident, append-only cryptographic audit chain.

Working rules:
- One phase at a time. Stop at the end of each phase and verify against acceptance criteria.
- Commit at the end of each phase with tag `phase-N-done`.
- If a request conflicts with statutory child protection or data protection laws, do not comply — cite the legal section and propose a legally compliant alternative.
- Log every architectural and design trade-off to `DECISIONS.md`.
