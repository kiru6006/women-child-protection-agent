import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { HELP_CATEGORIES, HELP_VERSION } from '@/data/help/categories';
import { HELP_FAQS, HELP_GLOSSARY, HELP_SCREEN_DIRECTORY, ONBOARDING_PATHS } from '@/data/help/catalogues';
import { HELP_DEPARTMENTS, HELP_ISSUES, HELP_ROLES } from '@/data/help/guides';
import { HelpCategoryId } from '@/data/help/types';
import {
  AvailabilityBadge,
  DemoWalkthroughsView,
  DepartmentGuideView,
  FaqSectionView,
  GlossaryView,
  IssueGuideView,
  Lifecycle18View,
  PlatformMindmapView,
  ProblemSolutionView,
  RoleGuideView,
  ScreenDirectoryView,
  WorkCategoryView,
} from './HelpInteractiveViews';
import { BookOpen, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export function HelpPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCatId = (searchParams.get('cat') as HelpCategoryId) || 'about';
  const [query, setQuery] = useState('');
  const [onboardingId, setOnboardingId] = useState(ONBOARDING_PATHS[0].id);
  const [completedOnboard, setCompletedOnboard] = useState<string[]>([]);

  const activeCat = HELP_CATEGORIES.find((c) => c.id === activeCatId) || HELP_CATEGORIES[0];
  const onboarding = ONBOARDING_PATHS.find((o) => o.id === onboardingId) || ONBOARDING_PATHS[0];

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const hits: { title: string; type: string; catId: HelpCategoryId }[] = [];
    HELP_CATEGORIES.forEach((c) => {
      if (c.label.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)) {
        hits.push({ title: c.label, type: 'Category', catId: c.id });
      }
    });
    HELP_ROLES.forEach((r) => {
      if (r.title.toLowerCase().includes(q) || r.overview.toLowerCase().includes(q)) {
        hits.push({ title: r.title, type: 'Role', catId: 'by-role' });
      }
    });
    HELP_DEPARTMENTS.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.purpose.toLowerCase().includes(q)) {
        hits.push({ title: d.name, type: 'Department', catId: 'by-department' });
      }
    });
    HELP_ISSUES.forEach((i) => {
      if (i.title.toLowerCase().includes(q) || i.definition.toLowerCase().includes(q)) {
        hits.push({ title: i.title, type: 'Issue', catId: 'by-issue' });
      }
    });
    HELP_SCREEN_DIRECTORY.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q)) {
        hits.push({ title: `${s.name} (${s.route})`, type: 'Screen', catId: 'screen-guide' });
      }
    });
    HELP_FAQS.forEach((f) => {
      if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
        hits.push({ title: f.question, type: 'FAQ', catId: 'faq' });
      }
    });
    HELP_GLOSSARY.forEach((g) => {
      if (g.term.toLowerCase().includes(q) || g.plainDefinition.toLowerCase().includes(q)) {
        hits.push({ title: g.term, type: 'Glossary', catId: 'glossary' });
      }
    });
    return hits.slice(0, 8);
  }, [query]);

  const renderCategoryBody = () => {
    switch (activeCat.id) {
      case 'about':
        return (
          <div className="space-y-3 text-xs">
            <Card header={<span className="font-bold text-[#1F3864]">What This Platform Is</span>}>
              <p className="text-slate-700 leading-relaxed mb-2">
                <strong>"This platform is not simply a dashboard that displays government data. It helps identify protection and welfare problems, investigate gaps, establish responsibility, coordinate departments, monitor approved actions and verify outcomes."</strong>
              </p>
              <div className="flex flex-wrap gap-1.5 items-center text-[11px] font-semibold text-[#7D2A42]">
                {['Gov Data', 'Problems', 'Gaps', 'Investigation', 'Approved Intervention', 'RACI Ownership', 'Convergence', 'Funding', 'Execution', 'Verified Outcomes', 'Learning'].map((step, i, arr) => (
                  <span key={step} className="inline-flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-[#FFE5DE] border border-[#C98A87]">{step}</span>
                    {i < arr.length - 1 && <span>→</span>}
                  </span>
                ))}
              </div>
            </Card>
            <PlatformMindmapView />
          </div>
        );
      case 'vision':
        return <Lifecycle18View />;
      case 'problems':
      case 'gap-intelligence':
      case 'solutions':
        return <ProblemSolutionView />;
      case 'architecture':
        return (
          <div className="space-y-3">
            <Card header={<span className="text-xs font-bold text-[#1F3864]">10-Layer Platform Architecture</span>}>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
                {['01. Stakeholders', '02. Workspaces', '03. Problems & Gaps', '04. Investigation', '05. RACI Ownership', '06. Convergence', '07. Finance Flow', '08. Monitoring', '09. Outcomes', '10. Audit & Gov'].map((l) => (
                  <div key={l} className="p-2 rounded bg-[#FFE5DE]/40 border border-[#C98A87] font-semibold text-[#1F3864]">{l}</div>
                ))}
              </div>
            </Card>
            <PlatformMindmapView />
          </div>
        );
      case 'by-role':
        return <RoleGuideView />;
      case 'by-department':
        return <DepartmentGuideView />;
      case 'by-work-category':
        return <WorkCategoryView />;
      case 'by-issue':
        return <IssueGuideView />;
      case 'women-protection':
        return (
          <Card header={<span className="text-xs font-bold text-[#7D2A42]">Domain A: Women Protection (MVP Active)</span>}>
            <p className="text-xs text-slate-700 mb-2">Covers Safety → Medical → Legal → Shelter → Economic → Rehabilitation (W01–W12). Welfare and protection services proceed independently or in parallel with litigation where legally available.</p>
            <Link to="/women" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold inline-block">Open Women Protection →</Link>
          </Card>
        );
      case 'child-protection':
        return (
          <Card header={<span className="text-xs font-bold text-[#7D2A42]">Domain B: Child Protection (Aggregate Research Only)</span>}>
            <p className="text-xs text-slate-700 mb-2">Covers C01–C16 alongside CWC, DCPU, JJB, CCIs, Education, Health, and Legal Services. Live individual child case writes are strictly locked (HTTP 403) in Phase 1 MVP under JJ Act s.74 and POCSO s.23 safeguards.</p>
            <Link to="/child" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold inline-block">Open Child Protection →</Link>
          </Card>
        );
      case 'matter-investigation':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Matter 360° Hub-and-Spoke & Investigation</span>}>
            <p className="text-xs text-slate-700 mb-2">Matter 360° connects Problem, Evidence, Investigation, Services, Police, Litigation, Court Orders, RACI, Actions, Dependencies, Finance, NGO, Alerts, Outcomes, and Audit across 7 independent status dimensions.</p>
            <div className="flex gap-2">
              <Link to="/matter-360" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold">Open Matter 360° →</Link>
              <Link to="/investigation" className="text-xs px-3 py-1.5 rounded border border-[#C98A87] text-[#7D2A42] font-semibold">Open Investigation →</Link>
            </div>
          </Card>
        );
      case 'ownership':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Ownership & RACI Lifecycle</span>}>
            <p className="text-xs text-slate-700 mb-2">Action Created → Authority Identified → Assigned → Acknowledged → In Progress → Evidence Submitted → Verified → Closed/Reopened. Ownership attaches to roles so officer transfers preserve history.</p>
            <div className="flex gap-2">
              <Link to="/my-work" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold">Open My Work →</Link>
              <Link to="/ownership" className="text-xs px-3 py-1.5 rounded border border-[#C98A87] text-[#7D2A42] font-semibold">Open Ownership Centre →</Link>
            </div>
          </Card>
        );
      case 'convergence':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Departmental Convergence & Dependency 360°</span>}>
            <p className="text-xs text-slate-700 mb-2">Models parallel and blocking dependencies across WCD, Police, DLSA, Finance, Health, Education, and NGOs, distinguishes lawful waits, and detects circular deadlocks automatically.</p>
            <div className="flex gap-2">
              <Link to="/convergence" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold">Open Convergence →</Link>
              <Link to="/dependencies" className="text-xs px-3 py-1.5 rounded border border-[#C98A87] text-[#7D2A42] font-semibold">Open Dependency 360° →</Link>
            </div>
          </Card>
        );
      case 'police-litigation':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Police & Judicial Independence</span>}>
            <p className="text-xs text-slate-700 mb-2">Tracks minimum authorised coordination references without replacing CCTNS, directing criminal investigations, predicting judicial outcomes, or delaying independently available welfare support.</p>
            <Link to="/matter-360?tab=police" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold inline-block">Open Police & Litigation Tab →</Link>
          </Card>
        );
      case 'finance':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Financial Execution Flow</span>}>
            <p className="text-xs text-slate-700 mb-2">Identified Need → Approved Intervention → Resource Assessment → Financial Approval → Sanction → Fund Release → Disbursement → Service Delivery → Utilisation Evidence → Outcome Verification. AI never approves payments.</p>
            <Link to="/finance" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold inline-block">Open Financial Intelligence →</Link>
          </Card>
        );
      case 'ngo-community':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">NGO & Local Body Participation</span>}>
            <p className="text-xs text-slate-700 mb-2">Empaneled NGOs, Panchayats, AWCs, and SHGs execute approved activities with purpose-limited cohort tokens, zero automatic PII exposure, and zero statutory decision authority for volunteers.</p>
            <Link to="/ngo-community" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold inline-block">Open NGO & Community →</Link>
          </Card>
        );
      case 'ai-intelligence':
        return (
          <Card header={<span className="text-xs font-bold text-[#46296E]">How AI Helps Government (Bounded temp=0.0)</span>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Issue / Gap Discovery:</strong> Review candidate problem</div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Evidence / Dependency Analysis:</strong> Review docs & blockers</div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Intervention Rec:</strong> Human approves corrective action</div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200"><strong>Outcome Analysis:</strong> Verify field results</div>
            </div>
            <Link to="/ai-intelligence" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold inline-block">Open AI Intelligence →</Link>
          </Card>
        );
      case 'progress-monitoring':
      case 'alerts-escalation':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Monitoring, Notifications & Escalations</span>}>
            <p className="text-xs text-slate-700 mb-2">New Assignment → Acknowledge; Approaching Deadline → Update Progress; Dependency Resolved → Resume Work; Completion Reported → Verify Evidence. Deduplicated in-app notifications prevent flooding.</p>
            <Link to="/alerts" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold inline-block">Open Alerts & Notifications →</Link>
          </Card>
        );
      case 'outcomes-recognition':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Outcome Verification & Quality Recognition</span>}>
            <p className="text-xs text-slate-700 mb-2">All actions may be completed while the intended public outcome remains unachieved. Outcomes require Day-30/60/90 verification; Recognition rewards verified quality improvements, never raw arrest/closure volumes.</p>
            <div className="flex gap-2">
              <Link to="/outcomes" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold">Open Outcomes →</Link>
              <Link to="/excellence" className="text-xs px-3 py-1.5 rounded border border-[#C98A87] text-[#7D2A42] font-semibold">Open Excellence →</Link>
            </div>
          </Card>
        );
      case 'directory':
      case 'knowledge-data':
        return <ScreenDirectoryView />;
      case 'screen-guide':
      case 'implementation-status':
        return <ScreenDirectoryView />;
      case 'walkthroughs':
        return <DemoWalkthroughsView />;
      case 'governance-safety':
        return (
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Governance, DPDP & Statutory Safeguards</span>}>
            <p className="text-xs text-slate-700 mb-2">Enforces Zero-PII tokens, role/jurisdiction RBAC, Domain B child protection lock (403), WORM SHA-256 audit logging, and human decision gates. Not a substitute for 181/1098/112 emergency response or legal advice.</p>
            <div className="flex gap-2">
              <Link to="/audit" className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] text-white font-semibold">Open Audit Ledger →</Link>
              <Link to="/governance" className="text-xs px-3 py-1.5 rounded border border-[#C98A87] text-[#7D2A42] font-semibold">Open Governance →</Link>
            </div>
          </Card>
        );
      case 'faq':
        return <FaqSectionView />;
      case 'glossary':
        return <GlossaryView />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section A: Compact Introduction */}
      <div className="bg-white border border-[#E5B8B7] border-l-4 border-l-[#EF5A90] rounded-lg px-4 py-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1F3864] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#EF5A90]" />
              <span>Help & Platform Knowledge Centre</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Understand the platform, government responsibilities, departmental coordination, and how protection problems convert into measurable action.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-bold">
            POC & Synthetic Demo • {HELP_VERSION}
          </span>
        </div>

        {/* Section B: Local Search */}
        <div className="mt-2.5 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, department, issue, scheme, workflow, screen, or FAQ (e.g. 'Who owns a pending action?')..."
            className="w-full pl-8 pr-3 py-1.5 rounded border border-[#C98A87] text-xs bg-slate-50 focus:bg-white"
          />
          {searchResults.length > 0 && (
            <div className="mt-1.5 bg-white border border-[#C98A87] rounded divide-y divide-slate-100">
              {searchResults.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchParams({ cat: h.catId });
                    setQuery('');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#FFE5DE]/40 flex items-center justify-between"
                >
                  <span className="font-semibold text-[#1F3864]">{h.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{h.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Category Selector */}
      <div className="lg:hidden">
        <select
          aria-label="Select Help Category"
          value={activeCat.id}
          onChange={(e) => setSearchParams({ cat: e.target.value })}
          className="w-full border border-[#C98A87] rounded p-2 text-xs font-semibold bg-white text-[#1F3864]"
        >
          {HELP_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {String(c.number).padStart(2, '0')}. {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* 3-Area Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: 30 Categories */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-[#E5B8B7] rounded-lg p-2 max-h-[72vh] overflow-y-auto space-y-0.5">
          {HELP_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSearchParams({ cat: c.id })}
              className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-colors flex items-center gap-1.5 ${
                activeCat.id === c.id
                  ? 'bg-[#FFE5DE] text-[#7D2A42] border-l-2 border-[#EF5A90] font-bold'
                  : 'text-slate-700 hover:bg-[#FFE5DE]/40'
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">{String(c.number).padStart(2, '0')}</span>
              <span className="truncate">{c.label}</span>
            </button>
          ))}
        </aside>

        {/* Centre: Selected Article / Interactive View */}
        <main className="lg:col-span-6 space-y-3">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h2 className="text-sm font-bold text-[#1F3864]">{String(activeCat.number).padStart(2, '0')}. {activeCat.label}</h2>
              <AvailabilityBadge status={activeCat.availability} />
            </div>
            <p className="text-xs text-slate-600">{activeCat.summary}</p>
          </Card>
          {renderCategoryBody()}
        </main>

        {/* Right: Related Screens & Optional Guided Onboarding */}
        <aside className="lg:col-span-3 space-y-3">
          <Card header={<span className="text-xs font-bold text-[#1F3864]">Related Application Screens</span>}>
            {activeCat.relatedScreens.length === 0 ? (
              <div className="text-xs text-slate-600">Select any topic or open the Screen Directory.</div>
            ) : (
              <div className="space-y-2">
                {activeCat.relatedScreens.map((rs) => (
                  <div key={rs.route} className="p-2 rounded border border-[#E5B8B7] bg-slate-50 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <strong className="text-[#1F3864]">{rs.name}</strong>
                      <AvailabilityBadge status={rs.status} />
                    </div>
                    <div className="text-[11px] text-slate-600">{rs.explanation}</div>
                    <Link to={rs.route} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7D2A42] hover:underline">
                      <span>Open Screen</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card header={<span className="text-xs font-bold text-[#1F3864]">Optional Guided Onboarding</span>}>
            <select
              aria-label="Select onboarding path"
              value={onboardingId}
              onChange={(e) => setOnboardingId(e.target.value)}
              className="w-full text-xs border border-[#C98A87] rounded p-1.5 mb-2 bg-white"
            >
              {ONBOARDING_PATHS.map((o) => (
                <option key={o.id} value={o.id}>{o.role}</option>
              ))}
            </select>
            <div className="space-y-1.5 text-xs">
              {onboarding.steps.map((st) => {
                const done = completedOnboard.includes(st.id);
                return (
                  <div key={st.id} className="flex items-center justify-between gap-2 p-1.5 rounded border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        if (!done) setCompletedOnboard((p) => [...p, st.id]);
                        setSearchParams({ cat: st.categoryId });
                      }}
                      className="text-left flex items-center gap-1.5 font-medium text-[#1F3864] hover:text-[#7D2A42]"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${done ? 'text-[#16A028]' : 'text-slate-400'}`} />
                      <span>{st.label}</span>
                    </button>
                    {st.route && <Link to={st.route} className="text-[10px] font-semibold text-[#7D2A42]">Go →</Link>}
                  </div>
                );
              })}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
