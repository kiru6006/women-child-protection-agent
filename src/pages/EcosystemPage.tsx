import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useDemoStore } from '@/store/demoStore';
import { ExternalLink, Phone, Mail, Search } from 'lucide-react';

const HIERARCHY_LEVELS = [
  'ALL',
  'Central Ministry',
  'National Institutions',
  'State WCD Departments',
  'District Administration',
  'District Programme Authorities',
  'Women Protection Institutions',
  'Child Protection Institutions',
  'Local Service Providers',
];

export function EcosystemPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'officials';
  const { officials } = useDemoStore();
  const [hierarchy, setHierarchy] = useState('ALL');
  const [query, setQuery] = useState('');

  const filtered = officials.filter((o) => {
    const mHier = hierarchy === 'ALL' || o.hierarchyLevel === hierarchy;
    const q = query.toLowerCase();
    const mQ =
      !q ||
      o.designation.toLowerCase().includes(q) ||
      o.department.toLowerCase().includes(q) ||
      o.jurisdiction.toLowerCase().includes(q) ||
      o.organisation.toLowerCase().includes(q);
    return mHier && mQ;
  });

  const tabs = [
    { id: 'officials', label: 'Government Officials' },
    { id: 'contacts', label: 'Contact Directory' },
    { id: 'hierarchy', label: 'Organisation Hierarchy' },
    { id: 'helplines', label: 'Helplines & Emergency' },
    { id: 'matrix', label: 'Responsibility Matrix' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={['Government Ecosystem', tabs.find((t) => t.id === activeTab)?.label || 'Officials']}
        title="Government Ecosystem, Officials & Centralised Contact Directory"
        purpose="Verified statutory designations, reporting hierarchies, public institutional contacts, and scheme responsibilities. Individual officeholders are marked UNVERIFIED unless verified via official appointment orders."
        source="Public MoWCD, NALSA, NCW, NCPCR & District NIC Directories"
        reportingPeriod="Verified 2026-11-25"
        classification="OFFICIAL_PUBLIC"
        limitations="Personal phone numbers and private addresses are strictly excluded; unverified individual names are shown as Designation Only."
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              activeTab === t.id
                ? 'bg-gov-navy text-white border-gov-navy'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-3 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search designation, department, jurisdiction..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded"
            />
          </div>
          <select value={hierarchy} onChange={(e) => setHierarchy(e.target.value)} className="border border-slate-200 rounded p-1.5">
            {HIERARCHY_LEVELS.map((h) => (
              <option key={h} value={h}>{h === 'ALL' ? 'All Hierarchy Levels' : h}</option>
            ))}
          </select>
        </div>
      </Card>

      {activeTab === 'helplines' ? (
        <Card header={<span className="text-sm font-bold text-gov-navy">Official Public Emergency Helplines</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { num: '181', name: 'Women Helpline (24x7)', owner: 'MoWCD — Mission Shakti', url: 'https://www.wcd.gov.in/' },
              { num: '1098', name: 'Child Helpline (24x7)', owner: 'MoWCD — Mission Vatsalya', url: 'https://www.wcd.gov.in/' },
              { num: '112', name: 'Emergency Response Support System', owner: 'Ministry of Home Affairs', url: 'https://112.gov.in/' },
              { num: '15100', name: 'NALSA Free Legal Aid', owner: 'National Legal Services Authority', url: 'https://nalsa.gov.in/' },
            ].map((h) => (
              <div key={h.num} className="p-3 rounded border border-slate-200 bg-slate-50">
                <div className="text-xl font-black text-gov-navy">{h.num}</div>
                <div className="font-bold text-slate-900 mt-1">{h.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{h.owner}</div>
                <a href={h.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-700 hover:underline inline-flex items-center gap-1 mt-2">
                  Official Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card header={<span className="text-sm font-bold text-gov-navy">Directory Records ({filtered.length})</span>}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Designation & Officeholder Status</th>
                  <th className="py-2.5 px-3">Hierarchy & Dept</th>
                  <th className="py-2.5 px-3">Jurisdiction</th>
                  <th className="py-2.5 px-3">Responsibilities & Schemes</th>
                  <th className="py-2.5 px-3">Public Institutional Contact</th>
                  <th className="py-2.5 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 align-top">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{o.designation}</div>
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                        {o.officeholderName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">{o.hierarchyLevel}</div>
                      <div className="text-[11px] text-slate-500">{o.department}</div>
                    </td>
                    <td className="py-2.5 px-3">{o.jurisdiction}</td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <p className="text-slate-700">{o.responsibilities}</p>
                      <div className="text-[10px] text-slate-500 mt-1">{o.associatedSchemes.join(' • ')}</div>
                    </td>
                    <td className="py-2.5 px-3 space-y-1">
                      {o.officialEmail && (
                        <div className="flex items-center gap-1 text-[11px]"><Mail className="w-3 h-3 text-slate-500" /> {o.officialEmail}</div>
                      )}
                      {o.officialPhone && (
                        <div className="flex items-center gap-1 text-[11px]"><Phone className="w-3 h-3 text-slate-500" /> {o.officialPhone}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <a href={o.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline inline-flex items-center gap-1">
                        Portal <ExternalLink className="w-3 h-3" />
                      </a>
                      <div className="text-[10px] text-slate-600 mt-0.5">{o.lastVerifiedDate}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
