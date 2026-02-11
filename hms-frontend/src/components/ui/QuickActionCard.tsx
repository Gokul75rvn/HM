import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  color?: 'primary' | 'success' | 'warning' | 'info';
}

const COLOR_CLASSES = {
  primary: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  success: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
  warning: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  info: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100',
};

export function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  color = 'primary' 
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="card-interactive text-left group w-full"
    >
      <div className={`inline-flex p-3 rounded-xl mb-3 transition-all duration-300 ${COLOR_CLASSES[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}
