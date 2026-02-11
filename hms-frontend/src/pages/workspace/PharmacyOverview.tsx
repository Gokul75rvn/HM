import { AlertTriangle, ClipboardCheck, Package, Pill, Truck, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import DataTable from '@components/ui/DataTable';
import AlertPanel from '@components/ui/AlertPanel';
import QuickActions from '@components/ui/QuickActions';
import SectionHeader from '@components/ui/SectionHeader';

const metrics = [
  { icon: <Pill className="w-5 h-5 text-secondary-600" />, title: 'Dispensing Queue', value: 22, subtitle: '6 STAT', accent: 'bg-secondary-50' },
  { icon: <Package className="w-5 h-5 text-primary-600" />, title: 'High-Value Orders', value: 5, subtitle: '2 awaiting verification', accent: 'bg-primary-50' },
  { icon: <Warehouse className="w-5 h-5 text-warning-600" />, title: 'Stockouts', value: 2, subtitle: 'Restock in progress', accent: 'bg-warning-50' },
  { icon: <Truck className="w-5 h-5 text-primary-600" />, title: 'Supplier ETA', value: '4 hrs', subtitle: 'Next delivery window', accent: 'bg-primary-50' },
];

const dispensingColumns = [
  { header: 'Rx', accessor: 'rx' },
  { header: 'Patient', accessor: 'patient' },
  { header: 'Medication', accessor: 'medication' },
  { header: 'Status', accessor: 'status' },
];

const dispensingData = [
  { rx: 'RX-20441', patient: 'Priya Thomas', medication: 'Atorvastatin 20mg', status: 'Verify' },
  { rx: 'RX-20442', patient: 'Noah Alvarez', medication: 'Amoxicillin 500mg', status: 'Dispense' },
  { rx: 'RX-20447', patient: 'Maya Singh', medication: 'Metformin 500mg', status: 'Ready' },
  { rx: 'RX-20455', patient: 'Elijah Rivera', medication: 'Lisinopril 10mg', status: 'STAT' },
];

const inventoryColumns = [
  { header: 'Item', accessor: 'item' },
  { header: 'On Hand', accessor: 'onHand', align: 'right' as const },
  { header: 'Reorder Point', accessor: 'reorder', align: 'right' as const },
  { header: 'Status', accessor: 'status' },
];

const inventoryData = [
  { item: 'Heparin', onHand: 12, reorder: 20, status: 'Low' },
  { item: 'Morphine', onHand: 48, reorder: 30, status: 'Healthy' },
  { item: 'Insulin Glargine', onHand: 18, reorder: 25, status: 'Low' },
  { item: 'Ceftriaxone', onHand: 64, reorder: 40, status: 'Healthy' },
];

const safetyChecks = [
  { label: 'Allergy review', detail: '2 orders flagged', status: 'Review now' },
  { label: 'Controlled substances', detail: 'Daily count due 17:00', status: 'Scheduled' },
  { label: 'Therapeutic duplication', detail: '1 pending override', status: 'Pending' },
];

function PharmacyOverview() {
  return (
    <DashboardLayout
      title="Pharmacy Fulfillment"
      subtitle="Coordinate dispensing, inventory health, and medication safety checks."
      metrics={metrics}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/pharmacy/dispensing" className="btn-outline btn-sm">Print pick list</Link>
          <Link to="/pharmacy/dispensing" className="btn-primary btn-sm">Approve STAT</Link>
        </div>
      }
      mainContent={
        <>
          <section className="card-hover animate-fade-in" style={{ animationDelay: '100ms' }}>
            <SectionHeader 
              label="Dispensing"
              title="Active Prescriptions"
            />
            <DataTable columns={dispensingColumns} data={dispensingData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '200ms' }}>
            <SectionHeader 
              label="Inventory"
              title="Critical Stock Watch"
            />
            <DataTable columns={inventoryColumns} data={inventoryData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '250ms' }}>
            <SectionHeader
              label="Safety"
              title="Medication Safety Checks"
              subtitle="High-risk review tasks for the current shift."
            />
            <div className="grid gap-3">
              {safetyChecks.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-600 mt-1">{item.detail}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-warning-50 text-warning-700 border-warning-200">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      }
      rightPanel={
        <>
          <AlertPanel
            title="Medication Safety"
            alerts={[
              {
                id: 'pharm-alert-1',
                title: 'Allergy cross-check required',
                detail: 'RX-20455 for PT-882134',
                timestamp: '10:00 AM',
                icon: AlertTriangle,
                severity: 'warning',
              },
              {
                id: 'pharm-alert-2',
                title: 'Controlled substance audit',
                detail: 'Verify daily count by 5 PM',
                timestamp: 'Today',
                icon: ClipboardCheck,
                severity: 'info',
              },
            ]}
          />
          <QuickActions
            title="Pharmacy"
            actions={[
              { label: 'Review dispensing queue', description: '22 orders', icon: Pill, href: '/pharmacy/dispensing' },
              { label: 'Inventory review', description: 'Low stock items', icon: Warehouse, href: '/pharmacy/inventory' },
              { label: 'Supplier updates', description: 'Incoming shipments', icon: Truck, href: '/pharmacy/inventory' },
            ]}
          />
        </>
      }
    />
  );
}

export default PharmacyOverview;
