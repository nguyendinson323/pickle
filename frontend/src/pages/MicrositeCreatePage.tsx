import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import TemplateSelector from '../components/micrositeBuilder/TemplateSelector';
import { micrositeBuilderApi, CreateMicrositeRequest } from '../services/micrositeBuilderApi';

interface MicrositeTemplate {
  id: number;
  name: string;
  description: string;
  category: 'club' | 'state_committee' | 'general';
  thumbnailUrl: string;
  previewUrl?: string;
  isPremium: boolean;
  requiredPlan?: string;
  tags: string[];
  isActive: boolean;
}

interface FormData {
  templateId: number | null;
  name: string;
  slug: string;
  subdomain: string;
  description: string;
}

const MicrositeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<MicrositeTemplate | null>(null);
  const [formData, setFormData] = useState<FormData>({
    templateId: null,
    name: '',
    slug: '',
    subdomain: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [subdomainChecking, setSubdomainChecking] = useState(false);

  const handleTemplateSelect = (template: MicrositeTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({ ...prev, templateId: template.id }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '') // Remove spaces
      .substring(0, 20); // Limit length
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
      subdomain: prev.subdomain || generateSubdomain(name)
    }));
  };

  const validateForm = () => {
    if (!selectedTemplate) {
      toast.error('Selecciona un template');
      return false;
    }

    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return false;
    }

    if (!formData.slug.trim()) {
      toast.error('El slug es requerido');
      return false;
    }

    if (!formData.subdomain.trim()) {
      toast.error('El subdominio es requerido');
      return false;
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast.error('El slug solo puede contener letras, números y guiones');
      return false;
    }

    // Validate subdomain format
    if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
      toast.error('El subdominio solo puede contener letras y números');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const createData: CreateMicrositeRequest = {
        templateId: formData.templateId!,
        name: formData.name,
        slug: formData.slug,
        subdomain: formData.subdomain,
        description: formData.description
      };

      const response = await micrositeBuilderApi.createMicrosite(createData);
      
      if (response.success) {
        toast.success('Micrositio creado exitosamente');
        navigate(`/microsite-builder/${response.data.id}/edit`);
      }
    } catch (error: any) {
      console.error('Error creating microsite:', error);
      toast.error(error.message || 'Error al crear el micrositio');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedTemplate) {
      toast.error('Selecciona un template para continuar');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/microsite-builder')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Micrositio</h1>
              <p className="text-gray-600">Configura tu nuevo sitio web personalizado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Seleccionar Template
                </span>
              </div>
              <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                <div 
                  className={`h-full transition-all duration-300 ${
                    currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  style={{ width: currentStep >= 2 ? '100%' : '0%' }}
                />
              </div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Configuración
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Elige un Template
              </h2>
              <p className="text-gray-600">
                Selecciona un diseño base para tu micrositio. Podrás personalizarlo después.
              </p>
            </div>

            <TemplateSelector
              selectedTemplateId={selectedTemplate?.id}
              onTemplateSelect={handleTemplateSelect}
              className="mb-8"
            />

            <div className="flex justify-end">
              <button
                onClick={nextStep}
                disabled={!selectedTemplate}
                className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Configuración del Micrositio
              </h2>
              <p className="text-gray-600">
                Define la información básica de tu micrositio.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
              <div className="bg-white shadow rounded-lg p-6 space-y-6">
                {/* Selected Template Preview */}
                {selectedTemplate && (
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedTemplate.thumbnailUrl}
                        alt={selectedTemplate.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedTemplate.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedTemplate.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Micrositio *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej: Club de Pickleball Jalisco"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL amigable) *
                    </label>
                    <input
                      type="text"
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="jalisco-pickleball"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      pattern="[a-z0-9-]+"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Solo letras minúsculas, números y guiones
                    </p>
                  </div>

                  <div>
                    <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-2">
                      Subdominio *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="subdomain"
                        value={formData.subdomain}
                        onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                        placeholder="jalisco"
                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        pattern="[a-z0-9]+"
                        required
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        .pickleballmx.com
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Solo letras minúsculas y números
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe tu club o comité estatal..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Volver
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creando...' : 'Crear Micrositio'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicrositeCreatePage;