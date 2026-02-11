import { useState } from 'react';
import PageHeader from '@components/ui/PageHeader';

function PatientProfile() {
  const [success, setSuccess] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess('Profile updated successfully.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile & Insurance"
        description="Update contact information, emergency contacts, and insurance details."
        breadcrumb={["Patient", "Profile"]}
      />

      <section className="card space-y-6">
        {success && (
          <div className="bg-success-50 border border-success-200 rounded-xl p-4">
            <p className="text-sm text-success-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="Sophia"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="Patel"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="sophia.patel@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="+1 (555) 123-2210"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="901 Wellness Ave, Healthcare City, HC 12345"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Insurance Provider</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="BlueShield"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Policy Number</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="BS-291001"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Emergency Contact</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              defaultValue="Aisha Patel · +1 (555) 221-1001"
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" className="btn-outline">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PatientProfile;
