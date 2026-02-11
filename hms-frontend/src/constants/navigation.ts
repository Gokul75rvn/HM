import {
  Briefcase,
  Building2,
  ClipboardCheck,
  ClipboardList,
  DollarSign,
  FileBarChart,
  LayoutDashboard,
  Microscope,
  Pill,
  ShieldCheck,
  Stethoscope,
  Users,
  Wallet2,
  type LucideIcon,
} from 'lucide-react';

export interface NavLinkItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_LINKS: Record<string, NavLinkItem[]> = {
  SUPER_ADMIN: [
    { label: 'Overview', path: '/executive/overview', icon: LayoutDashboard },
    { label: 'Trends', path: '/executive/trends', icon: FileBarChart },
    { label: 'Compliance', path: '/executive/compliance', icon: ShieldCheck },
  ],
  EXECUTIVE: [
    { label: 'Overview', path: '/executive/overview', icon: LayoutDashboard },
    { label: 'Trends', path: '/executive/trends', icon: FileBarChart },
    { label: 'Compliance', path: '/executive/compliance', icon: ShieldCheck },
  ],
  ADMIN: [
    { label: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Reports', path: '/admin/reports', icon: ClipboardList },
  ],
  DOCTOR: [
    { label: 'Overview', path: '/doctor/overview', icon: LayoutDashboard },
    { label: 'Schedule', path: '/doctor/schedule', icon: ClipboardCheck },
    { label: 'Patients', path: '/doctor/patients', icon: Stethoscope },
    { label: 'Lab Orders', path: '/doctor/labs', icon: Microscope },
  ],
  PATIENT: [
    { label: 'Overview', path: '/patient/overview', icon: LayoutDashboard },
    { label: 'Appointments', path: '/patient/appointments', icon: ClipboardList },
    { label: 'Billing', path: '/patient/billing', icon: Wallet2 },
  ],
  LAB_TECH: [
    { label: 'Overview', path: '/lab/overview', icon: LayoutDashboard },
    { label: 'Queue', path: '/lab/queue', icon: Microscope },
    { label: 'Reports', path: '/lab/reports', icon: ClipboardList },
  ],
  PHARMACIST: [
    { label: 'Overview', path: '/pharmacy/overview', icon: LayoutDashboard },
    { label: 'Dispensing', path: '/pharmacy/dispensing', icon: Pill },
    { label: 'Inventory', path: '/pharmacy/inventory', icon: ShieldCheck },
  ],
  ACCOUNTANT: [
    { label: 'Overview', path: '/accounts/overview', icon: LayoutDashboard },
    { label: 'Collections', path: '/accounts/collections', icon: DollarSign },
    { label: 'Claims', path: '/accounts/claims', icon: Briefcase },
  ],
};

export const getNavByRole = (role?: string): NavLinkItem[] => {
  if (!role) return [];
  return NAV_LINKS[role] ?? NAV_LINKS.ADMIN;
};