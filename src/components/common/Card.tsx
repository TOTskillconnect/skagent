import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  noPadding?: boolean;
  bordered?: boolean;
  interactive?: boolean;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  icon,
  actions,
  noPadding = false,
  bordered = false,
  interactive = false,
  elevated = false,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-xl ${elevated ? 'shadow-md' : 'shadow-sm'}
        ${bordered ? 'border border-gray-200' : ''}
        ${interactive ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      {(title || subtitle || actions) && (
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card; 