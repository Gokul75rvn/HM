import { ReactNode, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import Sidebar from '@components/navigation/Sidebar';
import TopBar from '@components/navigation/TopBar';
import PageHeader from '@components/ui/PageHeader';

interface AppLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: string[];
  children: ReactNode;
}

function AppLayout({ title, description, actions, breadcrumb, children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const role = useMemo(() => user?.role, [user?.role]);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className="min-h-screen bg-light flex text-gray-900">
      <Sidebar role={role} collapsed={collapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 px-6 py-6 space-y-6">
          <PageHeader title={title} description={description} actions={actions} breadcrumb={breadcrumb} />
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;