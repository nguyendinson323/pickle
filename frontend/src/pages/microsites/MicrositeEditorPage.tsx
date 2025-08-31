import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchMicrosite
} from '../../store/micrositeSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import MicrositeBuilderSidebar from '../../components/microsites/MicrositeBuilderSidebar';
import MicrositePageEditor from '../../components/microsites/MicrositePageEditor';
import MicrositePreview from '../../components/microsites/MicrositePreview';
import MicrositeSettings from '../../components/microsites/MicrositeSettings';
import MediaLibrary from '../../components/microsites/MediaLibrary';
import ThemeCustomizer from '../../components/microsites/ThemeCustomizer';
import { 
  EyeIcon, 
  PencilIcon, 
  Cog6ToothIcon, 
  DocumentTextIcon,
  PhotoIcon,
  PaintBrushIcon 
} from '@heroicons/react/24/outline';

const MicrositeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { 
    selectedMicrosite: currentMicrosite, 
    currentPage, 
    loading, 
    error
  } = useSelector((state: RootState) => state.microsites);
  
  const [previewMode] = useState(false);

  const [activeTab, setActiveTab] = useState('pages');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchMicrosite(parseInt(id)));
    }
    
    // Cleanup is handled by component unmounting
  }, [id, dispatch]);

  useEffect(() => {
    // Page management is handled by the microsite data
  }, [currentMicrosite, dispatch]);

  const handlePreviewToggle = () => {
    // setPreviewMode(!previewMode);
    console.log('Preview toggle', previewMode);
  };

  const handlePublish = async () => {
    if (currentMicrosite) {
      // Handle publish logic
      console.log('Publishing microsite:', currentMicrosite.id);
    }
  };

  const tabs = [
    {
      key: 'pages',
      label: 'Páginas',
      icon: DocumentTextIcon,
    },
    {
      key: 'media',
      label: 'Multimedia',
      icon: PhotoIcon,
    },
    {
      key: 'theme',
      label: 'Tema',
      icon: PaintBrushIcon,
    },
    {
      key: 'settings',
      label: 'Configuración',
      icon: Cog6ToothIcon,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !currentMicrosite) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error al cargar el micrositio
        </h2>
        <p className="text-gray-600 mb-4">{error || 'Micrositio no encontrado'}</p>
        <Button onClick={() => navigate('/dashboard/microsites')}>
          Volver a Micrositios
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 flex-shrink-0`}>
        <MicrositeBuilderSidebar
          microsite={currentMicrosite}
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={setActiveTab}
          isCollapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentMicrosite.title}
              </h1>
              <p className="text-sm text-gray-500">
                {currentMicrosite.subdomain}.pickleballfed.mx
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewToggle}
                className="flex items-center gap-2"
              >
                {previewMode ? (
                  <>
                    <PencilIcon className="w-4 h-4" />
                    Editar
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-4 h-4" />
                    Vista Previa
                  </>
                )}
              </Button>

              {currentMicrosite.status === 'published' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://${currentMicrosite.subdomain}.pickleballfed.mx`, '_blank')}
                >
                  Ver Sitio
                </Button>
              )}

              <Button
                size="sm"
                onClick={handlePublish}
                disabled={currentMicrosite.status === 'published'}
              >
                {currentMicrosite.status === 'published' ? 'Publicado' : 'Publicar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {previewMode ? (
            <MicrositePreview microsite={currentMicrosite} />
          ) : (
            <div className="h-full">
              {activeTab === 'pages' && (
                <MicrositePageEditor 
                  microsite={currentMicrosite}
                  page={currentPage}
                />
              )}
              {activeTab === 'media' && (
                <MediaLibrary />
              )}
              {activeTab === 'theme' && (
                <ThemeCustomizer microsite={currentMicrosite} />
              )}
              {activeTab === 'settings' && (
                <MicrositeSettings microsite={currentMicrosite} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicrositeEditorPage;