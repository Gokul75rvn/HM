import { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { setCredentials, setLoading, setError as setAuthError, clearError } from '@store/authSlice';
import type { RootState } from '@store/store';
import api from '@services/api';

const ROLE_OPTIONS = [
  { value: 'PATIENT', label: 'Patient' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'LAB_TECH', label: 'Lab Technician' },
  { value: 'PHARMACIST', label: 'Pharmacist' },
  { value: 'ACCOUNTANT', label: 'Accountant' },
];

function RegisterPage() {
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    dispatch(clearError());
    dispatch(setLoading(true));

    try {
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email: email || undefined,
        phone: phone || undefined,
        password,
        role,
      });

      const { accessToken, refreshToken, user } = response.data;

      dispatch(
        setCredentials({
          user,
          accessToken,
          refreshToken,
        }),
      );

      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        SUPER_ADMIN: '/executive/overview',
        ADMIN: '/admin/overview',
        DOCTOR: '/doctor/overview',
        PATIENT: '/patient/overview',
        LAB_TECH: '/lab/overview',
        PHARMACIST: '/pharmacy/overview',
        ACCOUNTANT: '/accounts/overview',
        NURSE: '/doctor/overview',
        RECEPTIONIST: '/admin/overview',
      };

      navigate(roleRedirects[role] || '/patient/overview', { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      dispatch(setAuthError(errorMessage));
      console.error('Registration error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20 flex items-center justify-center p-4">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-primary-600/80">Registration</p>
              <h1 className="text-3xl font-semibold text-slate-900">Create Account</h1>
              <p className="text-slate-600">
                Join CarePoint Hospital to access your personalized dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex gap-3 rounded-xl bg-red-50 p-4 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-900 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className={`w-full px-4 py-3 border-2 ${
                      validationErrors.firstName ? 'border-red-300' : 'border-slate-200'
                    } rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors`}
                  />
                  {validationErrors.firstName && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-900 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={`w-full px-4 py-3 border-2 ${
                      validationErrors.lastName ? 'border-red-300' : 'border-slate-200'
                    } rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors`}
                  />
                  {validationErrors.lastName && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-1">
                  Email (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 border-2 ${
                    validationErrors.email ? 'border-red-300' : 'border-slate-200'
                  } rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors`}
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-1">
                  Phone (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-slate-900 mb-1">
                  User Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={`w-full px-4 py-3 border-2 ${
                    validationErrors.password ? 'border-red-300' : 'border-slate-200'
                  } rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors`}
                />
                {validationErrors.password && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 border-2 ${
                    validationErrors.confirmPassword ? 'border-red-300' : 'border-slate-200'
                  } rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors`}
                />
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-700 hover:text-primary-800 transition-colors font-semibold">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
