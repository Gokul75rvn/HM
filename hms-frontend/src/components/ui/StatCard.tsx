type StatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
};

export type { StatCardProps };

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: StatCardProps) {
  return (
    <div className="w-full min-h-[160px] rounded-2xl bg-white p-6 shadow-ambient ring-1 ring-slate-100/50 transition-all duration-300 ease-out hover:shadow-elevated hover:-translate-y-1 hover:ring-slate-200/80 flex flex-col gap-4 min-w-0 overflow-hidden group">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent} transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-sm`}>
        {icon}
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
          {title}
        </p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none">
          {value}
        </p>
        <p className="text-sm text-slate-600 break-words leading-5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default StatCard;