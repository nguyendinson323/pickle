import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setCurrentPage, createPage } from '../../store/slices/micrositeSlice';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  DocumentTextIcon,
  HomeIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { Microsite } from '../../store/slices/micrositeSlice';

interface Tab {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MicrositeBuilderSidebarProps {
  microsite: Microsite;
  activeTab: string;
  tabs: Tab[];
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const MicrositeBuilderSidebar: React.FC<MicrositeBuilderSidebarProps> = ({
  microsite,
  activeTab,
  tabs,
  onTabChange,
  isCollapsed,
  onToggle,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPage } = useSelector((state: RootState) => state.microsites);

  const handlePageSelect = (page: any) => {
    dispatch(setCurrentPage(page));
  };

  const handleCreatePage = async () => {
    const pageData = {
      title: 'Nueva Página',
      slug: `nueva-pagina-${Date.now()}`,
      isHomePage: false,
      isPublished: false,
      template: 'default',
      settings: {},
    };

    await dispatch(createPage({ 
      micrositeId: microsite.id, 
      pageData 
    }));
  };

  const getPageIcon = (page: any) => {
    if (page.isHomePage) {
      return <HomeIcon className="w-4 h-4" />;
    }
    return <DocumentTextIcon className="w-4 h-4" />;
  };

  const getPageStatus = (page: any) => {
    if (!page.isPublished) {
      return <Badge variant="warning" size="sm">Borrador</Badge>;
    }
    return <Badge variant="success" size="sm">Publicado</Badge>;
  };

  if (isCollapsed) {
    return (
      <div className="w-16 h-full bg-white border-r border-gray-200 flex flex-col">
        {/* Toggle Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onToggle}
            className="w-full flex justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Icons */}
        <div className="flex-1 py-4">
          <div className="space-y-2 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`w-full p-3 rounded-md flex justify-center transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Editor</h2>
          <button
            onClick={onToggle}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'pages' && (
          <div className="p-4 space-y-4">
            {/* Add Page Button */}
            <Button
              onClick={handleCreatePage}
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Agregar Página
            </Button>

            {/* Pages List */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Páginas ({microsite.pages?.length || 0})
              </h3>
              
              {microsite.pages && microsite.pages.length > 0 ? (
                <div className="space-y-1">
                  {microsite.pages
                    .sort((a, b) => {
                      // Home page first, then by sort order
                      if (a.isHomePage) return -1;
                      if (b.isHomePage) return 1;
                      return a.sortOrder - b.sortOrder;
                    })
                    .map((page) => (
                      <div
                        key={page.id}
                        onClick={() => handlePageSelect(page)}
                        className={`p-3 rounded-md border cursor-pointer transition-colors ${
                          currentPage?.id === page.id
                            ? 'bg-blue-50 border-blue-200 text-blue-900'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getPageIcon(page)}
                            <span className="font-medium text-sm">
                              {page.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {page.isPublished ? (
                              <EyeIcon className="w-4 h-4 text-green-500" />
                            ) : (
                              <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-mono">
                            /{page.slug}
                          </span>
                          {getPageStatus(page)}
                        </div>

                        {page.contentBlocks && (
                          <div className="text-xs text-gray-500 mt-1">
                            {page.contentBlocks.length} bloques de contenido
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hay páginas</p>
                  <p className="text-xs">Crea tu primera página</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="p-4">
            <div className="space-y-4">
              <Button
                size="sm"
                className="w-full flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Subir Archivo
              </Button>
              
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Biblioteca de medios</p>
                <p className="text-xs">Próximamente...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Personalización
              </h3>
              
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Editor de temas</p>
                <p className="text-xs">Próximamente...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Configuración
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Estado:</span>
                  <Badge 
                    variant={microsite.status === 'published' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {microsite.status === 'published' ? 'Publicado' : 'Borrador'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Tema:</span>
                  <span className="text-gray-600">
                    {microsite.theme?.name || 'Por defecto'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Páginas:</span>
                  <span className="text-gray-600">
                    {microsite.pages?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Última actualización:</span>
                  <span className="text-gray-600 text-xs">
                    {new Date(microsite.updatedAt).toLocaleDateString('es-MX')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicrositeBuilderSidebar;