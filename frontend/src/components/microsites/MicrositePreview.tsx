import React from 'react';
import { Microsite } from '../../store/micrositeSlice';
import ContentBlockPreview from './ContentBlockPreview';
import { CalendarIcon} from '@heroicons/react/24/outline';

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
          
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs">Logo</span>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="flex space-x-8">
            {microsite.pages
              ?.filter(page => page.isPublished)
              .sort((a, b) => {
                if (a.isHomePage) return -1;
                if (b.isHomePage) return 1;
                return (a.sortOrder || 0) - (b.sortOrder || 0);
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
    // Contact info not available in current Microsite interface
    return null;
  };

  const renderSocialMedia = () => {
    // Social media not available in current Microsite interface
    return null;

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
          <span>Status: Active</span>
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
            No pages to display
          </h2>
          <p className="text-gray-600">
            Create and publish at least one page to see the microsite preview.
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
          Preview of {microsite.subdomain}.pickleballfed.mx
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
                  .map((block) => (
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
                  Page without content
                </h3>
                <p className="text-gray-600">
                  Add content blocks to appear here in the preview.
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