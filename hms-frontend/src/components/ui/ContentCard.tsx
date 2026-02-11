import React from 'react';

interface ContentCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  hover?: boolean;
  noPadding?: boolean;
}

export function ContentCard({ 
  title, 
  subtitle, 
  children, 
  actions, 
  className = '',
  hover = false,
  noPadding = false
}: ContentCardProps) {
  const cardClass = hover ? 'card-hover' : 'card';
  const paddingClass = noPadding ? '' : 'p-6';
  
  return (
    <div className={`${cardClass} ${className}`}>
      {(title || actions) && (
        <div className={`flex justify-between items-start ${noPadding ? 'px-6 pt-6' : 'mb-4'}`}>
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className={paddingClass}>{children}</div>
    </div>
  );
}
