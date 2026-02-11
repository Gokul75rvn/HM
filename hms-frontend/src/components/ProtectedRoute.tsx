import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { DEMO_MODE } from '@constants/env';

interface ProtectedRouteProps {
  roles: string[];
  children: ReactElement;
}

function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (DEMO_MODE) {
    return children;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Please login to continue' }}
        replace
      />
    );
  }

  if (roles.length && (!role || !roles.includes(role))) {
    return (
      <Navigate
        to="/login"
        state={{ message: 'Access denied for this account. Please login with the correct role.' }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;