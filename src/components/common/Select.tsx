import React, { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'default' | 'filled' | 'outline';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  id?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      helperText,
      error,
      size = 'md',
      variant = 'default',
      leftIcon,
      fullWidth = false,
      className = '',
      containerClassName = '',
      labelClassName = '',
      selectClassName = '',
      id,
      disabled,
      required,
      placeholder,
      ...props
    },
    ref
  ) => {
    // Generate a random ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    // Size classes
    const sizeClasses = {
      sm: 'py-1.5 text-sm',
      md: 'py-2 text-sm',
      lg: 'py-2.5 text-base',
    };

    // Icon padding classes
    const iconPaddingClasses = {
      sm: 'pl-7',
      md: 'pl-9',
      lg: 'pl-10',
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
            htmlFor={selectId}
            className={`block text-sm font-medium text-neutral-700 mb-1.5 ${
              disabled ? 'text-neutral-400' : ''
            } ${labelClassName}`}
          >
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            className={`
              block rounded-lg px-3 pr-9 appearance-none
              ${sizeClasses[size]} 
              ${variantClasses[variant]} 
              ${leftIcon ? iconPaddingClasses[size] : ''} 
              ${errorStateClasses} 
              ${disabledClasses}
              ${fullWidth ? 'w-full' : ''}
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${selectClassName}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-error-600">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 