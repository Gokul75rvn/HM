import { CalendarClock, CreditCard, HeartPulse, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import DataTable from '@components/ui/DataTable';
import AlertPanel from '@components/ui/AlertPanel';
import QuickActions from '@components/ui/QuickActions';
import SectionHeader from '@components/ui/SectionHeader';

const metrics = [
  { icon: <CalendarClock className="w-5 h-5 text-primary-600" />, title: 'Next Appointment', value: 'Mar 4, 10:00', subtitle: 'Cardiology follow-up', accent: 'bg-primary-50' },
  { icon: <HeartPulse className="w-5 h-5 text-secondary-600" />, title: 'Care Plan Tasks', value: 3, subtitle: '1 due today', accent: 'bg-secondary-50' },
  { icon: <CreditCard className="w-5 h-5 text-primary-600" />, title: 'Outstanding Balance', value: '$240', subtitle: 'Next statement Mar 15', accent: 'bg-primary-50' },
  { icon: <MessageCircle className="w-5 h-5 text-success-600" />, title: 'Messages', value: 2, subtitle: '1 from care team', accent: 'bg-success-50' },
];

const visitColumns = [
  { header: 'Date', accessor: 'date' },
  { header: 'Department', accessor: 'department' },
  { header: 'Provider', accessor: 'provider' },
  { header: 'Status', accessor: 'status' },
];

const visitData = [
  { date: 'Mar 4, 2026', department: 'Cardiology', provider: 'Dr. Reynolds', status: 'Confirmed' },
  { date: 'Mar 12, 2026', department: 'Lab', provider: 'Lab Team', status: 'Scheduled' },
  { date: 'Apr 1, 2026', department: 'Radiology', provider: 'Dr. Chen', status: 'Pending' },
];

const careColumns = [
  { header: 'Task', accessor: 'task' },
  { header: 'Due', accessor: 'due' },
  { header: 'Owner', accessor: 'owner' },
];

const careData = [
  { task: 'Daily blood pressure log', due: 'Today', owner: 'You' },
  { task: 'Medication refill review', due: 'Tomorrow', owner: 'Pharmacy' },
  { task: 'Care plan check-in', due: 'Mar 6', owner: 'Care Team' },
];

const medicationData = [
  { medication: 'Atorvastatin 20mg', instruction: 'Nightly', refill: 'In 12 days', status: 'Active' },
  { medication: 'Metformin 500mg', instruction: 'Twice daily', refill: 'In 20 days', status: 'Active' },
  { medication: 'Lisinopril 10mg', instruction: 'Morning', refill: 'Refill requested', status: 'Pending' },
];

function PatientOverview() {
  return (
    <DashboardLayout
      title="Patient Companion"
      subtitle="Manage appointments, care plan tasks, and messages with your care team."
      metrics={metrics}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/patient/appointments" className="btn-outline btn-sm">Download visit summary</Link>
          <Link to="/patient/messages" className="btn-primary btn-sm">Message care team</Link>
        </div>
      }
      mainContent={
        <>
          <section className="card-hover animate-fade-in" style={{ animationDelay: '100ms' }}>
            <SectionHeader 
              label="Appointments"
              title="Upcoming Visits"
            />
            <DataTable columns={visitColumns} data={visitData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '200ms' }}>
            <SectionHeader 
              label="Care Plan"
              title="Next Steps"
            />
            <DataTable columns={careColumns} data={careData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '250ms' }}>
            <SectionHeader
              label="Medications"
              title="Active Prescriptions"
              subtitle="Track dosage and refill timelines."
            />
            <div className="grid gap-3">
              {medicationData.map((item) => (
                <div key={item.medication} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.medication}</p>
                      <p className="text-xs text-slate-600 mt-1">{item.instruction}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.status === 'Pending' ? 'bg-warning-50 text-warning-700 border-warning-200' : 'bg-success-50 text-success-700 border-success-200'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Refill: {item.refill}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      }
      rightPanel={
        <>
          <AlertPanel
            title="Care Notifications"
            alerts={[
              {
                id: 'patient-alert-1',
                title: 'Lab results available',
                detail: 'Review new lipid panel report.',
                timestamp: '09:05 AM',
                icon: ShieldCheck,
                severity: 'info',
              },
              {
                id: 'patient-alert-2',
                title: 'Prescription ready for pickup',
                detail: 'Pharmacy pickup window today.',
                timestamp: 'Yesterday',
                icon: CreditCard,
                severity: 'warning',
              },
            ]}
          />
          <QuickActions
            title="Patient"
            actions={[
              { label: 'Book appointment', description: 'Find next available slot', icon: CalendarClock, href: '/book-appointment' },
              { label: 'Pay balance', description: 'Secure billing portal', icon: CreditCard, href: '/patient/billing' },
              { label: 'Update profile', description: 'Contact and insurance', icon: MessageCircle, href: '/patient/profile' },
            ]}
          />
        </>
      }
    />
  );
}

export default PatientOverview;
