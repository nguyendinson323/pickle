import React, { useState, useEffect } from 'react';
import { ContentBlock } from '../../store/micrositeSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
// FormField removed - using direct label/div structure instead
import SelectField from '../forms/SelectField';
import Tabs from '../ui/Tabs';
import MediaSelector from './MediaSelector';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ContentBlockEditorProps {
  block: ContentBlock;
  isOpen: boolean;
  onClose: () => void;
  onSave: (blockId: number, data: Partial<ContentBlock>) => void;
  micrositeId: number;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  isOpen,
  onClose,
  onSave,
  micrositeId,
}) => {
  const [content, setContent] = useState(block.content);
  const [settings, setSettings] = useState(block.settings || {});
  const [activeTab, setActiveTab] = useState('content');
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  useEffect(() => {
    setContent(block.content);
    setSettings(block.settings || {});
  }, [block]);

  const handleSave = () => {
    onSave(block.id, { content, settings });
    onClose();
  };

  const handleContentChange = (field: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderContentEditor = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido de Texto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={8}
                placeholder="Escribe tu contenido aquí... (HTML permitido)"
              />
            </div>

            <SelectField
              name="textAlign"
              label="Alineación del Texto"
              value={content.textAlign || 'left'}
              onChange={(value) => handleContentChange('textAlign', value)}
              options={[
                { value: 'left', label: 'Izquierda' },
                { value: 'center', label: 'Centrado' },
                { value: 'right', label: 'Derecha' },
                { value: 'justify', label: 'Justificado' },
              ]}
            />

            <SelectField
              name="fontSize"
              label="Tamaño de Fuente"
              value={content.fontSize || 'medium'}
              onChange={(value) => handleContentChange('fontSize', value)}
              options={[
                { value: 'small', label: 'Pequeño' },
                { value: 'medium', label: 'Mediano' },
                { value: 'large', label: 'Grande' },
                { value: 'xl', label: 'Extra Grande' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color del Texto
              </label>
              <input
                type="color"
                value={content.color || '#000000'}
                onChange={(e) => handleContentChange('color', e.target.value)}
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {content.imageUrl && (
                  <div className="relative">
                    <img
                      src={content.imageUrl}
                      alt={content.alt || 'Preview'}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowMediaSelector(true)}
                    className="flex items-center gap-2"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Seleccionar de Biblioteca
                  </Button>
                  
                  <div className="flex-1">
                    <input
                      type="url"
                      value={content.imageUrl || ''}
                      onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="O ingresa URL: https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Alternativo
              </label>
              <input
                type="text"
                value={content.alt || ''}
                onChange={(e) => handleContentChange('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción de la imagen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pie de Imagen
              </label>
              <input
                type="text"
                value={content.caption || ''}
                onChange={(e) => handleContentChange('caption', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Texto que aparece debajo de la imagen"
              />
            </div>

            <SelectField
              name="alignment"
              label="Alineación"
              value={content.alignment || 'center'}
              onChange={(value) => handleContentChange('alignment', value)}
              options={[
                { value: 'left', label: 'Izquierda' },
                { value: 'center', label: 'Centrado' },
                { value: 'right', label: 'Derecha' },
              ]}
            />

            <SelectField
              name="size"
              label="Tamaño"
              value={content.size || 'medium'}
              onChange={(value) => handleContentChange('size', value)}
              options={[
                { value: 'small', label: 'Pequeño' },
                { value: 'medium', label: 'Mediano' },
                { value: 'large', label: 'Grande' },
                { value: 'full', label: 'Ancho completo' },
              ]}
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <SelectField
              name="videoType"
              label="Tipo de Video"
              value={content.videoType || 'youtube'}
              onChange={(value) => handleContentChange('videoType', value)}
              options={[
                { value: 'youtube', label: 'YouTube' },
                { value: 'vimeo', label: 'Vimeo' },
                { value: 'file', label: 'Archivo de video' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Video <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={content.videoUrl || ''}
                onChange={(e) => handleContentChange('videoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  content.videoType === 'youtube' 
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'URL del video'
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Vista Previa
              </label>
              <input
                type="url"
                value={content.thumbnail || ''}
                onChange={(e) => handleContentChange('thumbnail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="URL de la imagen de vista previa"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.autoplay || false}
                  onChange={(e) => handleContentChange('autoplay', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Reproducción automática</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={content.controls !== false}
                  onChange={(e) => handleContentChange('controls', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Mostrar controles</span>
              </label>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contáctanos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <input
                type="email"
                value={content.email || ''}
                onChange={(e) => handleContentChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="contacto@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                value={content.phone || ''}
                onChange={(e) => handleContentChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="+52 55 1234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <textarea
                value={content.address || ''}
                onChange={(e) => handleContentChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Dirección completa"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showForm"
                checked={content.showForm || false}
                onChange={(e) => handleContentChange('showForm', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showForm" className="ml-2 text-sm text-gray-700">
                Mostrar formulario de contacto
              </label>
            </div>

            {content.showForm && (
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campos del Formulario
              </label>
                <div className="space-y-2">
                  {['name', 'email', 'phone', 'message'].map((field) => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(content.formFields || []).includes(field)}
                        onChange={(e) => {
                          const fields = content.formFields || [];
                          if (e.target.checked) {
                            handleContentChange('formFields', [...fields, field]);
                          } else {
                            handleContentChange('formFields', fields.filter((f: string) => f !== field));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {field === 'name' ? 'Nombre' :
                         field === 'email' ? 'Email' :
                         field === 'phone' ? 'Teléfono' :
                         field === 'message' ? 'Mensaje' : field}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'map':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                value={content.latitude || ''}
                onChange={(e) => handleContentChange('latitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="19.4326"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                value={content.longitude || ''}
                onChange={(e) => handleContentChange('longitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="-99.1332"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Zoom
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={content.zoom || 15}
                onChange={(e) => handleContentChange('zoom', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Marcador
              </label>
              <input
                type="text"
                value={content.markerTitle || ''}
                onChange={(e) => handleContentChange('markerTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Título que aparece en el marcador"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={content.address || ''}
                onChange={(e) => handleContentChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dirección visible"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showControls"
                checked={content.showControls !== false}
                onChange={(e) => handleContentChange('showControls', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showControls" className="ml-2 text-sm text-gray-700">
                Mostrar controles del mapa
              </label>
            </div>
          </div>
        );

      case 'custom_html':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código HTML <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content.html || ''}
                onChange={(e) => handleContentChange('html', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={8}
                placeholder="<div>Tu código HTML aquí...</div>"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSS Personalizado
              </label>
              <textarea
                value={content.css || ''}
                onChange={(e) => handleContentChange('css', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={6}
                placeholder=".mi-clase { color: blue; }"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <strong>Advertencia:</strong> Solo usa código HTML y CSS de fuentes confiables. 
                El código malicioso puede comprometer la seguridad de tu sitio.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Editor no disponible para el tipo: {block.type}</p>
          </div>
        );
    }
  };

  const renderSettingsEditor = () => {
    return (
      <div className="space-y-4">
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margen Superior
              </label>
          <SelectField
            name="marginTop"
            label="Margen Superior"
            value={settings.marginTop || 'medium'}
            onChange={(value) => handleSettingsChange('marginTop', value)}
            options={[
              { value: 'none', label: 'Sin margen' },
              { value: 'small', label: 'Pequeño' },
              { value: 'medium', label: 'Mediano' },
              { value: 'large', label: 'Grande' },
            ]}
          />
        </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margen Inferior
              </label>
          <SelectField
            name="marginBottom"
            label="Margen Inferior"
            value={settings.marginBottom || 'medium'}
            onChange={(value) => handleSettingsChange('marginBottom', value)}
            options={[
              { value: 'none', label: 'Sin margen' },
              { value: 'small', label: 'Pequeño' },
              { value: 'medium', label: 'Mediano' },
              { value: 'large', label: 'Grande' },
            ]}
          />
        </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Fondo
              </label>
          <input
            type="color"
            value={settings.backgroundColor || '#ffffff'}
            onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
            className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="fullWidth"
            checked={settings.fullWidth || false}
            onChange={(e) => handleSettingsChange('fullWidth', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="fullWidth" className="ml-2 text-sm text-gray-700">
            Ancho completo
          </label>
        </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clase CSS Personalizada
              </label>
          <input
            type="text"
            value={settings.customClass || ''}
            onChange={(e) => handleSettingsChange('customClass', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="mi-clase-personalizada"
          />
        </div>
      </div>
    );
  };

  const handleMediaSelect = (files: any[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (block.type === 'image') {
        handleContentChange('imageUrl', file.url);
        if (!content.alt) {
          handleContentChange('alt', file.fileName);
        }
      } else if (block.type === 'gallery') {
        const newImages = files.map(f => ({
          url: f.url,
          alt: f.fileName,
          caption: f.description || ''
        }));
        handleContentChange('images', [...(content.images || []), ...newImages]);
      }
    }
  };

  const tabs = [
    { id: 'content', label: 'Contenido' },
    { id: 'settings', label: 'Configuración' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Bloque: ${block.type}`}
      size="lg"
    >
      <div className="space-y-6">
        <Tabs
          items={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="min-h-[400px]">
          {activeTab === 'content' && renderContentEditor()}
          {activeTab === 'settings' && renderSettingsEditor()}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </div>

      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => setShowMediaSelector(false)}
        onSelect={handleMediaSelect}
        micrositeId={micrositeId}
        allowedTypes={block.type === 'gallery' ? ['image'] : ['image']}
        maxSelection={block.type === 'gallery' ? 10 : 1}
        title={block.type === 'gallery' ? 'Seleccionar Imágenes' : 'Seleccionar Imagen'}
      />
    </Modal>
  );
};

export default ContentBlockEditor;