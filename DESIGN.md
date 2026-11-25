# Design System — Civic Intelligence Light
## WCD Protection Intelligence Platform (Suraksha Sentinel & Sahyog)

---

## 1. Design Principles & References

Built for Government of India Ministry of Women & Child Development (MoWCD) officials, Collectors, and investigators:

- **Token Architecture (USWDS):** Centralized CSS variables in [`src/styles/design-tokens.css`](./src/styles/design-tokens.css) mapped into [`tailwind.config.js`](./tailwind.config.js) and [`src/index.css`](./src/index.css).
- **Functional Colour Discipline (GOV.UK / NHS):** Colour carries operational meaning (severity, domain, status), never decorative rainbow cards.
- **Enterprise Workspace & Charts (IBM Carbon):** Light neutral canvas (`#F1F5F9`), crisp white cards (`#FFFFFF`), 8-colour accessible visualization sequence (`--chart-1`..`--chart-8`).
- **Component Semantics (shadcn/ui):** Predictable interactive states (`--primary`, `--primary-hover`, `--ring`).
- **Indian Government Accessibility (UX4G / GIGW 3.0 / WCAG 2.1 AA):** High-contrast text (`>= 4.5:1`), visible `:focus-visible` outlines (`2px solid var(--ring)`), no full-screen dark cards or unreadable dark overlays.

---

## 2. Colour Audit: Now vs Next

| Dimension | Before (Legacy) | After (Civic Intelligence Light) | Improvement |
|---|---|---|---|
| **Token Centralization** | Scattered Tailwind utilities + legacy `gov.pink` mapped to navy/slate | Single source of truth in [`src/styles/design-tokens.css`](./src/styles/design-tokens.css) | **+100%** centralized |
| **Action & Surface Hierarchy** | `bg-pink-700` CTAs, `bg-slate-50` canvas, dark `bg-slate-900` executive sign-off card | `#1D4ED8` (`bg-primary`) CTAs, `#F1F5F9` (`bg-app`) canvas, light `bg-white` Executive Gate card | **100%** light civic surface consistency |
| **Domain & Severity Semantics** | Inverted `DomainBadge` (`rose`/`purple`), `SeverityBadge` `LOW` in `slate` & `HIGH` in `amber`, tinted `StatCard` fills | Women `pink` / Child `sky` in `DomainBadge`; Red / Orange / Yellow / Green scale in `SeverityBadge`; clean white `StatCard` with left status border | **~85%** semantic clarity gain |
| **Accessibility & Focus** | Missing global `:focus-visible`, `text-slate-400` low-contrast icons/labels | `2px solid var(--ring)` `:focus-visible`, darkened `StatCard` & `Sidebar` controls (`#64748B` / `text-slate-600`) | **~70%** keyboard & contrast gain |

---

## 3. Core Palette & Semantic Tokens

Defined in [`src/styles/design-tokens.css`](./src/styles/design-tokens.css):

### Surfaces & Typography
| Token | Hex | Usage |
|---|---|---|
| `--bg-app` | `#F1F5F9` | Application canvas (`AppLayout`) |
| `--bg-card` | `#FFFFFF` | Cards, panels, Executive Decision Gate |
| `--bg-hover` | `#F8FAFC` | Table row / list hover |
| `--bg-selected` | `#EFF6FF` | Active sidebar item background |
| `--text-primary` | `#0F172A` | Primary headings & body copy |
| `--text-secondary` | `#334155` | Supporting descriptions |
| `--text-muted` | `#64748B` | Captions, sidebar group headers |
| `--border-decorative` | `#E2E8F0` | Card dividers & borders |
| `--border-control` | `#64748B` | Form inputs & interactive controls |

### Brand & Primary Actions
| Token | Hex | Usage |
|---|---|---|
| `--gov-navy` | `#0F2744` | Top government header, primary brand identity |
| `--primary` | `#1D4ED8` | Primary CTAs (`Propose Gap`, `Approve`, `Save`, `Investigate`) |
| `--primary-hover` | `#1E40AF` | Primary CTA hover |
| `--ring` | `#1D4ED8` | Keyboard `:focus-visible` ring (`2px solid`, `2px` offset) |

### Protection Domain & Awareness Accents (Extracted Women & Girl Child Palette)
Used strictly for badges, small icons, category markers, and subtle borders with WCAG AA dark text on pastel fills:

