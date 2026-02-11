import { useEffect, useMemo, useState } from 'react';

import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'User', accessor: 'user' },
  { header: 'Role', accessor: 'role' },
  { header: 'Department', accessor: 'department' },
  { header: 'Status', accessor: 'status' },
];

const data = [
  { user: 'Derek Reynolds', role: 'DOCTOR', department: 'Cardiology', status: 'ACTIVE' },
  { user: 'Phoebe Holt', role: 'PHARMACIST', department: 'Pharmacy', status: 'ACTIVE' },
  { user: 'Liam Baker', role: 'LAB_TECH', department: 'Diagnostics', status: 'INACTIVE' },
  { user: 'Alex Daniels', role: 'ADMIN', department: 'Operations', status: 'ACTIVE' },
];

const STATUS_FILTERS = ['All', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'DEACTIVATED'] as const;

const ROLE_DEPARTMENT: Record<string, string> = {
  SUPER_ADMIN: 'Executive',
  ADMIN: 'Operations',
  DOCTOR: 'Clinical',
  PATIENT: 'Patient',
  NURSE: 'Clinical',
  RECEPTIONIST: 'Front Desk',
  LAB_TECH: 'Laboratory',
  PHARMACIST: 'Pharmacy',
  ACCOUNTANT: 'Finance',
};

function AdminUsers() {
  const [rows, setRows] = useState(data);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('All');

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await api.getUsers(1, 20);
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((user: any) => {
          const role = user.role ?? 'STAFF';

          return {
            user: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.registrationId || 'User',
            role,
            department: ROLE_DEPARTMENT[role] ?? 'Operations',
            status: user.status ?? 'ACTIVE',
          };
        });

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRows = useMemo(() => {
    if (statusFilter === 'All') {
      return rows;
    }

    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  const filterChips = STATUS_FILTERS.map((filter) => {
    const isActive = filter === statusFilter;
    return (
      <button
        key={filter}
        type="button"
        onClick={() => setStatusFilter(filter)}
        className={
          isActive
            ? 'rounded-full bg-slate-900 text-white text-xs font-semibold px-3 py-1'
            : 'rounded-full border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1 hover:border-slate-300'
        }
      >
        {filter}
      </button>
    );
  });

  return (
    <SectionPage
      title="User Management"
      description="Provision roles, manage access, and monitor onboarding across teams."
      breadcrumb={["Admin", "Users"]}
      summary={[
        { label: 'Active Users', value: '1,284', helper: 'Across all roles', tone: 'success' },
        { label: 'Pending Approvals', value: '12', helper: 'Awaiting verification', tone: 'warning' },
        { label: 'MFA Adoption', value: '89%', helper: 'Target 95%', tone: 'info' },
        { label: 'Inactive Accounts', value: '24', helper: 'Review for cleanup', tone: 'neutral' },
      ]}
      tableTitle="Access Roster"
      columns={columns}
      data={filteredRows}
      tableFilters={filterChips}
    />
  );
}

export default AdminUsers;
