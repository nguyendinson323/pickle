import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false,
  pulse = false
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-full
    ${pulse ? 'animate-pulse' : ''}
    ${dot ? 'w-2 h-2 p-0' : ''}
  `;

  const sizeStyles = dot ? {} : {
    sm: 'px-2 py-1 text-xs min-w-[1.25rem] min-h-[1.25rem]',
    md: 'px-2.5 py-1.5 text-xs min-w-[1.5rem] min-h-[1.5rem]',
    lg: 'px-3 py-2 text-sm min-w-[2rem] min-h-[2rem]'
  };

  const variantStyles = {
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
    success: 'bg-success-100 text-success-800 border border-success-200',
    warning: 'bg-warning-100 text-warning-800 border border-warning-200',
    error: 'bg-error-100 text-error-800 border border-error-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200'
  };

  const dotVariantStyles = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-blue-500'
  };

  const badgeClasses = `
    ${baseStyles}
    ${dot ? dotVariantStyles[variant] : variantStyles[variant]}
    ${dot ? '' : sizeStyles[size as keyof typeof sizeStyles]}
    ${className}
  `;

  return (
    <span className={badgeClasses.trim()}>
      {!dot && children}
    </span>
  );
};

export default Badge;