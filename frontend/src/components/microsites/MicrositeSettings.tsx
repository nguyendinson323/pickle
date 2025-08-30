import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateMicrosite } from '../../store/micrositeSlice';
import { Microsite } from '../../store/micrositeSlice';
import Button from '../ui/Button';
import { 
  Cog6ToothIcon,
  GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface MicrositeSettingsProps {
  microsite: Microsite;
}

const MicrositeSettings: React.FC<MicrositeSettingsProps> = ({ microsite }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: microsite.title || '',
    description: microsite.description || '',
    subdomain: microsite.subdomain || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateMicrosite({
        id: microsite.id,
        data: formData
      })).unwrap();
      
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título del Sitio
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingresa el título del sitio"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe tu sitio web"
        />
      </div>

      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-2">
          Subdominio
        </label>
        <div className="flex">
          <input
            type="text"
            id="subdomain"
            value={formData.subdomain}
            onChange={(e) => handleInputChange('subdomain', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="mi-sitio"
          />
          <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
            .pickleballapp.com
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white h-full">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Configuración del Sitio
          </h2>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveSection('general')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'general'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <DocumentTextIcon className="w-5 h-5" />
              General
            </button>
            
            <button
              onClick={() => setActiveSection('domain')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'domain'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <GlobeAltIcon className="w-5 h-5" />
              Dominio
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeSection === 'general' && renderGeneralSettings()}
            {activeSection === 'domain' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Configuración de Dominio</h3>
                <p className="text-gray-600">
                  Tu sitio está disponible en: <strong>{formData.subdomain || 'tu-sitio'}.pickleballapp.com</strong>
                </p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2"
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrositeSettings;