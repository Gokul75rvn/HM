import { useEffect, useMemo, useState } from 'react';

import SectionPage, { type SummaryItem } from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Program', accessor: 'program' },
  { header: 'Status', accessor: 'status' },
  { header: 'Owner', accessor: 'owner' },
  { header: 'Next Audit', accessor: 'nextAudit' },
];

const data = [
  { program: 'HIPAA Controls', status: 'On track', owner: 'Security', nextAudit: 'Apr 12' },
  { program: 'Joint Commission', status: 'In progress', owner: 'Quality', nextAudit: 'May 02' },
  { program: 'Medication Safety', status: 'Action required', owner: 'Pharmacy', nextAudit: 'Mar 20' },
  { program: 'Infection Control', status: 'On track', owner: 'Clinical Ops', nextAudit: 'Apr 01' },
];

const defaultSummary: SummaryItem[] = [
  { label: 'Outstanding Balance', value: '$0', helper: 'Revenue risk', tone: 'warning' },
  { label: 'Live Appointments', value: '0', helper: 'Operational load', tone: 'info' },
  { label: 'Active Admissions', value: '0', helper: 'Current census', tone: 'info' },
  { label: 'Capacity Buffer', value: '0%', helper: 'Available beds', tone: 'success' },
];

function ExecutiveCompliance() {
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

        const outstanding = Number(overview.outstanding ?? 0);
        const availableBeds = Number(overview.beds?.available ?? 0);
        const occupiedBeds = Number(overview.beds?.occupied ?? 0);
        const totalBeds = availableBeds + occupiedBeds;
        const bufferPercent = totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 0;

        const mapped = [
          {
            program: 'Revenue Integrity',
            status: outstanding > 0 ? 'Action required' : 'On track',
            owner: 'Finance',
            nextAudit: 'Mar 15',
          },
          {
            program: 'Capacity Readiness',
            status: availableBeds > occupiedBeds ? 'On track' : 'In progress',
            owner: 'Operations',
            nextAudit: 'Apr 02',
          },
          {
            program: 'Clinical Throughput',
            status: overview.liveAppointments > 0 ? 'In progress' : 'On track',
            owner: 'Clinical Ops',
            nextAudit: 'Apr 18',
          },
          {
            program: 'Admission Oversight',
            status: overview.activeAdmissions > 0 ? 'On track' : 'Stable',
            owner: 'Quality',
            nextAudit: 'Apr 28',
          },
        ];

        const updatedSummary: SummaryItem[] = [
          {
            label: 'Outstanding Balance',
            value: currencyFormatter.format(outstanding),
            helper: 'Revenue risk',
            tone: outstanding > 0 ? 'warning' : 'success',
          },
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
            label: 'Capacity Buffer',
            value: `${bufferPercent}%`,
            helper: `${availableBeds} beds available`,
            tone: bufferPercent >= 15 ? 'success' : 'warning',
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
      title="Compliance Command"
      description="Track regulatory readiness, audit timelines, and governance outcomes."
      breadcrumb={["Executive", "Compliance"]}
      summary={summary}
      tableTitle="Compliance Programs"
      columns={columns}
      data={rows}
    />
  );
}

export default ExecutiveCompliance;
