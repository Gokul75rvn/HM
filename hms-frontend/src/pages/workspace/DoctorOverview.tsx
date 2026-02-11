import { HeartPulse, Microscope, Pill, Stethoscope, Calendar, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@components/ui/StatCard';
import DataTable from '@components/ui/DataTable';
import PageHeader from '@components/ui/PageHeader';
import SectionHeader from '@components/ui/SectionHeader';

const appointmentColumns = [
  { header: 'Time', accessor: 'time' },
  { header: 'Patient', accessor: 'patient' },
  { header: 'Purpose', accessor: 'type' },
  { header: 'Room', accessor: 'room' },
  {
    header: 'Priority',
    accessor: 'priority',
    render: (row: any) => {
      const priorityColors: Record<string, string> = {
        'STAT': 'bg-red-100 text-red-700 border-red-200',
        'High': 'bg-amber-100 text-amber-700 border-amber-200',
        'Routine': 'bg-blue-100 text-blue-700 border-blue-200',
      };
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColors[row.priority] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          {row.priority}
        </span>
      );
    }
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (row: any) => {
      const statusColors: Record<string, string> = {
        'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'Waiting': 'bg-amber-100 text-amber-700 border-amber-200',
        'Scheduled': 'bg-gray-100 text-gray-700 border-gray-200',
      };
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[row.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          {row.status}
        </span>
      );
    }
  },
];

const appointmentData = [
  { time: '08:00', patient: 'Sarah Mitchell', type: 'Follow-up', room: '201-A', priority: 'Routine', status: 'Completed' },
  { time: '08:30', patient: 'James Rodriguez', type: 'Consultation', room: '201-B', priority: 'High', status: 'Completed' },
  { time: '09:15', patient: 'Emily Chen', type: 'Post-op Review', room: '201-A', priority: 'High', status: 'In Progress' },
  { time: '10:00', patient: 'Michael Davis', type: 'Annual Physical', room: '202-A', priority: 'Routine', status: 'Waiting' },
  { time: '10:45', patient: 'Sophia Patel', type: 'Lab Results', room: '201-B', priority: 'STAT', status: 'Waiting' },
  { time: '11:30', patient: 'Daniel Kim', type: 'New Patient', room: '203-A', priority: 'Routine', status: 'Scheduled' },
  { time: '13:00', patient: 'Olivia Martinez', type: 'Follow-up', room: '201-A', priority: 'Routine', status: 'Scheduled' },
  { time: '14:00', patient: 'Ethan Brown', type: 'Medication Review', room: '202-B', priority: 'High', status: 'Scheduled' },
];

const patientQueueData = [
  { id: 'PT-5582', name: 'Emily Chen', condition: 'Post-op recovery', priority: 'High', lastVitals: '2h ago', status: 'In Consultation' },
  { id: 'PT-5601', name: 'Michael Davis', condition: 'Hypertension follow-up', priority: 'Medium', lastVitals: '1h ago', status: 'Waiting' },
  { id: 'PT-5623', name: 'Sophia Patel', condition: 'Diabetes management', priority: 'Medium', lastVitals: '30m ago', status: 'Waiting' },
  { id: 'PT-5644', name: 'Robert Wilson', condition: 'Chest pain evaluation', priority: 'Critical', lastVitals: '15m ago', status: 'Urgent Review' },
  { id: 'PT-5652', name: 'Ava Park', condition: 'Post-discharge check', priority: 'Low', lastVitals: '4h ago', status: 'Completed' },
];

const clinicalAlerts = [
  { title: 'Critical lab: Potassium 6.2', detail: 'Sophia Patel · CMP panel', severity: 'Critical', due: 'Review within 30m' },
  { title: 'Overdue follow-up', detail: 'Michael Davis · BP recheck', severity: 'High', due: 'Due today' },
  { title: 'Imaging escalation', detail: 'Robert Wilson · Chest CT', severity: 'High', due: 'Awaiting approval' },
  { title: 'Medication interaction', detail: 'Emily Chen · New Rx flagged', severity: 'Moderate', due: 'Pharmacy review' },
];

const insightCards = [
  { label: 'Workload', value: '18 visits', detail: '4 high-acuity cases', tone: 'bg-blue-50 text-blue-700' },
  { label: 'Case Severity', value: '24% high', detail: 'Stable trend', tone: 'bg-amber-50 text-amber-700' },
  { label: 'Efficiency', value: '92% on-time', detail: 'Avg 14m delay', tone: 'bg-emerald-50 text-emerald-700' },
];

const careGaps = [
  { title: 'Post-discharge follow-up', detail: '2 patients due within 48h', action: 'Schedule calls', tone: 'bg-primary-50 text-primary-700' },
  { title: 'Medication adherence check', detail: '3 chronic care reviews', action: 'Review pharmacy notes', tone: 'bg-secondary-50 text-secondary-700' },
  { title: 'Vitals recheck', detail: 'BP trend flagged for 1 patient', action: 'Order nurse visit', tone: 'bg-warning-50 text-warning-700' },
];

