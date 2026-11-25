import { useSearchParams, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useAppStore } from '@/store/appStore';

const GEO_TABS = [
  { id: 'india', label: 'India Overview' },
  { id: 'state', label: 'State Intelligence' },
  { id: 'district', label: 'District Intelligence' },
  { id: 'coverage', label: 'Service Coverage' },
  { id: 'capacity', label: 'Capacity Gaps' },
  { id: 'comparisons', label: 'Regional Comparisons' },
];

export function GeographyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'india';
  const { selectedState, selectedDistrict } = useAppStore();

  const rows = [
    { area: 'Patna, Bihar (Synthetic Pilot)', osc: '1 Active (Sakhi)', legalAid: '36% DLSA Linkage (Synthetic)', status: 'GAP-W-PATNA-001 Active', path: '/investigation?gapId=GAP-W-PATNA-001' },
    { area: 'Other Districts (All India)', osc: 'DATA NOT AVAILABLE', legalAid: 'DATA NOT AVAILABLE', status: 'Pending LGD + MWCD Live Ingestion', path: '/knowledge?tab=catalogue' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Geographic Intelligence', GEO_TABS.find((t) => t.id === activeTab)?.label || 'Overview']}
        title={`Geographic Intelligence — ${selectedDistrict}, ${selectedState} & National`}
        purpose="Context-adjusted spatial comparison of protection gaps, service coverage, and capacity shortages. District leaderboards are prohibited; missing official datasets explicitly display DATA NOT AVAILABLE."
        source="LGD Master (DISCOVERED) + Synthetic Patna Pilot"
        reportingPeriod="2024–2026"
        classification="MIXED_OFFICIAL_AND_SYNTHETIC"
      />

      <div className="flex flex-wrap gap-2">
        {GEO_TABS.map((t) => (
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

      <Card header={<span className="text-sm font-bold text-gov-navy">Context-Adjusted Geographic Coverage</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Jurisdiction</th>
                <th className="py-2.5 px-3">OSC Coverage</th>
                <th className="py-2.5 px-3">Legal Aid Indicator</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.area}>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{r.area}</td>
                  <td className="py-2.5 px-3">{r.osc}</td>
                  <td className="py-2.5 px-3">{r.legalAid}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">{r.status}</td>
                  <td className="py-2.5 px-3"><Link to={r.path} className="text-blue-700 font-semibold hover:underline">Open →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
