import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  EyeIcon, 
  CloudArrowUpIcon,
  Cog6ToothIcon,
  PhotoIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { micrositeBuilderApi } from '../services/micrositeBuilderApi';
import PageEditor from '../components/micrositeBuilder/PageEditor';
import MediaLibrary from '../components/micrositeBuilder/MediaLibrary';
import MicrositeSettings from '../components/micrositeBuilder/MicrositeSettings';
import AnalyticsPanel from '../components/micrositeBuilder/AnalyticsPanel';

interface Microsite {
  id: number;
  name: string;
  slug: string;
  subdomain: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  pages: MicrositePage[];
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
  };
  features: {
    contactForm: boolean;
    eventCalendar: boolean;
    memberDirectory: boolean;
    photoGallery: boolean;
    newsUpdates: boolean;
    socialMedia: boolean;
  };
  contactInfo: any;
}

interface MicrositePage {
  id: string;
  name: string;
  slug: string;
  title: string;
  metaDescription: string;
  components: any[];
  isPublished: boolean;
  sortOrder: number;
}

const MicrositeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [microsite, setMicrosite] = useState<Microsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pages' | 'media' | 'settings' | 'analytics'>('pages');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadMicrosite();
    }
  }, [id]);

  const loadMicrosite = async () => {
    try {
      setLoading(true);
      const response = await micrositeBuilderApi.getMicrositeById(Number(id));
      
      if (response.success) {
        setMicrosite(response.data);
        // Select first page by default
        if (response.data.pages.length > 0) {
          setSelectedPageId(response.data.pages[0].id);
        }
      }
    } catch (error: any) {
      console.error('Error loading microsite:', error);
      toast.error('Error al cargar el micrositio');
      navigate('/microsite-builder');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!microsite) return;

    try {
      setSaving(true);
      const response = await micrositeBuilderApi.publishMicrosite(microsite.id);
      
      if (response.success) {
        toast.success('Micrositio publicado exitosamente');
        setMicrosite(prev => prev ? { ...prev, status: 'published' } : null);
      }
    } catch (error: any) {
      console.error('Error publishing microsite:', error);
      toast.error(error.message || 'Error al publicar el micrositio');
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (!microsite) return;

    try {
      setSaving(true);
      const response = await micrositeBuilderApi.unpublishMicrosite(microsite.id);
      
      if (response.success) {
        toast.success('Micrositio despublicado exitosamente');
        setMicrosite(prev => prev ? { ...prev, status: 'draft' } : null);
      }
    } catch (error: any) {
      console.error('Error unpublishing microsite:', error);
      toast.error(error.message || 'Error al despublicar el micrositio');
    } finally {
      setSaving(false);
    }
  };

  const handlePageUpdate = async (pageId: string, updates: any) => {
    if (!microsite) return;

    try {
      const response = await micrositeBuilderApi.updatePage(microsite.id, pageId, updates);
      
      if (response.success) {
        setMicrosite(prev => {
          if (!prev) return null;
          const updatedPages = prev.pages.map(page => 
            page.id === pageId ? { ...page, ...updates } : page
          );
          return { ...prev, pages: updatedPages };
        });
        toast.success('Página actualizada');
      }
    } catch (error: any) {
      console.error('Error updating page:', error);
      toast.error(error.message || 'Error al actualizar la página');
    }
  };

  const handleAddPage = async () => {
    if (!microsite) return;

    const newPageData = {
      name: `Nueva Página ${microsite.pages.length + 1}`,
      slug: `nueva-pagina-${microsite.pages.length + 1}`,
      title: `Nueva Página ${microsite.pages.length + 1}`,
      metaDescription: '',
      components: []
    };

    try {
      const response = await micrositeBuilderApi.addPage(microsite.id, newPageData);
      
      if (response.success) {
        await loadMicrosite(); // Reload to get updated pages
        toast.success('Página agregada');
      }
    } catch (error: any) {
      console.error('Error adding page:', error);
      toast.error(error.message || 'Error al agregar la página');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!microsite) return;

    if (microsite.pages.length <= 1) {
      toast.error('No puedes eliminar la última página');
      return;
    }

    try {
      const response = await micrositeBuilderApi.deletePage(microsite.id, pageId);
      
      if (response.success) {
        await loadMicrosite();
        if (selectedPageId === pageId) {
          setSelectedPageId(microsite.pages[0]?.id || null);
        }
        toast.success('Página eliminada');
      }
    } catch (error: any) {
      console.error('Error deleting page:', error);
      toast.error(error.message || 'Error al eliminar la página');
    }
  };

  const getPublicUrl = () => {
    if (!microsite) return '';
    return `https://${microsite.subdomain}.pickleballmx.com`;
  };

  const tabs = [
    { id: 'pages', name: 'Páginas', icon: Cog6ToothIcon },
    { id: 'media', name: 'Media', icon: PhotoIcon },
    { id: 'settings', name: 'Configuración', icon: Cog6ToothIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!microsite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Micrositio no encontrado</h2>
          <button
            onClick={() => navigate('/microsite-builder')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/microsite-builder')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{microsite.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{microsite.subdomain}.pickleballmx.com</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    microsite.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {microsite.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {microsite.status === 'published' && (
                <a
                  href={getPublicUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Ver Sitio
                </a>
              )}

              {microsite.status === 'draft' ? (
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                >
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  {saving ? 'Publicando...' : 'Publicar'}
                </button>
              ) : (
                <button
                  onClick={handleUnpublish}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
                >
                  {saving ? 'Despublicando...' : 'Despublicar'}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
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
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'pages' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
            {/* Page List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Páginas</h3>
                  <button
                    onClick={handleAddPage}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Agregar
                  </button>
                </div>
                
                <div className="space-y-2">
                  {microsite.pages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => setSelectedPageId(page.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPageId === page.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{page.name}</h4>
                          <p className="text-xs text-gray-500">/{page.slug}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {page.isPublished && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          {microsite.pages.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePage(page.id);
                              }}
                              className="text-red-400 hover:text-red-600 text-xs"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page Editor */}
            <div className="lg:col-span-3">
              {selectedPageId && (
                <PageEditor
                  micrositeId={microsite.id}
                  page={microsite.pages.find(p => p.id === selectedPageId)!}
                  onPageUpdate={handlePageUpdate}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <MediaLibrary micrositeId={microsite.id} />
        )}

        {activeTab === 'settings' && (
          <MicrositeSettings 
            microsite={microsite}
            onUpdate={(updates) => setMicrosite(prev => prev ? { ...prev, ...updates } : null)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPanel micrositeId={microsite.id} />
        )}
      </div>
    </div>
  );
};

export default MicrositeEditPage;