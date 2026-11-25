import { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { EpistemicBadge } from '@/components/badges/EpistemicBadge';
import { EpistemicClass, EvidenceItem } from '@/types';
import { createEvidence, fetchEvidence } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { Search, ExternalLink, ShieldAlert, Plus, X, FileCheck2 } from 'lucide-react';

export function EvidenceLibraryPage() {
  const { currentRole } = useAppStore();
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [epistemicFilter, setEpistemicFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showAdd, setShowAdd] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [sourceRef, setSourceRef] = useState('');
  const [claim, setClaim] = useState('');
  const [sourceOrigin, setSourceOrigin] = useState<'OFFICIAL' | 'OPERATIONAL' | 'FIELD' | 'SYNTHETIC'>('FIELD');
  const [epistemicClass, setEpistemicClass] = useState<EpistemicClass>('HYPOTHESIS');

  useEffect(() => {
    fetchEvidence().then(setItems);
  }, []);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = await createEvidence(
        {
          title,
          source_org: sourceOrg,
          publication_date: new Date().toISOString().slice(0, 10),
          document_type: 'FIELD_STUDY',
          source_url_or_ref: sourceRef,
          source_origin: sourceOrigin,
          epistemic_class: epistemicClass,
          extracted_claim: claim,
        },
        currentRole
      );
      setItems((prev) => [created, ...prev]);
      setTitle('');
      setSourceOrg('');
      setSourceRef('');
      setClaim('');
      setShowAdd(false);
    } catch (err: any) {
      setFormError(err.message || 'Backend required to persist evidence.');
    }
  };

  const filteredEvidence = items.filter((e) => {
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
            {items.length} Indexed Sources
          </span>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs px-3 py-1.5 rounded bg-primary text-white font-semibold hover:bg-primary-hover flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Evidence</span>
          </button>
        </div>
      </div>

      {showAdd && (
        <Card className="p-4 bg-white border-slate-200">
          <form onSubmit={handleAddEvidence} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                required
                placeholder="Document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs border border-slate-200 rounded p-2"
              />
              <input
                required
                placeholder="Source organisation"
                value={sourceOrg}
                onChange={(e) => setSourceOrg(e.target.value)}
                className="text-xs border border-slate-200 rounded p-2"
              />
              <input
                required
                placeholder="Reference / URL / Gazette ID"
                value={sourceRef}
                onChange={(e) => setSourceRef(e.target.value)}
                className="text-xs border border-slate-200 rounded p-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={sourceOrigin}
                onChange={(e) => setSourceOrigin(e.target.value as any)}
                className="text-xs border border-slate-200 rounded p-2"
              >
                <option value="OFFICIAL">OFFICIAL (Public Statutory/MIS)</option>
                <option value="OPERATIONAL">OPERATIONAL (Authorised Record)</option>
                <option value="FIELD">FIELD (Frontline Observation)</option>
                <option value="SYNTHETIC">SYNTHETIC (Demo Only)</option>
              </select>
              <select
                value={epistemicClass}
                onChange={(e) => setEpistemicClass(e.target.value as EpistemicClass)}
                className="text-xs border border-slate-200 rounded p-2"
              >
                {epistemicOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Extracted claim or finding..."
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded p-2"
            />
            {formError && <p className="text-xs text-red-700 font-medium">{formError}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="text-xs px-3 py-1.5 border rounded">
                Cancel
              </button>
              <button type="submit" className="text-xs px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded font-semibold">
                Save Evidence
              </button>
            </div>
          </form>
        </Card>
      )}

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
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                    {evd.sourceOrigin || 'SYNTHETIC'}
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
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
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
                  <button
                    type="button"
                    onClick={() => setSelectedEvidence(evd)}
                    className="text-gov-blue hover:underline flex items-center gap-1 font-medium"
                  >
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
            <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No evidence documents match your filter.</p>
          </div>
        )}
      </div>

      {selectedEvidence && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gazette & Source Provenance Preview"
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full p-5 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs font-bold text-primary">{selectedEvidence.id}</span>
                  <EpistemicBadge classification={selectedEvidence.epistemicClass} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedEvidence.title}</h3>
              </div>
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setSelectedEvidence(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
              <div><span className="text-slate-600 block text-[10px] font-bold uppercase">Publishing Authority</span><strong>{selectedEvidence.sourceOrg}</strong></div>
              <div><span className="text-slate-600 block text-[10px] font-bold uppercase">Publication Date</span><strong>{selectedEvidence.publicationDate}</strong></div>
              <div><span className="text-slate-600 block text-[10px] font-bold uppercase">Source Origin</span><strong className="font-mono">{selectedEvidence.sourceOrigin || 'SYNTHETIC'}</strong></div>
              <div><span className="text-slate-600 block text-[10px] font-bold uppercase">Confidence Score</span><strong>{(selectedEvidence.confidenceScore * 100).toFixed(0)}%</strong></div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-600">Gazette / Statutory Extract</div>
              <p className="text-slate-800 italic leading-relaxed">"{selectedEvidence.extractedClaim}"</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="font-mono text-slate-600 truncate">Ref: {selectedEvidence.sourceUrlOrRef}</span>
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="px-3 py-1.5 rounded bg-primary hover:bg-primary-hover text-white font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
