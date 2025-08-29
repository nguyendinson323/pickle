import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14'
  };

  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
    lg: checked ? 'translate-x-7' : 'translate-x-0'
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex-shrink-0">
        <button
          type="button"
          className={`
            ${sizeClasses[size]}
            relative inline-flex items-center rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2
            ${checked 
              ? 'bg-blue-600' 
              : disabled 
                ? 'bg-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300'
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          role="switch"
          aria-checked={checked}
        >
          <span
            aria-hidden="true"
            className={`
              ${thumbSizeClasses[size]}
              ${translateClasses[size]}
              pointer-events-none inline-block rounded-full bg-white shadow-lg transform 
              ring-0 transition duration-200 ease-in-out
            `}
          />
        </button>
      </div>
      
      {(label || description) && (
        <div className="ml-3 flex-1">
          {label && (
            <label className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {label}
            </label>
          )}
          {description && (
            <p className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Switch;