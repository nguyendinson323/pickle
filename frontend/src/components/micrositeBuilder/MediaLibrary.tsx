import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  DocumentIcon,
  FilmIcon,
  MusicalNoteIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  CloudArrowUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { micrositeBuilderApi } from '../../services/micrositeBuilderApi';

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  tags: string[];
  folder?: string;
  category: 'image' | 'video' | 'document' | 'audio';
  usageCount: number;
  createdAt: string;
}

interface MediaLibraryProps {
  micrositeId: number;
  selectionMode?: boolean;
  onMediaSelect?: (media: MediaItem) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  micrositeId,
  selectionMode = false,
  onMediaSelect
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    alt: '',
    caption: '',
    tags: '',
    folder: ''
  });

  const itemsPerPage = 20;

  useEffect(() => {
    loadMedia();
  }, [micrositeId, selectedCategory, selectedFolder, currentPage]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (selectedFolder) {
        params.folder = selectedFolder;
      }

      const response = await micrositeBuilderApi.getMedia(micrositeId, params);
      
      if (response.success) {
        setMedia(response.data.media || []);
        setTotalItems(response.data.pagination?.totalItems || 0);
      }
    } catch (error: any) {
      console.error('Error loading media:', error);
      toast.error('Error al cargar los archivos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Selecciona un archivo');
      return;
    }

    try {
      setUploading(true);
      
      const uploadData = {
        file: uploadForm.file,
        alt: uploadForm.alt,
        caption: uploadForm.caption,
        tags: uploadForm.tags ? uploadForm.tags.split(',').map(tag => tag.trim()) : [],
        folder: uploadForm.folder
      };

      const response = await micrositeBuilderApi.uploadMedia(micrositeId, uploadData);
      
      if (response.success) {
        toast.success('Archivo subido exitosamente');
        setShowUploadModal(false);
        setUploadForm({
          file: null,
          alt: '',
          caption: '',
          tags: '',
          folder: ''
        });
        loadMedia();
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      return;
    }

    try {
      const response = await micrositeBuilderApi.deleteMedia(micrositeId, mediaId);
      
      if (response.success) {
        toast.success('Archivo eliminado');
        loadMedia();
        if (selectedMedia?.id === mediaId) {
          setSelectedMedia(null);
        }
      }
    } catch (error: any) {
      console.error('Error deleting media:', error);
      toast.error(error.message || 'Error al eliminar el archivo');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image': return PhotoIcon;
      case 'video': return FilmIcon;
      case 'audio': return MusicalNoteIcon;
      default: return DocumentIcon;
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  };

  const filteredMedia = media.filter(item => 
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    { id: 'all', name: 'Todos', count: media.length },
    { id: 'image', name: 'Imágenes', count: media.filter(m => m.category === 'image').length },
    { id: 'video', name: 'Videos', count: media.filter(m => m.category === 'video').length },
    { id: 'document', name: 'Documentos', count: media.filter(m => m.category === 'document').length },
    { id: 'audio', name: 'Audio', count: media.filter(m => m.category === 'audio').length }
  ];

  const folders = Array.from(new Set(media.map(m => m.folder).filter(Boolean)));

  if (loading && media.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Biblioteca de Media
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {totalItems} archivo{totalItems !== 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
            Subir Archivo
          </button>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar archivos..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="p-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Categorías
            </h4>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Folders */}
          {folders.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Carpetas
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFolder('')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedFolder === ''
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Sin carpeta
                </button>
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder!)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                      selectedFolder === folder
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FolderIcon className="h-4 w-4 mr-2" />
                    {folder}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredMedia.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay archivos
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Sube archivos para comenzar a construir tu biblioteca de media.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredMedia.map((item) => {
                  const Icon = getCategoryIcon(item.category);
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (selectionMode && onMediaSelect) {
                          onMediaSelect(item);
                        } else {
                          setSelectedMedia(item);
                        }
                      }}
                      className="group relative bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      {/* Media Preview */}
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {item.category === 'image' ? (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.alt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Media Info */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-gray-900 truncate">
                          {item.originalName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(item.size)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMedia(item);
                            }}
                            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                          >
                            <EyeIcon className="h-3 w-3 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMedia(item.id);
                            }}
                            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 text-red-600"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Subir Archivo
                </h3>
                
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Archivo
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setUploadForm(prev => ({ 
                        ...prev, 
                        file: e.target.files?.[0] || null 
                      }))}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto Alternativo
                    </label>
                    <input
                      type="text"
                      value={uploadForm.alt}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, alt: e.target.value }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Descripción del archivo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pie de Foto (Opcional)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.caption}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (separados por comas)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carpeta (Opcional)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.folder}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, folder: e.target.value }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="nombre-carpeta"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {uploading ? 'Subiendo...' : 'Subir'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;