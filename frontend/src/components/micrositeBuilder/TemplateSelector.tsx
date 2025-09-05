import React, { useState, useEffect } from 'react';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { micrositeBuilderApi } from '../../services/micrositeBuilderApi';

interface MicrositeTemplate {
  id: number;
  name: string;
  description: string;
  category: 'club' | 'state' | 'general';
  thumbnailUrl: string;
  previewUrl?: string;
  isPremium: boolean;
  requiredPlan?: string;
  tags: string[];
  isActive: boolean;
}

interface TemplateSelectorProps {
  selectedTemplateId?: number;
  onTemplateSelect: (template: MicrositeTemplate) => void;
  category?: string;
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateSelect,
  category,
  className = ''
}) => {
  const [templates, setTemplates] = useState<MicrositeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>(category || 'all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<MicrositeTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [categoryFilter, premiumFilter]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      
      if (premiumFilter !== 'all') {
        params.isPremium = premiumFilter === 'premium';
      }

      const response = await micrositeBuilderApi.getTemplates(params);
      
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error: any) {
      console.error('Error loading templates:', error);
      toast.error('Error al cargar los templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: MicrositeTemplate) => {
    if (template.isPremium) {
      // Here you would check if user has required subscription
      // For now, just show a toast
      toast.error('Se requiere suscripción premium para este template');
      return;
    }
    
    onTemplateSelect(template);
  };

  const openPreviewModal = (template: MicrositeTemplate) => {
    setPreviewTemplate(template);
    setPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setPreviewModalOpen(false);
    setPreviewTemplate(null);
  };

  const getCategoryLabel = (cat: string) => {
    const labels = {
      club: 'Club',
      state: 'Comité Estatal',
      general: 'General'
    };
    return labels[cat as keyof typeof labels] || cat;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="all">Todas las categorías</option>
            <option value="club">Club</option>
            <option value="state">Comité Estatal</option>
            <option value="general">General</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="premium-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            id="premium-filter"
            value={premiumFilter}
            onChange={(e) => setPremiumFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="all">Todos</option>
            <option value="free">Gratuitos</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron templates con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative bg-white rounded-lg border-2 shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTemplateId === template.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <StarIcon className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                </div>
              )}

              {/* Selected Badge */}
              {selectedTemplateId === template.id && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              {/* Template Thumbnail */}
              <div className="relative">
                <img
                  src={template.thumbnailUrl}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-template.png';
                  }}
                />
                
                {/* Preview Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreviewModal(template);
                    }}
                    className="opacity-0 hover:opacity-100 transition-opacity duration-200 inline-flex items-center px-3 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-gray-900"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Vista Previa
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {template.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                    {getCategoryLabel(template.category)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs text-gray-500">
                        +{template.tags.length - 3} más
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && previewTemplate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {previewTemplate.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Vista previa del template
                  </p>
                </div>
                <button
                  onClick={closePreviewModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {previewTemplate.previewUrl ? (
                  <iframe
                    src={previewTemplate.previewUrl}
                    className="w-full h-96 border border-gray-300 rounded-lg"
                    title={`Preview de ${previewTemplate.name}`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                    <img
                      src={previewTemplate.thumbnailUrl}
                      alt={previewTemplate.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {previewTemplate.description}
                  </p>

                  {previewTemplate.tags.length > 0 && (
                    <>
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Características</h4>
                      <div className="flex flex-wrap gap-2">
                        {previewTemplate.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-4">
                <button
                  onClick={closePreviewModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate);
                    closePreviewModal();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                  disabled={previewTemplate.isPremium}
                >
                  {previewTemplate.isPremium ? 'Requiere Premium' : 'Seleccionar Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;