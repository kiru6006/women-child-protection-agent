# Code Review Feedback — WCD Protection Intelligence Platform (Demo Scope)

**Commit reviewed:** `4451aa7` · **Revision:** 2 (demo-scoped) · **Date:** 2026-11-25

> [!NOTE]
> **Scope change from revision 1.** The app is a **demo / proof of concept**, not production. Role-based authentication and security hardening were skipped on purpose. Those items are **removed from the defect list** and moved to Appendix A as "Deferred by design". This revision judges the app against the standard a demo should meet: it works, it is honest about what it is, it is easy to extend, and it will not embarrass the team in front of a reviewer.
>
> Static review only. No pen test, no CVE scan, no load test, no PostgreSQL runtime run. Evidence = files read plus `grep` / `wc` / `git ls-files`.

---

## 1. Verdict

| Area | Demo rating | Note |
|---|---|---|
| Demo completeness & flow | **9 / 10** | 31 routes, 19-step walkthrough, Help centre, Ask AI, M17/M18 mocks. |
| Frontend quality | **7 / 10** | Strict TS, shared stores, responsive (31 routes × 4 viewports, `0` overflows). Weak on lint, tests, bundle size. |
| Backend quality | **7 / 10** | Clean layering, state machines, tests pass (28). Large router files, unbounded lists. |
| Data model | **6 / 10** | Reasonable; string dates, integer booleans, no FKs. Fine for demo, costly to migrate later. |
| Honesty of claims (docs/UI) | **6 / 10** | Several docs over-claim vs code. **Biggest demo risk** (§2, item 1). |
| Testing | **5 / 10** | Pass counts only. No coverage numbers, no component tests. |
| CI/CD | **5 / 10** | Deploy runs on every push, no test gate. A bad push ships a broken public demo. |
| Accessibility | **6 / 10** | Contrast + responsive done. Tooltips hover-only, few `aria-` uses. |

**Bottom line:** strong demo. Fix the honesty gaps and two small runtime issues before showing it to anyone who will read the docs closely.

---

## 2. Top Items for a Demo (ordered by risk of embarrassment)

| # | Sev | Item | Evidence | Fix |
|---|---|---|---|---|
| 1 | 🟠 | **Docs over-claim vs code.** Reviewer reads README, opens code, finds mismatch. | See table in §4. | Reword six claims (≈15 min). |
| 2 | 🟠 | **Offline queue is dead code.** `offlineQueue.ts` has `0` usages outside its own file; no replay. Docs say "offline sync queue". | `grep enqueueOfflineAction\|getOfflineQueue` → 0. | Wire into one write path with replay on `online` event, **or** delete and fix docs. |
| 3 | 🟠 | **Service worker caches API responses.** Caches every successful GET, no old-cache cleanup, no `/api/` exclusion. In a demo this can show **stale data** after reseeding backend. | `public/sw.js`. | Cache only static shell; skip `/api/`; delete old caches in `activate`. |
| 4 | 🟡 | **Deploy has no test gate.** Push to `main` → build → publish. Failing tests still go live. | `.github/workflows/deploy.yml`. | Add `npm test` + `pytest` job; make deploy `needs:` it. |
| 5 | 🟡 | **Silent failures.** `4` empty `catch {}`; pages `fetch` backend directly and fall back to seed data without telling user per-page. Demo may look "live" when backend is down. | `grep "catch {}"`, `CommandCentrePage`, `AlertsPage`, `MyWorkPage`. | One API client; show the existing "SYNTHETIC / OFFLINE" banner state on every fallback. |
| 6 | 🟡 | **Two copies of demo data.** Frontend `src/data/*.ts` vs backend `db/seed.py` + `data/seed_data.py`. IDs (`GAP-W-PATNA-001`, `MTR-2026-W-001`, `CASE-DV-2026-PAT-0842`) repeat across 20+ files. UI and API can drift and show different numbers. | `grep` of IDs. | Shared ID constants; ideally one JSON fixture source. |
| 7 | 🟡 | **Main bundle ≈ 736 kB (≈ 196 kB gzip).** Large static data (`governanceData.ts` 1,422 lines) loaded on first paint. Slow on weak demo Wi-Fi. | Vite build warning, `wc -l`. | `React.lazy` per route; dynamic-import data modules. |
| 8 | 🟡 | **No lint / format.** `tsc` strict is on, ESLint/Prettier absent, `23` `any`. | `package.json`, `grep ": any\|as any"`. | Add ESLint (`react-hooks`, `jsx-a11y`) + Prettier. |
| 9 | 🟡 | **Mobile has no visible header labels.** Tooltips are `hidden sm:block` and hover-only; touch users see icons only. | `Header.tsx` (`3` hidden tooltips). | Long-press label or small text under icons on `<sm`; add `focus-visible` tooltip. |
| 10 | 🟡 | **Ask AI could be mistaken for generative AI.** It is rule-based token scoring over static content. | `AskAIDrawer.tsx`. | Add one line: "Rule-based assistant. No generative AI." |
| 11 | 🔵 | **No test coverage numbers.** "28/28", "10/10" are pass counts. | scripts. | `pytest --cov`, `vitest --coverage`. |
| 12 | 🔵 | **Playwright is a script, not a suite.** Screenshots + overflow only, run by hand. | `scripts/capture_screenshots.py`. | Convert to `@playwright/test` with assertions + axe. |
| 13 | 🔵 | **`requirements.txt` unpinned**, test deps mixed with runtime. | `backend/requirements.txt`. | Pin versions; split `requirements-dev.txt`. |
| 14 | 🔵 | **Big router files.** `router.py` 680 lines, `execution_router.py` 670. | `wc -l`. | Split per resource when time allows. |
| 15 | 🔵 | **Unbounded list endpoints** (`.all()` then Python filter). | `router.py`. | Fine at demo scale; add `limit` if data grows. |
| 16 | 🔵 | **Test DB shared on disk** (`wcd_protection.db`, session fixture). Test order can leak state. | `backend/tests/conftest.py`. | Per-test transaction rollback or temp DB. |

