import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { useGovernanceStore } from '@/store/governanceStore';
import { Award, CheckCircle2, Plus } from 'lucide-react';

export function ExcellencePage() {
  const { nominations, approveNomination, addNomination } = useGovernanceStore();
  const [showForm, setShowForm] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [category, setCategory] = useState('Effective Interdepartmental Coordination');
  const [geography, setGeography] = useState('Patna, Bihar');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [qualityMetric, setQualityMetric] = useState('');

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Governance Excellence', 'Recognition & Best Practices']}
        title="Governance Excellence & Recognition"
        purpose="Recognises verified interdepartmental coordination, accessibility, and rehabilitation outcomes. Prohibits rewarding raw case closures, arrests, or reduced crime reports without independent quality verification."
        badge={`${nominations.filter((n) => n.status === 'APPROVED').length} Approved Best Practices`}
        source="Independent Quality Audit & Recognition Registry (Synthetic)"
        classification="SYNTHETIC"
        actions={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="text-xs px-3 py-1.5 rounded bg-[#7D2A42] hover:bg-[#654161] text-white font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nominate Practice</span>
          </button>
        }
      />

      {showForm && (
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNomination({
                candidateName,
                candidateType: 'DISTRICT_TEAM',
                category,
                geography,
                evidenceSummary,
                qualityMetric: qualityMetric || 'Independent quality verification pending',
                independentVerifier: 'State WCD Quality Audit Cell',
              });
              setCandidateName('');
              setEvidenceSummary('');
              setQualityMetric('');
              setShowForm(false);
            }}
            className="space-y-2.5 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input required placeholder="Department / District / NGO / Local Body..." value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="border border-[#C98A87] rounded p-2" />
              <input required placeholder="Category..." value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[#C98A87] rounded p-2" />
              <input required placeholder="Geography..." value={geography} onChange={(e) => setGeography(e.target.value)} className="border border-[#C98A87] rounded p-2" />
            </div>
            <input required placeholder="Verified quality metric (no raw closure/arrest counts)..." value={qualityMetric} onChange={(e) => setQualityMetric(e.target.value)} className="w-full border border-[#C98A87] rounded p-2" />
            <textarea required rows={2} placeholder="Evidence summary & transferable lesson..." value={evidenceSummary} onChange={(e) => setEvidenceSummary(e.target.value)} className="w-full border border-[#C98A87] rounded p-2" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-[#7D2A42] text-white rounded font-semibold">Submit Nomination</button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {nominations.map((n) => (
          <Card key={n.id}>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#EF5A90]" />
                  <strong className="text-sm text-[#1F3864]">{n.candidateName}</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFE5DE] text-[#7D2A42] border border-[#C98A87] font-semibold">
                    {n.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                    n.status === 'APPROVED' ? 'bg-[#DFFFE0] text-[#166534] border-[#16A028]' : 'bg-[#FFFACD] text-[#7D2A42] border-[#C98A87]'
                  }`}>
                    {n.status}
                  </span>
                  {n.status !== 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => approveNomination(n.id)}
                      className="px-2.5 py-1 rounded bg-[#16A028] text-white font-semibold text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Human Approve</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-700">{n.evidenceSummary}</p>
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                <span><strong>Quality Metric:</strong> {n.qualityMetric}</span>
                <span><strong>Verifier:</strong> {n.independentVerifier}</span>
                <span><strong>Geography:</strong> {n.geography}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
