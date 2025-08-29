import React from 'react';

interface CheckboxFieldProps {
  name: string;
  label: string | React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  className?: string;
  description?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  required = false,
  error,
  className = '',
  description
}) => {
  return (
    <div className={`form-field ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            required={required}
            className={`
              w-4 h-4 text-primary-600 border-gray-300 rounded 
              focus:ring-primary-500 focus:ring-2 transition-colors duration-200
              ${error ? 'border-error-500' : ''}
            `}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={name} className="text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckboxField;