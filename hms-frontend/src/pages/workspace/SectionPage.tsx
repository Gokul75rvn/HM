import type { ReactNode } from 'react';
import PageHeader from '@components/ui/PageHeader';
import DataTable, { type Column } from '@components/ui/DataTable';

export type SummaryTone = 'neutral' | 'info' | 'success' | 'warning';

export interface SummaryItem {
  label: string;
  value: string;
  helper?: string;
  tone?: SummaryTone;
}

interface SectionPageProps<T> {
  title: string;
  description: string;
  breadcrumb: string[];
  summary?: SummaryItem[];
  tableTitle: string;
  tableAction?: ReactNode;
  tableFilters?: ReactNode;
  columns: Column<T>[];
  data: T[];
  extraContent?: ReactNode;
}

const TONE_CLASSES: Record<SummaryTone, string> = {
  neutral: 'text-gray-700',
  info: 'text-cyan-600',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
};

function SectionPage<T extends Record<string, unknown>>({
  title,
  description,
  breadcrumb,
  summary,
  tableTitle,
  tableAction,
  tableFilters,
  columns,
  data,
  extraContent,
}: SectionPageProps<T>) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} breadcrumb={breadcrumb} />

      {summary && summary.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="card">
              <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
              <p className={`text-2xl font-semibold ${TONE_CLASSES[item.tone ?? 'neutral']}`}>{item.value}</p>
              {item.helper && <p className="text-xs text-gray-500 mt-1">{item.helper}</p>}
            </div>
          ))}
        </section>
      )}

      <section className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Operational View</p>
            <h3 className="text-lg font-semibold text-gray-900">{tableTitle}</h3>
          </div>
          {tableAction}
        </div>
        {tableFilters && <div className="flex flex-wrap gap-2">{tableFilters}</div>}
        <DataTable columns={columns} data={data} />
      </section>

      {extraContent}
    </div>
  );
}

export default SectionPage;
