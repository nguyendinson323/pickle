import React, { useState } from 'react';
import { 
  GlobeAltIcon,
  SwatchIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { micrositeBuilderApi } from '../../services/micrositeBuilderApi';

interface Microsite {
  id: number;
  name: string;
  slug: string;
  subdomain: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterCard?: string;
  };
  features: {
    contactForm: boolean;
    eventCalendar: boolean;
    memberDirectory: boolean;
    photoGallery: boolean;
    newsUpdates: boolean;
    socialMedia: boolean;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      coordinates?: { lat: number; lng: number };
    };
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
  };
  customDomain?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

interface MicrositeSettingsProps {
  microsite: Microsite;
  onUpdate: (updates: Partial<Microsite>) => void;
}

const MicrositeSettings: React.FC<MicrositeSettingsProps> = ({
  microsite,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'seo' | 'features' | 'integrations'>('general');
  const [saving, setSaving] = useState(false);

  const handleSave = async (updates: any) => {
    try {
      setSaving(true);
      const response = await micrositeBuilderApi.updateMicrosite(microsite.id, updates);
      
      if (response.success) {
        onUpdate(updates);
        toast.success('Configuración guardada');
      }
    } catch (error: any) {
      console.error('Error updating microsite:', error);
      toast.error(error.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any, nested?: string) => {
    if (nested) {
      const updates = {
        [nested]: {
          ...microsite[nested as keyof Microsite],
          [field]: value
        }
      };
      handleSave(updates);
    } else {
      handleSave({ [field]: value });
    }
  };

  const updateColorScheme = (color: string, value: string) => {
    const updates = {
      colorScheme: {
        ...microsite.colorScheme,
        [color]: value
      }
    };
    handleSave(updates);
  };

  const updateSEO = (field: string, value: any) => {
    updateField(field, value, 'seo');
  };

  const updateFeatures = (feature: string, value: boolean) => {
    updateField(feature, value, 'features');
  };

  const updateContactInfo = (field: string, value: any, nested?: string) => {
    if (nested) {
      const updates = {
        contactInfo: {
          ...microsite.contactInfo,
          [nested]: {
            ...microsite.contactInfo[nested as keyof typeof microsite.contactInfo],
            [field]: value
          }
        }
      };
      handleSave(updates);
    } else {
      updateField(field, value, 'contactInfo');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'design', name: 'Diseño', icon: SwatchIcon },
    { id: 'seo', name: 'SEO', icon: MagnifyingGlassIcon },
    { id: 'features', name: 'Características', icon: ShieldCheckIcon },
    { id: 'integrations', name: 'Integraciones', icon: ShareIcon }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">
          Configuración del Micrositio
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Personaliza la apariencia y funcionalidad de tu sitio web
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Micrositio
              </label>
              <input
                type="text"
                value={microsite.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={microsite.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={microsite.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdominio
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={microsite.subdomain}
                    onChange={(e) => updateField('subdomain', e.target.value)}
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    .pickleballmx.com
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dominio Personalizado (Opcional)
              </label>
              <input
                type="text"
                value={microsite.customDomain || ''}
                onChange={(e) => updateField('customDomain', e.target.value)}
                placeholder="ejemplo.com"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Configura un dominio personalizado para tu micrositio
              </p>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={microsite.contactInfo.email || ''}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={microsite.contactInfo.phone || ''}
                    onChange={(e) => updateContactInfo('phone', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={microsite.contactInfo.address?.street || ''}
                    onChange={(e) => updateContactInfo('street', e.target.value, 'address')}
                    placeholder="Calle y número"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={microsite.contactInfo.address?.city || ''}
                    onChange={(e) => updateContactInfo('city', e.target.value, 'address')}
                    placeholder="Ciudad"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={microsite.contactInfo.address?.state || ''}
                    onChange={(e) => updateContactInfo('state', e.target.value, 'address')}
                    placeholder="Estado"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={microsite.contactInfo.address?.postalCode || ''}
                    onChange={(e) => updateContactInfo('postalCode', e.target.value, 'address')}
                    placeholder="Código postal"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Esquema de Colores</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Primario
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={microsite.colorScheme.primary}
                      onChange={(e) => updateColorScheme('primary', e.target.value)}
                      className="h-10 w-16 rounded-md border border-gray-300"
                    />
                    <input
                      type="text"
                      value={microsite.colorScheme.primary}
                      onChange={(e) => updateColorScheme('primary', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={microsite.colorScheme.secondary}
                      onChange={(e) => updateColorScheme('secondary', e.target.value)}
                      className="h-10 w-16 rounded-md border border-gray-300"
                    />
                    <input
                      type="text"
                      value={microsite.colorScheme.secondary}
                      onChange={(e) => updateColorScheme('secondary', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de Acento
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={microsite.colorScheme.accent}
                      onChange={(e) => updateColorScheme('accent', e.target.value)}
                      className="h-10 w-16 rounded-md border border-gray-300"
                    />
                    <input
                      type="text"
                      value={microsite.colorScheme.accent}
                      onChange={(e) => updateColorScheme('accent', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de Fondo
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={microsite.colorScheme.background}
                      onChange={(e) => updateColorScheme('background', e.target.value)}
                      className="h-10 w-16 rounded-md border border-gray-300"
                    />
                    <input
                      type="text"
                      value={microsite.colorScheme.background}
                      onChange={(e) => updateColorScheme('background', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color del Texto
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={microsite.colorScheme.text}
                      onChange={(e) => updateColorScheme('text', e.target.value)}
                      className="h-10 w-16 rounded-md border border-gray-300"
                    />
                    <input
                      type="text"
                      value={microsite.colorScheme.text}
                      onChange={(e) => updateColorScheme('text', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-6 p-6 rounded-lg border" style={{ backgroundColor: microsite.colorScheme.background }}>
                <h5 className="text-lg font-semibold mb-2" style={{ color: microsite.colorScheme.text }}>
                  Vista Previa
                </h5>
                <p className="mb-4" style={{ color: microsite.colorScheme.text }}>
                  Este es un ejemplo de cómo se verán los colores en tu micrositio.
                </p>
                <button
                  className="px-4 py-2 rounded-md text-white mr-3"
                  style={{ backgroundColor: microsite.colorScheme.primary }}
                >
                  Botón Primario
                </button>
                <button
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: microsite.colorScheme.accent }}
                >
                  Botón de Acento
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título SEO
              </label>
              <input
                type="text"
                value={microsite.seo.title}
                onChange={(e) => updateSEO('title', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Título optimizado para motores de búsqueda"
              />
              <p className="mt-1 text-sm text-gray-500">
                Máximo 60 caracteres recomendado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Descripción
              </label>
              <textarea
                rows={3}
                value={microsite.seo.description}
                onChange={(e) => updateSEO('description', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Descripción que aparece en los resultados de búsqueda"
              />
              <p className="mt-1 text-sm text-gray-500">
                Máximo 155 caracteres recomendado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palabras Clave
              </label>
              <input
                type="text"
                value={microsite.seo.keywords.join(', ')}
                onChange={(e) => updateSEO('keywords', e.target.value.split(', ').filter(k => k.trim()))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="pickleball, club, deporte, comunidad"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separa las palabras clave con comas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Open Graph (URL)
              </label>
              <input
                type="url"
                value={microsite.seo.ogImage || ''}
                onChange={(e) => updateSEO('ogImage', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://ejemplo.com/imagen-social.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Imagen que aparece when se comparte en redes sociales (1200x630px recomendado)
              </p>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Características Disponibles
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                Habilita o deshabilita características específicas de tu micrositio
              </p>

              <div className="space-y-4">
                {Object.entries(microsite.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {feature === 'contactForm' && 'Formulario de Contacto'}
                        {feature === 'eventCalendar' && 'Calendario de Eventos'}
                        {feature === 'memberDirectory' && 'Directorio de Miembros'}
                        {feature === 'photoGallery' && 'Galería de Fotos'}
                        {feature === 'newsUpdates' && 'Actualizaciones de Noticias'}
                        {feature === 'socialMedia' && 'Integración con Redes Sociales'}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {feature === 'contactForm' && 'Permite a los visitantes enviar mensajes'}
                        {feature === 'eventCalendar' && 'Muestra próximos eventos y torneos'}
                        {feature === 'memberDirectory' && 'Directorio público de miembros'}
                        {feature === 'photoGallery' && 'Galerías de imágenes interactivas'}
                        {feature === 'newsUpdates' && 'Sistema de blog y noticias'}
                        {feature === 'socialMedia' && 'Enlaces y feeds de redes sociales'}
                      </p>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateFeatures(feature, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={microsite.googleAnalyticsId || ''}
                onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="G-XXXXXXXXXX"
              />
              <p className="mt-1 text-sm text-gray-500">
                ID de Google Analytics para rastrear visitantes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={microsite.facebookPixelId || ''}
                onChange={(e) => updateField('facebookPixelId', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="123456789012345"
              />
              <p className="mt-1 text-sm text-gray-500">
                ID del Pixel de Facebook para anuncios y conversiones
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={microsite.contactInfo.socialMedia?.facebook || ''}
                    onChange={(e) => updateContactInfo('facebook', e.target.value, 'socialMedia')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://facebook.com/tu-pagina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={microsite.contactInfo.socialMedia?.instagram || ''}
                    onChange={(e) => updateContactInfo('instagram', e.target.value, 'socialMedia')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://instagram.com/tu-cuenta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={microsite.contactInfo.socialMedia?.twitter || ''}
                    onChange={(e) => updateContactInfo('twitter', e.target.value, 'socialMedia')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://twitter.com/tu-cuenta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={microsite.contactInfo.socialMedia?.youtube || ''}
                    onChange={(e) => updateContactInfo('youtube', e.target.value, 'socialMedia')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://youtube.com/tu-canal"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Status */}
      {saving && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Guardando cambios...
          </div>
        </div>
      )}
    </div>
  );
};

export default MicrositeSettings;