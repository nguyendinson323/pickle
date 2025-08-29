import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { uploadMediaFile, deleteMediaFile } from '../../store/slices/micrositeSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  FolderIcon,
  GridIcon,
  ListIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface MediaLibraryProps {
  micrositeId: number;
  isSelectMode?: boolean;
  allowedTypes?: string[];
  maxSelection?: number;
  onSelect?: (files: any[]) => void;
  selectedFiles?: any[];
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  micrositeId,
  isSelectMode = false,
  allowedTypes = ['image', 'video', 'document'],
  maxSelection = 1,
  onSelect,
  selectedFiles = []
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mediaFiles, loading } = useSelector((state: RootState) => state.microsites);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>(selectedFiles);

  // Filter media files
  const filteredFiles = mediaFiles?.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.fileType.startsWith(filterType);
    const matchesAllowedType = allowedTypes.includes(file.fileType.split('/')[0]);
    
    return matchesSearch && matchesType && matchesAllowedType;
  }) || [];

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('micrositeId', micrositeId.toString());
        
        await dispatch(uploadMediaFile({
          micrositeId,
          file: formData
        }));

        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = (file: any) => {
    if (!isSelectMode) {
      setPreviewFile(file);
      return;
    }

    if (maxSelection === 1) {
      setSelectedItems([file]);
      onSelect?.([file]);
    } else {
      const isSelected = selectedItems.some(f => f.id === file.id);
      let newSelection;
      
      if (isSelected) {
        newSelection = selectedItems.filter(f => f.id !== file.id);
      } else if (selectedItems.length < maxSelection) {
        newSelection = [...selectedItems, file];
      } else {
        return; // Max selection reached
      }
      
      setSelectedItems(newSelection);
      onSelect?.(newSelection);
    }
  };

  const handleDelete = async (file: any) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      try {
        await dispatch(deleteMediaFile(file.id));
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <PhotoIcon className="w-6 h-6 text-blue-500" />;
    } else if (fileType.startsWith('video/')) {
      return <VideoCameraIcon className="w-6 h-6 text-purple-500" />;
    }
    return <DocumentIcon className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredFiles.map((file) => {
        const isSelected = selectedItems.some(f => f.id === file.id);
        return (
          <div
            key={file.id}
            onClick={() => handleFileSelect(file)}
            className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
              isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {isSelectMode && isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {file.fileType.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="w-full h-full object-cover"
                />
              ) : (
                getFileIcon(file.fileType)
              )}
            </div>

            <div className="p-2">
              <p className="text-xs font-medium text-gray-900 truncate">
                {file.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>

            {!isSelectMode && (
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewFile(file);
                  }}
                  className="bg-white"
                >
                  <EyeIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file);
                  }}
                  className="bg-white text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="divide-y divide-gray-200">
      {filteredFiles.map((file) => {
        const isSelected = selectedItems.some(f => f.id === file.id);
        return (
          <div
            key={file.id}
            onClick={() => handleFileSelect(file)}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 ${
              isSelected ? 'bg-blue-50' : ''
            }`}
          >
            {isSelectMode && (
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                isSelected 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300'
              }`}>
                {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
              </div>
            )}

            <div className="flex-shrink-0">
              {file.fileType.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  {getFileIcon(file.fileType)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{file.fileName}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
              </p>
              {file.description && (
                <p className="text-sm text-gray-600 truncate mt-1">{file.description}</p>
              )}
            </div>

            {!isSelectMode && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewFile(file);
                  }}
                >
                  <EyeIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderFilePreviewModal = () => (
    <Modal
      isOpen={!!previewFile}
      onClose={() => setPreviewFile(null)}
      title="Vista Previa del Archivo"
      size="lg"
    >
      {previewFile && (
        <div className="space-y-4">
          <div className="text-center">
            {previewFile.fileType.startsWith('image/') ? (
              <img
                src={previewFile.url}
                alt={previewFile.fileName}
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
            ) : previewFile.fileType.startsWith('video/') ? (
              <video
                src={previewFile.url}
                controls
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
            ) : (
              <div className="p-8 bg-gray-100 rounded-lg">
                {getFileIcon(previewFile.fileType)}
                <p className="mt-2 font-medium">{previewFile.fileName}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Nombre:</dt>
                <dd className="text-gray-600">{previewFile.fileName}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Tamaño:</dt>
                <dd className="text-gray-600">{formatFileSize(previewFile.size)}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Tipo:</dt>
                <dd className="text-gray-600">{previewFile.fileType}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Subido:</dt>
                <dd className="text-gray-600">{new Date(previewFile.createdAt).toLocaleDateString()}</dd>
              </div>
              {previewFile.description && (
                <div className="col-span-2">
                  <dt className="font-medium text-gray-900">Descripción:</dt>
                  <dd className="text-gray-600">{previewFile.description}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(previewFile.url, '_blank')}
            >
              Descargar
            </Button>
            <Button
              onClick={() => handleDelete(previewFile)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isSelectMode ? 'Seleccionar Archivos' : 'Biblioteca de Medios'}
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {!isSelectMode && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                Subir Archivos
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los tipos' },
              { value: 'image', label: 'Imágenes' },
              { value: 'video', label: 'Videos' },
              { value: 'application', label: 'Documentos' }
            ]}
          />
        </div>

        {isSelectMode && selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedItems.length} de {maxSelection} archivos seleccionados
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedItems([]);
                onSelect?.([]);
              }}
            >
              Limpiar selección
            </Button>
          </div>
        )}
      </div>

      {/* Upload Area */}
      {!isSelectMode && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="m-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {isUploading ? (
            <div className="space-y-3">
              <LoadingSpinner />
              <p className="text-sm text-gray-600">
                Subiendo archivos... {Math.round(uploadProgress)}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                Soporta imágenes, videos y documentos hasta 10MB
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
              >
                Seleccionar Archivos
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : filteredFiles.length > 0 ? (
          viewMode === 'grid' ? renderGridView() : renderListView()
        ) : (
          <div className="text-center py-12">
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay archivos
            </h3>
            <p className="text-gray-500">
              {searchQuery || filterType !== 'all' 
                ? 'No se encontraron archivos con los filtros aplicados.'
                : 'Sube tu primer archivo para comenzar.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Preview Modal */}
      {renderFilePreviewModal()}
    </div>
  );
};

export default MediaLibrary;