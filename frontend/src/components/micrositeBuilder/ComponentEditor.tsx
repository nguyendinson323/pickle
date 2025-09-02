import React, { useState } from 'react';
import { 
  SwatchIcon,
  AdjustmentsHorizontalIcon,
  PhotoIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface MicrositeComponent {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'contact_form' | 'event_list' | 'member_showcase' | 'stats' | 'testimonials' | 'map';
  position: number;
  settings: Record<string, any>;
  content: Record<string, any>;
  styling: {
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    shadow?: boolean;
  };
}

interface ComponentEditorProps {
  component: MicrositeComponent;
  onUpdate: (updates: Partial<MicrositeComponent>) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'styling'>('content');

  const updateContent = (field: string, value: any) => {
    onUpdate({
      content: {
        ...component.content,
        [field]: value
      }
    });
  };

  const updateSettings = (field: string, value: any) => {
    onUpdate({
      settings: {
        ...component.settings,
        [field]: value
      }
    });
  };

  const updateStyling = (field: string, value: any) => {
    onUpdate({
      styling: {
        ...component.styling,
        [field]: value
      }
    });
  };

  const renderContentEditor = () => {
    switch (component.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={component.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Título principal del hero"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <textarea
                rows={2}
                value={component.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Subtítulo descriptivo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Fondo (URL)
              </label>
              <input
                type="url"
                value={component.content.backgroundImage || ''}
                onChange={(e) => updateContent('backgroundImage', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={component.content.buttonText || ''}
                  onChange={(e) => updateContent('buttonText', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Llamada a la acción"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace del Botón
                </label>
                <input
                  type="text"
                  value={component.content.buttonLink || ''}
                  onChange={(e) => updateContent('buttonLink', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="#contacto"
                />
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido
              </label>
              <textarea
                rows={6}
                value={component.content.content || ''}
                onChange={(e) => updateContent('content', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Escribe tu contenido aquí..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Puedes usar HTML básico como &lt;strong&gt;, &lt;em&gt;, &lt;p&gt;, etc.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alineación del Texto
              </label>
              <select
                value={component.content.textAlign || 'left'}
                onChange={(e) => updateContent('textAlign', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
                <option value="justify">Justificado</option>
              </select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen
              </label>
              <input
                type="url"
                value={component.content.src || ''}
                onChange={(e) => updateContent('src', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Alternativo
              </label>
              <input
                type="text"
                value={component.content.alt || ''}
                onChange={(e) => updateContent('alt', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Descripción de la imagen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pie de Foto (Opcional)
              </label>
              <input
                type="text"
                value={component.content.caption || ''}
                onChange={(e) => updateContent('caption', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Pie de foto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlace (Opcional)
              </label>
              <input
                type="url"
                value={component.content.link || ''}
                onChange={(e) => updateContent('link', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>
        );

      case 'contact_form':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Formulario
              </label>
              <input
                type="text"
                value={component.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contáctanos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campos del Formulario
              </label>
              <div className="space-y-2">
                {['name', 'email', 'phone', 'message'].map((field) => (
                  <label key={field} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={component.content.fields?.includes(field) || false}
                      onChange={(e) => {
                        const currentFields = component.content.fields || ['name', 'email', 'message'];
                        if (e.target.checked) {
                          updateContent('fields', [...currentFields, field]);
                        } else {
                          updateContent('fields', currentFields.filter((f: string) => f !== field));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {field === 'name' && 'Nombre'}
                      {field === 'email' && 'Email'}
                      {field === 'phone' && 'Teléfono'}
                      {field === 'message' && 'Mensaje'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto del Botón
              </label>
              <input
                type="text"
                value={component.content.submitText || ''}
                onChange={(e) => updateContent('submitText', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enviar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de Éxito
              </label>
              <input
                type="text"
                value={component.content.successMessage || ''}
                onChange={(e) => updateContent('successMessage', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Mensaje enviado correctamente"
              />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Sección
              </label>
              <input
                type="text"
                value={component.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Estadísticas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estadísticas
              </label>
              <div className="space-y-3">
                {(component.content.stats || []).map((stat: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="number"
                      value={stat.number || ''}
                      onChange={(e) => {
                        const newStats = [...(component.content.stats || [])];
                        newStats[index] = { ...stat, number: e.target.value };
                        updateContent('stats', newStats);
                      }}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="100"
                    />
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => {
                        const newStats = [...(component.content.stats || [])];
                        newStats[index] = { ...stat, label: e.target.value };
                        updateContent('stats', newStats);
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Miembros activos"
                    />
                    <button
                      onClick={() => {
                        const newStats = (component.content.stats || []).filter((_: any, i: number) => i !== index);
                        updateContent('stats', newStats);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newStats = [...(component.content.stats || []), { number: '', label: '' }];
                    updateContent('stats', newStats);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  + Agregar Estadística
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-6 text-gray-500">
            <p>Editor específico para {component.type} en desarrollo...</p>
          </div>
        );
    }
  };

  const renderStylingEditor = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margen (px)
            </label>
            <input
              type="text"
              value={component.styling.margin || '0'}
              onChange={(e) => updateStyling('margin', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding (px)
            </label>
            <input
              type="text"
              value={component.styling.padding || '20px'}
              onChange={(e) => updateStyling('padding', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="20px"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={component.styling.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyling('backgroundColor', e.target.value)}
                className="h-10 w-16 rounded-md border border-gray-300"
              />
              <input
                type="text"
                value={component.styling.backgroundColor || 'transparent'}
                onChange={(e) => updateStyling('backgroundColor', e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color del Texto
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={component.styling.textColor || '#1e293b'}
                onChange={(e) => updateStyling('textColor', e.target.value)}
                className="h-10 w-16 rounded-md border border-gray-300"
              />
              <input
                type="text"
                value={component.styling.textColor || '#1e293b'}
                onChange={(e) => updateStyling('textColor', e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="#1e293b"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radio del Borde (px)
          </label>
          <input
            type="text"
            value={component.styling.borderRadius || '0'}
            onChange={(e) => updateStyling('borderRadius', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={component.styling.shadow || false}
              onChange={(e) => updateStyling('shadow', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">
              Agregar sombra
            </span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 inline mr-2" />
            Contenido
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'styling'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SwatchIcon className="h-4 w-4 inline mr-2" />
            Estilo
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'content' ? renderContentEditor() : renderStylingEditor()}
      </div>
    </div>
  );
};

export default ComponentEditor;