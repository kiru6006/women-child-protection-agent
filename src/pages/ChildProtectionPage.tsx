import { useSearchParams, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { DomainBadge } from '@/components/badges/DomainBadge';
import { Lock } from 'lucide-react';

const CHILD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'abuse', label: 'Abuse & Neglect' },
  { id: 'pocso', label: 'POCSO Intelligence' },
  { id: 'missing', label: 'Missing Children' },
  { id: 'marriage', label: 'Child Marriage' },
  { id: 'labour', label: 'Labour & Trafficking' },
  { id: 'education', label: 'Education & Dropout' },
  { id: 'health', label: 'Health & Nutrition' },
  { id: 'digital', label: 'Digital Safety' },
  { id: 'care', label: 'Institutional & Family Care' },
  { id: 'aftercare', label: 'Rehab & Aftercare' },
];

export function ChildProtectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const plannedModules = [
    { title: '1. Helpline 1098 & DCPU Aggregate Intelligence', status: 'Aggregate Research', desc: 'Public Mission Vatsalya & NCPCR institutional indicators.' },
    { title: '2. Statutory CWC Production DAG (JJ Act s.31)', status: 'Architecture-Ready (Locked)', desc: '24h statutory production timer — live child case tracking blocked until DPDP/legal approval.' },
    { title: '3. POCSO Medical & FTSC Pendency (DoJ)', status: 'Aggregate Research', desc: 'Fast Track Special Courts pendency & Section 27 protocol tracking.' },
    { title: '4. Education Dropout & Nutrition (UDISE+ / POSHAN)', status: 'Aggregate Research', desc: 'District school dropout & Anganwadi nutrition convergence.' },
    { title: '5. CCI, Foster Care & Aftercare', status: 'Planned (Phase 2/3)', desc: 'Institutional capacity & post-18 sponsorship tracking.' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Child Protection', CHILD_TABS.find((t) => t.id === activeTab)?.label || 'Overview']}
        title="Child Protection Intelligence (Domain B)"
        purpose="Public-source research taxonomy and statutory architecture for C01–C16. Individual child case workflows, risk scoring, and custody decisions are strictly disabled in Phase 1 MVP (JJ Act s.74 & POCSO s.23)."
        badge="Aggregate Research Only • Live Writes Locked (403)"
        source="MoWCD Mission Vatsalya, NCPCR, UDISE+, DoJ (Cataloged)"
        reportingPeriod="2023–2026"
        classification="OFFICIAL_PUBLIC"
        actions={<DomainBadge domain="CHILD" />}
      />

      <div className="flex flex-wrap gap-1.5">
        {CHILD_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`px-2.5 py-1 rounded text-xs font-semibold border ${
              activeTab === t.id ? 'bg-[#7D2A42] text-white border-[#7D2A42]' : 'bg-white text-slate-700 border-slate-200 hover:bg-[#FFC0CB]/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card
        className="border-[#FFC0CB]"
        header={
          <div className="flex items-center gap-2 font-bold text-sm text-[#7D2A42]">
            <Lock className="w-4 h-4 text-[#EF5A90]" />
            <span>Safeguarding Boundary & Domain B Modules</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {plannedModules.map((m) => (
            <div key={m.title} className="p-3 rounded border border-sky-200 bg-sky-50/40">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-slate-900">{m.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-semibold">{m.status}</span>
              </div>
              <p className="text-slate-600">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs">
          <Link to="/knowledge?tab=catalogue" className="text-blue-700 font-semibold hover:underline">View Child Datasets in Catalogue →</Link>
          <Link to="/ecosystem?tab=officials" className="text-blue-700 font-semibold hover:underline">View CWC / NCPCR Directory →</Link>
        </div>
      </Card>
    </div>
  );
}
