import { useEffect, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Sample ID', accessor: 'sample' },
  { header: 'Panel', accessor: 'panel' },
  { header: 'Priority', accessor: 'priority' },
  { header: 'ETA', accessor: 'eta', align: 'right' as const },
];

const data = [
  { sample: 'LB-77421', panel: 'CBC', priority: 'STAT', eta: '12 min' },
  { sample: 'LB-77425', panel: 'CMP', priority: 'Routine', eta: '32 min' },
  { sample: 'LB-77439', panel: 'Lipid Panel', priority: 'STAT', eta: '18 min' },
  { sample: 'LB-77451', panel: 'Coagulation', priority: 'Routine', eta: '40 min' },
];

const queueTrend = [
  { hour: '08', samples: 12 },
  { hour: '10', samples: 18 },
  { hour: '12', samples: 15 },
  { hour: '14', samples: 20 },
  { hour: '16', samples: 11 },
];

function formatEta(value?: string) {
  if (!value) {
    return 'TBD';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'TBD';
  }

  return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function LabQueue() {
  const [rows, setRows] = useState(data);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const response = await api.getLabOrders();
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((order: any) => ({
          sample: order.orderNumber ?? order.id ?? 'LAB',
          panel: order.test?.name ?? 'Lab Panel',
          priority: order.status ?? 'ORDERED',
          eta: formatEta(order.sampleCollectionDate ?? order.orderDate),
        }));

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

  return (
    <SectionPage
      title="Lab Queue"
      description="Monitor incoming samples and prioritize STAT processing."
      breadcrumb={["Lab", "Queue"]}
      summary={[
        { label: 'Samples Waiting', value: '36', helper: '8 STAT', tone: 'warning' },
        { label: 'Avg Turnaround', value: '42 min', helper: 'Target 35 min', tone: 'warning' },
        { label: 'QC Holds', value: '2', helper: 'Instrument I2', tone: 'info' },
        { label: 'Completed Today', value: '184', helper: 'Shift total', tone: 'success' },
      ]}
      tableTitle="Active Queue"
      columns={columns}
      data={rows}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Queue Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Hourly Sample Load</h3>
          </div>
          <TrendAreaChart data={queueTrend} dataKey="samples" />
          <p className="text-xs text-slate-600">Peak processing occurs between 12:00 and 14:00.</p>
        </section>
      }
    />
  );
}

export default LabQueue;
