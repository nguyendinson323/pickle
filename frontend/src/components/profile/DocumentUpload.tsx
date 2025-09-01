import React, { useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import apiService from '@/services/api';

interface DocumentUploadProps {
  label: string;
  accept: string;
  maxSize: number; // in MB
  currentDocument?: string;
  onDocumentUpdate: (documentUrl: string) => void;
  required?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  accept,
  maxSize,
  currentDocument,
  onDocumentUpdate,
  required = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    // Validate file
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const mimeTypeMatch = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      }
      return file.type.match(type);
    });

    if (!mimeTypeMatch) {
      alert(`Please select a valid file type: ${accept}`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('idDocument', file);

      const response = await apiService.post<any>('/upload/document', formData);

      if (response.success && response.url) {
        onDocumentUpdate(response.url);
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Document upload failed:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="document-upload">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && !currentDocument && document.getElementById(`file-input-${label}`)?.click()}
      >
        {currentDocument ? (
          <div className="flex items-center justify-center space-x-2">
            <DocumentTextIcon className="w-8 h-8 text-green-500" />
            <span className="text-sm text-green-600">Document uploaded</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(currentDocument, '_blank');
              }}
              className="text-primary-600 hover:text-primary-800 text-sm underline"
            >
              View
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`file-input-${label}`)?.click();
              }}
              className="text-gray-600 hover:text-gray-800 text-sm underline"
              disabled={isUploading}
            >
              Replace
            </button>
          </div>
        ) : (
          <div>
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your document here, or{' '}
              <span className="text-primary-600 hover:text-primary-800 underline">
                browse
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: {accept} • Max size: {maxSize}MB
            </p>
          </div>
        )}

        {isUploading && (
          <div className="mt-2">
            <LoadingSpinner size="sm" />
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          </div>
        )}
      </div>

      <input
        id={`file-input-${label}`}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default DocumentUpload;