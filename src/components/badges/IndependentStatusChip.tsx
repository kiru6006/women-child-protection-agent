import { cn } from '@/lib/utils';

interface IndependentStatusChipProps {
  dimension: string;
  value: string;
  className?: string;
}

export function IndependentStatusChip({ dimension, value, className }: IndependentStatusChipProps) {
  const normalized = value.toUpperCase();
  let tone = 'bg-slate-100 text-slate-700 border-slate-300';

  if (normalized.includes('BLOCKED') || normalized.includes('NOT_ACHIEVED') || normalized.includes('REJECTED')) {
    tone = 'bg-red-50 text-red-800 border-red-300';
  } else if (normalized.includes('WAITING') || normalized.includes('AWAITING') || normalized.includes('PENDING') || normalized.includes('REVIEW')) {
    tone = 'bg-orange-50 text-orange-800 border-orange-300';
  } else if (normalized.includes('PARTIAL') || normalized.includes('IN_PROGRESS') || normalized.includes('ACTIVE') || normalized.includes('SANCTIONED') || normalized.includes('RELEASED') || normalized.includes('ONGOING')) {
    tone = 'bg-[#FFFACD] text-[#7D2A42] border-[#C98A87]';
  } else if (normalized.includes('VERIFIED') || normalized.includes('ACHIEVED') || normalized.includes('RESOLVED') || normalized.includes('CLOSED') || normalized.includes('DELIVERED') || normalized.includes('DISBURSED') || normalized.includes('COMPLETED')) {
    tone = 'bg-[#DFFFE0] text-[#166534] border-[#16A028]';
  }

  return (
    <div className={cn('inline-flex flex-col px-2 py-1 rounded border text-[10px]', tone, className)}>
      <span className="font-bold uppercase tracking-wider opacity-80">{dimension}</span>
      <span className="font-mono font-bold truncate">{value.replace(/_/g, ' ')}</span>
    </div>
  );
}
