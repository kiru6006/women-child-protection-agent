import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { governmentSchemes } from '@/data/platformData';
import { ExternalLink } from 'lucide-react';

const SCHEME_TABS = [
  { id: 'all', label: 'All Schemes' },
  { id: 'shakti', label: 'Mission Shakti & OSCs' },
  { id: 'vatsalya', label: 'Mission Vatsalya & CCIs' },
  { id: 'poshan', label: 'Saksham Anganwadi & POSHAN' },
  { id: 'legal', label: 'Legal Aid & Financial Support' },
  { id: 'availability', label: 'Service Availability' },
];

export function SchemesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  const filtered = governmentSchemes.filter((s) => {
    if (activeTab === 'all' || activeTab === 'availability') return true;
    if (activeTab === 'shakti') return s.id === 'SCH-SHAKTI';
    if (activeTab === 'vatsalya') return s.id === 'SCH-VATSALYA';
    if (activeTab === 'poshan') return s.id === 'SCH-POSHAN';
    if (activeTab === 'legal') return s.id === 'SCH-NALSA';
    return true;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Schemes & Services', SCHEME_TABS.find((t) => t.id === activeTab)?.label || 'All']}
        title="Government Schemes & Support Services"
        purpose="Authoritative mapping of Mission Shakti, Mission Vatsalya, Saksham Anganwadi & POSHAN 2.0, and Free Legal Aid services."
        source="MoWCD & NALSA Official Guidelines"
        reportingPeriod="2024–2026"
        classification="OFFICIAL_PUBLIC"
      />

      <div className="flex flex-wrap gap-2">
        {SCHEME_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`px-3 py-1.5 rounded text-xs font-semibold border ${
              activeTab === t.id ? 'bg-gov-navy text-white border-gov-navy' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <Card key={s.id} header={<span className="text-sm font-bold text-gov-navy">{s.name}</span>}>
            <div className="space-y-2 text-xs">
              <p className="text-slate-700">{s.purpose}</p>
              <div>
                <strong>Services:</strong>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {s.services.map((srv) => (
                    <span key={srv} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{s.department} • {s.reportingPeriod}</span>
                <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline inline-flex items-center gap-1">
                  Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
