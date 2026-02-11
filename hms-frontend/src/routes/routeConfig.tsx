import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import LandingPage from '@pages/LandingPage';
import BookAppointment from '@pages/BookAppointment';
import EmergencyPage from '../pages/EmergencyPage';
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import AllEntitiesDirectory from '@pages/AllEntitiesDirectory';
import WorkspaceLayout from '@layouts/WorkspaceLayout';
import { getNavByRole } from '@constants/navigation';
import ExecutiveOverview from '@pages/workspace/ExecutiveOverview';
import ExecutiveTrends from '@pages/workspace/ExecutiveTrends';
import ExecutiveCompliance from '@pages/workspace/ExecutiveCompliance';
import ExecutiveBriefing from '../pages/workspace/ExecutiveBriefing';
import AdminOverview from '@pages/workspace/AdminOverview';
import AdminUsers from '@pages/workspace/AdminUsers';
import AdminDepartments from '@pages/workspace/AdminDepartments';
import AdminReports from '@pages/workspace/AdminReports';
import AdminRequestNew from '../pages/workspace/AdminRequestNew';
import DoctorOverview from '@pages/workspace/DoctorOverview';
import DoctorSchedule from '@pages/workspace/DoctorSchedule';
import DoctorPatients from '@pages/workspace/DoctorPatients';
import DoctorLabs from '@pages/workspace/DoctorLabs';
import DoctorPrescriptionNew from '../pages/workspace/DoctorPrescriptionNew';
import PatientOverview from '@pages/workspace/PatientOverview';
import PatientAppointments from '@pages/workspace/PatientAppointments';
import PatientBilling from '@pages/workspace/PatientBilling';
import PatientMessages from '../pages/workspace/PatientMessages';
import PatientProfile from '../pages/workspace/PatientProfile';
import LabOverview from '@pages/workspace/LabOverview';
import LabQueue from '@pages/workspace/LabQueue';
import LabReports from '@pages/workspace/LabReports';
import PharmacyOverview from '@pages/workspace/PharmacyOverview';
import PharmacyDispensing from '@pages/workspace/PharmacyDispensing';
import PharmacyInventory from '@pages/workspace/PharmacyInventory';
import AccountsOverview from '@pages/workspace/AccountsOverview';
import AccountsCollections from '@pages/workspace/AccountsCollections';
import AccountsClaims from '@pages/workspace/AccountsClaims';

export interface RouteChild {
  path?: string;
  index?: boolean;
  element: ReactElement;
}

export interface RouteItem {
  path: string;
  element: ReactElement;
  roles?: string[];
  children?: RouteChild[];
}

export const publicRoutes: RouteItem[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/book-appointment', element: <BookAppointment /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/entities', element: <AllEntitiesDirectory /> },
  { path: '/emergency', element: <EmergencyPage /> },
];

export const protectedRoutes: RouteItem[] = [
  {
    path: '/executive',
    roles: ['SUPER_ADMIN', 'EXECUTIVE'],
    element: <WorkspaceLayout sidebarItems={getNavByRole('EXECUTIVE')} />,
    children: [
      { index: true, element: <Navigate to="/executive/overview" replace /> },
      { path: 'overview', element: <ExecutiveOverview /> },
      { path: 'trends', element: <ExecutiveTrends /> },
      { path: 'compliance', element: <ExecutiveCompliance /> },
      { path: 'briefing', element: <ExecutiveBriefing /> },
    ],
  },
  {
    path: '/admin',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    element: <WorkspaceLayout sidebarItems={getNavByRole('ADMIN')} />,
    children: [
      { index: true, element: <Navigate to="/admin/overview" replace /> },
      { path: 'overview', element: <AdminOverview /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'departments', element: <AdminDepartments /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'requests/new', element: <AdminRequestNew /> },
    ],
  },
  {
    path: '/doctor',
    roles: ['DOCTOR', 'NURSE'],
    element: <WorkspaceLayout sidebarItems={getNavByRole('DOCTOR')} />,
    children: [
      { index: true, element: <Navigate to="/doctor/overview" replace /> },
      { path: 'overview', element: <DoctorOverview /> },
      { path: 'schedule', element: <DoctorSchedule /> },
      { path: 'patients', element: <DoctorPatients /> },
      { path: 'labs', element: <DoctorLabs /> },
      { path: 'prescriptions/new', element: <DoctorPrescriptionNew /> },
    ],
  },
  {
    path: '/patient',
    roles: ['PATIENT'],
    element: <WorkspaceLayout sidebarItems={getNavByRole('PATIENT')} />,
    children: [
      { index: true, element: <Navigate to="/patient/overview" replace /> },
      { path: 'overview', element: <PatientOverview /> },
      { path: 'appointments', element: <PatientAppointments /> },
      { path: 'billing', element: <PatientBilling /> },
      { path: 'messages', element: <PatientMessages /> },
      { path: 'profile', element: <PatientProfile /> },
    ],
  },
  {
    path: '/lab',
    roles: ['LAB_TECH'],
    element: <WorkspaceLayout sidebarItems={getNavByRole('LAB_TECH')} />,
    children: [
      { index: true, element: <Navigate to="/lab/overview" replace /> },
      { path: 'overview', element: <LabOverview /> },
      { path: 'queue', element: <LabQueue /> },
      { path: 'reports', element: <LabReports /> },
    ],
  },
  {
    path: '/pharmacy',
    roles: ['PHARMACIST'],
    element: <WorkspaceLayout sidebarItems={getNavByRole('PHARMACIST')} />,
    children: [
      { index: true, element: <Navigate to="/pharmacy/overview" replace /> },
      { path: 'overview', element: <PharmacyOverview /> },
      { path: 'dispensing', element: <PharmacyDispensing /> },
      { path: 'inventory', element: <PharmacyInventory /> },
    ],
  },
  {
    path: '/accounts',
    roles: ['ACCOUNTANT'],
    element: <WorkspaceLayout sidebarItems={getNavByRole('ACCOUNTANT')} />,
    children: [
      { index: true, element: <Navigate to="/accounts/overview" replace /> },
      { path: 'overview', element: <AccountsOverview /> },
      { path: 'collections', element: <AccountsCollections /> },
      { path: 'claims', element: <AccountsClaims /> },
    ],
  },
];
