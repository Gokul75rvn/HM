import { useState } from 'react';
import PageHeader from '@components/ui/PageHeader';

function DoctorPrescriptionNew() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('Prescription saved and queued for pharmacy review.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Prescription"
        description="Create an electronic prescription and send it directly to pharmacy."
        breadcrumb={["Doctor", "Prescriptions"]}
      />

      <section className="card space-y-6">
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-xl p-4">
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-success-50 border border-success-200 rounded-xl p-4">
            <p className="text-sm text-success-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Patient</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="Search patient name or ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Medication</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="Medication name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dosage</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="500mg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="Twice daily"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="7 days"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Instructions</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              placeholder="Take with food, avoid driving, etc."
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">Send to Pharmacy</button>
            <button type="button" className="btn-outline">Save Draft</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Prescriptions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { patient: 'Sophia Patel', medication: 'Amoxicillin', status: 'Sent to pharmacy' },
            { patient: 'Michael Davis', medication: 'Metformin', status: 'Awaiting approval' },
            { patient: 'Emily Chen', medication: 'Atorvastatin', status: 'Dispensed' },
          ].map((item) => (
            <div key={item.patient} className="rounded-xl border border-slate-200/60 p-4 bg-gradient-to-br from-slate-50/30 to-transparent">
              <p className="text-sm font-semibold text-slate-900">{item.patient}</p>
              <p className="text-xs text-slate-600 mt-1">{item.medication}</p>
              <p className="text-xs text-primary-600 mt-2 font-semibold">{item.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DoctorPrescriptionNew;
