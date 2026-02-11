import { useEffect, useMemo, useState } from 'react';

import SectionPage from '@pages/workspace/SectionPage';
import api from '@services/api';

const columns = [
  { header: 'Department', accessor: 'department' },
  { header: 'Head', accessor: 'head' },
  { header: 'Doctors', accessor: 'doctors', align: 'right' as const },
  { header: 'Wards', accessor: 'wards', align: 'right' as const },
];

const data = [
  { department: 'Emergency', head: 'Dr. Vale', doctors: 12, wards: 3, status: 'Assigned Head' },
  { department: 'Surgery', head: 'Dr. Gopal', doctors: 9, wards: 2, status: 'Assigned Head' },
  { department: 'Radiology', head: 'Unassigned', doctors: 6, wards: 1, status: 'Unassigned' },
  { department: 'Pediatrics', head: 'Dr. Singh', doctors: 8, wards: 2, status: 'Assigned Head' },
];

const STATUS_FILTERS = ['All', 'Assigned Head', 'Unassigned'] as const;

function AdminDepartments() {
  const [rows, setRows] = useState(data);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('All');

  useEffect(() => {
    let isMounted = true;

    const loadDepartments = async () => {
      try {
        const response = await api.getDepartments();
        const items = response.data?.data ?? response.data ?? [];
        if (!Array.isArray(items)) {
          return;
        }

        const mapped = items.map((department: any) => {
          const headUser = department.head?.user;
          const headName = headUser
            ? `Dr. ${headUser.firstName ?? ''} ${headUser.lastName ?? ''}`.trim()
            : 'Unassigned';

          return {
            department: department.name ?? 'Department',
            head: headName || 'Unassigned',
            doctors: department._count?.doctors ?? 0,
            wards: department._count?.wards ?? 0,
            status: headUser ? 'Assigned Head' : 'Unassigned',
          };
        });

        if (isMounted && mapped.length > 0) {
          setRows(mapped);
        }
      } catch {
        // Keep fallback data on errors.
      }
    };

    loadDepartments();

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
      title="Departments"
      description="Maintain departmental capacity, staffing, and service performance."
      breadcrumb={["Admin", "Departments"]}
      summary={[
        { label: 'Active Departments', value: '18', helper: 'Across campuses', tone: 'success' },
        { label: 'Maintenance Tickets', value: '7', helper: '2 critical', tone: 'warning' },
        { label: 'Bed Utilization', value: '84%', helper: 'Hospital-wide', tone: 'info' },
        { label: 'Staffing Gaps', value: '6', helper: 'Shift coverage needed', tone: 'warning' },
      ]}
      tableTitle="Department Overview"
      columns={columns}
      data={filteredRows}
      tableFilters={filterChips}
    />
  );
}

export default AdminDepartments;
