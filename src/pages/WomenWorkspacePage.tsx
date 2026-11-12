import { Card } from '@/components/common/Card';
import { DomainBadge } from '@/components/badges/DomainBadge';
import { ShieldCheck, ArrowRight, HeartPulse, Scale, Home, Briefcase, RefreshCw } from 'lucide-react';

export function WomenWorkspacePage() {
  const journeyStages = [
    { title: '1. Safety & Distress Intake', desc: 'OSC Intake / Helpline 181 / Women Police Cell', icon: ShieldCheck, status: 'Active (32 Cases)' },
    { title: '2. Immediate Health & Forensic', desc: 'Hospital Medical Exam within 24h (PWDVA s.7)', icon: HeartPulse, status: '2 Breaches Flagged' },
    { title: '3. Legal Protection & DIR', desc: 'Protection Officer DIR filing & DLSA Panel Assignment', icon: Scale, status: '11 Awaiting DIR' },
    { title: '4. Shelter & Emergency Care', desc: 'Sakhi Swadhar Greh / Short Stay Homes', icon: Home, status: '4 Active Admissions' },
    { title: '5. Economic & Livelihood Support', desc: 'MGNREGS / NRLM Sakhī Mandal Linkage', icon: Briefcase, status: '8 Pending Linkage' },
    { title: '6. Outcome & Rehabilitation', desc: '3-Month Survivor Safety & Non-Repetition Audit', icon: RefreshCw, status: '14 Under Verification' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900">Women Protection Intelligence Workspace</h1>
            <DomainBadge domain="WOMEN" />
          </div>
          <p className="text-xs text-slate-500">
            Domain A Operational State Machine: Safety → Support → Legal → Shelter → Economic → Rehabilitation.
          </p>
        </div>
      </div>

      {/* Continuum Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {journeyStages.map((stage) => {
          const Icon = stage.icon;
          return (
            <Card key={stage.title} className="hover:border-rose-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">{stage.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{stage.desc}</p>
                  <div className="mt-3 text-xs font-semibold text-rose-700 flex items-center justify-between">
                    <span>{stage.status}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

