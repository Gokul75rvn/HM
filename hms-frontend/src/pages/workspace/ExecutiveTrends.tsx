import { useEffect, useMemo, useState } from 'react';

import SectionPage, { type SummaryItem } from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Metric', accessor: 'metric' },
  { header: 'Current', accessor: 'current', align: 'right' as const },
  { header: '30d Trend', accessor: 'trend', align: 'right' as const },
  { header: 'Direction', accessor: 'direction' },
];

const data = [
  { metric: 'Average LOS', current: '4.2 days', trend: '-3.4%', direction: 'Improving' },
  { metric: 'ED Wait Time', current: '41 min', trend: '+4.1%', direction: 'Needs focus' },
  { metric: 'Readmission Rate', current: '7.2%', trend: '-0.8%', direction: 'Improving' },
  { metric: 'Surgery Utilization', current: '86%', trend: '+2.5%', direction: 'Stable' },
];

const defaultSummary: SummaryItem[] = [
  { label: 'Live Appointments', value: '0', helper: 'Scheduled/active', tone: 'info' },
  { label: 'Active Admissions', value: '0', helper: 'Currently admitted', tone: 'warning' },
  { label: 'Capacity Buffer', value: '0%', helper: 'Available beds', tone: 'success' },
  { label: 'Outstanding Balance', value: '$0', helper: 'Across all bills', tone: 'warning' },
];

function ExecutiveTrends() {
  const [rows, setRows] = useState(data);
  const [summary, setSummary] = useState<SummaryItem[]>(defaultSummary);
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      try {
        const response = await api.getReportsOverview();
        const overview = response.data?.data ?? response.data;
        if (!overview) {
          return;
        }

        const availableBeds = Number(overview.beds?.available ?? 0);
        const occupiedBeds = Number(overview.beds?.occupied ?? 0);
        const totalBeds = availableBeds + occupiedBeds;
        const bufferPercent = totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 0;

        const mapped = [
          {
            metric: 'Live Appointments',
            current: String(overview.liveAppointments ?? 0),
            trend: 'N/A',
            direction: 'Current',
          },
          {
            metric: 'Active Admissions',
            current: String(overview.activeAdmissions ?? 0),
            trend: 'N/A',
            direction: 'Current',
          },
          {
            metric: 'Available Beds',
            current: String(availableBeds),
            trend: 'N/A',
            direction: 'Capacity',
          },
          {
            metric: 'Monthly Revenue',
            current: `$${overview.revenue ?? 0}`,
            trend: 'N/A',
            direction: 'Current',
          },
        ];

        const updatedSummary: SummaryItem[] = [
          {
            label: 'Live Appointments',
            value: String(overview.liveAppointments ?? 0),
            helper: 'Scheduled/active',
            tone: 'info',
          },
          {
            label: 'Active Admissions',
            value: String(overview.activeAdmissions ?? 0),
            helper: 'Currently admitted',
            tone: 'warning',
          },
          {
            label: 'Capacity Buffer',
            value: `${bufferPercent}%`,
            helper: `${availableBeds} beds available`,
            tone: bufferPercent >= 15 ? 'success' : 'warning',
          },
          {
            label: 'Outstanding Balance',
            value: currencyFormatter.format(Number(overview.outstanding ?? 0)),
            helper: 'Across all bills',
            tone: Number(overview.outstanding ?? 0) > 0 ? 'warning' : 'success',
          },
        ];

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
          setSummary(updatedSummary);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, [currencyFormatter]);

  return (
    <SectionPage
      title="Executive Trends"
      description="Monitor operational and clinical KPIs over the past 30 days."
      breadcrumb={["Executive", "Trends"]}
      summary={summary}
      tableTitle="KPI Trendlines"
      columns={columns}
      data={rows}
    />
  );
}

export default ExecutiveTrends;
