# Code Review Feedback — WCD Protection Intelligence Platform

**Reviewed commit:** `4451aa7` (`main`) · **Review date:** 2026-11-25
**Scope:** React/TypeScript frontend, FastAPI/SQLAlchemy/Alembic backend, PostgreSQL design, CI/CD, security, privacy, accessibility, testing, documentation.

> [!IMPORTANT]
> **How to read this document.** This is a *static, evidence-based review* of the repository. Findings cite files I opened or commands I ran (`grep`, `wc`, `git ls-files`). It is **not** a substitute for a formal external audit: no penetration test, no dynamic scanning, no dependency CVE scan, no load test, no legal opinion and no runtime review against a real PostgreSQL instance was performed. Where a claim could not be verified it is marked **UNVERIFIED**. The "Internal / External audit" sections list what an auditor would raise and what evidence they would ask for; they are not certifications.

---

## 1. Executive Summary

| Dimension | Rating | One-line verdict |
|---|---|---|
| Overall maturity | **Prototype / demo-grade** | Solid structure and good domain invariants; not deployable to real beneficiaries as-is. |
| Backend design | 6.5 / 10 | Clean layering, good state-machine and Zero-PII ideas; auth model and audit-chain concurrency are the main gaps. |
| Frontend design | 6.5 / 10 | Strict TypeScript, good component reuse; very large static data files, little test coverage, `any` usage. |
| Database / PostgreSQL | 4.5 / 10 | Schema is reasonable, but RLS is DDL-only (never exercised), timestamps are strings, no FK constraints observed. |
| Security | 4 / 10 | Fails fundamental controls for production: unauthenticated token issuance, default secret, header-based auth on by default. |
| Privacy / DPDP | 5.5 / 10 | Strong *intent* (pseudonymous tokens, PII regex guard); regex guard is weak and name/address are undetected. |
| Testing | 4 / 10 | 28 pytest + 10 vitest pass; no coverage measurement, no component/E2E tests in the repo. |
| CI/CD | 3.5 / 10 | Single deploy workflow publishes to Pages **without** running tests. |
| Accessibility | 5.5 / 10 | Contrast sweep and responsive audit done; no automated a11y test, `aria-` used in only 16 files. |
| Documentation | 7 / 10 | Extensive; but some docs assert capabilities more strongly than the code supports (see §5.3). |

**Top 5 must-fix before any real-data pilot**

1. `POST /auth/token` mints a valid token for **any** role with **no credential** ([router.py `issue_dev_or_sso_token`](backend/app/api/v1/router.py)). Any caller can become `DISTRICT_COLLECTOR`.
2. `SECRET_SALT` defaults to a hard-coded string and `DEV_HEADER_AUTH_ENABLED` defaults to `true` ([config.py](backend/app/core/config.py)). Fail-open defaults.
3. Audit ledger is **not concurrency-safe** and its "WORM" claim is unenforced at DB level ([audit_service.py](backend/app/services/audit_service.py)).
4. PostgreSQL RLS policies in migration `0002` depend on a session setting (`app.active_domain`) that **nothing in the code ever sets**; the app also creates tables with `create_all` rather than Alembic ([database.py](backend/app/db/database.py)).
5. CI deploys on every push to `main` with no test, lint, type-check, or security-scan gate ([deploy.yml](.github/workflows/deploy.yml)).

---

## 2. Findings by Technology Stack

Severity legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Low / Hygiene

### 2.1 Python / FastAPI (backend)

