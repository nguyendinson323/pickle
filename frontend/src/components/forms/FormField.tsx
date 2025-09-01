import React from 'react';
import { FormFieldProps } from '@/types/registration';

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  required = false,
  error,
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type={type === 'email' ? 'text' : type === 'tel' ? 'text' : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-primary-500 
          focus:border-primary-500 transition-colors duration-200
          ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}
        `}
      />
      
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

export default FormField;