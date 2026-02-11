import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@store/store';
import { logout } from '@store/authSlice';
import api from '@services/api';

function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      dispatch(logout());
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/95 flex items-center justify-between px-6 shadow-ambient">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">CarePoint Hospital</p>
          <p className="text-slate-900 font-semibold text-lg">Healthcare Portal</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary-600">{user?.role}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border-2 border-slate-200 hover:text-slate-900 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
          Logout
        </button>
      </div>
    </header>
  );
}

export default TopBar;