| # | Sev | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| B1 | 🔴 | **Unauthenticated token issuance.** Endpoint accepts `role`, `district`, `domain` from the request body and signs a token. Role is client-asserted. | `router.py` → `issue_dev_or_sso_token` calls `issue_access_token(payload.role, …)` with no credential check. | Gate behind `DEV_HEADER_AUTH_ENABLED` *and* an environment check, or remove. In production, accept only tokens from the Government SSO/OIDC IdP; validate `iss`, `aud`, `exp`, `nbf`, `kid`. |
| B2 | 🔴 | **Fail-open secret and auth defaults.** | `config.py`: `SECRET_SALT` default `"dev-only-local-salt-change-in-prod"`; `DEV_HEADER_AUTH_ENABLED` default `"true"`. | Fail startup if `SECRET_SALT` is the default or < 32 bytes when `ENV=production`. Default dev-header auth to `false`. |
| B3 | 🟠 | **Hand-rolled JWT.** HS256 implemented manually with `hmac`; no `kid`, `iss`, `aud`, `nbf`, no key rotation; the exception message (`f"Invalid or expired Bearer token: {exc}"`) leaks validation internals. | `auth.py` lines 44–86. | Use `PyJWT`/`authlib`. Return a generic 401 message. Plan asymmetric (RS256/ES256) verification against the IdP's JWKS. |
| B4 | 🟠 | **Many read endpoints appear unauthenticated.** 23 `GET` handlers vs 11 uses of `get_actor_context` in `router.py`. | `list_gaps`, `list_evidence`, `list_interventions`, `list_outcomes`, `list_datasets`, `list_officials`, `list_alerts` take only `db`. *(Per-endpoint check not exhaustive — UNVERIFIED for each.)* | Apply an auth dependency at router level; enforce role/domain/district scoping on reads (RBAC is currently mostly write-side). |
| B5 | 🟠 | **Audit chain race condition.** Event id is `f"AUD-{count + 900}"`, `previous_hash` read from the "last" row, in a separate session from the business transaction. Two concurrent writes can fork the chain or collide on id. | `audit_service.py` `append_event`. | Use a DB sequence for `block_index`; take a row/advisory lock (`SELECT … FOR UPDATE` / `pg_advisory_xact_lock`) while reading the tail; write the audit row in the *same* transaction as the business change. |
| B6 | 🟠 | **"WORM" is not enforced.** Nothing prevents `UPDATE`/`DELETE` on `audit_chain`; the genesis hash is a fixed constant; chain has no external anchor. | `audit_service.py`, models. | PostgreSQL: revoke `UPDATE/DELETE` from the app role, add a trigger that raises on mutation, periodically anchor the head hash externally (e.g., signed daily digest). Rename claim to "tamper-evident" until enforced. |
| B7 | 🟡 | **Zero-PII guard is a regex denylist.** The Aadhaar pattern matches *any* 12-digit number (false positives) and will miss spaced/obfuscated forms; names, addresses, DOBs, caste, case narratives are not detected. Domain scope is checked but free-text fields are the real risk. | `pii_guard.py`. | Treat as a defence-in-depth *tripwire*, not a control. Add Verhoeff checksum for Aadhaar, structured-field allow-lists, max lengths, and a DPIA-driven data dictionary of fields that may hold free text. |
| B8 | 🟡 | **Unbounded list queries.** `db.query(Model).all()` then Python-side filtering; no pagination, `limit`, or ordering. | `router.py` `list_gaps`, etc. | Push filters into SQL, add `limit/offset` or keyset pagination, and response-size caps. |
| B9 | 🟡 | **Router modules are large** (`router.py` 680 lines, `execution_router.py` 670) mixing schemas, mapping, and handlers. | `wc -l`. | Split per resource (`routers/gaps.py`, …), move Pydantic models to `schemas/`, move `*_to_dict` mappers to `response_model`/`from_attributes`. |
| B10 | 🟡 | **`HTTP_422_UNPROCESSABLE_ENTITY` deprecation** surfaced in pytest warnings. | pytest warning summary. | Use `HTTP_422_UNPROCESSABLE_CONTENT`. |
| B11 | 🟡 | **Unpinned dependencies.** `requirements.txt` uses `>=` for every package, including `pytest`/`httpx` (test deps in runtime file). | `backend/requirements.txt`. | Pin with a lock file (`pip-tools`/`uv`), split `requirements-dev.txt`, run `pip-audit` in CI. |
| B12 | 🟡 | **CORS `allow_headers=["*"]` with `allow_credentials=True`.** Origins are explicit (good), but headers are wide. | `main.py`. | List required headers explicitly (`Authorization`, `Content-Type`, `X-User-Role` only in dev). |
| B13 | 🟡 | **No rate limiting, request-size limits, security headers, or structured logging / request IDs.** | `main.py`. | Add `slowapi`/gateway limits, `secure`-style headers, JSON logging with correlation id; never log request bodies. |
| B14 | 🔵 | `ActorContext.district`/`domain` are taken from headers in dev mode and trusted. | `auth.py` `get_actor_context`. | In production derive from token claims only. |
| B15 | 🔵 | Phase 3 adapters (`PgVectorAdapter`, `LocalLLMAdapter`) are **scaffolds with no behaviour** and are not wired into `RAGService`. | `rag_service.py` tail. | Either wire and test them or label as stubs in code and docs. |
| B16 | 🔵 | Positive: deterministic state machines, human-gate role checks, Domain B `403` lock, tamper-detection test, consistent `404` helper (`_get_or_404`) introduced. | `gap_state_machine.py`, `execution_engine.py`, tests. | Keep; extend `_get_or_404` to remaining handlers (several still hand-roll the lookup/404). |

