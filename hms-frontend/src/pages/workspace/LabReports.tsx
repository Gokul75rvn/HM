import { useEffect, useMemo, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Report', accessor: 'report' },
  { header: 'Shift', accessor: 'shift' },
  { header: 'Owner', accessor: 'owner' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { report: 'Daily QC Summary', shift: 'Day', owner: 'Lab Supervisor', status: 'Ordered' },
  { report: 'Critical Result Log', shift: 'Day', owner: 'Lab Lead', status: 'In progress' },
  { report: 'Specimen Rejection', shift: 'Evening', owner: 'QA', status: 'Cancelled' },
  { report: 'Turnaround Metrics', shift: 'All', owner: 'Analytics', status: 'Completed' },
];

const reportTrend = [
  { day: 'Mon', reports: 6 },
  { day: 'Tue', reports: 5 },
  { day: 'Wed', reports: 7 },
  { day: 'Thu', reports: 6 },
  { day: 'Fri', reports: 4 },
];

const STATUS_FILTERS = ['All', 'Ordered', 'In progress', 'Completed', 'Cancelled'] as const;

function formatShift(value?: string) {
  if (!value) {
    return 'All';
  }

  const hour = new Date(value).getHours();
  if (Number.isNaN(hour)) {
    return 'All';
  }

  if (hour < 12) return 'Day';
  if (hour < 18) return 'Evening';
  return 'Night';
}

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

function LabReports() {
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
          const doctor = order.doctor?.user;
          const doctorName = doctor ? `Dr. ${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim() : 'Lab Team';

          return {
            report: order.test?.name ? `${order.test.name} Report` : order.orderNumber ?? 'Lab Report',
            shift: formatShift(order.orderDate),
            owner: doctorName || 'Lab Team',
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
      title="Lab Reports"
      description="Track quality, turnaround, and critical result reporting."
      breadcrumb={["Lab", "Reports"]}
      summary={[
        { label: 'Reports Due', value: '3', helper: 'By end of shift', tone: 'warning' },
        { label: 'Critical Logs', value: '2', helper: 'Awaiting sign-off', tone: 'info' },
        { label: 'QC Compliance', value: '98.6%', helper: 'Last 24 hrs', tone: 'success' },
        { label: 'Rejected Samples', value: '4', helper: 'Require recollect', tone: 'warning' },
      ]}
      tableTitle="Reporting Queue"
      columns={columns}
      data={filteredRows}
      tableFilters={filterChips}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Reporting Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Weekly Report Volume</h3>
          </div>
          <TrendAreaChart data={reportTrend} dataKey="reports" />
          <p className="text-xs text-slate-600">Shift reporting volume over the last five days.</p>
        </section>
      }
    />
  );
}

export default LabReports;
