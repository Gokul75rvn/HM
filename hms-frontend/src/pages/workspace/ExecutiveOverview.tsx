import { Activity, AlertTriangle, Banknote, BedDouble, FileBarChart, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import DataTable from '@components/ui/DataTable';
import AlertPanel from '@components/ui/AlertPanel';
import QuickActions from '@components/ui/QuickActions';
import SectionHeader from '@components/ui/SectionHeader';
import TrendAreaChart from '@components/ui/TrendAreaChart';

const metrics = [
  { icon: <BedDouble className="w-5 h-5 text-success-600" />, title: 'Active Beds', value: '312/350', subtitle: '89% occupancy', accent: 'bg-success-50' },
  { icon: <Activity className="w-5 h-5 text-success-600" />, title: 'Admissions Today', value: 48, subtitle: '+12% vs yesterday', accent: 'bg-success-50' },
  { icon: <TrendingUp className="w-5 h-5 text-success-600" />, title: 'Operating Margin', value: '14.8%', subtitle: '+0.6% MoM', accent: 'bg-success-50' },
  { icon: <Users className="w-5 h-5 text-primary-600" />, title: 'Staff On Duty', value: 847, subtitle: '96% scheduled', accent: 'bg-primary-50' },
  { icon: <AlertTriangle className="w-5 h-5 text-warning-600" />, title: 'Critical Alerts', value: 3, subtitle: '2 require action', accent: 'bg-warning-50' },
];

const serviceLineColumns = [
  { header: 'Service Line', accessor: 'line' },
  { header: 'Census', accessor: 'census', align: 'right' as const },
  { header: 'Margin', accessor: 'margin', align: 'right' as const },
  { header: 'Status', accessor: 'status' },
];

const serviceLineData = [
  { line: 'Cardiology', census: '84%', margin: '+4.2%', status: 'On track' },
  { line: 'Oncology', census: '76%', margin: '+2.1%', status: 'Monitor staffing' },
  { line: 'Orthopedics', census: '92%', margin: '+6.7%', status: 'At capacity' },
  { line: 'Emergency', census: '88%', margin: '+1.4%', status: 'High demand' },
  { line: 'Pediatrics', census: '71%', margin: '+3.8%', status: 'Stable' },
  { line: 'Surgery', census: '95%', margin: '+5.2%', status: 'Excellent' },
];

const dischargeColumns = [
  { header: 'Unit', accessor: 'unit' },
  { header: 'Expected Discharges', accessor: 'expected', align: 'right' as const },
  { header: 'Readiness', accessor: 'readiness', align: 'right' as const },
];

const dischargeData = [
  { unit: 'ICU', expected: 4, readiness: '76%' },
  { unit: 'Surgical', expected: 9, readiness: '82%' },
  { unit: 'Med-Surg', expected: 14, readiness: '71%' },
  { unit: 'Pediatrics', expected: 3, readiness: '89%' },
  { unit: 'Cardiac', expected: 6, readiness: '94%' },
  { unit: 'Oncology', expected: 5, readiness: '68%' },
];

const leadershipPulse = [
  { label: 'Safety Rounds', value: '92%', detail: '3 units overdue', tone: 'text-warning-600' },
  { label: 'Staffing Coverage', value: '96%', detail: 'Night shift gaps', tone: 'text-primary-600' },
  { label: 'Critical Capacity', value: '78%', detail: 'ICU steady', tone: 'text-success-600' },
  { label: 'Patient Experience', value: '4.6/5', detail: 'Up 0.2', tone: 'text-secondary-600' },
];

const throughputTrend = [
  { day: 'Mon', volume: 420 },
  { day: 'Tue', volume: 460 },
  { day: 'Wed', volume: 410 },
  { day: 'Thu', volume: 490 },
  { day: 'Fri', volume: 470 },
  { day: 'Sat', volume: 380 },
  { day: 'Sun', volume: 340 },
];

function ExecutiveOverview() {
  return (
    <DashboardLayout
      title="Executive Command"
      subtitle="System-wide operational intelligence, risk posture, and throughput control."
      metrics={metrics}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/executive/trends" className="btn-outline btn-sm">Export KPI Pack</Link>
          <Link to="/executive/briefing" className="btn-primary btn-sm">Launch Briefing</Link>
        </div>
      }
      mainContent={
        <div className="space-y-6">
          <section className="card-hover animate-fade-in" style={{ animationDelay: '100ms' }}>
            <SectionHeader 
              label="Service Lines"
              title="Performance Snapshot"
              badge={<span className="text-xs uppercase tracking-[0.2em] text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Updated 08:45</span>}
            />
            <DataTable columns={serviceLineColumns} data={serviceLineData} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="card-hover animate-fade-in" style={{ animationDelay: '200ms' }}>
              <SectionHeader 
                label="Flow Management"
                title="Discharge Readiness"
              />
              <DataTable columns={dischargeColumns} data={dischargeData} />
            </section>

            <section className="card-hover animate-fade-in" style={{ animationDelay: '250ms' }}>
              <SectionHeader 
                label="Financial Overview"
                title="Revenue Performance"
              />
              <div className="space-y-4">
                {[
                  { label: 'Daily Revenue', value: '$847,200', change: '+8.4%', positive: true },
                  { label: 'Collections Rate', value: '94.2%', change: '+2.1%', positive: true },
                  { label: 'Pending Claims', value: '127', change: '-15', positive: true },
                  { label: 'AR Days', value: '42.3', change: '+1.2', positive: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3.5 bg-gradient-to-br from-slate-50/50 to-transparent border border-slate-200/60 rounded-xl hover:border-slate-300/80 transition-all duration-200">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">{item.value}</span>
                      <span className={`ml-3 text-xs font-semibold ${item.positive ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '300ms' }}>
            <SectionHeader
              label="Leadership Pulse"
              title="Operational Stability"
              subtitle="Real-time signal checks to guide executive focus."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {leadershipPulse.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent hover:border-slate-300/80 transition-all duration-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{item.label}</p>
                  <p className={`text-2xl font-bold mt-2 ${item.tone}`}>{item.value}</p>
                  <p className="text-xs text-slate-600 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '350ms' }}>
            <SectionHeader
              label="Throughput"
              title="Patient Volume"
              subtitle="Daily visits across all departments."
            />
            <TrendAreaChart data={throughputTrend} dataKey="volume" />
            <p className="text-xs text-slate-600 mt-2">Volume is highest mid-week, aligned with elective surgery blocks.</p>
          </section>
        </div>
      }
      rightPanel={
        <>
          <AlertPanel
            title="Strategic Alerts"
            alerts={[
              {
                id: 'exec-alert-1',
                title: 'ED wait time exceeds 42 minutes',
                detail: 'Escalate surge staffing for evening shift.',
                timestamp: '10:10 AM',
                icon: AlertTriangle,
                severity: 'warning',
              },
              {
                id: 'exec-alert-2',
                title: 'Blood bank supply below threshold',
                detail: 'Coordinate with regional supplier by 4 PM.',
                timestamp: '09:30 AM',
                icon: ShieldCheck,
                severity: 'info',
              },
            ]}
          />
          <QuickActions
            title="Executive"
            actions={[
              { label: 'Review capacity forecast', description: 'Next 7 days', icon: FileBarChart, href: '/executive/trends' },
              { label: 'Open compliance dashboard', description: 'Audit-ready summary', icon: ShieldCheck, href: '/executive/compliance' },
              { label: 'Revenue pulse check', description: 'Collections and claims', icon: Banknote, href: '/accounts/overview' },
            ]}
          />
        </>
      }
    />
  );
}

export default ExecutiveOverview;
