import { useEffect, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Item', accessor: 'item' },
  { header: 'On Hand', accessor: 'onHand', align: 'right' as const },
  { header: 'Reorder Point', accessor: 'reorder', align: 'right' as const },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { item: 'Heparin', onHand: 12, reorder: 20, status: 'Low' },
  { item: 'Morphine', onHand: 48, reorder: 30, status: 'Healthy' },
  { item: 'Insulin Glargine', onHand: 18, reorder: 25, status: 'Low' },
  { item: 'Ceftriaxone', onHand: 64, reorder: 40, status: 'Healthy' },
];

const stockTrend = [
  { day: 'Mon', stock: 76 },
  { day: 'Tue', stock: 72 },
  { day: 'Wed', stock: 70 },
  { day: 'Thu', stock: 68 },
  { day: 'Fri', stock: 74 },
];

function PharmacyInventory() {
  const [rows, setRows] = useState(data);

  useEffect(() => {
    let isMounted = true;

    const loadInventory = async () => {
      try {
        const response = await api.getMedicines();
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((medicine: any) => {
          const stock = Number(medicine.stock ?? 0);
          const reorder = Number(medicine.reorderLevel ?? 0);
          const status = stock <= reorder ? 'Low' : 'Healthy';

          return {
            item: medicine.name ?? 'Medication',
            onHand: stock,
            reorder,
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

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SectionPage
      title="Inventory"
      description="Track stock levels, supplier orders, and controlled substances."
      breadcrumb={["Pharmacy", "Inventory"]}
      summary={[
        { label: 'Low Stock Items', value: '12', helper: 'Need reorder', tone: 'warning' },
        { label: 'Backorders', value: '3', helper: 'Supplier delay', tone: 'warning' },
        { label: 'Controlled Audits', value: '2', helper: 'Due this week', tone: 'info' },
        { label: 'Stock Value', value: '$1.4M', helper: 'Current on-hand', tone: 'success' },
      ]}
      tableTitle="Inventory Watchlist"
      columns={columns}
      data={rows}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Stock Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Weekly Stock Coverage</h3>
          </div>
          <TrendAreaChart data={stockTrend} dataKey="stock" />
          <p className="text-xs text-slate-600">Overall coverage across critical items.</p>
        </section>
      }
    />
  );
}

export default PharmacyInventory;
