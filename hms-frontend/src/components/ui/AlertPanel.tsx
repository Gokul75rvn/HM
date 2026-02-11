import type { LucideIcon } from 'lucide-react';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface AlertItem {
  id: string;
  title: string;
  detail?: string;
  timestamp?: string;
  icon?: LucideIcon;
  severity?: AlertSeverity;
}

interface AlertPanelProps {
  title: string;
  alerts: AlertItem[];
}

const SEVERITY_BG: Record<AlertSeverity, string> = {
  info: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  critical: 'bg-rose-50 text-rose-800 border-rose-200',
};

function AlertPanel({ title, alerts }: AlertPanelProps) {
  return (
    <div className="card-hover space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Alerts</p>
        <h3 className="text-lg font-bold text-slate-900 mt-1">{title}</h3>
      </div>
      <div className="space-y-2.5">
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${SEVERITY_BG[alert.severity ?? 'info']} animate-fade-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {alert.icon && (
              <span className="mt-0.5">
                <alert.icon className="w-5 h-5" />
              </span>
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">{alert.title}</p>
              {alert.detail && <p className="text-xs opacity-90 mt-0.5">{alert.detail}</p>}
              {alert.timestamp && <p className="text-[11px] uppercase tracking-wider opacity-75 mt-1.5">{alert.timestamp}</p>}
            </div>
          </div>
        ))}
        {alerts.length === 0 && <p className="text-sm text-slate-500 text-center py-4">All systems stable.</p>}
      </div>
    </div>
  );
}

export default AlertPanel;
