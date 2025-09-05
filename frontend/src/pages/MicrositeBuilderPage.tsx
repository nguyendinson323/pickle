import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  GlobeAltIcon,
  DocumentDuplicateIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { micrositeBuilderApi } from '../services/micrositeBuilderApi';

interface Microsite {
  id: number;
  name: string;
  slug: string;
  subdomain: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const MicrositeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [microsites, setMicrosites] = useState<Microsite[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [micrositeToDelete, setMicrositeToDelete] = useState<Microsite | null>(null);

  useEffect(() => {
    loadMicrosites();
  }, [currentPage, statusFilter]);

  const loadMicrosites = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      };

      const response = await micrositeBuilderApi.getMicrosites(params);
      
      if (response.success) {
        setMicrosites(response.data.microsites);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error('Error loading microsites:', error);
      toast.error('Error al cargar los micrositios');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (microsite: Microsite) => {
    try {
      const response = await micrositeBuilderApi.publishMicrosite(microsite.id);
      
      if (response.success) {
        toast.success('Micrositio publicado exitosamente');
        loadMicrosites();
      }
    } catch (error: any) {
      console.error('Error publishing microsite:', error);
      toast.error(error.message || 'Error al publicar el micrositio');
    }
  };

  const handleUnpublish = async (microsite: Microsite) => {
    try {
      const response = await micrositeBuilderApi.unpublishMicrosite(microsite.id);
      
      if (response.success) {
        toast.success('Micrositio despublicado exitosamente');
        loadMicrosites();
      }
    } catch (error: any) {
      console.error('Error unpublishing microsite:', error);
      toast.error(error.message || 'Error al despublicar el micrositio');
    }
  };

  const handleDelete = async () => {
    if (!micrositeToDelete) return;

    try {
      const response = await micrositeBuilderApi.deleteMicrosite(micrositeToDelete.id);
      
      if (response.success) {
        toast.success('Micrositio eliminado exitosamente');
        setDeleteModalOpen(false);
        setMicrositeToDelete(null);
        loadMicrosites();
      }
    } catch (error: any) {
      console.error('Error deleting microsite:', error);
      toast.error(error.message || 'Error al eliminar el micrositio');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      draft: 'Borrador',
      published: 'Publicado',
      archived: 'Archivado'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading && microsites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Constructor de Micrositios</h1>
              <p className="mt-2 text-gray-600">
                Crea y administra sitios web personalizados para tu club o comité estatal
              </p>
            </div>
            <Link
              to="/microsite-builder/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear Micrositio
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>

        {/* Microsites Grid */}
        {microsites.length === 0 ? (
          <div className="text-center py-12">
            <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay micrositios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primer micrositio personalizado.
            </p>
            <div className="mt-6">
              <Link
                to="/microsite-builder/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Micrositio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {microsites.map((microsite) => (
              <div key={microsite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Microsite Preview */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-bold">{microsite.name}</h3>
                      <p className="text-sm opacity-90">{microsite.subdomain}.pickleballmx.com</p>
                    </div>
                  </div>
                </div>

                {/* Microsite Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {microsite.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {microsite.description || 'Sin descripción'}
                      </p>
                    </div>
                    {getStatusBadge(microsite.status)}
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Creado el {new Date(microsite.createdAt).toLocaleDateString('es-MX')}
                    {microsite.publishedAt && (
                      <span className="block">
                        Publicado el {new Date(microsite.publishedAt).toLocaleDateString('es-MX')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {microsite.status === 'published' && (
                      <a
                        href={`https://${microsite.subdomain}.pickleballmx.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver
                      </a>
                    )}
                    
                    <Link
                      to={`/microsite-builder/${microsite.id}/edit`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Editar
                    </Link>

                    <Link
                      to={`/microsite-builder/${microsite.id}/analytics`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ChartBarIcon className="h-4 w-4 mr-1" />
                      Stats
                    </Link>

                    {microsite.status === 'draft' ? (
                      <button
                        onClick={() => handlePublish(microsite)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Publicar
                      </button>
                    ) : microsite.status === 'published' ? (
                      <button
                        onClick={() => handleUnpublish(microsite)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Despublicar
                      </button>
                    ) : null}

                    <div className="relative">
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        •••
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span> de{' '}
              <span className="font-medium">{pagination.totalItems}</span> resultados
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Anterior
              </button>
              
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const page = i + Math.max(1, pagination.currentPage - 2);
                if (page > pagination.totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      page === currentPage
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModalOpen && micrositeToDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">Eliminar Micrositio</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar el micrositio "{micrositeToDelete.name}"? 
                    Esta acción no se puede deshacer.
                  </p>
                </div>
                <div className="items-center px-4 py-3 space-x-4">
                  <button
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setMicrositeToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicrositeBuilderPage;