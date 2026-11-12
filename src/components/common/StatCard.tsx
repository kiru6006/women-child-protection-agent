import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  variant?: 'default' | 'alert' | 'warning' | 'success';
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  badge,
  variant = 'default',
  className,
  onClick,
}: StatCardProps) {
  const variantStyles = {
    default: 'border-slate-200 bg-white hover:border-slate-300',
    alert: 'border-red-200 bg-red-50/30 hover:border-red-300',
    warning: 'border-amber-200 bg-amber-50/30 hover:border-amber-300',
    success: 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 rounded-lg border transition-all duration-150',
        variantStyles[variant],
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-500 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</span>
        {badge || (Icon && <Icon className="w-4 h-4 text-slate-400" />)}
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
}

