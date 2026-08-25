import React from 'react';

export default function Badge({ children, variant = 'blue', className = '' }) {
  const variantStyles = {
    blue: 'bg-brand-50 text-brand-700 border-brand-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    navy: 'bg-navy-900 text-white border-navy-800',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant] || variantStyles.blue} ${className}`}
    >
      {children}
    </span>
  );
}
