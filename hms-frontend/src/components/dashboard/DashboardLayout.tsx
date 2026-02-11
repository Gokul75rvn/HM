import { ReactNode } from 'react';
import StatCard, { StatCardProps } from '@components/ui/StatCard';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  metrics: StatCardProps[];
  mainContent: ReactNode;
  rightPanel?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

function DashboardLayout({ title, subtitle, metrics, mainContent, rightPanel, actions, children }: DashboardLayoutProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-2">Command Surface</p>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600 mt-2">{subtitle}</p>
        </div>
        {actions}
      </div>

      <section className="grid grid-cols-4 gap-6 items-start">
        {metrics.map((metric, index) => (
          <div key={metric.title} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <StatCard {...metric} />
          </div>
        ))}
      </section>

      <section className={`grid gap-8 ${rightPanel ? 'xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]' : ''}`}>
        <div className="space-y-6">{mainContent}</div>
        {rightPanel && <div className="space-y-6 animate-slide-in">{rightPanel}</div>}
      </section>

      {children && <section className="space-y-6">{children}</section>}
    </div>
  );
}

export default DashboardLayout;
