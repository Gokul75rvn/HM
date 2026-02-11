import { useEffect, useMemo, useState } from 'react';
import SectionPage from '@pages/workspace/SectionPage';
import TrendAreaChart from '@components/ui/TrendAreaChart';
import api from '@services/api';

const columns = [
  { header: 'Time', accessor: 'time' },
  { header: 'Patient', accessor: 'patient' },
  { header: 'Visit Type', accessor: 'visit' },
  { header: 'Location', accessor: 'location' },
];

const data = [
  { time: '09:30', patient: 'Priya Thomas', visit: 'Follow-up', location: 'Clinic 3B' },
  { time: '10:15', patient: 'Noah Alvarez', visit: 'Post-op', location: 'Ward 2A' },
  { time: '11:00', patient: 'Maya Singh', visit: 'Lab review', location: 'Tele-visit' },
  { time: '13:30', patient: 'Elijah Rivera', visit: 'New consult', location: 'Clinic 4C' },
];

const scheduleTrend = [
  { hour: '08', visits: 1 },
  { hour: '10', visits: 2 },
  { hour: '12', visits: 1 },
  { hour: '14', visits: 2 },
  { hour: '16', visits: 1 },
  { hour: '18', visits: 0 },
];

function DoctorSchedule() {
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }, []);
  const [rows, setRows] = useState(data);

  useEffect(() => {
    const doctorId = storedUser?.doctorId;
    if (!doctorId) {
      return;
    }

    const loadAppointments = async () => {
      try {
        const response = await api.getDoctorAppointments(doctorId);
        const mapped = (response.data || []).map((item: any) => ({
          time: item.appointmentTime ?? '09:00',
          patient: item.patient?.user ? `${item.patient.user.firstName} ${item.patient.user.lastName}` : 'Patient',
          visit: item.type ?? 'Consult',
          location: item.department?.name ?? 'Main Wing',
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
      title="Schedule"
      description="Manage appointments, rounds, and provider availability."
      breadcrumb={["Doctor", "Schedule"]}
      summary={[
        { label: 'Appointments Today', value: '12', helper: '3 tele-visits', tone: 'info' },
        { label: 'Open Slots', value: '4', helper: 'Next 48 hours', tone: 'success' },
        { label: 'Follow-ups', value: '6', helper: 'Pending labs', tone: 'warning' },
        { label: 'On-call', value: 'Yes', helper: 'Until 6 PM', tone: 'neutral' },
      ]}
      tableTitle="Today Schedule"
      columns={columns}
      data={rows}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Daily Load</p>
            <h3 className="text-lg font-semibold text-slate-900">Appointment Density</h3>
          </div>
          <TrendAreaChart data={scheduleTrend} dataKey="visits" />
          <p className="text-xs text-slate-600">Peak load is expected between 10:00 and 14:00.</p>
        </section>
      }
    />
  );
}

export default DoctorSchedule;
