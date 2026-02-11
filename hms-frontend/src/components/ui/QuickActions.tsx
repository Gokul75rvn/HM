import type { LucideIcon } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export type QuickAction = {
  label: string;
  description?: string;
  icon?: LucideIcon;
  href?: string;
};

interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
}

function QuickActions({ title, actions }: QuickActionsProps) {
  return (
    <div className="card-hover space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">{title}</p>
        <h3 className="text-lg font-bold text-slate-900 mt-1">Quick Actions</h3>
      </div>
      <div className="space-y-2.5">
        {actions.map((action, index) => (
          <Fragment key={action.label}>
            {action.href ? (
              <Link
                className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50/30 to-transparent px-4 py-3.5 hover:border-primary-300 hover:bg-primary-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                to={action.href}
              >
                <div className="flex items-center gap-3">
                  {action.icon && (
                    <span className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                      <action.icon className="w-4 h-4" />
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                    {action.description && <p className="text-xs text-slate-600">{action.description}</p>}
                  </div>
                </div>
                <span className="text-xs uppercase tracking-wider text-primary-600 font-medium group-hover:translate-x-0.5 transition-transform">Go →</span>
              </Link>
            ) : (
              <div 
                className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50/30 to-transparent px-4 py-3.5 opacity-60 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {action.icon && (
                  <span className="p-2 rounded-lg bg-slate-100 text-slate-500">
                    <action.icon className="w-4 h-4" />
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-700">{action.label}</p>
                  {action.description && <p className="text-xs text-slate-500">{action.description}</p>}
                </div>
                <span className="ml-auto text-xs uppercase tracking-wider text-slate-400 font-medium">Soon</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
