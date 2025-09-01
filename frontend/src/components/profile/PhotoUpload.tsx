import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import { CameraIcon } from '@heroicons/react/24/outline';
import apiService from '@/services/api';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoUpdate: (photoUrl: string) => void;
  isLoading?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  currentPhoto, 
  onPhotoUpdate,
  isLoading = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const cropperRef = useRef<HTMLImageElement>(null);
  const [cropper, setCropper] = useState<any>();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        alert('Please select a valid image file (JPEG, JPG, or PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setShowCropModal(true);
    }
  };

  const handleCrop = async () => {
    if (cropper) {
      setUploading(true);
      try {
        const canvas = cropper.getCroppedCanvas({
          width: 300,
          height: 300,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        });
        
        canvas.toBlob(async (blob: Blob | null) => {
          if (blob) {
            const formData = new FormData();
            formData.append('profilePhoto', blob, 'profile.jpg');
            
            try {
              const response = await apiService.post<any>('/upload/profile-photo', formData);
              
              if (response.success && response.url) {
                onPhotoUpdate(response.url);
                setShowCropModal(false);
                setSelectedFile(null);
              } else {
                throw new Error(response.error || 'Upload failed');
              }
            } catch (error) {
              console.error('Photo upload failed:', error);
              alert('Failed to upload photo. Please try again.');
            }
          }
        }, 'image/jpeg', 0.9);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleModalClose = () => {
    if (!uploading) {
      setShowCropModal(false);
      setSelectedFile(null);
      setCropper(undefined);
    }
  };

  return (
    <div className="profile-photo-upload">
      {/* Current photo display */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <img
          src={currentPhoto || '/default-avatar.svg'}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border-4 border-gray-200"
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.svg';
          }}
        />
        <button
          type="button"
          onClick={() => document.getElementById('photo-input')?.click()}
          className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
          disabled={isLoading || uploading}
        >
          <CameraIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading || uploading}
      />

      {/* Crop Modal */}
      {showCropModal && selectedFile && (
        <Modal isOpen={showCropModal} onClose={handleModalClose}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Adjust Your Photo</h3>
            <div className="mb-4">
              <Cropper
                src={URL.createObjectURL(selectedFile)}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                ref={cropperRef}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                viewMode={1}
                dragMode="move"
                cropBoxMovable={true}
                cropBoxResizable={true}
                toggleDragModeOnDblclick={false}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="btn-secondary"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCrop}
                className="btn-primary flex items-center space-x-2"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Save Photo</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PhotoUpload;