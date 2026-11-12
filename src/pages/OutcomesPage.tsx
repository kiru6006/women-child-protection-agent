import { mockOutcomes, mockGaps } from '@/data/mockData';
import { Card } from '@/components/common/Card';
import { StatCard } from '@/components/common/StatCard';
import { AlertTriangle, CheckCircle2, FileSearch } from 'lucide-react';

export function OutcomesPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EFFECTIVE':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold">EFFECTIVE</span>;
      case 'PARTIALLY_EFFECTIVE':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">PARTIALLY EFFECTIVE</span>;
      case 'INEFFECTIVE':
        return <span className="bg-red-100 text-red-800 border border-red-300 text-xs px-2.5 py-0.5 rounded-full font-bold">INEFFECTIVE</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">INSUFFICIENT DATA</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Outcome Verification Engine</h1>
        <p className="text-xs text-slate-500 mt-1">
          Ground-truth assessment verifying whether administrative sanctions actually solved the protection failure in the field.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Measured Interventions"
          value={mockOutcomes.length}
          subtext="Audited with baseline & target"
          variant="default"
          icon={FileSearch}
        />
        <StatCard
          label="Effective Gap Closures"
          value="1"
          subtext="Target KPI exceeded"
          variant="success"
          icon={CheckCircle2}
        />
        <StatCard
          label="Partially Effective"
          value="1"
          subtext="Requires field recalibration"
          variant="warning"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockOutcomes.map((out) => {
          const linkedGap = mockGaps.find((g) => g.id === out.gapId);
          const percentProgress = Math.min(
            100,
            Math.round(((out.observedResult - out.baseline) / (out.target - out.baseline)) * 100)
          );

          return (
            <Card key={out.id} className="hover:border-slate-300 transition-shadow">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-blue">{out.id}</span>
                    <span className="text-xs text-slate-500">Gap: <strong className="font-mono">{out.gapId}</strong></span>
                    <span className="text-xs text-slate-400">Measured: {out.measurementDate}</span>
                  </div>
                  {getStatusBadge(out.status)}
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {linkedGap?.title || 'Intervention Evaluation'}
                </h3>

                {/* KPI Metrics Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">Baseline</span>
                    <span className="text-base font-bold text-slate-700">{out.baseline}%</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">Observed Field Result</span>
                    <span className="text-base font-bold text-gov-blue">{out.observedResult}%</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">Mandated Target</span>
                    <span className="text-base font-bold text-emerald-700">{out.target}%</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">Target Progress</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gov-blue h-full rounded-full transition-all"
                          style={{ width: `${percentProgress}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs">{percentProgress}%</span>
                    </div>
                  </div>
                </div>

                {/* Evidence & Field Observation Notes */}
                <div className="p-3 bg-white border border-slate-200 rounded-md text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Field Audit Corroboration
                  </span>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{out.evidenceNotes}"
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