### 2.2 PostgreSQL / SQLAlchemy / Alembic

| # | Sev | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| D1 | 🟠 | **RLS is declared but inert.** Policies use `current_setting('app.active_domain', true)`; the policy treats `NULL` as "allow all", and no code calls `SET LOCAL app.active_domain`. Net effect: RLS would permit everything. Table owner also bypasses RLS unless `FORCE ROW LEVEL SECURITY`. | `0002_continuity_m17_m18_and_rls.py`; grep shows no `set_config`/`SET LOCAL` in `backend/`. The `domain` column's existence on `matters` and `gap_contracts` was **not verified** against the models. | Set `SET LOCAL` per request from the verified token; make missing setting **deny**; use `FORCE ROW LEVEL SECURITY`; use a non-owner app role; add a Postgres-backed integration test that proves cross-domain reads are blocked. |
| D2 | 🟠 | **Schema is created by `create_all`, not Alembic**, so migrations (including RLS) are never exercised by the app/tests. | `database.py` `init_db`. | Run `alembic upgrade head` on startup/in CI; remove `create_all` outside tests; add a migration test against Postgres. |
| D3 | 🟡 | **Timestamps are `String` columns** (`created_at`, `updated_at`, `timeline_date`, …). No native `timestamptz`, no ordering/index guarantees, timezone ambiguity. | `models.py` (`Column(String(64))` for dates). | Use `DateTime(timezone=True)` / `Date`; default via `server_default=func.now()`. |
| D4 | 🟡 | **No foreign keys observed** between `actions.matter_id`, `dependencies.matter_id`, `notifications.matter_id`, `ground_truth_callbacks.case_token`, etc. | `models.py`. | Add FKs with `ON DELETE RESTRICT`, indexes on FK columns; enforce referential integrity in the DB, not only in code. |
| D5 | 🟡 | **Booleans stored as `Integer`** (`acknowledged`, `is_lawful_wait`, `is_synthetic`, `discrepancy_flag`). | `models.py`. | Use `Boolean`. |
| D6 | 🟡 | **Enumerations are free strings** (statuses, roles, channels). Validity is enforced only in Python. | `models.py`, routers. | Use `CHECK` constraints or native enums; keep Pydantic `Literal`/`Enum` in sync. |
| D7 | 🟡 | **Weak ID generation.** `f"GT-{count()+1:03d}"` is race-prone and non-unique under concurrency. | `execution_router.py` `create_ground_truth_callback`. | Use sequences / UUIDv7 or DB-generated identity. |
| D8 | 🔵 | SQLite dev default means test behaviour differs from Postgres (no RLS, weaker typing, `check_same_thread=False`). | `database.py`, `conftest.py`. | Run the pytest suite against Postgres in CI (service container). |
| D9 | 🔵 | `conftest.py` seeds a **shared on-disk DB** for the whole session (`wcd_protection.db`); tests are order-dependent and can leak state. | `conftest.py`. | Use per-test transactions/rollback or an ephemeral DB. |

