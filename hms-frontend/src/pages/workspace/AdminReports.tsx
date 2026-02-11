import { useEffect, useMemo, useState } from 'react';

import SectionPage, { type SummaryItem } from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Report', accessor: 'report' },
  { header: 'Owner', accessor: 'owner' },
  { header: 'Frequency', accessor: 'frequency' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { report: 'Daily Operations Summary', owner: 'Operations', frequency: 'Daily', status: 'Scheduled' },
  { report: 'Infection Control Audit', owner: 'Quality', frequency: 'Weekly', status: 'Draft' },
  { report: 'Staffing Utilization', owner: 'HR Ops', frequency: 'Monthly', status: 'Ready' },
  { report: 'Incident Review', owner: 'Compliance', frequency: 'Quarterly', status: 'In progress' },
];

const defaultSummary: SummaryItem[] = [
  { label: 'Live Appointments', value: '0', helper: 'Operational load', tone: 'info' },
  { label: 'Active Admissions', value: '0', helper: 'Current census', tone: 'info' },
  { label: 'Monthly Revenue', value: '$0', helper: 'Completed payments', tone: 'success' },
  { label: 'Outstanding Balance', value: '$0', helper: 'Collections needed', tone: 'warning' },
];

function AdminReports() {
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

        const mapped = [
          {
            report: 'Operations KPI Snapshot',
            owner: 'Operations',
            frequency: 'Daily',
            status: overview.liveAppointments > 0 ? 'Ready' : 'Scheduled',
          },
          {
            report: 'Capacity Utilization',
            owner: 'Clinical Ops',
            frequency: 'Weekly',
            status: 'Ready',
          },
          {
            report: 'Revenue Cycle Summary',
            owner: 'Finance',
            frequency: 'Monthly',
            status: overview.outstanding > 0 ? 'In progress' : 'Ready',
          },
          {
            report: 'Admissions Brief',
            owner: 'Quality',
            frequency: 'Weekly',
            status: overview.activeAdmissions > 0 ? 'Draft' : 'Ready',
          },
        ];

        const updatedSummary: SummaryItem[] = [
          {
            label: 'Live Appointments',
            value: String(overview.liveAppointments ?? 0),
            helper: 'Operational load',
            tone: 'info',
          },
          {
            label: 'Active Admissions',
            value: String(overview.activeAdmissions ?? 0),
            helper: 'Current census',
            tone: 'info',
          },
          {
            label: 'Monthly Revenue',
            value: currencyFormatter.format(Number(overview.revenue ?? 0)),
            helper: 'Completed payments',
            tone: 'success',
          },
          {
            label: 'Outstanding Balance',
            value: currencyFormatter.format(Number(overview.outstanding ?? 0)),
            helper: 'Collections needed',
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
      title="Reports"
      description="Generate, schedule, and distribute operational reports."
      breadcrumb={["Admin", "Reports"]}
      summary={summary}
      tableTitle="Reporting Schedule"
      columns={columns}
      data={rows}
    />
  );
}

export default AdminReports;
