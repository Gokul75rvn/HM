import { useEffect, useMemo, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Account', accessor: 'account' },
  { header: 'Amount', accessor: 'amount', align: 'right' as const },
  { header: 'Payer', accessor: 'payer' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { account: 'AC-22041', amount: '$12,400', payer: 'BlueShield', status: 'Follow-up' },
  { account: 'AC-22055', amount: '$8,920', payer: 'UnitedCare', status: 'Pending remit' },
  { account: 'AC-22062', amount: '$6,310', payer: 'MediChoice', status: 'Appeal' },
  { account: 'AC-22070', amount: '$4,860', payer: 'Metro Health', status: 'Ready' },
];

const cashTrend = [
  { day: 'Mon', cash: 28 },
  { day: 'Tue', cash: 34 },
  { day: 'Wed', cash: 26 },
  { day: 'Thu', cash: 39 },
  { day: 'Fri', cash: 32 },
];

function AccountsCollections() {
  const [rows, setRows] = useState(data);
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
          const patient = bill.patient?.user;
          const patientName = patient ? `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim() : 'Patient Pay';
          const payer = bill.insuranceClaims?.[0]?.insurance?.providerName ?? patientName ?? 'Patient Pay';
          const total = Number(bill.totalAmount ?? 0);

          return {
            account: bill.billNumber ?? bill.id ?? 'ACCT',
            amount: currencyFormatter.format(total),
            payer,
            status: bill.status ?? 'Pending',
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

  return (
    <SectionPage
      title="Collections"
      description="Manage daily cash, payer follow-ups, and patient pay plans."
      breadcrumb={["Accounts", "Collections"]}
      summary={[
        { label: 'Cash Collected', value: '$148K', helper: 'Today', tone: 'success' },
        { label: 'Patient Pay', value: '$32K', helper: 'Auto-pay enabled', tone: 'info' },
        { label: 'Overdue', value: '$24K', helper: 'Requires outreach', tone: 'warning' },
        { label: 'Payment Plans', value: '38', helper: 'Active', tone: 'neutral' },
      ]}
      tableTitle="Top Collections"
      columns={columns}
      data={rows}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Cash Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Daily Collections</h3>
          </div>
          <TrendAreaChart data={cashTrend} dataKey="cash" />
          <p className="text-xs text-slate-600">Shows daily collections (in thousands).</p>
        </section>
      }
    />
  );
}

export default AccountsCollections;
