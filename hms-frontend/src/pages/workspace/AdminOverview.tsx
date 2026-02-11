import { Building2, ClipboardCheck, ShieldCheck, Users2, Wrench, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import DataTable from '@components/ui/DataTable';
import AlertPanel from '@components/ui/AlertPanel';
import QuickActions from '@components/ui/QuickActions';
import SectionHeader from '@components/ui/SectionHeader';

const metrics = [
  { icon: <Users2 className="w-5 h-5 text-success-600" />, title: 'Staff On Duty', value: 428, subtitle: '96% attendance', accent: 'bg-success-50' },
  { icon: <Building2 className="w-5 h-5 text-warning-600" />, title: 'Facilities Online', value: '98%', subtitle: '1 wing in maintenance', accent: 'bg-warning-50' },
  { icon: <ClipboardCheck className="w-5 h-5 text-secondary-600" />, title: 'Policy Reviews', value: 6, subtitle: '2 due this week', accent: 'bg-secondary-50' },
  { icon: <UserCheck className="w-5 h-5 text-primary-600" />, title: 'Access Requests', value: 12, subtitle: '8 pending approval', accent: 'bg-primary-50' },
  { icon: <ShieldCheck className="w-5 h-5 text-success-600" />, title: 'Audit Readiness', value: 'Green', subtitle: 'Last review 3 days ago', accent: 'bg-success-50' },
];

const departmentColumns = [
  { header: 'Department', accessor: 'department' },
  { header: 'Occupancy', accessor: 'occupancy', align: 'right' as const },
  { header: 'Open Tickets', accessor: 'tickets', align: 'right' as const },
  { header: 'SLA Risk', accessor: 'risk', align: 'right' as const },
];

const departmentData = [
  { department: 'Emergency', occupancy: '88%', tickets: 3, risk: 'High' },
  { department: 'Surgery', occupancy: '76%', tickets: 1, risk: 'Medium' },
  { department: 'Radiology', occupancy: '69%', tickets: 2, risk: 'Low' },
  { department: 'Pediatrics', occupancy: '81%', tickets: 0, risk: 'Low' },
  { department: 'ICU', occupancy: '92%', tickets: 4, risk: 'High' },
  { department: 'Laboratory', occupancy: '74%', tickets: 1, risk: 'Low' },
];

const accessColumns = [
  { header: 'Request', accessor: 'request' },
  { header: 'Owner', accessor: 'owner' },
  { header: 'Priority', accessor: 'priority' },
];

const accessData = [
  { request: 'New clinician onboarding', owner: 'HR Operations', priority: 'High' },
  { request: 'Elevated pharmacy access', owner: 'Security Team', priority: 'Medium' },
  { request: 'Billing role update', owner: 'Revenue Cycle', priority: 'Low' },
  { request: 'Lab technician credentials', owner: 'Clinical Admin', priority: 'High' },
  { request: 'Visitor system access', owner: 'Facilities', priority: 'Low' },
];

const facilitiesUpdates = [
  { title: 'HVAC inspection', detail: 'East Wing · Due 14:00', status: 'In progress' },
  { title: 'Elevator maintenance', detail: 'Tower B · Vendor on-site', status: 'Scheduled' },
  { title: 'IT patch window', detail: 'Clinical workstations · 22:00', status: 'Ready' },
  { title: 'Security drill', detail: 'Lobby and ER · Tomorrow', status: 'Planned' },
];

function AdminOverview() {
  return (
    <DashboardLayout
      title="Admin Operations"
      subtitle="Control staffing, facilities, and governance workflows across the hospital."
      metrics={metrics}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/users" className="btn-outline btn-sm">Download roster</Link>
          <Link to="/admin/requests/new" className="btn-primary btn-sm">Create request</Link>
        </div>
      }
      mainContent={
        <div className="space-y-6">
          <section className="card-hover animate-fade-in" style={{ animationDelay: '100ms' }}>
            <SectionHeader 
              label="Operational Load"
              title="Department Utilization"
            />
            <DataTable columns={departmentColumns} data={departmentData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '200ms' }}>
            <SectionHeader 
              label="Access Control"
              title="Pending Access Requests"
            />
            <DataTable columns={accessColumns} data={accessData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '250ms' }}>
            <SectionHeader
              label="Facilities"
              title="Operations Update"
              subtitle="Real-time facilities tasks and maintenance schedule."
            />
            <div className="grid gap-3 md:grid-cols-2">
              {facilitiesUpdates.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent hover:border-slate-300/80 transition-all duration-200">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{item.detail}</p>
                  <p className="text-xs text-primary-600 mt-2 font-semibold">{item.status}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      }
      rightPanel={
        <>
          <AlertPanel
            title="Operational Alerts"
            alerts={[
              {
                id: 'admin-alert-1',
                title: 'Generator maintenance due in 48 hours',
                detail: 'Schedule backup coverage for East Wing.',
                timestamp: '09:10 AM',
                icon: Wrench,
                severity: 'warning',
              },
              {
                id: 'admin-alert-2',
                title: 'New policy update awaiting sign-off',
                detail: 'Infection control policy v3.2',
                timestamp: 'Yesterday',
                icon: ShieldCheck,
                severity: 'info',
              },
            ]}
          />
          <QuickActions
            title="Admin"
            actions={[
              { label: 'Review user access', description: '12 approvals pending', icon: Users2, href: '/admin/users' },
              { label: 'Facilities checklist', description: 'Daily operations report', icon: Building2, href: '/admin/departments' },
              { label: 'Compliance pack', description: 'Policy updates', icon: ClipboardCheck, href: '/admin/reports' },
            ]}
          />
        </>
      }
    />
  );
}

export default AdminOverview;
