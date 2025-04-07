import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
  outline?: boolean;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  outline = false,
}: BadgeProps) => {
  // Base classes for all badges
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  };
  
  // Variant classes - solid background
  const solidVariants = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-error-100 text-error-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  // Variant classes - outline
  const outlineVariants = {
    default: 'bg-white text-neutral-800 border border-neutral-200',
    primary: 'bg-white text-primary-600 border border-primary-200',
    secondary: 'bg-white text-secondary-600 border border-secondary-200',
    success: 'bg-white text-success-600 border border-success-200',
    warning: 'bg-white text-warning-600 border border-warning-200',
    danger: 'bg-white text-error-600 border border-error-200',
    info: 'bg-white text-blue-600 border border-blue-200',
  };
  
  // Dot colors
  const dotColors = {
    default: 'bg-neutral-500',
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-error-500',
    info: 'bg-blue-500',
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${outline ? outlineVariants[variant] : solidVariants[variant]}
        ${className}
      `}
    >
      {dot && (
        <span 
          className={`mr-1.5 h-2 w-2 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge; 