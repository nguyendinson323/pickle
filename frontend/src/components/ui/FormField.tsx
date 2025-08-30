import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  help,
  children,
  className = ''
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {help && (
        <p className="mt-1 text-sm text-gray-500">{help}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;