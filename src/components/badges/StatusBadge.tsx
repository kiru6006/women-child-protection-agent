import { GapStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: GapStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs: Record<GapStatus, { label: string; bg: string; text: string; border: string }> = {
    CANDIDATE: {
      label: 'Candidate',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
    },
    UNDER_INVESTIGATION: {
      label: 'Under Investigation',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
    VALIDATED: {
      label: 'Validated Gap',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-300',
    },
    INTERVENTION_PLANNED: {
      label: 'Intervention Planned',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    INTERVENTION_ACTIVE: {
      label: 'Intervention Active',
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-300',
    },
    VERIFIED: {
      label: 'Outcome Verified',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
    },
    CLOSED: {
      label: 'Closed',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
    },
  };

  const config = configs[status] || configs.CANDIDATE;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {config.label}
    </span>
  );
}
