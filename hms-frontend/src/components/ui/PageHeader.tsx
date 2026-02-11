import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: string[];
}

function PageHeader({ title, description, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="text-[11px] uppercase tracking-[0.2em] text-slate-500 flex flex-wrap gap-2 font-semibold mb-4">
          {breadcrumb.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-2">
              <span>{item}</span>
              {index < breadcrumb.length - 1 && <span className="text-slate-300">/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description && <p className="text-slate-600 mt-2 text-sm max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;