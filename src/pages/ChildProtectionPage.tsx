import { Card } from '@/components/common/Card';
import { DomainBadge } from '@/components/badges/DomainBadge';
import { Lock } from 'lucide-react';

export function ChildProtectionPage() {
  const plannedModules = [
    {
      title: '1. Identification & Helpline 1098 Handoff',
      status: 'Design Phase',
      desc: 'Seamless transfer protocol between Child Helpline and DCPU / Special Juvenile Police Unit (SJPU).',
    },
    {
      title: '2. Statutory CWC Production DAG',
      status: 'Architecture-Ready',
      desc: 'Strict 24-hour statutory timer under Section 31(1) of the Juvenile Justice Act 2015 with automated show-cause notice generation.',
    },
    {
      title: '3. Forensic Medical Examination (POCSO)',
      status: 'Architecture-Ready',
      desc: 'Section 27 POCSO Act 24-hour medical examination window tracking with child-friendly protocol audit.',
    },
    {
      title: '4. Institutional Care (CCI) & Fit Facility',
      status: 'Design Phase',
      desc: 'Child Care Institution vacancy mapping and Individual Care Plan (ICP) statutory reviews.',
    },
    {
      title: '5. Family Reintegration & Aftercare',
      status: 'Planned',
      desc: 'Post-18 institutional release tracking and Mission Vatsalya sponsorship linkage verification.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-50/60 border border-purple-200 p-5 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Child Protection Intelligence (Domain B)</h1>
            <DomainBadge domain="CHILD" />
          </div>
          <span className="text-xs bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-full border border-purple-300">
            Phase 2 Architecture-Ready
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          <strong>Safeguarding & DPDP Invariant:</strong> To strictly comply with Section 74 of the Juvenile Justice Act 2015 and Section 23 of the POCSO Act 2012, no live child records or case tracking are active in the Phase 1 MVP. Domain B is architecturally segregated and scheduled for activation following independent legal review.
        </p>
      </div>

      {/* Security & Isolation Guarantee */}
      <Card
        header={
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Strict Domain Segregation & RBAC Protocol</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">No Cross-Domain Leakage</span>
            <p className="text-slate-600">
              Women Protection officers cannot access sensitive CWC child records without judicial authorization.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Family Context Isolation</span>
            <p className="text-slate-600">
              Mother-child cases are linked via restricted junction tokens, maintaining independent state machines.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Zero PII / Anonymized Tokens</span>
            <p className="text-slate-600">
              Future case ingestion will strictly utilize irreversible SHA-256 HMAC child tokens (e.g. CASE-POCSO-2026-PAT-0119).
            </p>
          </div>
        </div>
      </Card>

      {/* Planned Phase 2 DAG Modules */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Planned Statutory Modules (Mission Vatsalya Convergence)</h2>
        <div className="space-y-3">
          {plannedModules.map((mod, idx) => (
            <Card key={idx} className="hover:border-purple-200 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{mod.desc}</p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 whitespace-nowrap">
                  {mod.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
