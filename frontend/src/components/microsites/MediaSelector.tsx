import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import MediaLibrary from './MediaLibrary';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (files: any[]) => void;
  micrositeId: number;
  allowedTypes?: string[];
  maxSelection?: number;
  title?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ['image'],
  maxSelection = 1,
  title = 'Select File'
}) => {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const handleSelect = (files: any[]) => {
    setSelectedFiles(files);
  };

  const handleConfirm = () => {
    onSelect(selectedFiles);
    onClose();
    setSelectedFiles([]);
  };

  const handleCancel = () => {
    onClose();
    setSelectedFiles([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      size="full"
    >
      <div className="h-[80vh] flex flex-col">
        <div className="flex-1 overflow-hidden">
          <MediaLibrary
            isSelectMode={true}
            allowedTypes={allowedTypes}
            maxSelection={maxSelection}
            onSelect={handleSelect}
            selectedFiles={selectedFiles}
          />
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedFiles.length === 0}
            className="flex items-center gap-2"
          >
            <PhotoIcon className="w-4 h-4" />
            Select {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MediaSelector;