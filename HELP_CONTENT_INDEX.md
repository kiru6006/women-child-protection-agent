# Help & Platform Knowledge Centre — Content Index

**Version:** `v2.0 (2026-11-25)`  
**Route:** `/help` (GitHub Pages SPA compatible under `/women-child-protection-agent/help`)  
**Page Title:** Help & Platform Knowledge Centre  

## Architecture & Modular Files

- `src/data/help/types.ts` — TypeScript types (`HelpAvailability`, `HelpCategoryId`, `HelpCategoryMeta`, `HelpProblemMapping`, `HelpRoleGuide`, `HelpDeptGuide`, `HelpWorkCategory`, `HelpIssueGuide`, `HelpScreenEntry`, `HelpWalkthrough`, `MindmapNode`, `HelpFaqItem`, `HelpGlossaryItem`, `OnboardingPath`)
- `src/data/help/categories.ts` — `HELP_VERSION`, 30 `HELP_CATEGORIES`, 18 `PROBLEM_SOLUTIONS` (`Problem → Gap → Solution → Responsible Authority → Outcome`)
- `src/data/help/guides.ts` — `HELP_ROLES`, `HELP_DEPARTMENTS`, `HELP_WORK_CATEGORIES`, `HELP_ISSUES`
- `src/data/help/catalogues.ts` — 18 `LIFECYCLE_STEPS`, 31 `HELP_SCREEN_DIRECTORY` entries, 8 `HELP_WALKTHROUGHS`, `PLATFORM_MINDMAP`, `HELP_FAQS`, `HELP_GLOSSARY`, 4 `ONBOARDING_PATHS`
- `src/features/help/HelpInteractiveViews.tsx` — Interactive diagrams, search/filterable directories, expandable mappings, mindmap tree, FAQ & glossary views
- `src/features/help/HelpPage.tsx` — Main Knowledge Centre page (Section A Intro, Section B Local Structured Search, 30-category progressive disclosure, Related Screens & Guided Onboarding)
- `src/tests/help.test.ts` — Vitest route-validation and data-integrity suite

## 30 Knowledge Categories

1. `about` — About the Platform (includes 11-step Value Flow diagram & Statutory Non-Replacement notice)
2. `purpose` — Purpose and Vision
3. `problems` — Government Problems (18 structured `Problem → Gap → Solution → Authority → Outcome` mappings)
4. `gap-intelligence` — Gap Intelligence (18-step protection lifecycle)
5. `solutions` — Proposed Solutions
6. `architecture` — Platform Architecture (Interactive Mindmap + System Stack)
7. `roles` — Understand by Role (stakeholder role guides)
8. `departments` — Understand by Department (11 government departments & bodies)
9. `work-categories` — Understand by Category of Work (10 operational workstreams)
10. `issues` — Understand by Issue (11 protection & welfare issue guides)
11. `women-protection` — Women Protection (`AVAILABLE` / Domain A MVP)
12. `child-protection` — Child Protection (`AVAILABLE` / Domain A MVP)
13. `matter-investigation` — Matter and Investigation
14. `ownership` — Ownership and Accountability
15. `convergence` — Government Convergence
16. `police-litigation` — Police and Litigation Coordination
17. `finance` — Finance and Resources
18. `ngo-community` — NGO and Community Collaboration
19. `ai-intelligence` — AI Intelligence (Human-led gate boundaries)
20. `progress-monitoring` — Progress Monitoring
21. `alerts-escalation` — Alerts and Escalation
22. `outcomes-recognition` — Outcomes and Recognition
23. `directory` — Government Directory
24. `knowledge-data` — Knowledge and Data
25. `screen-guide` — Application Screen Guide (31 screens with availability badges & direct links)
26. `demonstrations` — End-to-End Demonstrations (8 synthetic scenario walkthroughs)
27. `governance-security` — Governance, Privacy and Security (Zero-PII, Domain B `403`, Human Gates, WORM)
28. `faq` — Frequently Asked Questions
29. `glossary` — Glossary
30. `implementation-status` — Current Implementation Status

## Capability Classification Badges

- `AVAILABLE` — Active PoC UI and/or local backend service in current build
- `DEMONSTRATION ONLY` — Simulated/synthetic workflow for orientation & review
- `UNDER DEVELOPMENT` — Partial scaffold; awaiting backend completion
- `PLANNED` — Roadmap item
- `REQUIRES GOVERNMENT INTEGRATION` — Needs live CCTNS, e-Courts, PFMS, or state MIS API
- `REQUIRES LEGAL OR ADMINISTRATIVE APPROVAL` — Needs statutory/notification/MoU clearance

## Maintenance

When adding new routes to `src/App.tsx` or updating synthetic scenarios, update `src/data/help/catalogues.ts` and re-run `npm test` (`src/tests/help.test.ts`) to ensure zero broken Help links.
