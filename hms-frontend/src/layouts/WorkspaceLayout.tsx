import { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/navigation/Sidebar';
import TopBar from '@components/navigation/TopBar';
import type { NavLinkItem } from '@constants/navigation';

interface WorkspaceLayoutProps {
  sidebarItems: NavLinkItem[];
  rightRail?: ReactNode;
}

function WorkspaceLayout({ sidebarItems }: WorkspaceLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/50 flex text-gray-900">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} items={sidebarItems} />
      <div className="flex-1 flex flex-col min-h-0">
        <TopBar />
        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default WorkspaceLayout;
