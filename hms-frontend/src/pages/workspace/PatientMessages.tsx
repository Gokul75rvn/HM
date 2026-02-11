import { useState } from 'react';
import PageHeader from '@components/ui/PageHeader';

function PatientMessages() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess('Message delivered to your care team. Response expected within 2 hours.');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Care Team Messages"
        description="Securely message your care team, share updates, and request guidance."
        breadcrumb={["Patient", "Messages"]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="card space-y-5">
          {success && (
            <div className="bg-success-50 border border-success-200 rounded-xl p-4">
              <p className="text-sm text-success-700">{success}</p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">New Message</p>
            <h3 className="text-lg font-semibold text-slate-900">Send an update</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                placeholder="Medication question"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                placeholder="Share symptoms, questions, or updates"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </section>

        <section className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent Conversations</p>
            <h3 className="text-lg font-semibold text-slate-900">Latest responses</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Lab results follow-up', sender: 'Dr. Reynolds', time: 'Today 09:20 AM' },
              { title: 'Medication refill request', sender: 'Pharmacy Team', time: 'Yesterday 04:05 PM' },
              { title: 'Next appointment prep', sender: 'Care Coordinator', time: 'Feb 8, 10:15 AM' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600 mt-1">From {item.sender}</p>
                <p className="text-xs text-primary-600 mt-2 font-semibold">{item.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PatientMessages;
