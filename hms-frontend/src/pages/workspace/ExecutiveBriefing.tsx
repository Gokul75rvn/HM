import PageHeader from '@components/ui/PageHeader';
import DataTable from '@components/ui/DataTable';

const agendaColumns = [
  { header: 'Topic', accessor: 'topic' },
  { header: 'Owner', accessor: 'owner' },
  { header: 'Impact', accessor: 'impact' },
  { header: 'Status', accessor: 'status' },
];

const agendaData = [
  { topic: 'ED throughput plan', owner: 'Operations', impact: 'High', status: 'In progress' },
  { topic: 'Staffing surge coverage', owner: 'HR', impact: 'Medium', status: 'Ready' },
  { topic: 'Revenue cycle risks', owner: 'Finance', impact: 'High', status: 'Needs review' },
  { topic: 'Safety compliance', owner: 'Quality', impact: 'Medium', status: 'On track' },
];

function ExecutiveBriefing() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Briefing"
        description="Daily leadership briefing with operational, clinical, and financial priorities."
        breadcrumb={["Executive", "Briefing"]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Hospital Census', value: '89%', helper: 'Up 3% vs yesterday' },
          { label: 'Critical Alerts', value: '4', helper: '2 escalations pending' },
          { label: 'ED Wait Time', value: '38 min', helper: 'Target < 30 min' },
          { label: 'Revenue Risk', value: '$180K', helper: 'Claims pending' },
        ].map((item) => (
          <div key={item.label} className="card">
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{item.value}</p>
            <p className="text-xs text-slate-600 mt-1">{item.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Briefing Agenda</p>
            <h3 className="text-lg font-semibold text-slate-900">Priority Topics</h3>
          </div>
          <DataTable columns={agendaColumns} data={agendaData} />
        </div>

        <div className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Action Items</p>
            <h3 className="text-lg font-semibold text-slate-900">Today’s Commitments</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Approve surge staffing for ED', owner: 'COO', due: '11:00 AM' },
              { title: 'Review payer denial trends', owner: 'CFO', due: '2:00 PM' },
              { title: 'Finalize OR utilization plan', owner: 'CMO', due: '4:30 PM' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600 mt-1">Owner: {item.owner}</p>
                <p className="text-xs text-primary-600 mt-2 font-semibold">Due by {item.due}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ExecutiveBriefing;
