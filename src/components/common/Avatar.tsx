import React from 'react';
import Image from 'next/image';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circle' | 'rounded';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'bottom-right';
}

const Avatar = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  variant = 'circle',
  className = '',
  status,
  statusPosition = 'bottom-right',
}: AvatarProps) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  // Variant classes
  const variantClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
  };

  // Status color classes
  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-neutral-300',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  };

  // Status position classes
  const statusPositionClasses = {
    'top-right': '-top-0.5 -right-0.5',
    'bottom-right': '-bottom-0.5 -right-0.5',
  };

  // Status size based on avatar size
  const statusSizeClasses = {
    xs: 'h-2 w-2',
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
    xl: 'h-4 w-4',
  };

  // Determine background color for initials avatar
  const getInitialsColor = (initials: string) => {
    const charCode = initials.charCodeAt(0);
    const colors = [
      'bg-primary-100 text-primary-800',
      'bg-secondary-100 text-secondary-800',
      'bg-error-100 text-error-800',
      'bg-warning-100 text-warning-800',
      'bg-success-100 text-success-800',
      'bg-blue-100 text-blue-800',
      'bg-indigo-100 text-indigo-800',
      'bg-purple-100 text-purple-800',
    ];
    return colors[charCode % colors.length];
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <div
          className={`${sizeClasses[size]} ${variantClasses[variant]} overflow-hidden bg-neutral-200 flex items-center justify-center`}
        >
          <Image
            src={src}
            alt={alt}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
      ) : initials ? (
        <div
          className={`${sizeClasses[size]} ${variantClasses[variant]} ${getInitialsColor(
            initials
          )} flex items-center justify-center font-medium`}
        >
          {initials.substring(0, 2).toUpperCase()}
        </div>
      ) : (
        <div
          className={`${sizeClasses[size]} ${variantClasses[variant]} bg-neutral-200 text-neutral-500 flex items-center justify-center`}
        >
          <svg
            className="w-1/2 h-1/2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {status && (
        <span
          className={`absolute ${statusPositionClasses[statusPosition]} ${
            statusColors[status]
          } ${
            statusSizeClasses[size]
          } rounded-full ring-2 ring-white`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Avatar; 