### 2.3 React 19 / TypeScript / Vite (frontend)

| # | Sev | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| F1 | 🟠 | **Dead code shipped as a feature.** `offlineQueue.ts` is not referenced anywhere (0 usages outside its own file) and the service worker caches GETs with fetch-then-cache fallback only; there is **no replay/sync** of queued writes. The docs describe an "offline sync queue". | `grep` for `enqueueOfflineAction|getOfflineQueue` outside the file → 0. | Either wire it into write paths with replay-on-reconnect and conflict handling, or remove it and correct the docs. |
| F2 | 🟠 | **Service worker risk.** It caches any successful same-origin GET, including API responses, indefinitely, with no versioned cleanup of old caches, no exclusion of `/api/` and no cache size bound. Beneficiary-adjacent data could persist on shared devices. | `public/sw.js`. | Cache only static shell assets; exclude API routes; delete old caches in `activate`; never cache authenticated responses. |
| F3 | 🟡 | **`localStorage` queue stores request payloads.** Even if Zero-PII is intended, there is no enforcement/encryption and it persists on shared kiosk devices. | `offlineQueue.ts`. | Run `reject_raw_pii`-equivalent on enqueue, use IndexedDB with expiry, clear on logout. |
| F4 | 🟡 | **Silent failure patterns.** 4 empty `catch {}` blocks; API layer falls back to mock data on error (`api.ts`), which can mask outages and present synthetic data as live if the banner logic regresses. | `grep "catch {}"`, `api.ts` lines ~140, ~266. | Surface errors (toast/inline), centralise error handling, keep the "SYNTHETIC / OFFLINE" banner as a tested invariant. |
| F5 | 🟡 | **`any` usage (23 occurrences)** and `icon: any` in navigation types. | `grep ": any\|as any"`. | Replace with `LucideIcon`/typed errors (`unknown` + narrowing). Enable `@typescript-eslint/no-explicit-any`. |
| F6 | 🟡 | **No ESLint/Prettier/format config; no `lint` script.** `tsc` strict + `noUnused*` is on (good) but style/hooks rules are unenforced. | `package.json` scripts. | Add ESLint (`react-hooks`, `jsx-a11y`, `@typescript-eslint`), Prettier, Husky/lint-staged. |
| F7 | 🟡 | **Very large static data modules** (`governanceData.ts` 1,422 lines; `platformData.ts` 539; help data ~1,100) are bundled into the main chunk (Vite warns: main JS ≈ 736 kB, ≈ 196 kB gzip). | build output, `wc -l`. | Route-level code splitting (`React.lazy`), dynamic import of help/governance data, `manualChunks`. |
| F8 | 🟡 | **API base URL duplicated** as `const API_BASE = import.meta.env… || 'http://127.0.0.1:8000/…'` across pages, bypassing the `services/api.ts` layer (pages call `fetch` directly). | `grep` shows `VITE_API_BASE_URL` in 4 places; `CommandCentrePage`, `AlertsPage`, `MyWorkPage` use `fetch`. | Single typed API client with timeout, retry, auth header injection, and error mapping; remove page-level `fetch`. |
| F9 | 🟡 | **Role is a client-side dropdown** that sets `X-User-Role`. In production this must be derived from the session; UI gating alone is not security. | `Header.tsx`, `appStore.ts`. | Treat UI role switch as demo-only; hide in production builds. |
| F10 | 🟡 | **Ask AI "AI" is keyword/token scoring over static content** with epistemic badges; it is not an LLM. Labelling is honest in code but the name and UX may imply more. | `AskAIDrawer.tsx`. | Add an explicit "rule-based assistant (no generative AI)" label to avoid user over-trust. |
| F11 | 🔵 | Duplicated badge helpers (`getStatusBadge` in pages), repeated mock arrays partly centralised in `workflowSeedData.ts` (good) but `mockData.ts`, `platformData.ts`, `governanceData.ts`, and `backend/app/data/seed_data.py` + `db/seed.py` still duplicate IDs (`GAP-W-PATNA-001`, `MTR-2026-W-001`, `CASE-DV-2026-PAT-0842`) across 20+ files. | `grep` of IDs. | Single source of truth: generate FE fixtures from backend seed (or shared JSON) and import IDs from constants. |
| F12 | 🔵 | `Number(e.target.value) || 0` style coercions without bounds validation on user input. | `OutcomesPage.tsx`, `InvestigationPage.tsx`. | Validate ranges client-side and rely on server validation. |
| F13 | 🔵 | Positive: `strict` TS, centralised stores (Zustand), reusable `Card`/`PageHeader`/badge components, route-integrity test for Help data, responsive audit across 31 routes × 4 viewports. | `tsconfig.json`, `help.test.ts`, Playwright script. | Keep. |

