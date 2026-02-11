import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Building2, User, AlertCircle, ArrowRight } from 'lucide-react';
import api from '@services/api';

interface Department {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
  specialization?: string;
}

function BookAppointment() {
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }, []);
  const accessToken = localStorage.getItem('accessToken');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [type, setType] = useState('OPD');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const load = async () => {
      try {
        const [departmentsResponse, doctorsResponse] = await Promise.all([
          api.getDepartments(),
          api.getDoctors(1, 50),
        ]);

        setDepartments(departmentsResponse.data || []);
        setDoctors(doctorsResponse.data?.data || doctorsResponse.data || []);
      } catch (err) {
        setError('Unable to load doctors and departments. Please try again.');
      }
    };

    load();
  }, [accessToken]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!storedUser?.patientId) {
      setError('Your patient profile is still being prepared. Please contact support.');
      return;
    }

    if (!departmentId || !doctorId || !appointmentDate || !appointmentTime) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      const appointmentDateIso = new Date(appointmentDate).toISOString();
      await api.createAppointment({
        patientId: storedUser.patientId,
        doctorId,
        departmentId,
        appointmentDate: appointmentDateIso,
        appointmentTime,
        type,
        reason: reason || undefined,
      });

      setSuccess('Appointment booked successfully. Your care team will confirm shortly.');
      setDepartmentId('');
      setDoctorId('');
      setAppointmentDate('');
      setAppointmentTime('');
      setType('OPD');
      setReason('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20">
      <header className="bg-white/95 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <div>
              <p className="text-slate-900 font-bold text-lg">CarePoint Hospital</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-primary-600 font-semibold">Appointment Center</p>
            </div>
          </Link>
          <Link to="/" className="text-sm font-semibold text-primary-700 hover:text-primary-800">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-primary-600 font-semibold">Book Appointment</p>
              <h1 className="text-4xl font-bold text-slate-900">Schedule your visit with our specialists</h1>
              <p className="text-lg text-slate-600">Choose a department, doctor, and time. Our care team confirms every booking within 30 minutes.</p>
            </div>

            {!accessToken && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-ambient">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-warning-600 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Sign in required</p>
                    <p className="text-slate-600 mb-4">Please sign in or register to book an appointment.</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">
                      Go to Sign In
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {accessToken && (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/60 shadow-ambient p-8 space-y-6">
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Department *</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                        required
                      >
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Doctor *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                        required
                      >
                        <option value="">Select doctor</option>
                        {doctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            Dr. {doc.user?.firstName} {doc.user?.lastName} · {doc.specialization || 'General'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                  >
                    <option value="OPD">Outpatient Consultation</option>
                    <option value="FOLLOW_UP">Follow-up Visit</option>
                    <option value="EMERGENCY">Emergency Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for visit</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                    placeholder="Describe symptoms or reason for appointment"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </form>
            )}
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-ambient p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">What happens next?</h2>
              <ul className="space-y-3 text-slate-600">
                <li>• Our care coordinator confirms your appointment.</li>
                <li>• You receive a confirmation SMS and email.</li>
                <li>• Digital check-in opens 24 hours prior to visit.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl text-white p-6 shadow-lg space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-white/80">Need urgent help?</p>
              <h3 className="text-2xl font-bold">Emergency Services</h3>
              <p className="text-white/90">Call 911 or visit our emergency wing available 24/7.</p>
              <Link
                to="/emergency"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Emergency: 911
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default BookAppointment;
