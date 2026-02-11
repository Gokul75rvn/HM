import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

type RoleCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  href: string;
};

const RoleCard = ({ icon: Icon, title, subtitle, description, href }: RoleCardProps) => {
  return (
    <Link
      to={href}
      className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/60 hover:bg-white/10 transition-all duration-200"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 shadow-inner shadow-cyan-500/30 group-hover:scale-105 transition">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">{title}</p>
          <h3 className="text-xl font-semibold text-white">{subtitle}</h3>
        </div>
      </div>
      <p className="text-slate-300 text-sm">{description}</p>
    </Link>
  );
};

export default RoleCard;