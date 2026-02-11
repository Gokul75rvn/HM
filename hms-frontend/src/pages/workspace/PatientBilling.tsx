import { useEffect, useMemo, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Statement', accessor: 'statement' },
  { header: 'Amount', accessor: 'amount', align: 'right' as const },
  { header: 'Due', accessor: 'due' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { statement: 'Feb 2026', amount: '$240', due: 'Mar 15', status: 'GENERATED' },
  { statement: 'Jan 2026', amount: '$0', due: 'Paid', status: 'PAID' },
  { statement: 'Dec 2025', amount: '$85', due: 'Paid', status: 'PAID' },
];

const billingTrend = [
  { month: 'Oct', amount: 120 },
  { month: 'Nov', amount: 80 },
  { month: 'Dec', amount: 95 },
  { month: 'Jan', amount: 0 },
  { month: 'Feb', amount: 240 },
];

const STATUS_FILTERS = ['All', 'GENERATED', 'PAID', 'PARTIAL', 'CANCELLED'] as const;

function formatStatementDate(value?: string) {
  if (!value) {
    return 'Statement';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Statement';
  }

  return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDueDate(value?: string) {
  if (!value) {
    return 'TBD';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'TBD';
  }

  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function PatientBilling() {
  const [rows, setRows] = useState(data);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('All');
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadBills = async () => {
      try {
        const response = await api.getBills();
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((bill: any) => {
          const status = bill.status ?? 'GENERATED';

          return {
            statement: formatStatementDate(bill.billDate ?? bill.createdAt),
            amount: currencyFormatter.format(Number(bill.totalAmount ?? 0)),
            due: status === 'PAID' ? 'Paid' : formatDueDate(bill.dueDate),
            status,
          };
        });

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadBills();

    return () => {
      isMounted = false;
    };
  }, [currencyFormatter]);

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
      title="Billing"
      description="Review statements, payment plans, and insurance coverage."
      breadcrumb={["Patient", "Billing"]}
      summary={[
        { label: 'Outstanding Balance', value: '$240', helper: 'Due Mar 15', tone: 'warning' },
        { label: 'Insurance Claims', value: '2', helper: 'In progress', tone: 'info' },
        { label: 'Payment Plan', value: 'Active', helper: 'Auto-pay enabled', tone: 'success' },
        { label: 'Statements', value: '8', helper: 'Past 12 months', tone: 'neutral' },
      ]}
      tableTitle="Billing Statements"
      columns={columns}
      data={filteredRows}
      tableFilters={filterChips}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Billing Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Monthly Balance</h3>
          </div>
          <TrendAreaChart data={billingTrend} dataKey="amount" />
          <p className="text-xs text-slate-600">Shows billed totals for the last five months.</p>
        </section>
      }
    />
  );
}

export default PatientBilling;
