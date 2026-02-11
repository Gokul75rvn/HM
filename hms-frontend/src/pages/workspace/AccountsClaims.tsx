import { useEffect, useMemo, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Claim', accessor: 'claim' },
  { header: 'Payer', accessor: 'payer' },
  { header: 'Amount', accessor: 'amount', align: 'right' as const },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { claim: 'CL-88014', payer: 'BlueShield', amount: '$18,400', status: 'In review' },
  { claim: 'CL-88018', payer: 'UnitedCare', amount: '$6,920', status: 'Pending' },
  { claim: 'CL-88022', payer: 'MediChoice', amount: '$9,410', status: 'Denied' },
  { claim: 'CL-88031', payer: 'Metro Health', amount: '$4,260', status: 'Approved' },
];

const denialTrend = [
  { week: 'W1', denials: 4 },
  { week: 'W2', denials: 6 },
  { week: 'W3', denials: 3 },
  { week: 'W4', denials: 5 },
];

function AccountsClaims() {
  const [rows, setRows] = useState(data);
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadClaims = async () => {
      try {
        const response = await api.getInsuranceClaims();
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((claim: any) => {
          const payer = claim.insurance?.providerName ?? 'Payer';
          const amount = Number(claim.claimAmount ?? 0);

          return {
            claim: claim.claimNumber ?? claim.id ?? 'CLM',
            payer,
            amount: currencyFormatter.format(amount),
            status: claim.status ?? 'Pending',
          };
        });

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadClaims();

    return () => {
      isMounted = false;
    };
  }, [currencyFormatter]);

  return (
    <SectionPage
      title="Claims"
      description="Monitor claim status, denials, and appeal workflows."
      breadcrumb={["Accounts", "Claims"]}
      summary={[
        { label: 'Claims Pending', value: '76', helper: '12 high value', tone: 'warning' },
        { label: 'Denial Rate', value: '3.1%', helper: '0.4% MoM', tone: 'info' },
        { label: 'Appeals Due', value: '8', helper: 'Within 5 days', tone: 'warning' },
        { label: 'Clean Rate', value: '94%', helper: 'Submitted clean', tone: 'success' },
      ]}
      tableTitle="Claims Queue"
      columns={columns}
      data={rows}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Denial Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Weekly Denials</h3>
          </div>
          <TrendAreaChart data={denialTrend} dataKey="denials" />
          <p className="text-xs text-slate-600">Denial volume over the past four weeks.</p>
        </section>
      }
    />
  );
}

export default AccountsClaims;
