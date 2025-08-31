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
            dangerouslySetInnerHTML={{ __html: block.content.text || '<p>Empty text</p>' }}
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
                <p className="text-gray-500">No image selected</p>
              </div>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Image Gallery</h3>
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
                <p className="text-gray-500">No images in gallery</p>
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
                    <p>YouTube Video</p>
                    <p className="text-sm opacity-75">Preview not available</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p>Custom Video</p>
                    <p className="text-sm opacity-75">Preview not available</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">🎥</div>
                <p className="text-gray-500">No video configured</p>
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {block.content.title || 'Contact Information'}
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
                  <p className="text-sm text-gray-600 mb-3">Contact form:</p>
                  <div className="space-y-2">
                    {(block.content.formFields || ['name', 'email', 'message']).map((field: string) => (
                      <div key={field} className="text-sm text-gray-500">
                        • Field: {field}
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
            <h3 className="text-lg font-medium mb-4">Location Map</h3>
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <MapPinIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                Interactive map - Lat: {block.content.latitude || 0}, Lng: {block.content.longitude || 0}
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
              {block.content.title || 'Our Courts'}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">List of available courts</p>
              <div className="text-sm text-gray-500 space-y-1">
                {block.content.showAvailability && <div>• Show availability</div>}
                {block.content.showPricing && <div>• Show pricing</div>}
                {block.content.showBookingButton && <div>• Booking button</div>}
                <div>• Layout: {block.content.layout || 'grid'}</div>
              </div>
            </div>
          </div>
        );

      case 'tournament_list':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {block.content.title || 'Tournaments'}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <TrophyIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Tournament list</p>
              <div className="text-sm text-gray-500 space-y-1">
                {block.content.showUpcoming && <div>• Show upcoming tournaments</div>}
                {block.content.showPast && <div>• Show past tournaments</div>}
                {block.content.showRegistrationButton && <div>• Registration button</div>}
                <div>• Limit: {block.content.limit || 10} tournaments</div>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {block.content.title || 'Event Calendar'}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <CalendarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Interactive calendar</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div>• Events: {block.content.showEvents || 'all'}</div>
                <div>• View: {block.content.view || 'monthly'}</div>
                {block.content.showFilters && <div>• Filters enabled</div>}
              </div>
            </div>
          </div>
        );

      case 'custom_html':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Custom HTML</h3>
            {block.content.html ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
                  {block.content.html}
                </pre>
                {block.content.css && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Custom CSS:</p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-20">
                      {block.content.css}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">💻</div>
                <p className="text-gray-500">No custom HTML configured</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Unsupported block type: <code>{block.type}</code>
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