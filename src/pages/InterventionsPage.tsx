import { mockInterventions } from '@/data/mockData';
import { Card } from '@/components/common/Card';
import { Calendar, Target, CheckCircle2, AlertCircle } from 'lucide-react';

export function InterventionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Intervention Workspace & Mandated Directives</h1>
          <p className="text-xs text-slate-500 mt-1">
            Formal administrative interventions sanctioned by District Magistrates and WCD Secretaries with measurable baseline-to-target KPIs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockInterventions.map((intPlan) => {
          const isApproved = intPlan.status === 'APPROVED' || intPlan.status === 'IN_PROGRESS';
          return (
            <Card key={intPlan.id} className="hover:border-slate-300 transition-shadow">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-blue">{intPlan.id}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold uppercase">
                      {intPlan.type.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-xs text-slate-400">Linked: {intPlan.gapId}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      intPlan.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {intPlan.status === 'IN_PROGRESS' ? (
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    )}
                    <span>{intPlan.status.replace(/_/g, ' ')}</span>
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {intPlan.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">Assigned Owner</span>
                    <span className="font-semibold text-slate-800">{intPlan.ownerRole}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>Target KPI</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {intPlan.kpiMetric}: <strong className="text-emerald-700">{intPlan.kpiTarget}%</strong> (from {intPlan.kpiBaseline}%)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Statutory Deadline</span>
                    </span>
                    <span className="font-semibold text-slate-800">{intPlan.targetDate}</span>
                  </div>
                </div>

                {isApproved && intPlan.approvalRole && (
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span>Sanctioned by: <strong className="text-slate-700">{intPlan.approvalRole}</strong></span>
                    <span>Sanction Date: {intPlan.approvedAt?.split('T')[0]}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
