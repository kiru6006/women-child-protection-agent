import { useState } from 'react';
import { mockEvidence } from '@/data/mockData';
import { Card } from '@/components/common/Card';
import { EpistemicBadge } from '@/components/badges/EpistemicBadge';
import { EpistemicClass } from '@/types';
import { Search, ExternalLink, ShieldAlert } from 'lucide-react';

export function EvidenceLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [epistemicFilter, setEpistemicFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredEvidence = mockEvidence.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.extractedClaim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.sourceOrg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEpistemic = epistemicFilter === 'ALL' || e.epistemicClass === epistemicFilter;
    const matchesType = typeFilter === 'ALL' || e.documentType === typeFilter;
    return matchesSearch && matchesEpistemic && matchesType;
  });

  const epistemicOptions: EpistemicClass[] = [
    'VERIFIED_FACT',
    'INFERENCE',
    'HYPOTHESIS',
    'RECOMMENDATION',
    'DATA_NOT_AVAILABLE',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Evidence Library & Provenance Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ground-truth government documents, statutory gazettes, CAG audit observations, and epistemic classifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 px-3 py-1.5 rounded border border-slate-200 text-slate-700 font-mono">
            {mockEvidence.length} Indexed Sources
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search claims, documents, gazette refs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-gov-blue"
            />
          </div>

          <div>
            <select
              value={epistemicFilter}
              onChange={(e) => setEpistemicFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-1.5 focus:outline-hidden focus:border-gov-blue"
            >
              <option value="ALL">All Epistemic Levels</option>
              {epistemicOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-1.5 focus:outline-hidden focus:border-gov-blue"
            >
              <option value="ALL">All Document Types</option>
              <option value="ACT">Statutory Acts & Rules</option>
              <option value="SOP">Operational Guidelines / SOPs</option>
              <option value="ANNUAL_REPORT">Ministry Annual Reports</option>
              <option value="CAG_AUDIT">CAG / Statutory Audits</option>
              <option value="DATASET">Official Datasets (NCRB/NFHS)</option>
              <option value="FIELD_STUDY">Frontline Field Assessments</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Evidence Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEvidence.map((evd) => (
          <Card key={evd.id} className="hover:border-slate-300 transition-shadow">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gov-blue">{evd.id}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                    {evd.documentType}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-medium">
                    {evd.credibilityCategory}
                  </span>
                </div>
                <EpistemicBadge classification={evd.epistemicClass} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{evd.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published by <strong className="text-slate-700">{evd.sourceOrg}</strong> on {evd.publicationDate}
                </p>
              </div>

              {/* Extracted Claim Quote */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Extracted Statutory Claim / Finding
                </div>
                <p className="text-xs text-slate-800 italic leading-relaxed">
                  "{evd.extractedClaim}"
                </p>
              </div>

              {/* Provenance & Citation Metadata */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
                <span className="font-mono">Reference: {evd.sourceUrlOrRef}</span>
                <div className="flex items-center gap-3">
                  <span>Confidence: <strong>{(evd.confidenceScore * 100).toFixed(0)}%</strong></span>
                  <button className="text-gov-blue hover:underline flex items-center gap-1 font-medium">
                    <span>Inspect Gazette Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredEvidence.length === 0 && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-lg">
            <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No evidence documents match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
