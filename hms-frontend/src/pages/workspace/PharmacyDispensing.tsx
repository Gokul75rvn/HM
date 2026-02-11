import { useEffect, useState } from 'react';

import TrendAreaChart from '@components/ui/TrendAreaChart';
import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Rx', accessor: 'rx' },
  { header: 'Patient', accessor: 'patient' },
  { header: 'Medication', accessor: 'medication' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { rx: 'RX-20441', patient: 'Priya Thomas', medication: 'Atorvastatin 20mg', status: 'Verify' },
  { rx: 'RX-20442', patient: 'Noah Alvarez', medication: 'Amoxicillin 500mg', status: 'Dispense' },
  { rx: 'RX-20447', patient: 'Maya Singh', medication: 'Metformin 500mg', status: 'Ready' },
  { rx: 'RX-20455', patient: 'Elijah Rivera', medication: 'Lisinopril 10mg', status: 'STAT' },
];

const dispensingTrend = [
  { hour: '08', orders: 18 },
  { hour: '10', orders: 24 },
  { hour: '12', orders: 22 },
  { hour: '14', orders: 28 },
  { hour: '16', orders: 19 },
];

function PharmacyDispensing() {
  const [rows, setRows] = useState(data);

  useEffect(() => {
    let isMounted = true;

    const loadQueue = async () => {
      try {
        const response = await api.getPharmacyQueue();
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((entry: any) => {
          const prescription = entry.prescription ?? entry;
          const patient = prescription.patient?.user;
          const patientName = patient ? `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim() : 'Patient';
          const medicines = Array.isArray(prescription.medicines)
            ? prescription.medicines
                .map((item: any) => item.medicine?.name)
                .filter(Boolean)
                .join(', ')
            : 'Medication';

          return {
            rx: prescription.prescriptionNumber ?? prescription.id ?? 'RX',
            patient: patientName || 'Patient',
            medication: medicines || 'Medication',
            status: prescription.status ?? entry.status ?? 'Pending',
          };
        });

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadQueue();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SectionPage
      title="Dispensing"
      description="Verify prescriptions, safety checks, and fulfill STAT orders."
      breadcrumb={["Pharmacy", "Dispensing"]}
      summary={[
        { label: 'Queue Size', value: '22', helper: '6 STAT', tone: 'warning' },
        { label: 'Verification SLA', value: '18 min', helper: 'Target 15 min', tone: 'warning' },
        { label: 'Ready for Pickup', value: '9', helper: 'Awaiting courier', tone: 'info' },
        { label: 'Completed Today', value: '142', helper: 'Shift total', tone: 'success' },
      ]}
      tableTitle="Active Prescriptions"
      columns={columns}
      data={rows}
      extraContent={
        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Dispensing Trend</p>
            <h3 className="text-lg font-semibold text-slate-900">Hourly Orders</h3>
          </div>
          <TrendAreaChart data={dispensingTrend} dataKey="orders" />
          <p className="text-xs text-slate-600">Peak dispensing occurs early afternoon.</p>
        </section>
      }
    />
  );
}

export default PharmacyDispensing;