### 2.4 Testing & QA

| # | Sev | Finding | Recommendation |
|---|---|---|---|
| T1 | 🟠 | **No coverage measurement** for either stack; claims of "26/26", "28/28", "10/10" are *pass counts*, not coverage. | Add `pytest --cov` and `vitest --coverage`; set a threshold (start at 60 %, ratchet). |
| T2 | 🟠 | **Frontend has 2 test files** (domain invariants, Help route integrity). No component tests (React Testing Library), no store tests, no Ask AI tests. | Add RTL tests for critical flows (role switch, approval gates, offline banner, Ask AI answers). |
| T3 | 🟡 | **Playwright script is a screenshot/overflow check, not an assertion suite**; it lives in `scripts/`, runs against `vite preview`, and requires manual invocation. | Convert to `@playwright/test` specs with assertions (a11y via `axe`, visual regression), run in CI. |
| T4 | 🟡 | **Backend security tests are thin:** no tests for unauthenticated token issuance, expired/forged tokens, cross-role access on reads, SQL-injection style inputs, oversized payloads. | Add negative/abuse tests per OWASP API Top 10. |
| T5 | 🟡 | **No property/concurrency tests** for the audit chain or ID generation. | Add a threaded test that appends N events concurrently and verifies chain integrity. |

### 2.5 DevOps / CI-CD

| # | Sev | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| O1 | 🟠 | **Deploy job has no quality gate.** It runs `npm ci && npm run build` only (type-check via `tsc -b`), then publishes. No `npm test`, no backend tests, no lint, no audit. | `deploy.yml`. | Add a `verify` job (vitest, pytest, `npm audit --omit=dev`, `pip-audit`, CodeQL/Semgrep) and make deploy depend on it. |
| O2 | 🟡 | **`permissions: contents: write`** at workflow level and a third-party action (`peaceiris/actions-gh-pages@v4`) pinned by tag, not SHA. | `deploy.yml`. | Prefer the official Pages actions with `pages: write`/`id-token: write`; pin third-party actions to commit SHAs; scope permissions per job. |
| O3 | 🟡 | **No Dockerfile / compose / IaC** for the backend; no health/readiness distinction; no environment matrix (dev/stage/prod). | repo root listing. | Add container build, `.env.example`, non-root user, health probes, and a staged config model. |
| O4 | 🟡 | **No Dependabot/Renovate**, no SBOM, no licence scan. | `.github/`. | Enable Dependabot, generate CycloneDX SBOM, run licence check (relevant for a government deliverable). |
| O5 | 🔵 | Repo hygiene: build output and local DB exist on disk but are git-ignored (good — `git ls-files` shows none tracked). `tsconfig.tsbuildinfo` is ignored via `*.tsbuildinfo`. | `.gitignore`, `git ls-files`. | Keep; add `.env*` to `.gitignore` explicitly (currently only `*.local` is covered). |

