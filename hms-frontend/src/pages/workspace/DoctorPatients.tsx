import { useEffect, useMemo, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Patient', accessor: 'patient' },
  { header: 'MRN', accessor: 'mrn' },
  { header: 'Condition', accessor: 'condition' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { patient: 'Priya Thomas', mrn: 'PT-558201', condition: 'Arrhythmia', status: 'Active' },
  { patient: 'Noah Alvarez', mrn: 'PT-112309', condition: 'Post-op recovery', status: 'Active' },
  { patient: 'Maya Singh', mrn: 'PT-774401', condition: 'Hypertension', status: 'Active' },
  { patient: 'Elijah Rivera', mrn: 'PT-441882', condition: 'New consult', status: 'New' },
];

const acuityTrend = [
  { day: 'Mon', cases: 8 },
  { day: 'Tue', cases: 10 },
  { day: 'Wed', cases: 7 },
  { day: 'Thu', cases: 11 },
  { day: 'Fri', cases: 9 },
  { day: 'Sat', cases: 5 },
];

const STATUS_FILTERS = ['All', 'Active', 'New'] as const;

function computeStatus(createdAt?: string) {
  if (!createdAt) {
    return 'Active';
  }

  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) {
    return 'Active';
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return created >= sevenDaysAgo ? 'New' : 'Active';
}

function DoctorPatients() {
  const [rows, setRows] = useState(data);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('All');

  useEffect(() => {
    let isMounted = true;

    const loadPatients = async () => {
      try {
        const response = await api.getPatients(1, 20);
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((patient: any) => ({
          patient: `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim() || 'Patient',
          mrn: patient.id ?? 'MRN',
          condition: patient.bloodGroup ?? 'General Care',
          status: computeStatus(patient.createdAt),
        }));

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadPatients();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRows = useMemo(() => {
    if (statusFilter === 'All') {
      return rows;
    }

    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  const filterChips = STATUS_FILTERS.map((filter) => {
    const isActive = filter === statusFilter;
    return (
      <button
        key={filter}
        type="button"
        onClick={() => setStatusFilter(filter)}
        className={
          isActive
            ? 'rounded-full bg-slate-900 text-white text-xs font-semibold px-3 py-1'
            : 'rounded-full border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1 hover:border-slate-300'
        }
      >
        {filter}
      </button>
    );
  });

  return (
    <SectionPage
      title="Patient Panel"
      description="Review active cases, follow-ups, and risk flags."
      breadcrumb={["Doctor", "Patients"]}
      summary={[
        { label: 'Active Patients', value: '48', helper: 'Assigned panel', tone: 'info' },
        { label: 'High Risk', value: '5', helper: 'Requires check-in', tone: 'warning' },
        { label: 'Discharges Today', value: '3', helper: 'Awaiting summaries', tone: 'success' },
        { label: 'New Referrals', value: '6', helper: 'This week', tone: 'neutral' },
      ]}
      tableTitle="Active Patient List"
      columns={columns}
      data={filteredRows}
      tableFilters={filterChips}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Acuity Mix</p>
            <h3 className="text-lg font-semibold text-slate-900">Weekly Case Load</h3>
          </div>
          <TrendAreaChart data={acuityTrend} dataKey="cases" />
          <p className="text-xs text-slate-600">Case load trend for the last seven days.</p>
        </section>
      }
    />
  );
}

export default DoctorPatients;
