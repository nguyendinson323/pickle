import React from 'react';
import { Microsite, MicrositePage } from '../../store/slices/micrositeSlice';
import ContentBlockPreview from './ContentBlockPreview';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  GlobeAltIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface MicrositePreviewProps {
  microsite: Microsite;
}

const MicrositePreview: React.FC<MicrositePreviewProps> = ({ microsite }) => {
  const homePage = microsite.pages?.find(page => page.isHomePage);
  const currentPage = homePage || microsite.pages?.[0];

  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {microsite.title}
            </h1>
            {microsite.description && (
              <p className="text-gray-600 mt-1">
                {microsite.description}
              </p>
            )}
          </div>
          
          {microsite.logo && (
            <div className="flex-shrink-0">
              <img 
                src={microsite.logo} 
                alt={microsite.title}
                className="h-12 w-auto"
              />
            </div>
          )}
        </div>
        
        <nav className="mt-6">
          <div className="flex space-x-8">
            {microsite.pages
              ?.filter(page => page.isPublished)
              .sort((a, b) => {
                if (a.isHomePage) return -1;
                if (b.isHomePage) return 1;
                return a.sortOrder - b.sortOrder;
              })
              .map((page) => (
                <button
                  key={page.id}
                  className={`text-sm font-medium transition-colors ${
                    currentPage?.id === page.id
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-2'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {page.title}
                </button>
              ))
            }
          </div>
        </nav>
      </div>
    </header>
  );

  const renderContactInfo = () => {
    const hasContact = microsite.phone || microsite.email || microsite.address;
    
    if (!hasContact) return null;

    return (
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {microsite.phone && (
              <div className="flex items-center justify-center gap-3">
                <PhoneIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{microsite.phone}</span>
              </div>
            )}
            
            {microsite.email && (
              <div className="flex items-center justify-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{microsite.email}</span>
              </div>
            )}
            
            {microsite.address && (
              <div className="flex items-center justify-center gap-3">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{microsite.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSocialMedia = () => {
    const socialLinks = microsite.socialMedia;
    if (!socialLinks || Object.keys(socialLinks).length === 0) return null;

    return (
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Síguenos
          </h3>
          <div className="flex justify-center gap-6">
            {socialLinks.facebook && (
              <a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Facebook
              </a>
            )}
            
            {socialLinks.instagram && (
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                Instagram
              </a>
            )}
            
            {socialLinks.twitter && (
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 transition-colors"
              >
                Twitter
              </a>
            )}
            
            {socialLinks.youtube && (
              <a 
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                YouTube
              </a>
            )}
            
            {socialLinks.website && (
              <a 
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                <GlobeAltIcon className="w-4 h-4" />
                Sitio Web
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFooter = () => (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-lg font-semibold mb-2">{microsite.title}</h3>
        {microsite.description && (
          <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
            {microsite.description}
          </p>
        )}
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <CalendarIcon className="w-4 h-4" />
          <span>Última actualización: {new Date(microsite.updatedAt).toLocaleDateString('es-MX')}</span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
          Powered by PickleBall Fed
        </div>
      </div>
    </footer>
  );

  if (!currentPage) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No hay páginas para mostrar
          </h2>
          <p className="text-gray-600">
            Crea y publica al menos una página para ver la vista previa del micrositio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Preview Header */}
      <div className="sticky top-0 bg-blue-600 text-white py-2 px-4 z-50">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Vista previa de {microsite.subdomain}.pickleballfed.mx
        </div>
      </div>

      {/* Microsite Content */}
      <div className="min-h-screen flex flex-col">
        {renderHeader()}
        
        {/* Main Content */}
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-8">
            {/* Page Title */}
            {!currentPage.isHomePage && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentPage.title}
                </h1>
                {currentPage.description && (
                  <p className="text-lg text-gray-600">
                    {currentPage.description}
                  </p>
                )}
              </div>
            )}

            {/* Content Blocks */}
            {currentPage.contentBlocks && currentPage.contentBlocks.length > 0 ? (
              <div className="space-y-12">
                {currentPage.contentBlocks
                  .filter(block => block.isVisible)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((block, index) => (
                    <div key={block.id} className="content-block">
                      <ContentBlockPreview block={block} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Página sin contenido
                </h3>
                <p className="text-gray-600">
                  Agrega bloques de contenido para que aparezcan aquí en la vista previa.
                </p>
              </div>
            )}
          </div>
        </main>

        {renderContactInfo()}
        {renderSocialMedia()}
        {renderFooter()}
      </div>
    </div>
  );
};

export default MicrositePreview;