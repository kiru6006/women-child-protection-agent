import { EpistemicClass } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, HelpCircle, AlertTriangle, Lightbulb, FileQuestion } from 'lucide-react';

interface EpistemicBadgeProps {
  classification: EpistemicClass;
  showIcon?: boolean;
  className?: string;
}

export function EpistemicBadge({ classification, showIcon = true, className }: EpistemicBadgeProps) {
  const configs: Record<EpistemicClass, { label: string; bg: string; text: string; border: string; icon: typeof CheckCircle2 }> = {
    VERIFIED_FACT: {
      label: 'VERIFIED FACT',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: CheckCircle2,
    },
    INFERENCE: {
      label: 'INFERENCE',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-300',
      icon: HelpCircle,
    },
    HYPOTHESIS: {
      label: 'HYPOTHESIS',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: AlertTriangle,
    },
    RECOMMENDATION: {
      label: 'RECOMMENDATION',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-300',
      icon: Lightbulb,
    },
    DATA_NOT_AVAILABLE: {
      label: 'DATA NOT AVAILABLE',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: FileQuestion,
    },
  };

  const config = configs[classification] || configs.DATA_NOT_AVAILABLE;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-xs',
        config.bg,
        config.text,
        config.border,
        className
      )}
      title={`Epistemic Level: ${config.label}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </span>
  );
}
