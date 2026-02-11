import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

function DataTable<T extends Record<string, unknown>>({ columns, data, emptyMessage = 'No records found' }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden border border-slate-200/60 rounded-2xl bg-white shadow-ambient">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className={`px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr key={(row as { id?: string }).id ?? rowIndex} className="hover:bg-slate-50/70 transition-colors duration-150">
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={`px-6 py-4 text-sm text-slate-700 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}>
                  {column.render
                    ? column.render(row)
                    : String(column.accessor ? ((row as Record<string, unknown>)[column.accessor as string] ?? '') : '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;