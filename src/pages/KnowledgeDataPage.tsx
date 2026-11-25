import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useDemoStore } from '@/store/demoStore';
import { ExternalLink } from 'lucide-react';

const TABS = [
  { id: 'catalogue', label: 'Government Data Catalogue' },
  { id: 'evidence', label: 'Evidence Library' },
  { id: 'laws', label: 'Laws, Rules & Orders' },
  { id: 'policies', label: 'Policies & Guidelines' },
  { id: 'reports', label: 'Reports & Parliament' },
  { id: 'budget', label: 'Budget & Expenditure' },
];

export function KnowledgeDataPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'catalogue';
  const { datasets, evidence } = useDemoStore();
  const [domainFilter, setDomainFilter] = useState('ALL');

  const filteredDatasets = datasets.filter((d) => domainFilter === 'ALL' || d.protectionDomain === domainFilter);

  const statusBadge = (st: string) => {
    const map: Record<string, string> = {
      VALIDATED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      DISCOVERED: 'bg-blue-50 text-blue-800 border-blue-200',
      'ACCESS RESTRICTED': 'bg-amber-100 text-amber-800 border-amber-300',
      FAILED: 'bg-red-100 text-red-800 border-red-300',
    };
    return map[st] || 'bg-slate-100 text-slate-700 border-slate-300';
  };

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Knowledge & Data', TABS.find((t) => t.id === activeTab)?.label || 'Catalogue']}
        title="Government Data Catalogue & Knowledge Repository"
        purpose="Auditable registry of authoritative GoI datasets (LGD, Census, NFHS-5, NCRB, MoWCD, UDISE+, DoJ), statutory texts, and evidence provenance. Discovered datasets are never mislabelled as imported."
        source="Authoritative GoI Portals (data.gov.in, wcd.gov.in, ncrb.gov.in, lgdirectory.gov.in)"
        reportingPeriod="2011–2026"
        classification="OFFICIAL_PUBLIC"
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
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
        <Link to="/evidence" className="px-3 py-1.5 rounded text-xs font-semibold border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100">
          Open Full Evidence Manager →
        </Link>
      </div>

      {activeTab === 'catalogue' ? (
        <Card
          header={
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <span className="text-sm font-bold text-gov-navy">Official Government Datasets ({filteredDatasets.length})</span>
              <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="text-xs border border-slate-300 rounded px-2 py-1 bg-white">
                <option value="ALL">All Domains</option>
                <option value="WOMEN">Women</option>
                <option value="CHILD">Child</option>
                <option value="SHARED">Shared</option>
              </select>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Dataset & Dept</th>
                  <th className="py-2.5 px-3">Domain / Coverage</th>
                  <th className="py-2.5 px-3">Period / Pub Date</th>
                  <th className="py-2.5 px-3">Format / Records</th>
                  <th className="py-2.5 px-3">Ingestion Status</th>
                  <th className="py-2.5 px-3">Limitations & License</th>
                  <th className="py-2.5 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDatasets.map((d) => (
                  <tr key={d.datasetCode} className="hover:bg-slate-50 align-top">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{d.name}</div>
                      <div className="text-[11px] text-slate-500">{d.datasetCode} • {d.publishingDepartment}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[11px] font-semibold">{d.protectionDomain}</span>
                      <div className="text-[11px] text-slate-500">{d.geographicCoverage}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{d.reportingPeriod}</div>
                      <div className="text-[10px] text-slate-600">Pub: {d.publicationDate}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{d.availableFormat}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Imported: {d.recordCount}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${statusBadge(d.status)}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs text-[11px] text-slate-600">
                      <div>{d.limitations}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{d.licenseTerms}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <a href={d.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline inline-flex items-center gap-1">
                        URL <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card header={<span className="text-sm font-bold text-gov-navy">Indexed Statutory & Policy Evidence ({evidence.length})</span>}>
          <div className="space-y-2 text-xs">
            {evidence.map((e) => (
              <div key={e.id} className="p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-900">{e.title} ({e.epistemicClass})</div>
                <p className="text-slate-600 mt-1">{e.extractedClaim}</p>
                <div className="text-[11px] text-slate-500 mt-1">{e.sourceOrg} • {e.sourceUrlOrRef} • {e.publicationDate}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
