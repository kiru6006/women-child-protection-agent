import { useEffect, useState } from 'react';
import { mockGaps } from '@/data/mockData';
import { Card } from '@/components/common/Card';
import { StatCard } from '@/components/common/StatCard';
import { OutcomeRecord } from '@/types';
import { createOutcome, fetchOutcomes, verifyOutcome } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { AlertTriangle, CheckCircle2, FileSearch, Plus } from 'lucide-react';

export function OutcomesPage() {
  const { currentRole } = useAppStore();
  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showRecord, setShowRecord] = useState(false);
  const [observed, setObserved] = useState('78');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOutcomes().then(setOutcomes);
  }, []);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      const created = await createOutcome(
        {
          intervention_id: 'INT-PAT-001',
          gap_id: 'GAP-W-PATNA-001',
          baseline: 36,
          target: 85,
          observed_result: Number(observed) || 0,
          measurement_date: new Date().toISOString().slice(0, 10),
          evidence_notes: notes,
        },
        currentRole
      );
      setOutcomes((prev) => [created, ...prev]);
      setNotes('');
      setShowRecord(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to record outcome.');
    }
  };

  const handleVerify = async (id: string, status: OutcomeRecord['status']) => {
    setActionError(null);
    try {
      const updated = await verifyOutcome(id, status, currentRole);
      setOutcomes((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (err: any) {
      setActionError(err.message || 'Outcome certification rejected.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EFFECTIVE':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold">EFFECTIVE</span>;
      case 'PARTIALLY_EFFECTIVE':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">PARTIALLY EFFECTIVE</span>;
      case 'INEFFECTIVE':
        return <span className="bg-red-100 text-red-800 border border-red-300 text-xs px-2.5 py-0.5 rounded-full font-bold">INEFFECTIVE</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">{status.replace(/_/g, ' ')}</span>;
    }
  };

  const effectiveCount = outcomes.filter((o) => o.status === 'EFFECTIVE').length;
  const partialCount = outcomes.filter((o) => o.status === 'PARTIALLY_EFFECTIVE').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Outcome Verification Engine</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ground-truth assessment verifying whether administrative sanctions actually solved the protection failure in the field.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRecord(!showRecord)}
          className="text-xs px-3 py-1.5 rounded bg-primary text-white font-semibold hover:bg-primary-hover flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Outcome</span>
        </button>
      </div>

      {showRecord && (
        <Card className="p-4 bg-white border-slate-200">
          <form onSubmit={handleRecord} className="space-y-3">
            <input
              type="number"
              required
              placeholder="Observed KPI % (e.g. 78)"
              value={observed}
              onChange={(e) => setObserved(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded p-2"
            />
            <textarea
              required
              rows={2}
              placeholder="Field audit observation & measurement limitations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded p-2"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowRecord(false)} className="text-xs px-3 py-1.5 border rounded">Cancel</button>
              <button type="submit" className="text-xs px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded font-semibold">Save Measurement</button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Measured Interventions"
          value={outcomes.length}
          subtext="Audited with baseline & target"
          variant="default"
          icon={FileSearch}
        />
        <StatCard
          label="Effective Gap Closures"
          value={effectiveCount}
          subtext="Target KPI exceeded"
          variant="success"
          icon={CheckCircle2}
        />
        <StatCard
          label="Partially Effective"
          value={partialCount}
          subtext="Requires field recalibration"
          variant="warning"
          icon={AlertTriangle}
        />
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 font-medium">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {outcomes.map((out) => {
          const linkedGap = mockGaps.find((g) => g.id === out.gapId);
          const denom = out.target - out.baseline || 1;
          const percentProgress = Math.max(0, Math.min(100, Math.round(((out.observedResult - out.baseline) / denom) * 100)));

          return (
            <Card key={out.id} className="hover:border-slate-300 transition-shadow">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-blue">{out.id}</span>
                    <span className="text-xs text-slate-500">Gap: <strong className="font-mono">{out.gapId}</strong></span>
                    <span className="text-xs text-slate-600">Measured: {out.measurementDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(out.status)}
                    {out.status !== 'EFFECTIVE' && (
                      <button
                        type="button"
                        onClick={() => handleVerify(out.id, 'EFFECTIVE')}
                        className="text-xs px-2.5 py-1 rounded border border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold hover:bg-emerald-100"
                      >
                        Human Certify Effective
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{linkedGap?.title || 'Intervention Evaluation'}</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                  <div>
                    <span className="text-slate-600 uppercase text-[10px] font-bold block">Baseline</span>
                    <span className="text-base font-bold text-slate-700">{out.baseline}%</span>
                  </div>
                  <div>
                    <span className="text-slate-600 uppercase text-[10px] font-bold block">Observed Field Result</span>
                    <span className="text-base font-bold text-gov-blue">{out.observedResult}%</span>
                  </div>
                  <div>
                    <span className="text-slate-600 uppercase text-[10px] font-bold block">Mandated Target</span>
                    <span className="text-base font-bold text-emerald-700">{out.target}%</span>
                  </div>
                  <div>
                    <span className="text-slate-600 uppercase text-[10px] font-bold block">Target Progress</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-gov-blue h-full rounded-full transition-all" style={{ width: `${percentProgress}%` }} />
                      </div>
                      <span className="font-bold text-xs">{percentProgress}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-md text-xs space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                    Field Audit Corroboration
                  </span>
                  <p className="text-slate-700 leading-relaxed italic">"{out.evidenceNotes}"</p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-semibold text-slate-600">90-Day Follow-up Cadence (Demo):</span>
                    <span className="px-2 py-0.5 rounded bg-green-50 text-green-800 border border-green-200 font-medium">
                      Day 30: Verified
                    </span>
                    <span className={`px-2 py-0.5 rounded border font-medium ${percentProgress >= 50 ? 'bg-green-50 text-green-800 border-green-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}>
                      Day 60: {percentProgress >= 50 ? 'Audit Logged' : 'Scheduled'}
                    </span>
                    <span className={`px-2 py-0.5 rounded border font-medium ${out.status === 'EFFECTIVE' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                      Day 90: {out.status === 'EFFECTIVE' ? 'Certified Complete' : 'Pending Sign-off'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
