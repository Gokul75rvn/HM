import { ReactNode } from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

function SectionHeader({ label, title, subtitle, badge, actions }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="space-y-1">
        {label && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            {label}
          </p>
        )}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {badge && badge}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-600 mt-1.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
