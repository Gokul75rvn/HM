import { Banknote, Briefcase, CreditCard, DollarSign, FileBarChart, Wallet2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import DataTable from '@components/ui/DataTable';
import AlertPanel from '@components/ui/AlertPanel';
import QuickActions from '@components/ui/QuickActions';
import SectionHeader from '@components/ui/SectionHeader';
import TrendAreaChart from '@components/ui/TrendAreaChart';

const metrics = [
  { icon: <DollarSign className="w-5 h-5 text-success-600" />, title: 'Collections Today', value: '$148K', subtitle: '3.2% above target', accent: 'bg-success-50' },
  { icon: <Briefcase className="w-5 h-5 text-secondary-600" />, title: 'Claims Pending', value: 76, subtitle: '12 high value', accent: 'bg-secondary-50' },
  { icon: <Wallet2 className="w-5 h-5 text-warning-600" />, title: 'AR Days', value: '28.4', subtitle: 'Target 26', accent: 'bg-warning-50' },
  { icon: <CreditCard className="w-5 h-5 text-primary-600" />, title: 'Denial Rate', value: '3.1%', subtitle: '0.4% MoM', accent: 'bg-primary-50' },
];

const payerColumns = [
  { header: 'Payer', accessor: 'payer' },
  { header: 'Outstanding', accessor: 'outstanding', align: 'right' as const },
  { header: 'Avg Days', accessor: 'days', align: 'right' as const },
  { header: 'Status', accessor: 'status' },
];

const payerData = [
  { payer: 'BlueShield', outstanding: '$420K', days: 32, status: 'Review' },
  { payer: 'UnitedCare', outstanding: '$318K', days: 27, status: 'On track' },
  { payer: 'MediChoice', outstanding: '$210K', days: 35, status: 'Escalate' },
  { payer: 'Metro Health', outstanding: '$156K', days: 24, status: 'On track' },
];

const cashColumns = [
  { header: 'Category', accessor: 'category' },
  { header: 'Value', accessor: 'value', align: 'right' as const },
  { header: 'Trend', accessor: 'trend' },
];

const cashData = [
  { category: 'Patient Pay', value: '$32K', trend: 'Up 6%' },
  { category: 'Insurance Remit', value: '$92K', trend: 'Steady' },
  { category: 'Self Pay Plans', value: '$14K', trend: 'Down 3%' },
];

const denialReasons = [
  { reason: 'Missing documentation', count: 18, impact: '$42K' },
  { reason: 'Coding mismatch', count: 12, impact: '$31K' },
  { reason: 'Authorization expired', count: 9, impact: '$18K' },
  { reason: 'Eligibility issue', count: 7, impact: '$14K' },
];

const collectionsTrend = [
  { day: 'Mon', total: 28 },
  { day: 'Tue', total: 34 },
  { day: 'Wed', total: 26 },
  { day: 'Thu', total: 39 },
  { day: 'Fri', total: 32 },
];

function AccountsOverview() {
  return (
    <DashboardLayout
      title="Revenue Command"
      subtitle="Monitor collections, claims, and payer performance across the cycle."
      metrics={metrics}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/accounts/collections" className="btn-outline btn-sm">Export cash report</Link>
          <Link to="/accounts/claims" className="btn-primary btn-sm">Open claims queue</Link>
        </div>
      }
      mainContent={
        <>
          <section className="card-hover animate-fade-in" style={{ animationDelay: '100ms' }}>
            <SectionHeader 
              label="Payer Mix"
              title="Top Outstanding Balances"
            />
            <DataTable columns={payerColumns} data={payerData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '200ms' }}>
            <SectionHeader 
              label="Cash Flow"
              title="Collections Snapshot"
            />
            <DataTable columns={cashColumns} data={cashData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '230ms' }}>
            <SectionHeader
              label="Trend"
              title="Daily Collections"
              subtitle="Amounts shown in thousands."
            />
            <TrendAreaChart data={collectionsTrend} dataKey="total" />
            <p className="text-xs text-slate-600 mt-2">Collections peak mid-week following payer remittances.</p>
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '250ms' }}>
            <SectionHeader
              label="Denials"
              title="Top Denial Reasons"
              subtitle="Focus areas to reduce rework and speed reimbursement."
            />
            <div className="grid gap-3">
              {denialReasons.map((item) => (
                <div key={item.reason} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.reason}</p>
                      <p className="text-xs text-slate-600 mt-1">{item.count} claims</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-secondary-50 text-secondary-700 border-secondary-200">
                      {item.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      }
      rightPanel={
        <>
          <AlertPanel
            title="Revenue Alerts"
            alerts={[
              {
                id: 'acct-alert-1',
                title: 'High denial spike from MediChoice',
                detail: 'Review coding on 6 claims.',
                timestamp: '09:20 AM',
                icon: FileBarChart,
                severity: 'warning',
              },
              {
                id: 'acct-alert-2',
                title: 'Large payer remittance posted',
                detail: 'BlueShield batch received.',
                timestamp: 'Today',
                icon: Banknote,
                severity: 'info',
              },
            ]}
          />
          <QuickActions
            title="Revenue"
            actions={[
              { label: 'Review collections', description: 'Daily cash log', icon: DollarSign, href: '/accounts/collections' },
              { label: 'Audit claim denials', description: 'Prioritize appeals', icon: Briefcase, href: '/accounts/claims' },
              { label: 'Generate billing statements', description: 'Patient balances', icon: CreditCard, href: '/accounts/collections' },
            ]}
          />
        </>
      }
    />
  );
}

export default AccountsOverview;
