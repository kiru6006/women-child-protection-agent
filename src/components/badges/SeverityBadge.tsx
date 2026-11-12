import { SeverityLevel } from '@/types';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const configs: Record<SeverityLevel, { label: string; bg: string; text: string; border: string }> = {
    CRITICAL: {
      label: 'CRITICAL',
      bg: 'bg-red-50 text-red-800 border-red-300',
      text: 'text-red-800',
      border: 'border-red-300',
    },
    HIGH: {
      label: 'HIGH',
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    MEDIUM: {
      label: 'MEDIUM',
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-300',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
    },
    LOW: {
      label: 'LOW',
      bg: 'bg-slate-50 text-slate-700 border-slate-300',
      text: 'text-slate-700',
      border: 'border-slate-300',
    },
  };

  const config = configs[severity] || configs.LOW;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide border',
        config.bg,
        className
      )}
    >
      {config.label}
    </span>
  );
}

