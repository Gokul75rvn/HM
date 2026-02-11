import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield, Clock, Award, ArrowRight, Mail, Phone, MapPin, User, Lock } from 'lucide-react';
import api from '../services/api';

const roles = [
  { value: 'DOCTOR', label: 'Doctor', description: 'Medical professionals & physicians' },
  { value: 'PATIENT', label: 'Patient', description: 'Receive care & manage appointments' },
  { value: 'LAB_TECH', label: 'Lab Technician', description: 'Laboratory & diagnostics' },
  { value: 'PHARMACIST', label: 'Pharmacist', description: 'Pharmacy & medication management' },
  { value: 'ACCOUNTANT', label: 'Accountant', description: 'Billing & financial services' },
];

function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Registration form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.login(registrationId, password);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate based on role
      const roleRoutes: Record<string, string> = {
        DOCTOR: '/doctor/overview',
        PATIENT: '/patient/overview',
        LAB_TECH: '/lab/overview',
        PHARMACIST: '/pharmacy/overview',
        ACCOUNTANT: '/accounts/overview',
        ADMIN: '/admin/overview',
      };
      
      navigate(roleRoutes[response.data.user.role] || '/doctor/overview');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (registerPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.register({
        firstName,
        lastName,
        email: email || undefined,
        phone: phone || undefined,
        password: registerPassword,
        role: selectedRole,
      });
      
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate based on role
      const roleRoutes: Record<string, string> = {
        DOCTOR: '/doctor/overview',
        PATIENT: '/patient/overview',
        LAB_TECH: '/lab/overview',
        PHARMACIST: '/pharmacy/overview',
        ACCOUNTANT: '/accounts/overview',
      };
      
      navigate(roleRoutes[response.data.user.role] || '/patient/overview');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetRegisterForm = () => {
    setRegistrationStep('role');
    setSelectedRole('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRegisterPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CarePoint Hospital</h1>
                <p className="text-[10px] uppercase tracking-[0.15em] text-primary-600 font-semibold">Excellence in Healthcare</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setShowLogin(true); setShowRegister(false); }}
                className="px-5 py-2 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => { setShowRegister(true); setShowLogin(false); }}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100/60 rounded-full border border-primary-200/60">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-700 tracking-wide">24/7 Patient Care Available</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Your Health,
              <span className="block text-primary-600">Our Priority</span>
            </h2>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Experience world-class healthcare with compassionate professionals, advanced technology, and personalized treatment plans designed for your well-being.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'Certified Care', value: '500+ Doctors' },
                { icon: Clock, label: 'Quick Response', value: '<15 minutes' },
                { icon: Award, label: 'Excellence', value: '50+ Awards' },
                { icon: Heart, label: 'Patient Satisfaction', value: '98%' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-ambient border border-slate-200/60 hover:shadow-elevated transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-primary-600 mb-3" strokeWidth={1.5} />
                  <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/book-appointment"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/emergency"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
              >
                Emergency: 911
              </Link>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-50 shadow-2xl border border-white/60 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <Heart className="w-32 h-32 text-primary-300 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-lg font-semibold text-slate-600">Professional Medical Care</p>
                  <p className="text-sm text-slate-500 mt-2">Replace with hospital image</p>
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 left-8 right-8 bg-white rounded-2xl shadow-xl p-6 border border-slate-200/60">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">24/7</p>
                  <p className="text-sm text-slate-600 mt-1">Available</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary-600">50K+</p>
                  <p className="text-sm text-slate-600 mt-1">Patients Served</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-success-600">98%</p>
                  <p className="text-sm text-slate-600 mt-1">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-primary-600 font-semibold mb-3">Our Services</p>
            <h3 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Healthcare Solutions</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From emergency care to specialized treatments, we provide complete medical services under one roof.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Emergency Care', description: '24/7 emergency services with rapid response teams and state-of-the-art facilities.' },
              { title: 'Specialized Treatment', description: 'Expert physicians across 40+ specialties providing personalized care.' },
              { title: 'Diagnostic Services', description: 'Advanced laboratory and imaging services with quick turnaround times.' },
              { title: 'Surgical Excellence', description: 'Modern operation theaters with minimally invasive surgical options.' },
              { title: 'Pharmacy Services', description: 'In-house pharmacy with 24/7 medication dispensing and consultation.' },
              { title: 'Patient Care', description: 'Comfortable rooms, compassionate nursing, and family-centered care approach.' },
            ].map((service, index) => (
              <div
                key={service.title}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-600 to-primary-700"></div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login/Register Modal */}
      {(showLogin || showRegister) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowLogin(false); setShowRegister(false); resetRegisterForm(); }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            {showLogin ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h3>
                  <p className="text-slate-600">Sign in to access your healthcare portal</p>
                </div>

                {error && (
                  <div className="bg-error-50 border border-error-200 rounded-xl p-4">
                    <p className="text-sm text-error-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Registration ID</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={registrationId}
                        onChange={(e) => setRegistrationId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                        placeholder="Enter your ID"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => { setShowLogin(false); setShowRegister(true); }}
                      className="text-primary-600 font-semibold hover:text-primary-700"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {registrationStep === 'role' ? (
                  <>
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">Join CarePoint</h3>
                      <p className="text-slate-600">I want to register as a...</p>
                    </div>

                    <div className="grid gap-3">
                      {roles.map((role) => (
                        <button
                          key={role.value}
                          onClick={() => {
                            setSelectedRole(role.value);
                            setRegistrationStep('form');
                          }}
                          className="p-5 rounded-xl border-2 text-left transition-all duration-200 border-slate-200 hover:border-primary-300 hover:shadow-sm hover:bg-primary-50/30"
                        >
                          <p className="font-bold text-slate-900 text-lg mb-1">{role.label}</p>
                          <p className="text-sm text-slate-600">{role.description}</p>
                        </button>
                      ))}
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <button
                          onClick={() => { setShowRegister(false); setShowLogin(true); resetRegisterForm(); }}
                          className="text-primary-600 font-semibold hover:text-primary-700"
                        >
                          Sign in here
                        </button>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <button
                        onClick={() => setRegistrationStep('role')}
                        className="text-sm text-slate-500 hover:text-slate-700 mb-2"
                      >
                        ← Change role
                      </button>
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">Complete Registration</h3>
                      <p className="text-slate-600">Registering as {roles.find(r => r.value === selectedRole)?.label}</p>
                    </div>

                    {error && (
                      <div className="bg-error-50 border border-error-200 rounded-xl p-4">
                        <p className="text-sm text-error-700">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                            placeholder="John"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email (Optional)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                          placeholder="john.doe@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone (Optional)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
                        <input
                          type="password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                          placeholder="At least 8 characters"
                          required
                          minLength={8}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password *</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                          placeholder="Re-enter password"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                      </button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <button
                          onClick={() => { setShowRegister(false); setShowLogin(true); resetRegisterForm(); }}
                          className="text-primary-600 font-semibold hover:text-primary-700"
                        >
                          Sign in here
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold">CarePoint Hospital</h4>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-primary-400 font-semibold">Excellence in Healthcare</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Providing compassionate, patient-centered care with the latest medical technology and experienced healthcare professionals since 1995.
              </p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-primary-600 transition-colors flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-full opacity-70"></div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-lg mb-4">Quick Links</h5>
              <ul className="space-y-3 text-slate-400">
                {['About Us', 'Our Doctors', 'Departments', 'Services', 'Careers', 'News & Events'].map((link) => (
                  <li key={link}>
                    <button className="hover:text-primary-400 transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-lg mb-4">Contact Us</h5>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>123 Medical Center Drive<br />Healthcare City, HC 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span>info@carepoint.hospital</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            <p>© 2024 CarePoint Hospital. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;