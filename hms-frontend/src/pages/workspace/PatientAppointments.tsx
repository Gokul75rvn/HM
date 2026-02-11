import { useEffect, useMemo, useState } from 'react';
import SectionPage from '@pages/workspace/SectionPage';
import TrendAreaChart from '@components/ui/TrendAreaChart';
import api from '@services/api';

const columns = [
  { header: 'Date', accessor: 'date' },
  { header: 'Clinic', accessor: 'clinic' },
  { header: 'Provider', accessor: 'provider' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { date: 'Mar 4, 2026', clinic: 'Cardiology', provider: 'Dr. Reynolds', status: 'Confirmed' },
  { date: 'Mar 12, 2026', clinic: 'Lab', provider: 'Lab Team', status: 'Scheduled' },
  { date: 'Apr 1, 2026', clinic: 'Radiology', provider: 'Dr. Chen', status: 'Pending' },
  { date: 'Apr 18, 2026', clinic: 'Wellness', provider: 'Dr. Patel', status: 'Waitlist' },
];

const visitTrend = [
  { day: 'Mon', visits: 2 },
  { day: 'Tue', visits: 3 },
  { day: 'Wed', visits: 1 },
  { day: 'Thu', visits: 4 },
  { day: 'Fri', visits: 2 },
  { day: 'Sat', visits: 1 },
  { day: 'Sun', visits: 0 },
];

function PatientAppointments() {
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }, []);
  const [rows, setRows] = useState(data);

  useEffect(() => {
    const patientId = storedUser?.patientId;
    if (!patientId) {
      return;
    }

    const loadAppointments = async () => {
      try {
        const response = await api.getPatientAppointments(patientId);
        const mapped = (response.data || []).map((item: any) => ({
          date: new Date(item.appointmentDate).toLocaleDateString(),
          clinic: item.department?.name ?? 'General',
          provider: item.doctor?.user ? `Dr. ${item.doctor.user.firstName} ${item.doctor.user.lastName}` : 'Assigned Provider',
          status: item.status ?? 'Scheduled',
        }));
        if (mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data
      }
    };

    loadAppointments();
  }, [storedUser]);

  return (
    <SectionPage
      title="Appointments"
      description="View upcoming visits and manage scheduling requests."
      breadcrumb={["Patient", "Appointments"]}
      summary={[
        { label: 'Upcoming Visits', value: '4', helper: 'Next 90 days', tone: 'info' },
        { label: 'Tele-visits', value: '2', helper: 'Video enabled', tone: 'success' },
        { label: 'Reschedules', value: '1', helper: 'Awaiting confirmation', tone: 'warning' },
        { label: 'Care Team', value: '5', helper: 'Assigned providers', tone: 'neutral' },
      ]}
      tableTitle="Appointment Timeline"
      columns={columns}
      data={rows}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Weekly Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Visit Volume</h3>
          </div>
          <TrendAreaChart data={visitTrend} dataKey="visits" />
          <p className="text-xs text-slate-600">Shows the distribution of visits across the last 7 days.</p>
        </section>
      }
    />
  );
}

export default PatientAppointments;
