import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateMicrosite } from '../../store/slices/micrositeSlice';
import { Microsite } from '../../store/slices/micrositeSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { 
  Cog6ToothIcon,
  GlobeAltIcon,
  ShareIcon,
  EyeIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
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
    subdomain: microsite.subdomain || '',
    phone: microsite.phone || '',
    email: microsite.email || '',
    address: microsite.address || '',
    logo: microsite.logo || '',
    favicon: microsite.favicon || '',
    socialMedia: {
      facebook: microsite.socialMedia?.facebook || '',
      instagram: microsite.socialMedia?.instagram || '',
      twitter: microsite.socialMedia?.twitter || '',
      youtube: microsite.socialMedia?.youtube || '',
      website: microsite.socialMedia?.website || '',
    },
    seoSettings: {
      metaTitle: microsite.seoSettings?.metaTitle || '',
      metaDescription: microsite.seoSettings?.metaDescription || '',
      metaKeywords: microsite.seoSettings?.metaKeywords || '',
      ogTitle: microsite.seoSettings?.ogTitle || '',
      ogDescription: microsite.seoSettings?.ogDescription || '',
      ogImage: microsite.seoSettings?.ogImage || '',
    },
    customCSS: microsite.customCSS || '',
    customJS: microsite.customJS || '',
    analytics: {
      googleAnalyticsId: microsite.analytics?.googleAnalyticsId || '',
      facebookPixelId: microsite.analytics?.facebookPixelId || '',
    }
  });

  const handleInputChange = (field: string, value: string) => {
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateMicrosite({
        id: microsite.id,
        updates: formData
      }));
    } catch (error) {
      console.error('Error updating microsite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    {
      key: 'general',
      label: 'General',
      icon: Cog6ToothIcon,
    },
    {
      key: 'contact',
      label: 'Contacto',
      icon: ShareIcon,
    },
    {
      key: 'social',
      label: 'Redes Sociales',
      icon: ShareIcon,
    },
    {
      key: 'seo',
      label: 'SEO',
      icon: GlobeAltIcon,
    },
    {
      key: 'appearance',
      label: 'Apariencia',
      icon: PaintBrushIcon,
    },
    {
      key: 'advanced',
      label: 'Avanzado',
      icon: DocumentTextIcon,
    },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
        <div className="space-y-4">
          <Input
            label="Nombre del Micrositio"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ej: Club de Pickleball Norte"
            required
          />
          
          <Textarea
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe tu micrositio..."
            rows={3}
          />
          
          <div>
            <Input
              label="Subdominio"
              value={formData.subdomain}
              onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="mi-club"
              required
              helperText="Solo letras, números y guiones. Tu sitio será accesible en: https://tu-subdominio.pickleballfed.mx"
            />
          </div>
          
          <Input
            label="Logo (URL)"
            type="url"
            value={formData.logo}
            onChange={(e) => handleInputChange('logo', e.target.value)}
            placeholder="https://ejemplo.com/logo.png"
          />
          
          <Input
            label="Favicon (URL)"
            type="url"
            value={formData.favicon}
            onChange={(e) => handleInputChange('favicon', e.target.value)}
            placeholder="https://ejemplo.com/favicon.ico"
          />
        </div>
      </div>
    </div>
  );

  const renderContactSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
        <div className="space-y-4">
          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+52 55 1234 5678"
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contacto@miclub.com"
          />
          
          <Textarea
            label="Dirección"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Calle Ejemplo 123, Colonia Centro, Ciudad, CP 12345"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderSocialSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h3>
        <div className="space-y-4">
          <Input
            label="Facebook"
            value={formData.socialMedia.facebook}
            onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
            placeholder="https://facebook.com/tu-pagina"
          />
          
          <Input
            label="Instagram"
            value={formData.socialMedia.instagram}
            onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
            placeholder="https://instagram.com/tu-cuenta"
          />
          
          <Input
            label="Twitter"
            value={formData.socialMedia.twitter}
            onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
            placeholder="https://twitter.com/tu-cuenta"
          />
          
          <Input
            label="YouTube"
            value={formData.socialMedia.youtube}
            onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
            placeholder="https://youtube.com/tu-canal"
          />
          
          <Input
            label="Sitio Web"
            value={formData.socialMedia.website}
            onChange={(e) => handleInputChange('socialMedia.website', e.target.value)}
            placeholder="https://tu-sitio-web.com"
          />
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración SEO</h3>
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
            placeholder="pickleball, deporte, club, torneos"
          />
          
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Open Graph (Redes Sociales)</h4>
            
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
              className="mt-4"
            />
            
            <Input
              label="Imagen OG (URL)"
              value={formData.seoSettings.ogImage}
              onChange={(e) => handleInputChange('seoSettings.ogImage', e.target.value)}
              placeholder="https://ejemplo.com/imagen-compartir.jpg"
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personalización Visual</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <EyeIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Editor de Temas</h4>
              <p className="text-sm text-blue-700">
                Próximamente podrás personalizar colores, fuentes y estilos de tu micrositio.
              </p>
            </div>
          </div>
        </div>
        
        <Textarea
          label="CSS Personalizado"
          value={formData.customCSS}
          onChange={(e) => handleInputChange('customCSS', e.target.value)}
          placeholder="/* Agrega tu CSS personalizado aquí */"
          rows={8}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Avanzada</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Analytics</h4>
            <div className="space-y-4">
              <Input
                label="Google Analytics ID"
                value={formData.analytics.googleAnalyticsId}
                onChange={(e) => handleInputChange('analytics.googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              
              <Input
                label="Facebook Pixel ID"
                value={formData.analytics.facebookPixelId}
                onChange={(e) => handleInputChange('analytics.facebookPixelId', e.target.value)}
                placeholder="123456789012345"
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">JavaScript Personalizado</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800 mb-1">¡Precaución!</h5>
                  <p className="text-sm text-yellow-700">
                    Solo agrega código JavaScript si sabes lo que haces. El código incorrecto puede afectar el funcionamiento del sitio.
                  </p>
                </div>
              </div>
            </div>
            
            <Textarea
              label="JavaScript Personalizado"
              value={formData.customJS}
              onChange={(e) => handleInputChange('customJS', e.target.value)}
              placeholder="// Agrega tu JavaScript personalizado aquí"
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      {/* Settings Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Configuración
          </h2>
          
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === 'general' && renderGeneralSettings()}
          {activeSection === 'contact' && renderContactSettings()}
          {activeSection === 'social' && renderSocialSettings()}
          {activeSection === 'seo' && renderSEOSettings()}
          {activeSection === 'appearance' && renderAppearanceSettings()}
          {activeSection === 'advanced' && renderAdvancedSettings()}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrositeSettings;