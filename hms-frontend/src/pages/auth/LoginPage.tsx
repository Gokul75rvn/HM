import { FormEvent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Stethoscope, User2, FlaskConical, Pill, Wallet } from 'lucide-react';
import { setCredentials, setLoading, setError as setAuthError, clearError, logout } from '@store/authSlice';
import type { RootState } from '@store/store';
import { authenticateLocalUser, LOCAL_USERS } from '@constants/localAuth';
import { DEMO_MODE } from '@constants/env';
import RoleCard from '@components/ui/RoleCard';

const ROLE_REDIRECTS: Record<string, string> = {
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

function LoginPage() {
  const { isAuthenticated, role, user, loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const locationState = location.state as { from?: Location; message?: string } | undefined;
  const loginPrompt = locationState?.message ?? null;
  const roleMeta = useMemo(
    () => [
      { key: 'ADMIN', label: 'Executive Control', description: 'Hospital-wide command center for administrators.', icon: ShieldCheck, href: '/admin/overview' },
      { key: 'DOCTOR', label: 'Clinical Command', description: 'Patient queues, rounds, and treatment plans.', icon: Stethoscope, href: '/doctor/overview' },
      { key: 'PATIENT', label: 'Patient Companion', description: 'Care plans, appointments, and discharge updates.', icon: User2, href: '/patient/overview' },
      { key: 'LAB_TECH', label: 'Diagnostics Lab', description: 'Sample pipelines, QC, and results dispatch.', icon: FlaskConical, href: '/lab/overview' },
      { key: 'PHARMACIST', label: 'Pharmacy Fulfillment', description: 'Dispensing and inventory intelligence.', icon: Pill, href: '/pharmacy/overview' },
      { key: 'ACCOUNTANT', label: 'Revenue Integrity', description: 'Billing, claims, and financial operations.', icon: Wallet, href: '/accounts/overview' },
    ],
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const account = authenticateLocalUser(username, password);
      if (!account) {
        dispatch(setAuthError('Invalid credentials. Please try again.'));
        return;
      }

      const payloadUser = {
        id: account.id,
        registrationId: account.registrationId,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role,
        redirectPath: account.redirectPath,
      };

      dispatch(
        setCredentials({
          user: payloadUser,
          accessToken: `local-access-${account.id}`,
          refreshToken: `local-refresh-${account.id}`,
        }),
      );

      const intendedPath = locationState?.from?.pathname;
      const destination = intendedPath ?? account.redirectPath ?? ROLE_REDIRECTS[account.role] ?? '/login';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Local login failed', err);
      dispatch(setAuthError('Unable to sign in. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col text-white">
      <div className="flex-1 grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Secure Login Capsule</p>
            <h1 className="text-3xl font-semibold">Hospital Command Login</h1>
            <p className="text-slate-300">
              Authenticate with your enterprise-issued credentials to enter your mission dashboard.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 w-full max-w-lg">
            {loginPrompt && <div className="alert alert-info">{loginPrompt}</div>}
            {isAuthenticated && role && user && (
              <div className="alert alert-warning text-slate-900">
                Session active as <strong>{user.firstName || user.registrationId}</strong> ({role}).
                <button type="button" className="link ml-2" onClick={() => dispatch(logout())}>
                  Sign out
                </button>
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-200 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Command Center'}
            </button>
            <div className="flex justify-between text-xs text-slate-400">
              <button type="button" className="link">Forgot access?</button>
              <Link to="/register" className="link">Create account</Link>
            </div>
          </form>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Demo Credentials</p>
            <div className="grid gap-2 md:grid-cols-2">
              {Object.values(LOCAL_USERS).map((account) => (
                <div key={account.id} className="text-sm text-slate-200 bg-white/5 rounded-xl px-3 py-2">
                  <p className="font-semibold text-white">{account.username} / {account.password}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{account.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Instant access</p>
              <h2 className="text-2xl font-semibold">Role Selection Console</h2>
              <p className="text-slate-300 text-sm">
                {DEMO_MODE
                  ? 'Demo Mode active — dashboards open without authentication.'
                  : 'Select a role to preview the dashboards available post-login.'}
              </p>
            </div>
            {DEMO_MODE && (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300">DEMO MODE</span>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {roleMeta.map((roleCard) => (
              <RoleCard
                key={roleCard.key}
                icon={roleCard.icon}
                title={roleCard.key}
                subtitle={roleCard.label}
                description={roleCard.description}
                href={roleCard.href}
              />
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Need a shortcut?</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/" className="btn-outline">
                Back to landing
              </Link>
              <Link to="/entities" className="btn-outline">
                Entities Directory
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-xs text-slate-500 py-6">Hospital Command Portal · UX Sandbox · v1.0</footer>
    </div>
  );
}

export default LoginPage;