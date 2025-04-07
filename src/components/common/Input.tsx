import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'outline';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      variant = 'default',
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      fullWidth = false,
      className = '',
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    // Generate a random ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Size classes
    const sizeClasses = {
      sm: 'py-1.5 text-sm',
      md: 'py-2 text-sm',
      lg: 'py-2.5 text-base',
    };

    // Icon padding classes
    const iconPaddingClasses = {
      sm: {
        left: 'pl-7',
        right: 'pr-7',
        both: 'pl-7 pr-7',
      },
      md: {
        left: 'pl-9',
        right: 'pr-9',
        both: 'pl-9 pr-9',
      },
      lg: {
        left: 'pl-10',
        right: 'pr-10',
        both: 'pl-10 pr-10',
      },
    };

    // Variant classes
    const variantClasses = {
      default: 'bg-white border border-neutral-300 focus:border-primary-500',
      filled: 'bg-neutral-100 border border-transparent focus:bg-white focus:border-primary-500',
      outline: 'bg-transparent border border-neutral-300 focus:border-primary-500',
    };

    // Error state classes
    const errorStateClasses = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
      : 'focus:ring-primary-500';

    // Icon positioning classes
    const getIconPaddingClass = () => {
      if (leftIcon && rightIcon) return iconPaddingClasses[size].both;
      if (leftIcon) return iconPaddingClasses[size].left;
      if (rightIcon) return iconPaddingClasses[size].right;
      return '';
    };

    // Disabled classes
    const disabledClasses = disabled
      ? 'bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-200'
      : '';

    return (
      <div
        className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium text-neutral-700 mb-1.5 ${
              disabled ? 'text-neutral-400' : ''
            } ${labelClassName}`}
          >
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftAddon && (
            <div className="absolute inset-y-0 left-0 flex items-center">
              {leftAddon}
            </div>
          )}

          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={`
              block rounded-lg px-3 
              ${sizeClasses[size]} 
              ${variantClasses[variant]} 
              ${getIconPaddingClass()} 
              ${errorStateClasses} 
              ${disabledClasses}
              ${leftAddon ? 'pl-10' : ''} 
              ${rightAddon ? 'pr-10' : ''}
              ${fullWidth ? 'w-full' : ''}
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${inputClassName}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
              {rightIcon}
            </div>
          )}

          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error-600">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 