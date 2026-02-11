import { useEffect, useMemo, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Order', accessor: 'order' },
  { header: 'Patient', accessor: 'patient' },
  { header: 'Panel', accessor: 'panel' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { order: 'LB-77421', patient: 'Priya Thomas', panel: 'CBC', status: 'In progress' },
  { order: 'LB-77439', patient: 'Noah Alvarez', panel: 'CMP', status: 'Ordered' },
  { order: 'LB-77451', patient: 'Maya Singh', panel: 'Lipid Panel', status: 'Completed' },
  { order: 'LB-77455', patient: 'Elijah Rivera', panel: 'Coagulation', status: 'Ordered' },
];

const turnaroundTrend = [
  { hour: '08', minutes: 32 },
  { hour: '10', minutes: 28 },
  { hour: '12', minutes: 34 },
  { hour: '14', minutes: 26 },
  { hour: '16', minutes: 30 },
];

const STATUS_FILTERS = ['All', 'Ordered', 'In progress', 'Completed', 'Cancelled'] as const;

function formatStatus(value?: string) {
  switch (value) {
    case 'ORDERED':
      return 'Ordered';
    case 'SAMPLE_COLLECTED':
    case 'IN_PROGRESS':
      return 'In progress';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return value ?? 'Ordered';
  }
}

function DoctorLabs() {
  const [rows, setRows] = useState(data);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('All');

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const response = await api.getLabOrders();
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((order: any) => {
          const patient = order.patient?.user;
          const patientName = patient ? `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim() : 'Patient';

          return {
            order: order.orderNumber ?? order.id ?? 'LAB',
            patient: patientName || 'Patient',
            panel: order.test?.name ?? 'Lab Panel',
            status: formatStatus(order.status),
          };
        });

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadOrders();

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
      title="Lab Orders"
      description="Track diagnostic orders, results, and escalations."
      breadcrumb={["Doctor", "Lab Orders"]}
      summary={[
        { label: 'Open Orders', value: '12', helper: '3 critical', tone: 'warning' },
        { label: 'Results Today', value: '24', helper: '8 with notes', tone: 'info' },
        { label: 'Pending Sign-off', value: '5', helper: 'Awaiting review', tone: 'warning' },
        { label: 'STAT Turnaround', value: '28 min', helper: 'Target 25 min', tone: 'neutral' },
      ]}
      tableTitle="Active Lab Orders"
      columns={columns}
      data={filteredRows}
      tableFilters={filterChips}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Turnaround Time</p>
            <h3 className="text-lg font-semibold text-slate-900">STAT Result Speed</h3>
          </div>
          <TrendAreaChart data={turnaroundTrend} dataKey="minutes" />
          <p className="text-xs text-slate-600">Average minutes to result for high-priority panels.</p>
        </section>
      }
    />
  );
}

export default DoctorLabs;
