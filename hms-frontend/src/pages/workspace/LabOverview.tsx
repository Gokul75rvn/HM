import { Beaker, CheckCircle2, Microscope, Timer, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import DataTable from '@components/ui/DataTable';
import AlertPanel from '@components/ui/AlertPanel';
import QuickActions from '@components/ui/QuickActions';
import SectionHeader from '@components/ui/SectionHeader';

const metrics = [
  { icon: <Beaker className="w-5 h-5 text-secondary-600" />, title: 'Samples In Queue', value: 36, subtitle: '8 priority', accent: 'bg-secondary-50' },
  { icon: <Timer className="w-5 h-5 text-warning-600" />, title: 'Avg Turnaround', value: '42 min', subtitle: 'Target 35 min', accent: 'bg-warning-50' },
  { icon: <CheckCircle2 className="w-5 h-5 text-success-600" />, title: 'QC Pass Rate', value: '98.6%', subtitle: 'Last 24 hrs', accent: 'bg-success-50' },
  { icon: <Microscope className="w-5 h-5 text-error-600" />, title: 'Critical Results', value: 2, subtitle: 'Need review', accent: 'bg-error-50' },
];

const queueColumns = [
  { header: 'Sample ID', accessor: 'sample' },
  { header: 'Panel', accessor: 'panel' },
  { header: 'Priority', accessor: 'priority' },
  { header: 'ETA', accessor: 'eta', align: 'right' as const },
];

const queueData = [
  { sample: 'LB-77421', panel: 'CBC', priority: 'STAT', eta: '12 min' },
  { sample: 'LB-77425', panel: 'CMP', priority: 'Routine', eta: '32 min' },
  { sample: 'LB-77439', panel: 'Lipid Panel', priority: 'STAT', eta: '18 min' },
  { sample: 'LB-77451', panel: 'Coagulation', priority: 'Routine', eta: '40 min' },
];

const qcColumns = [
  { header: 'Instrument', accessor: 'instrument' },
  { header: 'QC Status', accessor: 'status' },
  { header: 'Next Check', accessor: 'next' },
];

const qcData = [
  { instrument: 'Hematology Analyzer A1', status: 'Pass', next: '13:00' },
  { instrument: 'Chemistry Analyzer C3', status: 'Pass', next: '14:30' },
  { instrument: 'Immunoassay I2', status: 'Monitor', next: '12:15' },
];

const resultDelivery = [
  { batch: 'Morning STAT batch', eta: '12:30', recipients: 'ER + ICU', status: 'In transit' },
  { batch: 'Oncology panel', eta: '14:10', recipients: 'Oncology Ward', status: 'Queued' },
  { batch: 'Routine chemistry', eta: '16:00', recipients: 'Outpatient', status: 'Scheduled' },
];

function LabOverview() {
  return (
    <DashboardLayout
      title="Diagnostics Lab"
      subtitle="Track sample throughput, QC, and critical result escalation."
      metrics={metrics}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/lab/queue" className="btn-outline btn-sm">Print batch labels</Link>
          <Link to="/lab/queue" className="btn-primary btn-sm">Open sample intake</Link>
        </div>
      }
      mainContent={
        <>
          <section className="card-hover animate-fade-in" style={{ animationDelay: '100ms' }}>
            <SectionHeader 
              label="Workflow"
              title="Active Sample Queue"
            />
            <DataTable columns={queueColumns} data={queueData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '200ms' }}>
            <SectionHeader 
              label="Quality Control"
              title="Instrument Health"
            />
            <DataTable columns={qcColumns} data={qcData} />
          </section>

          <section className="card-hover animate-fade-in" style={{ animationDelay: '250ms' }}>
            <SectionHeader
              label="Result Delivery"
              title="Outbound Result Batches"
              subtitle="Monitor lab results moving to care teams."
            />
            <div className="grid gap-3">
              {resultDelivery.map((item) => (
                <div key={item.batch} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.batch}</p>
                      <p className="text-xs text-slate-600 mt-1">Recipients: {item.recipients}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-primary-50 text-primary-700 border-primary-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">ETA: {item.eta}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      }
      rightPanel={
        <>
          <AlertPanel
            title="Critical Results"
            alerts={[
              {
                id: 'lab-alert-1',
                title: 'Critical potassium result',
                detail: 'Notify Dr. Reynolds for PT-558201',
                timestamp: '10:12 AM',
                icon: AlertTriangle,
                severity: 'critical',
              },
              {
                id: 'lab-alert-2',
                title: 'QC variance on Immunoassay I2',
                detail: 'Run control sample immediately.',
                timestamp: '09:50 AM',
                icon: Microscope,
                severity: 'warning',
              },
            ]}
          />
          <QuickActions
            title="Lab"
            actions={[
              { label: 'Review STAT samples', description: '8 pending', icon: Microscope, href: '/lab/queue' },
              { label: 'Publish daily report', description: 'Shift summary', icon: CheckCircle2, href: '/lab/reports' },
              { label: 'Calibrate instruments', description: 'QC checklist', icon: Beaker, href: '/lab/reports' },
            ]}
          />
        </>
      }
    />
  );
}

export default LabOverview;
