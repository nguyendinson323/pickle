import React from 'react';
import { SelectOption } from '@/types/registration';

interface SelectFieldProps {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  required = false,
  error,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  className = ''
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          bg-white focus:outline-none focus:ring-primary-500 
          focus:border-primary-500 transition-colors duration-200
          ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-error-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;