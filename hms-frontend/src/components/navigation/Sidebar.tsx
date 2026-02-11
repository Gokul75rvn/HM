import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNavByRole, type NavLinkItem } from '@constants/navigation';

interface SidebarProps {
  role?: string;
  collapsed: boolean;
  onToggle: () => void;
  items?: NavLinkItem[];
}

function Sidebar({ role, collapsed, onToggle, items }: SidebarProps) {
  const links = useMemo(() => {
    if (items) {
      return items;
    }
    return getNavByRole(role);
  }, [items, role]);

  return (
    <aside
      className={`
        ${collapsed ? 'w-16' : 'w-64'}
        bg-white/95 border-r border-slate-200/60 h-screen flex flex-col overflow-hidden transition-all duration-200 shadow-ambient`}>
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200/60">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary-600 font-semibold">CarePoint</span>
          {!collapsed && <span className="text-slate-900 font-semibold text-lg mt-0.5">Healthcare</span>}
        </div>
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className={`flex-1 py-6 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `group flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-slate-600 hover:bg-primary-50/50 hover:text-primary-700'
              }`
            }
            end>
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center h-9 w-9 rounded-lg flex-shrink-0 transition-colors duration-200 ${
                  collapsed
                    ? isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-primary-100'
                    : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-primary-100'
                }`}>
                  <Icon size={18} />
                </span>
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;