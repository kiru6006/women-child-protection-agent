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
    default: 'border-[#E5B8B7] bg-white hover:border-[#EF5A90]',
    alert: 'border-[#E5B8B7] border-l-4 border-l-red-600 bg-white hover:border-[#EF5A90]',
    warning: 'border-[#E5B8B7] border-l-4 border-l-orange-500 bg-white hover:border-[#EF5A90]',
    success: 'border-[#E5B8B7] border-l-4 border-l-green-600 bg-white hover:border-[#EF5A90]',
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
        {badge || (Icon && <Icon className="w-4 h-4 text-slate-600" />)}
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
}

