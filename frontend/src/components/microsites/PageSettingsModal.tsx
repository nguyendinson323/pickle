import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updatePage } from '../../store/micrositeSlice';
import { MicrositePage } from '../../store/micrositeSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Switch from '../ui/Switch';
import Tabs from '../ui/Tabs';
import {
  DocumentTextIcon,
  GlobeAltIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: MicrositePage | null;
}

const PageSettingsModal: React.FC<PageSettingsModalProps> = ({
  isOpen,
  onClose,
  page
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    template: 'default',
    isPublished: false,
    sortOrder: 1,
    seoSettings: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      noIndex: false,
      noFollow: false,
    },
    settings: {
      showInNavigation: true,
      requireAuth: false,
      customCSS: '',
      customJS: '',
    }
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        description: page.description || '',
        template: page.template || 'default',
        isPublished: page.isPublished || false,
        sortOrder: page.sortOrder || 1,
        seoSettings: {
          metaTitle: page.seoSettings?.metaTitle || '',
          metaDescription: page.seoSettings?.metaDescription || '',
          metaKeywords: page.seoSettings?.metaKeywords || '',
          ogTitle: page.seoSettings?.ogTitle || '',
          ogDescription: page.seoSettings?.ogDescription || '',
          ogImage: page.seoSettings?.ogImage || '',
          noIndex: page.seoSettings?.noIndex || false,
          noFollow: page.seoSettings?.noFollow || false,
        },
        settings: {
          showInNavigation: page.settings?.showInNavigation !== false,
          requireAuth: page.settings?.requireAuth || false,
          customCSS: page.settings?.customCSS || '',
          customJS: page.settings?.customJS || '',
        }
      });
    }
  }, [page]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!page?.isHomePage) {
      const newSlug = generateSlug(title);
      handleInputChange('slug', newSlug);
    }
  };

  const handleSave = async () => {
    if (!page) return;

    setIsLoading(true);
    try {
      await dispatch(updatePage({
        id: page.id,
        updates: formData
      }));
      onClose();
    } catch (error) {
      console.error('Error updating page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const templates = [
    { value: 'default', label: 'Por Defecto' },
    { value: 'landing', label: 'Página de Aterrizaje' },
    { value: 'about', label: 'Acerca de' },
    { value: 'contact', label: 'Contacto' },
    { value: 'events', label: 'Eventos' },
    { value: 'gallery', label: 'Galería' },
  ];

  const tabs = [
    {
      key: 'general',
      label: 'General',
      icon: DocumentTextIcon,
    },
    {
      key: 'seo',
      label: 'SEO',
      icon: GlobeAltIcon,
    },
    {
      key: 'visibility',
      label: 'Visibilidad',
      icon: EyeIcon,
    },
    {
      key: 'advanced',
      label: 'Avanzado',
      icon: Cog6ToothIcon,
    },
  ];

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <Input
        label="Título de la Página"
        value={formData.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Ej: Acerca de Nosotros"
        required
      />

      {!page?.isHomePage && (
        <Input
          label="URL (Slug)"
          value={formData.slug}
          onChange={(e) => handleInputChange('slug', generateSlug(e.target.value))}
          placeholder="acerca-de-nosotros"
          required
          helperText="La URL será: /tu-slug"
        />
      )}

      <Textarea
        label="Descripción"
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Describe el contenido de esta página..."
        rows={3}
      />

      <Select
        label="Plantilla"
        value={formData.template}
        onChange={(e) => handleInputChange('template', e.target.value)}
        options={templates}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Orden en Navegación
        </label>
        <Input
          type="number"
          value={formData.sortOrder.toString()}
          onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Meta Tags</h3>
        <div className="space-y-4">
          <Input
            label="Meta Título"
            value={formData.seoSettings.metaTitle}
            onChange={(e) => handleInputChange('seoSettings.metaTitle', e.target.value)}
            placeholder="Título que aparece en Google (50-60 caracteres)"
            maxLength={60}
          />

          <Textarea
            label="Meta Descripción"
            value={formData.seoSettings.metaDescription}
            onChange={(e) => handleInputChange('seoSettings.metaDescription', e.target.value)}
            placeholder="Descripción que aparece en Google (150-160 caracteres)"
            maxLength={160}
            rows={3}
          />

          <Input
            label="Palabras Clave"
            value={formData.seoSettings.metaKeywords}
            onChange={(e) => handleInputChange('seoSettings.metaKeywords', e.target.value)}
            placeholder="palabra1, palabra2, palabra3"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Open Graph (Redes Sociales)</h3>
        <div className="space-y-4">
          <Input
            label="Título OG"
            value={formData.seoSettings.ogTitle}
            onChange={(e) => handleInputChange('seoSettings.ogTitle', e.target.value)}
            placeholder="Título al compartir en redes sociales"
          />

          <Textarea
            label="Descripción OG"
            value={formData.seoSettings.ogDescription}
            onChange={(e) => handleInputChange('seoSettings.ogDescription', e.target.value)}
            placeholder="Descripción al compartir en redes sociales"
            rows={2}
          />

          <Input
            label="Imagen OG (URL)"
            value={formData.seoSettings.ogImage}
            onChange={(e) => handleInputChange('seoSettings.ogImage', e.target.value)}
            placeholder="https://ejemplo.com/imagen-compartir.jpg"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Indexación</h3>
        <div className="space-y-3">
          <Switch
            label="No Index"
            description="Evitar que los motores de búsqueda indexen esta página"
            checked={formData.seoSettings.noIndex}
            onChange={(checked) => handleInputChange('seoSettings.noIndex', checked)}
          />

          <Switch
            label="No Follow"
            description="Evitar que los motores de búsqueda sigan los enlaces en esta página"
            checked={formData.seoSettings.noFollow}
            onChange={(checked) => handleInputChange('seoSettings.noFollow', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderVisibilityTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Estado de Publicación</h3>
        <Switch
          label="Página Publicada"
          description="La página será visible para los visitantes del sitio"
          checked={formData.isPublished}
          onChange={(checked) => handleInputChange('isPublished', checked)}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Navegación</h3>
        <Switch
          label="Mostrar en Navegación"
          description="La página aparecerá en el menú de navegación principal"
          checked={formData.settings.showInNavigation}
          onChange={(checked) => handleInputChange('settings.showInNavigation', checked)}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Acceso</h3>
        <Switch
          label="Requiere Autenticación"
          description="Solo los usuarios autenticados pueden ver esta página"
          checked={formData.settings.requireAuth}
          onChange={(checked) => handleInputChange('settings.requireAuth', checked)}
        />
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">CSS Personalizado</h3>
        <Textarea
          label="CSS Personalizado para esta Página"
          value={formData.settings.customCSS}
          onChange={(e) => handleInputChange('settings.customCSS', e.target.value)}
          placeholder="/* Agrega tu CSS personalizado aquí */"
          rows={6}
          className="font-mono text-sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">JavaScript Personalizado</h3>
        <Textarea
          label="JavaScript Personalizado para esta Página"
          value={formData.settings.customJS}
          onChange={(e) => handleInputChange('settings.customJS', e.target.value)}
          placeholder="// Agrega tu JavaScript personalizado aquí"
          rows={6}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );

  if (!page) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Página"
      size="xl"
    >
      <div className="flex h-96">
        {/* Tabs */}
        <div className="w-48 border-r border-gray-200 pr-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6 overflow-y-auto">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'seo' && renderSEOTab()}
          {activeTab === 'visibility' && renderVisibilityTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </Modal>
  );
};

export default PageSettingsModal;