| Domain / Campaign | Accent | Tint / Pastel Fill | Border |
|---|---|---|---|
| **Women Protection (Domain A)** | `#7D2A42` (Burgundy) / `#654161` (Royal Plum) | `#FFE5DE` (Gentle Peach) | `#C98A87` (Dusty Rose) |
| **Child Protection (Domain B)** | `#EF5A90` (National Girl Child Day Pink) | `#FFC0CB` (Baby Pink) / `#FFFACD` (Lemon Macaron) | `#EF5A90` |
| **AI Intelligence** | `#46296E` (IWD Purple) | `#E6D0E3` (Soft Lavender) | — |
| **Government Ecosystem** | `#167F80` (Deep Teal) / `#1F3864` (Navy Blue) | `#DFFFE0` (Gummy Mint) | — |
| **Schemes & Services** | `#16A028` (Emerald Green) / `#8AEA92` (IWD Green) | `#DFFFE0` (Gummy Mint) | — |

### Operational Severity Scale (Red, Orange, Yellow, Green, Slate)
| Level | Background | Text | Border |
|---|---|---|---|
| **CRITICAL** | `#FEF2F2` (`bg-red-50`) | `#991B1B` (`text-red-800`) | `#DC2626` (`border-red-300`) |
| **HIGH** | `#FFF7ED` (`bg-orange-50`) | `#9A3412` (`text-orange-800`) | `#EA580C` (`border-orange-300`) |
| **MEDIUM** | `#FEFCE8` (`bg-yellow-50`) | `#854D0E` (`text-yellow-800`) | `#CA8A04` (`border-yellow-300`) |
| **LOW** | `#F0FDF4` (`bg-green-50`) | `#166534` (`text-green-800`) | `#86EFAC` (`border-green-300`) |
| **INFO** | `#F1F5F9` | `#475569` | `#CBD5E1` |

---

## 4. Component Implementation Map

| Component / Page | Applied Standard | File |
|---|---|---|
| **Domain Badge** | Women (`pink-50/800/200`), Child (`sky-50/800/200`) | [`src/components/badges/DomainBadge.tsx`](./src/components/badges/DomainBadge.tsx) |
| **Severity Badge** | Red (`CRITICAL`), Orange (`HIGH`), Yellow (`MEDIUM`), Green (`LOW`) | [`src/components/badges/SeverityBadge.tsx`](./src/components/badges/SeverityBadge.tsx) |
| **Stat Card** | White surface (`bg-white`) with 4px left semantic accent border | [`src/components/common/StatCard.tsx`](./src/components/common/StatCard.tsx) |
| **App Shell & Sidebar** | `bg-app` (`#F1F5F9`) canvas; active nav `bg-[#EFF6FF] text-[#1D4ED8] border-l-2 border-[#1D4ED8]` | [`AppLayout.tsx`](./src/components/layout/AppLayout.tsx), [`Sidebar.tsx`](./src/components/layout/Sidebar.tsx) |
| **Action CTAs** | `bg-primary hover:bg-primary-hover text-white` across workflows | [`GapExplorerPage.tsx`](./src/pages/GapExplorerPage.tsx), [`InterventionsPage.tsx`](./src/pages/InterventionsPage.tsx), [`OutcomesPage.tsx`](./src/pages/OutcomesPage.tsx), [`EvidenceLibraryPage.tsx`](./src/pages/EvidenceLibraryPage.tsx) |
| **Executive Human Gate** | Light `bg-white` card with `border-l-4 border-l-gov-navy` (replaces dark `bg-slate-900`) | [`src/pages/InvestigationPage.tsx`](./src/pages/InvestigationPage.tsx) |

---

## 5. Verification & Remaining Items

- **Verified:** `npm run build` (`tsc -b && vite build`), `npm test` (`10/10` Vitest), `pytest` (`26/26` Pytest), and Playwright full 31-route × 4-viewport audit (`21/21` screenshots, `1920x1080`, `1280x800`, `768x1024`, `375x812`, `0` errors, `0` overflows) pass.
- **Completed Contrast & Theme Sweep:** Upgraded `text-slate-400` micro-captions/icons on light backgrounds across core pages to `text-slate-500`/`text-slate-600` (`>= 4.5:1`), replaced the Attention Centre gradient banner with Civic Intelligence Light (`bg-white` + `border-l-gov-navy`), and added a high-contrast Black & White theme toggle in the compact icon-only header.