### 2.6 UX, Accessibility & Content

| # | Sev | Finding | Recommendation |
|---|---|---|---|
| A1 | 🟡 | Only **16 source files** contain `aria-` attributes across ~30 pages and many interactive widgets; icon-only header buttons rely on `aria-label` + CSS tooltips that are `hidden` on `<sm`, so **touch users get no label** except `aria-label` (screen-reader only). | Add visible text or long-press tooltips on mobile; add `aria-live` for Ask AI responses; ensure focus trap/Escape for the Ask AI panel. |
| A2 | 🟡 | Hover-only tooltips (`group-hover`) are not keyboard-reachable (no `group-focus-visible`). | Add `focus-visible` variants and `role="tooltip"`/`aria-describedby`. |
| A3 | 🟡 | No automated WCAG checks; contrast was swept manually. | Add `jest-axe`/Playwright `axe-core` in CI. |
| A4 | 🔵 | Ask AI is a fixed bottom-right overlay; on 375 px width the open panel can cover content and the bottom controls. | Provide a bottom-sheet pattern on mobile and respect `prefers-reduced-motion`. |

---

## 3. Domain, Privacy & Governance Review

### 3.1 Data protection (DPDP Act 2023 / sector rules) — *engineering view, not legal advice*

| # | Sev | Observation | Recommendation |
|---|---|---|---|
| P1 | 🟠 | The platform stores **free-text** fields (`note`, `evidence_notes`, `consent_status`, case narratives). A regex denylist cannot guarantee absence of personal data. | Replace free text with coded values wherever possible; document remaining free-text fields in a data dictionary; add minimisation and retention limits. |
| P2 | 🟠 | **Consent** (M18) is a mutable string on `continuity_tokens`. There is no immutable consent event log (who/when/scope/witness), nor withdrawal propagation to downstream stores. | Model consent as append-only events with scope, purpose, timestamp, actor; derive current state. |
| P3 | 🟡 | **Retention/erasure** is documented in `docs/04` but there is no implementation (no TTL jobs, no erasure endpoint, no legal-hold logic). | Implement retention policies and erasure workflow; test them. |
| P4 | 🟡 | Pseudonymisation relies on token format convention; there is no token service, re-identification control, or key management shown. | Introduce a token vault (HMAC with rotating keys held in HSM/KMS) and access-logged re-identification. |
| P5 | 🔵 | Good: Domain B (child) write lock, no individual risk scoring, human approval gates for sanction/approval/closure. | Keep; add automated tests that no endpoint can create child case data. |

### 3.2 AI governance

| # | Sev | Observation | Recommendation |
|---|---|---|---|
| G1 | 🟡 | RAG is in-memory keyword/cosine retrieval over hard-coded chunks; citations are static strings. "A1–A4 AI at temperature 0" is documented but **no model is invoked**. | Keep claims precise ("deterministic retrieval prototype"). When a model is added, log prompts/outputs with hashes, evaluate citation accuracy, and red-team prompt injection. |
| G2 | 🔵 | Prompt-injection refusal is regex-based (`PROHIBITED_INJECTION_PATTERNS`). | Treat as a basic guard; add allow-listed intents and output validation. |

---

## 4. Audit Perspectives

### 4.1 Internal Audit (engineering/quality/compliance function)