---

## 3. Corrections to Revision 1 (double-check results)

| Rev-1 claim | Re-check result | Now |
|---|---|---|
| `domain` column on RLS-targeted tables **UNVERIFIED** | **Confirmed present** on `gap_contracts` (`models.py:30`), `matters` (`:184`), `continuity_tokens` (`:296`). Migration `0002` DDL references real columns. | Removed as risk. |
| Unauthenticated `/auth/token`, default secret, header auth, open reads, hand-rolled JWT, CORS headers, rate limits, RLS inert, WORM not enforced, audit race | **Valid technically, but out of scope by owner decision.** | Moved to Appendix A. |
| Duplicate data | Still valid; matters more for demo consistency than for production. | Kept (#6). |
| `create_all` instead of Alembic | Alembic folder exists (`env.py`, `versions/`), README/app never run `upgrade`. Fine for SQLite demo. | Downgraded to note: say "schema auto-created for demo" in docs. |
| Tooltip/a11y | Re-confirmed: `3` hidden-on-mobile tooltips. | Kept (#9). |

---

## 4. Doc-vs-Code Wording Fixes (demo honesty)

| Current claim | What code does | Suggested wording |
|---|---|---|
| "Immutable / WORM audit chain" | Hash-chained, tamper-evident; not DB-enforced | "Tamper-evident hash-chained audit log (demo)" |
| "PostgreSQL RLS" | DDL drafted in `0002`; never activated; demo runs SQLite | "RLS policies drafted for pilot; not active in demo" |
| "Offline PWA sync queue" | Shell cache only; queue unused | "Offline shell caching (sync queue planned)" |
| "Bounded AI A1–A4 at temp 0" | No model invoked | "Deterministic retrieval prototype; LLM planned" |
| "Signed Bearer JWT / RBAC" | Demo role switcher; dev tokens | "Demo role switcher (production SSO deferred by design)" |
| "pgvector / Local LLM adapters" | Empty scaffolds | "Interface placeholders (not functional)" |

---

## 5. What Is Good (keep)
- Clear Domain A / Domain B split; child writes locked (`403`).
- Human-gate rules: AI role cannot approve or certify.
- Deterministic gap and action state machines with negative tests.
- Zero-PII tripwire on write fields (as a demo safeguard).
- Strict TypeScript, Zustand stores, shared `Card` / `PageHeader` / badges.
- Responsive across 31 routes × 4 viewports, recorded in `SCREENSHOT_INDEX.md`.
- Synthetic-data labelling in UI and docs.

---

## 6. Short Roadmap (demo polish only)

| Order | Task | Effort |
|---|---|---|
| 1 | Reword six doc claims (§4) | S |
| 2 | Fix service worker: shell only, skip `/api/`, clean old caches | S |
| 3 | Wire or delete `offlineQueue.ts` | S |
| 4 | Add "rule-based assistant" label to Ask AI | S |
| 5 | CI: run tests before deploy | S |
| 6 | Route-level lazy loading | M |
| 7 | Shared fixtures / ID constants | M |
| 8 | ESLint + Prettier + coverage | M |
| 9 | Mobile header labels + focus tooltips | S |

---

## Appendix A — Deferred By Design (not defects for the demo)

Owner decision: auth and security skipped for demo. Listed for the **future pilot** backlog only.

- Token issuance without credential (`/auth/token`); client-asserted role; header auth on by default.
- Default `SECRET_SALT`; hand-rolled HS256 JWT; verbose token errors.
- Open read endpoints; no object-level authorisation.
- Audit chain concurrency and DB-level append-only enforcement.
- RLS activation (`SET LOCAL`, deny-by-default, `FORCE RLS`, non-owner role).
- CORS header tightening, rate limits, security headers, request-size limits.
- Zero-PII regex is a denylist; consent as event log; retention/erasure; token vault.
- Dependency CVE scan, SAST, SBOM, VAPT, DPIA, SSO integration.
- Schema hardening (`timestamptz`, FKs, `Boolean`, enums, generated IDs); Postgres CI run.

**Not performed:** dynamic testing, CVE scanning, load testing, PostgreSQL runtime validation, assistive-technology testing, legal review.
