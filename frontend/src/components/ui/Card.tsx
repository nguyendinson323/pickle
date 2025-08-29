import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  shadow = 'md',
  rounded = 'lg',
  header,
  footer,
  loading = false,
  onClick
}) => {
  const baseStyles = `
    bg-white border border-gray-200
    transition-all duration-200 ease-in-out
    ${onClick ? 'cursor-pointer' : ''}
    ${hover && !loading ? 'hover:shadow-lg hover:-translate-y-1' : ''}
  `;

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const roundedStyles = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const cardClasses = `
    ${baseStyles}
    ${paddingStyles[padding]}
    ${shadowStyles[shadow]}
    ${roundedStyles[rounded]}
    ${className}
  `;

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  if (loading) {
    return (
      <div className={cardClasses}>
        <div className="animate-pulse">
          {header && (
            <div className="pb-4 border-b border-gray-200 mb-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          
          {footer && (
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses} onClick={handleClick}>
      {header && (
        <div className={`${padding !== 'none' ? 'pb-4 border-b border-gray-200 mb-4' : ''}`}>
          {header}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className={`${padding !== 'none' ? 'pt-4 border-t border-gray-200 mt-4' : ''}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;