| Control area | Status | Gap / evidence an auditor would request |
|---|---|---|
| Access control | ❌ Not production-ready | Role is client-asserted; token endpoint unauthenticated; read endpoints largely open. Provide SSO integration and authZ matrix tests. |
| Segregation of duties | 🟡 Partial | Human-validator role set exists; AI role cannot approve. Need maker-checker enforcement and tests for each approval path. |
| Change management | ❌ | No branch protection/PR review evidence in repo; direct pushes to `main` auto-deploy. |
| Logging & monitoring | 🟡 | Business audit chain exists; no operational/security logging, alerting, or SIEM integration. |
| Data integrity | 🟡 | Hash chain with verification endpoint; concurrency and immutability gaps (B5, B6). |
| Backup/DR | ❌ Not evidenced | No RPO/RTO, backup, or restore test. |
| Vulnerability management | ❌ Not evidenced | No dependency scanning, SAST, or SBOM in CI. |
| Documentation accuracy | 🟡 | See §5.3 — several statements over-claim vs implementation. |

### 4.2 External Audit (independent assurance: CERT-In-empanelled VAPT, STQC, CAG-style)

| Expected test | Likely outcome today | What to prepare |
|---|---|---|
| OWASP API Top 10 (BOLA, broken auth, excessive data exposure, no rate limiting) | **Fail** on API1/API2/API4/API5 (object-level auth on reads, token minting, unbounded lists, function-level auth) | Fix B1–B4, B8, B13; supply an authZ matrix and negative test evidence. |
| Authentication & session review | **Fail** (default secret, header auth, self-issued tokens) | SSO integration, key management, token lifetimes/revocation. |
| Cryptography review | **Fail/Observation** (HS256 custom JWT, constant genesis hash, no KMS) | Use vetted libraries, KMS/HSM keys, rotation policy. |
| Infrastructure/hosting (NIC MeghRaj / SDC) | **Not assessable** | Hardening baseline, network segmentation, TLS 1.2+/1.3, WAF, secrets management. |
| Privacy/DPIA | **Not assessable** | DPIA, data-flow diagrams, legal basis, retention schedule (`G04`, `G05`, `G06`). |
| Accessibility (GIGW 3.0 / WCAG 2.1 AA) | **Observation** | Add automated + manual assistive-tech testing; publish accessibility statement. |
| Source-code review (SAST) | Not performed | Run Semgrep/CodeQL/Bandit/ESLint-security; remediate findings. |

---

## 5. Cross-Cutting Observations

### 5.1 What is genuinely good
- Clear domain separation and explicit guardrails (Domain B lock, human gates, no individual risk scoring).
- Deterministic state machines for gaps and actions with tests, including negative cases.
- Strict TypeScript, shared stores, and a reasonable component library; route-integrity test for Help data prevents broken links.
- Responsive behaviour verified across 31 routes at 4 viewports (`0` horizontal overflows) and recorded in `SCREENSHOT_INDEX.md`.
- Honest synthetic-data labelling in UI and docs.

### 5.2 Duplication and structure
- Identifiers and narrative strings (`MTR-2026-W-001`, `GAP-W-PATNA-001`, `CASE-DV-2026-PAT-0842`, "Rs. 10,000 tranche", "36% → 85%") recur across frontend data, Help content, backend seeds, and tests. Create a single fixtures package and import constants to avoid drift.
- Frontend and backend maintain **two independent copies** of the demo dataset (`src/data/*.ts` vs `backend/app/db/seed.py`/`data/seed_data.py`), so UI and API can diverge silently.

### 5.3 Documentation vs implementation (claims that need tightening)

| Claim in docs/README/UI | Reality found in code | Suggested wording |
|---|---|---|
| "Immutable / WORM SHA-256 audit chain" | Hash-chained, tamper-*evident*; not DB-enforced immutable; not concurrency-safe | "Tamper-evident hash-chained audit log (immutability enforcement pending)" |
| "PostgreSQL RLS" (migration `0002`) | DDL present; never activated or tested; app uses `create_all` | "RLS policies drafted; activation and tests pending" |
| "Offline PWA sync queue" | Queue helper unused; no replay | "Offline shell caching only; sync queue not wired" |
| "Bounded AI A1–A4 at temperature 0" | No model invoked; deterministic keyword/cosine retrieval | "Deterministic retrieval prototype; LLM integration pending" |
| "Signed Bearer JWT / RBAC" | Self-issued tokens from an open endpoint; HS256 shared secret | "Development-only token issuance; production SSO pending" |
| "Pgvector / Local LLM adapters" | Empty scaffolds | "Interface placeholders (not functional)" |

