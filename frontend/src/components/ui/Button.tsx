import React, { ButtonHTMLAttributes } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200 ease-in-out
    transform active:scale-95
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}
  `;

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[32px]',
    md: 'px-4 py-2.5 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]'
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600 text-white
      hover:from-primary-600 hover:to-primary-700
      focus:ring-primary-500
      shadow-md hover:shadow-lg
      ${disabled || loading ? 'opacity-50 from-primary-300 to-primary-400' : ''}
    `,
    secondary: `
      bg-secondary-100 text-secondary-700 border border-secondary-200
      hover:bg-secondary-200 hover:border-secondary-300
      focus:ring-secondary-500
      ${disabled || loading ? 'opacity-50 bg-secondary-50' : ''}
    `,
    success: `
      bg-gradient-to-r from-success-500 to-success-600 text-white
      hover:from-success-600 hover:to-success-700
      focus:ring-success-500
      shadow-md hover:shadow-lg
      ${disabled || loading ? 'opacity-50 from-success-300 to-success-400' : ''}
    `,
    warning: `
      bg-gradient-to-r from-warning-500 to-warning-600 text-white
      hover:from-warning-600 hover:to-warning-700
      focus:ring-warning-500
      shadow-md hover:shadow-lg
      ${disabled || loading ? 'opacity-50 from-warning-300 to-warning-400' : ''}
    `,
    error: `
      bg-gradient-to-r from-error-500 to-error-600 text-white
      hover:from-error-600 hover:to-error-700
      focus:ring-error-500
      shadow-md hover:shadow-lg
      ${disabled || loading ? 'opacity-50 from-error-300 to-error-400' : ''}
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-500
      ${disabled || loading ? 'opacity-50 text-gray-400' : ''}
    `,
    outline: `
      border border-gray-300 text-gray-700 bg-white
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-primary-500
      ${disabled || loading ? 'opacity-50 border-gray-200 text-gray-400' : ''}
    `
  };

  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `;

  return (
    <button
      className={buttonClasses.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          <span className="opacity-70">Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;