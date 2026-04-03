import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success';
  icon?: string;
  className?: string;
}

export default function Alert({ children, variant = 'info', icon, className = '' }: AlertProps) {
  const variantClasses = {
    'info': 'bg-primary-container text-on-primary-container',
    'warning': 'bg-surface-container text-on-surface-variant border-l-4 border-error',
    'error': 'bg-error-container text-on-error-container',
    'success': 'bg-tertiary-fixed text-on-tertiary',
  };

  const defaultIcons = {
    'info': 'info',
    'warning': 'warning',
    'error': 'error',
    'success': 'check_circle',
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${variantClasses[variant]} ${className}`}>
      {(icon || defaultIcons[variant]) && (
        <span className="material-symbols-outlined flex-shrink-0 text-lg">
          {icon || defaultIcons[variant]}
        </span>
      )}
      <div className="text-sm font-medium leading-tight">{children}</div>
    </div>
  );
}