---

## 6. Prioritised Remediation Roadmap

| Priority | Action | Effort | Owner |
|---|---|---|---|
| **P0 (before any real data)** | Remove/guard `/auth/token`; fail-closed secret & auth defaults; derive identity from IdP-issued tokens; apply auth to all reads; generic auth errors | M | Backend/Security |
| **P0** | Make audit append atomic (sequence + lock + same transaction); enforce append-only in Postgres; anchor head hash | M | Backend/DBA |
| **P0** | Add CI gate: tests + lint + `npm audit` + `pip-audit` + SAST; protect `main` with required reviews | S | DevOps |
| **P1** | Activate RLS end-to-end (request-scoped `SET LOCAL`, deny-by-default, `FORCE RLS`, non-owner role) and run migrations via Alembic; Postgres-backed tests | M | DBA/Backend |
| **P1** | Schema hardening: `timestamptz`, FKs, `Boolean`, `CHECK`/enums, generated IDs | M | DBA |
| **P1** | Pagination, SQL-side filtering, rate limiting, request-size limits, security headers, structured logging | M | Backend |
| **P1** | Service worker scope fix (exclude API, cache hygiene); wire or remove offline queue | S | Frontend |
| **P2** | Code-splitting and data lazy-loading; single API client; remove page-level `fetch`; ESLint/Prettier/jsx-a11y | M | Frontend |
| **P2** | Coverage thresholds; RTL component tests; Playwright assertions + axe; concurrency tests | M | QA |
| **P2** | Single-source fixtures shared by UI, API and tests; split large routers | M | Full-stack |
| **P3** | Consent event log, retention/erasure jobs, token vault with KMS | L | Backend/Privacy |
| **P3** | Dockerfile, `.env.example`, Dependabot, SBOM, licence scan, DR plan (RPO/RTO) | M | DevOps |

---

## 7. Method, Limits and Reproducibility

**Evidence gathered**
- Read in full: `backend/app/core/auth.py`, `config.py`, `pii_guard.py`, `backend/app/services/audit_service.py`, `backend/app/db/database.py`, `backend/app/main.py`, `backend/tests/conftest.py`, `.github/workflows/deploy.yml`, `package.json`, `backend/requirements.txt`.
- Sampled: `backend/app/db/models.py`, `execution_router.py`, `router.py`, `rag_service.py`, `src/pages/*`, `AskAIDrawer.tsx`, `offlineQueue.ts`, `public/sw.js`.
- Commands: `grep` for `: any|as any` (23), empty `catch {}` (4), `aria-` (16 files), `AbortSignal.timeout` (22), `enqueueOfflineAction|getOfflineQueue` outside its module (0), `set_config|SET LOCAL` in backend (none found); `git ls-files` for tracked artefacts (none); `wc -l` for file sizes.
- Test status at review time: `npm test` 10/10, `pytest` 28/28, `npm run build` passes (`tsc -b && vite build`).

**Not performed (would be required for formal assurance):** dynamic testing/pen-test, dependency CVE scanning, SAST tooling, performance/load testing, PostgreSQL runtime validation of migrations/RLS, accessibility testing with assistive technology, threat model workshop, legal review.

**Verification note:** I did not open every file; findings marked **UNVERIFIED** (e.g., per-endpoint authentication on all `GET` routes, `domain` column presence on RLS-targeted tables) should be confirmed by the owning engineer before being logged as defects.
