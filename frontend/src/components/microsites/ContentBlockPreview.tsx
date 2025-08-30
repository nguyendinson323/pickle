import React from 'react';
import { ContentBlock } from '../../store/micrositeSlice';
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarIcon,
  TrophyIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface ContentBlockPreviewProps {
  block: ContentBlock;
}

const ContentBlockPreview: React.FC<ContentBlockPreviewProps> = ({ block }) => {
  const renderContent = () => {
    switch (block.type) {
      case 'text':
        const textAlignClass = block.content.textAlign === 'center' ? 'text-center' : 
                               block.content.textAlign === 'right' ? 'text-right' : 
                               'text-left';
        return (
          <div 
            className={`prose max-w-none ${textAlignClass}`}
            dangerouslySetInnerHTML={{ __html: block.content.text || '<p>Texto vacío</p>' }}
          />
        );

      case 'image':
        const alignmentClass = block.content.alignment === 'left' ? 'text-left' : 
                               block.content.alignment === 'right' ? 'text-right' : 
                               'text-center';
        return (
          <div className={alignmentClass}>
            {block.content.imageUrl ? (
              <div>
                <img
                  src={block.content.imageUrl}
                  alt={block.content.alt || ''}
                  className="max-w-full h-auto rounded"
                />
                {block.content.caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    {block.content.caption}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">🖼️</div>
                <p className="text-gray-500">No se ha seleccionado ninguna imagen</p>
              </div>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Galería de Imágenes</h3>
            {block.content.images && block.content.images.length > 0 ? (
              <div className={`grid gap-4 ${
                block.content.columns === 1 ? 'grid-cols-1' :
                block.content.columns === 2 ? 'grid-cols-2' :
                block.content.columns === 4 ? 'grid-cols-4' :
                block.content.columns === 5 ? 'grid-cols-5' :
                block.content.columns === 6 ? 'grid-cols-6' :
                'grid-cols-3'
              }`}>
                {block.content.images.map((image: any, index: number) => (
                  <div key={index} className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.alt || ''}
                      className="w-full h-full object-cover rounded"
                    />
                    {block.content.showCaptions && image.caption && (
                      <p className="text-sm text-gray-600 mt-1">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">🖼️</div>
                <p className="text-gray-500">No hay imágenes en la galería</p>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Video</h3>
            {block.content.videoUrl ? (
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                {block.content.videoType === 'youtube' ? (
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <p>Video de YouTube</p>
                    <p className="text-sm opacity-75">Vista previa no disponible</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p>Video personalizado</p>
                    <p className="text-sm opacity-75">Vista previa no disponible</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">🎥</div>
                <p className="text-gray-500">No se ha configurado ningún video</p>
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {block.content.title || 'Información de Contacto'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {block.content.email && (
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                    <span>{block.content.email}</span>
                  </div>
                )}
                {block.content.phone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-blue-600" />
                    <span>{block.content.phone}</span>
                  </div>
                )}
                {block.content.address && (
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-blue-600 mt-1" />
                    <span>{block.content.address}</span>
                  </div>
                )}
              </div>
              {block.content.showForm && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">Formulario de contacto:</p>
                  <div className="space-y-2">
                    {(block.content.formFields || ['name', 'email', 'message']).map((field: string) => (
                      <div key={field} className="text-sm text-gray-500">
                        • Campo: {field}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'map':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Mapa de Ubicación</h3>
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <MapPinIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                Mapa interactivo - Lat: {block.content.latitude || 0}, Lng: {block.content.longitude || 0}
              </p>
              {block.content.address && (
                <p className="text-sm text-gray-500 mt-1">{block.content.address}</p>
              )}
            </div>
          </div>
        );

      case 'court_list':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {block.content.title || 'Nuestras Canchas'}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Lista de canchas disponibles</p>
              <div className="text-sm text-gray-500 space-y-1">
                {block.content.showAvailability && <div>• Mostrar disponibilidad</div>}
                {block.content.showPricing && <div>• Mostrar precios</div>}
                {block.content.showBookingButton && <div>• Botón de reserva</div>}
                <div>• Layout: {block.content.layout || 'grid'}</div>
              </div>
            </div>
          </div>
        );

      case 'tournament_list':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {block.content.title || 'Torneos'}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <TrophyIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Lista de torneos</p>
              <div className="text-sm text-gray-500 space-y-1">
                {block.content.showUpcoming && <div>• Mostrar próximos torneos</div>}
                {block.content.showPast && <div>• Mostrar torneos pasados</div>}
                {block.content.showRegistrationButton && <div>• Botón de inscripción</div>}
                <div>• Límite: {block.content.limit || 10} torneos</div>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {block.content.title || 'Calendario de Eventos'}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <CalendarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Calendario interactivo</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div>• Eventos: {block.content.showEvents || 'todos'}</div>
                <div>• Vista: {block.content.view || 'mensual'}</div>
                {block.content.showFilters && <div>• Filtros habilitados</div>}
              </div>
            </div>
          </div>
        );

      case 'custom_html':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">HTML Personalizado</h3>
            {block.content.html ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
                  {block.content.html}
                </pre>
                {block.content.css && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">CSS personalizado:</p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-20">
                      {block.content.css}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">💻</div>
                <p className="text-gray-500">No se ha configurado HTML personalizado</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Tipo de bloque no soportado: <code>{block.type}</code>
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`${!block.isVisible ? 'opacity-50' : ''}`}>
      {renderContent()}
    </div>
  );
};

export default ContentBlockPreview;