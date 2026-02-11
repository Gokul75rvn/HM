import { useState } from 'react';
import PageHeader from '@components/ui/PageHeader';

function AdminRequestNew() {
  const [success, setSuccess] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess('Request submitted. Facilities team will respond within 4 hours.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Service Request"
        description="Log operational and facilities requests for immediate action."
        breadcrumb={["Admin", "Requests"]}
      />

      <section className="card space-y-6">
        {success && (
          <div className="bg-success-50 border border-success-200 rounded-xl p-4">
            <p className="text-sm text-success-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
            <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors" required>
              <option value="">Select department</option>
              <option>Emergency</option>
              <option>ICU</option>
              <option>Surgery</option>
              <option>Pharmacy</option>
              <option>Radiology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors" required>
              <option value="">Select category</option>
              <option>Facilities</option>
              <option>IT Support</option>
              <option>Security</option>
              <option>Equipment</option>
              <option>Housekeeping</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
            <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors" required>
              <option value="">Select priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Standard</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Requested By</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="Name or role"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Request Details</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="Describe the issue and location"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Resolution Time</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="Within 2 hours"
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary">Submit Request</button>
            <button type="button" className="btn-outline">Save Draft</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdminRequestNew;