function DoctorOverview() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader 
        title="Doctor Workspace"
        description="Overview of today's clinical activities"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/doctor/schedule" className="btn-outline">Print Schedule</Link>
            <Link to="/doctor/prescriptions/new" className="btn-primary">New Prescription</Link>
          </div>
        }
      />

      {/* Clinical Overview */}
      <section>
        <SectionHeader 
          label="Clinical Overview"
          title="Today at a Glance"
          subtitle="Balanced patient load with critical items requiring timely review."
        />
        <div className="grid grid-cols-4 gap-6 items-start">
          <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <StatCard 
              title="Today's Appointments"
              value={8}
              subtitle="2 completed, 6 remaining"
              icon={<Calendar className="w-5 h-5 text-primary-600" />}
              accent="bg-primary-50"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <StatCard 
              title="Assigned Patients"
              value={24}
              subtitle="4 awaiting review"
              icon={<Users className="w-5 h-5 text-success-600" />}
              accent="bg-success-50"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <StatCard 
              title="Pending Reports"
              value={7}
              subtitle="2 critical results"
              icon={<Microscope className="w-5 h-5 text-secondary-600" />}
              accent="bg-secondary-50"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <StatCard 
              title="Critical Alerts"
              value={3}
              subtitle="2 require immediate action"
              icon={<AlertCircle className="w-5 h-5 text-error-600" />}
              accent="bg-error-50"
            />
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: Primary Clinical Area */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          {/* Today's Schedule */}
          <section className="card card-hover animate-fade-in" style={{ animationDelay: '250ms' }}>
            <SectionHeader 
              label="Today's Schedule"
              title="Appointments & Consultations"
              badge={<span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-semibold">8 Total</span>}
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-slate-200/60 bg-gradient-to-br from-blue-50/30 to-transparent p-4 hover:border-slate-300/80 transition-all duration-200">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Next Appointment</p>
                <p className="text-lg font-bold text-slate-900 mt-2">09:15 · Emily Chen</p>
                <p className="text-sm text-slate-600 mt-1">Post-op review · Room 201-A</p>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-gradient-to-br from-amber-50/30 to-transparent p-4 hover:border-slate-300/80 transition-all duration-200">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Priority Queue</p>
                <p className="text-lg font-bold text-slate-900 mt-2">2 High · 1 STAT</p>
                <p className="text-sm text-slate-600 mt-1">Focused follow-ups</p>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-gradient-to-br from-emerald-50/30 to-transparent p-4 hover:border-slate-300/80 transition-all duration-200">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Average Delay</p>
                <p className="text-lg font-bold text-slate-900 mt-2">14 minutes</p>
                <p className="text-sm text-slate-600 mt-1">On-track for the day</p>
              </div>
            </div>
            <DataTable columns={appointmentColumns} data={appointmentData} />
          </section>

          {/* Patient Queue */}
          <section className="card card-hover animate-fade-in" style={{ animationDelay: '300ms' }}>
            <SectionHeader 
              label="Active Patients"
              title="Patient Queue"
            />
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-lg bg-blue-50/80 border border-blue-100/50 px-3 py-2.5">
                <p className="text-xs text-blue-700 font-semibold">Waiting</p>
                <p className="text-sm font-bold text-blue-900 mt-0.5">2 patients</p>
              </div>
              <div className="rounded-lg bg-emerald-50/80 border border-emerald-100/50 px-3 py-2.5">
                <p className="text-xs text-emerald-700 font-semibold">In Progress</p>
                <p className="text-sm font-bold text-emerald-900 mt-0.5">1 patient</p>
              </div>
              <div className="rounded-lg bg-slate-50/80 border border-slate-100/50 px-3 py-2.5">
                <p className="text-xs text-slate-700 font-semibold">Completed</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">1 patient</p>
              </div>
            </div>
            <div className="space-y-3">
              {patientQueueData.map((patient, idx) => {
                const priorityColors: Record<string, string> = {
                  'Critical': 'border-l-red-500 bg-gradient-to-br from-red-50/70 to-red-50/30',
                  'High': 'border-l-amber-500 bg-gradient-to-br from-amber-50/70 to-amber-50/30',
                  'Medium': 'border-l-blue-500 bg-gradient-to-br from-blue-50/70 to-blue-50/30',
                  'Low': 'border-l-emerald-500 bg-gradient-to-br from-emerald-50/70 to-emerald-50/30',
                };
                const statusColors: Record<string, string> = {
                  'In Consultation': 'bg-blue-600 text-white shadow-sm',
                  'Waiting': 'bg-slate-500 text-white shadow-sm',
                  'Urgent Review': 'bg-red-600 text-white shadow-sm',
                  'Completed': 'bg-emerald-600 text-white shadow-sm',
                };
                return (
                  <div 
                    key={patient.id} 
                    className={`border-l-4 ${priorityColors[patient.priority] || 'border-l-slate-300 bg-gradient-to-br from-slate-50/70 to-slate-50/30'} p-4 rounded-r-xl border-r border-t border-b border-slate-200/60 hover:shadow-md hover:border-slate-300/80 transition-all duration-300 animate-fade-in`}
                    style={{ animationDelay: `${350 + idx * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{patient.name}</h4>
                          <span className="text-xs text-slate-500 font-mono">{patient.id}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1.5">{patient.condition}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[patient.status]}`}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                      <span className="flex items-center gap-1">
                        <HeartPulse className="w-3 h-3" />
                        Vitals: {patient.lastVitals}
                      </span>
                      <span className={`font-semibold ${patient.priority === 'Critical' ? 'text-red-600' : patient.priority === 'High' ? 'text-amber-600' : patient.priority === 'Medium' ? 'text-blue-600' : 'text-emerald-600'}`}>
                        {patient.priority} Priority
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card card-hover animate-fade-in" style={{ animationDelay: '350ms' }}>
            <SectionHeader
              label="Care Coordination"
              title="Care Gap Watchlist"
              subtitle="High-impact tasks needing follow-up to keep patients on track."
            />
            <div className="grid gap-3">
              {careGaps.map((gap) => (
                <div key={gap.title} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{gap.title}</p>
                      <p className="text-xs text-slate-600 mt-1.5">{gap.detail}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${gap.tone} border-current/20`}>{gap.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Support Panel */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* Quick Actions */}
          <section className="card card-hover animate-slide-in" style={{ animationDelay: '400ms' }}>
            <SectionHeader 
              label="Quick Actions"
              title="Clinical Tools"
            />
            <div className="space-y-2.5">
              <Link to="/doctor/prescriptions/new" className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-blue-50 to-blue-50/50 hover:from-blue-100 hover:to-blue-50 border border-blue-200/60 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
                <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm group-hover:scale-110 group-hover:shadow transition-all duration-300">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 text-sm">New Prescription</p>
                  <p className="text-xs text-slate-600">eRx workflow</p>
                </div>
              </Link>
              <Link to="/doctor/labs" className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-50 to-emerald-50/50 hover:from-emerald-100 hover:to-emerald-50 border border-emerald-200/60 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
                <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-sm group-hover:scale-110 group-hover:shadow transition-all duration-300">
                  <Microscope className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 text-sm">Order Lab Test</p>
                  <p className="text-xs text-slate-600">Diagnostics panel</p>
                </div>
              </Link>
              <Link to="/doctor/patients" className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-amber-50 to-amber-50/50 hover:from-amber-100 hover:to-amber-50 border border-amber-200/60 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
                <div className="p-2 bg-amber-600 text-white rounded-lg shadow-sm group-hover:scale-110 group-hover:shadow transition-all duration-300">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 text-sm">Refer Specialist</p>
                  <p className="text-xs text-slate-600">Cardiology consult</p>
                </div>
              </Link>
              <Link to="/doctor/patients" className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-slate-50 to-slate-50/50 hover:from-slate-100 hover:to-slate-50 border border-slate-200/60 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
                <div className="p-2 bg-slate-700 text-white rounded-lg shadow-sm group-hover:scale-110 group-hover:shadow transition-all duration-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 text-sm">Add Clinical Notes</p>
                  <p className="text-xs text-slate-600">SOAP documentation</p>
                </div>
              </Link>
            </div>
          </section>

          {/* Clinical Alerts */}
          <section className="card card-hover animate-slide-in" style={{ animationDelay: '450ms' }}>
            <SectionHeader 
              label="Clinical Alerts"
              title="Immediate Attention"
              badge={<span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-semibold border border-red-100">3 critical</span>}
            />
            <div className="space-y-3">
              {clinicalAlerts.map((alert) => {
                const severityTone = alert.severity === 'Critical'
                  ? 'bg-red-50/80 text-red-700 border-red-200/60'
                  : alert.severity === 'High'
                    ? 'bg-amber-50/80 text-amber-700 border-amber-200/60'
                    : 'bg-blue-50/80 text-blue-700 border-blue-200/60';
                return (
                  <div key={alert.title} className="rounded-xl border border-slate-200/60 p-3.5 hover:border-slate-300/80 transition-all duration-200 bg-gradient-to-br from-slate-50/30 to-transparent">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                        <p className="text-xs text-slate-600 mt-1.5">{alert.detail}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border font-semibold shrink-0 ${severityTone}`}>{alert.severity}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2.5">{alert.due}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Insights Panel */}
          <section className="card card-hover animate-slide-in" style={{ animationDelay: '500ms' }}>
            <SectionHeader 
              label="Insights"
              title="Clinical Efficiency"
            />
            <div className="space-y-3">
              {insightCards.map((card) => (
                <div key={card.label} className="flex items-center justify-between rounded-xl border border-slate-200/60 p-3.5 hover:border-slate-300/80 transition-all duration-200 bg-gradient-to-br from-slate-50/30 to-transparent">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] font-semibold">{card.label}</p>
                    <p className="text-lg font-bold text-slate-900 mt-1.5">{card.value}</p>
                    <p className="text-xs text-slate-600 mt-1">{card.detail}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${card.tone} border-current/20`}>{card.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DoctorOverview;
