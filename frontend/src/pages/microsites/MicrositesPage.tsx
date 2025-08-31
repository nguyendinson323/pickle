import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchMicrosites, 
  deleteMicrosite, 
  duplicateMicrosite,
  publishMicrosite,
  unpublishMicrosite,
  clearError 
} from '../../store/micrositeSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
// import CreateMicrositeModal from '../../components/microsites/CreateMicrositeModal'; // Temporarily disabled due to component issues

const MicrositesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { microsites, loading, error } = useSelector((state: RootState) => state.microsites);
  // const { user } = useSelector((state: RootState) => state.auth); // Removed since CreateMicrositeModal is disabled
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedMicrosite, setSelectedMicrosite] = useState<any>(null);
  const [duplicateSubdomain, setDuplicateSubdomain] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMicrosites());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDelete = async () => {
    if (selectedMicrosite) {
      await dispatch(deleteMicrosite(selectedMicrosite.id));
      setShowDeleteModal(false);
      setSelectedMicrosite(null);
    }
  };

  const handleDuplicate = async () => {
    if (selectedMicrosite && duplicateSubdomain) {
      await dispatch(duplicateMicrosite({ 
        id: selectedMicrosite.id, 
        subdomain: duplicateSubdomain 
      }));
      setShowDuplicateModal(false);
      setSelectedMicrosite(null);
      setDuplicateSubdomain('');
    }
  };

  const handlePublish = async (microsite: any) => {
    if (microsite.status === 'published') {
      await dispatch(unpublishMicrosite(microsite.id));
    } else {
      await dispatch(publishMicrosite(microsite.id));
    }
  };

  const filteredMicrosites = microsites.filter(microsite => {
    const matchesStatus = filterStatus === 'all' || microsite.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      microsite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      microsite.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'suspended':
        return <Badge variant="error">Suspended</Badge>;
      default:
        return <Badge variant="primary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Micrositios</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus micrositios personalizados para tu organización
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Crear Micrositio
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Buscar micrositios
              </label>
              <input
                type="text"
                id="search"
                placeholder="Buscar por nombre o subdominio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
                <option value="suspended">Suspendidos</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Microsite Grid */}
      {filteredMicrosites.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {microsites.length === 0 ? 'No tienes micrositios' : 'No se encontraron micrositios'}
            </h3>
            <p className="text-gray-600 mb-4">
              {microsites.length === 0 
                ? 'Crea tu primer micrositio para comenzar a compartir tu contenido.'
                : 'Intenta ajustar los filtros de búsqueda.'
              }
            </p>
            {microsites.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)}>
                Crear Primer Micrositio
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMicrosites.map((microsite) => (
            <Card key={microsite.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header Image placeholder - removed headerImageUrl property */}
                {false && (
                  <div className="mb-4 -mx-6 -mt-6">
                    <img
                      src=""
                      alt={microsite.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {microsite.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-mono">
                        {microsite.subdomain}.pickleballfed.mx
                      </p>
                    </div>
                    {getStatusBadge(microsite.status)}
                  </div>

                  {microsite.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {microsite.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Páginas: {microsite.pages?.length || 0}</span>
                    <span>Páginas disponibles</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {microsite.status === 'published' && (
                      <a
                        href={`https://${microsite.subdomain}.pickleballfed.mx`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => navigate(`/dashboard/microsites/${microsite.id}/edit`)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMicrosite(microsite);
                        setShowDuplicateModal(true);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMicrosite(microsite);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    size="sm"
                    variant={microsite.status === 'published' ? 'outline' : 'primary'}
                    onClick={() => handlePublish(microsite)}
                  >
                    {microsite.status === 'published' ? 'Despublicar' : 'Publicar'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Microsite Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Micrositio"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Funcionalidad de creación de micrositios en desarrollo.
            </p>
            <Button 
              onClick={() => setShowCreateModal(false)}
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Micrositio"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro que deseas eliminar el micrositio "{selectedMicrosite?.name}"? 
            Esta acción no se puede deshacer y se perderán todos los datos asociados.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Duplicate Modal */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        title="Duplicar Micrositio"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Crear una copia de "{selectedMicrosite?.name}" con un nuevo subdominio.
          </p>
          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
              Nuevo Subdominio
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="subdomain"
                value={duplicateSubdomain}
                onChange={(e) => setDuplicateSubdomain(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="mi-nuevo-sitio"
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                .pickleballfed.mx
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDuplicateModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDuplicate}
              disabled={!duplicateSubdomain}
            >
              Duplicar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MicrositesPage;