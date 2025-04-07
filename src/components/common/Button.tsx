import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-button';
  
  const variantStyles = {
    primary: 'bg-btn-bg text-btn-text hover:bg-gray-800 focus:ring-primary',
    outline: 'bg-btn-bg text-btn-text border border-gray-600 hover:bg-gray-800 focus:ring-primary',
    secondary: 'bg-btn-bg text-btn-text hover:bg-gray-800 focus:ring-primary'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
} 