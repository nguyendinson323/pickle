import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { ContentModerationResponse, ContentModerationFilters, ContentModerationItem } from '../../types/admin';
import { 
  FiShield, 
  FiSearch, 
  FiFilter, 
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiEye,
  FiFlag,
  FiUser,
  FiMessageSquare,
  FiImage,
  FiFileText
} from 'react-icons/fi';

const ContentModeration: React.FC = () => {
  const [data, setData] = useState<ContentModerationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentModerationFilters>({
    page: 1,
    limit: 20
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchModerationItems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get(`/admin/moderation?${queryParams.toString()}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar elementos de moderación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationItems();
  }, [filters]);

  const moderateContent = async (contentId: number, action: string, reason: string) => {
    try {
      await api.patch(`/admin/moderation/${contentId}`, { action, reason });
      fetchModerationItems(); // Refresh the data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al moderar contenido');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <FiCheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <FiXCircle className="h-4 w-4 text-red-500" />;
      case 'flagged': return <FiFlag className="h-4 w-4 text-orange-500" />;
      case 'escalated': return <FiAlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <FiClock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'user_profile': return <FiUser className="h-4 w-4" />;
      case 'message': return <FiMessageSquare className="h-4 w-4" />;
      case 'media': return <FiImage className="h-4 w-4" />;
      case 'review': return <FiFileText className="h-4 w-4" />;
      default: return <FiFileText className="h-4 w-4" />;
    }
  };

  const ModerationRow: React.FC<{ item: ContentModerationItem; index: number }> = ({ item, index }) => {
    const [showActions, setShowActions] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    return (
      <motion.tr
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white border-b border-gray-200 hover:bg-gray-50"
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, item.id]);
              } else {
                setSelectedItems(selectedItems.filter(id => id !== item.id));
              }
            }}
            className="rounded border-gray-300 text-pickleball-600 focus:ring-pickleball-500"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {getContentTypeIcon(item.contentType)}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 capitalize">
                {item.contentType.replace('_', ' ')}
              </div>
              <div className="text-xs text-gray-500">ID: {item.contentId}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="max-w-xs">
            <p className="text-sm text-gray-900 truncate">{item.contentPreview}</p>
            {item.contentPreview.length > 100 && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-pickleball-600 hover:text-pickleball-800 mt-1"
              >
                {showPreview ? 'Ver menos' : 'Ver más'}
              </button>
            )}
            {showPreview && (
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700 max-w-md">
                {item.contentPreview}
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {getStatusIcon(item.status)}
            <span className="ml-2 text-sm text-gray-900 capitalize">{item.status}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(item.severity)}`}>
            {item.severity}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.reportReason && (
            <div className="max-w-xs truncate" title={item.reportReason}>
              {item.reportReason}
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {item.aiFlags && (
            <div className="space-y-1">
              {item.aiFlags.toxicity > 0.5 && (
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  Toxicidad: {Math.round(item.aiFlags.toxicity * 100)}%
                </div>
              )}
              {item.aiFlags.spam > 0.5 && (
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                  Spam: {Math.round(item.aiFlags.spam * 100)}%
                </div>
              )}
              {item.aiFlags.inappropriate > 0.5 && (
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  Inapropiado: {Math.round(item.aiFlags.inappropriate * 100)}%
                </div>
              )}
              <div className="text-xs text-gray-500">
                Confianza: {Math.round(item.aiFlags.confidence * 100)}%
              </div>
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiMoreVertical className="h-4 w-4" />
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      // Handle view details
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiEye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </button>
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          moderateContent(item.id, 'approved', 'Aprobado por moderador');
                          setShowActions(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full text-left"
                      >
                        <FiCheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          moderateContent(item.id, 'rejected', 'Rechazado por moderador');
                          setShowActions(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                      >
                        <FiXCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </button>
                      <button
                        onClick={() => {
                          moderateContent(item.id, 'flagged', 'Marcado para revisión adicional');
                          setShowActions(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 w-full text-left"
                      >
                        <FiFlag className="h-4 w-4 mr-2" />
                        Marcar
                      </button>
                    </>
                  )}
                  {item.status === 'flagged' && (
                    <button
                      onClick={() => {
                        moderateContent(item.id, 'escalated', 'Escalado a supervisor');
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                    >
                      <FiAlertTriangle className="h-4 w-4 mr-2" />
                      Escalar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </td>
      </motion.tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moderación de Contenido</h1>
          <p className="text-gray-600 mt-1">Revisa y modera el contenido de la plataforma</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FiFilter className="h-4 w-4 mr-2" />
            Filtros
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.items.filter(item => item.status === 'pending').length}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.items.filter(item => item.status === 'approved').length}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50">
                <FiXCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rechazados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.items.filter(item => item.status === 'rejected').length}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-50">
                <FiFlag className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Marcados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.items.filter(item => item.status === 'flagged').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
                <option value="flagged">Marcado</option>
                <option value="escalated">Escalado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severidad</label>
              <select
                value={filters.severity || ''}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value="">Todas las severidades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contenido</label>
              <select
                value={filters.contentType || ''}
                onChange={(e) => setFilters({ ...filters, contentType: e.target.value, page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                <option value="user_profile">Perfil de Usuario</option>
                <option value="tournament">Torneo</option>
                <option value="microsite">Micrositio</option>
                <option value="message">Mensaje</option>
                <option value="review">Reseña</option>
                <option value="media">Multimedia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resultados por página</label>
              <select
                value={filters.limit}
                onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pickleball-50 border border-pickleball-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-pickleball-700">
              {selectedItems.length} elemento(s) seleccionado(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Handle bulk approve
                  setSelectedItems([]);
                }}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Aprobar Todo
              </button>
              <button
                onClick={() => {
                  // Handle bulk reject
                  setSelectedItems([]);
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Rechazar Todo
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pickleball-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FiXCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-gray-600">{error}</p>
              <button
                onClick={fetchModerationItems}
                className="mt-2 px-4 py-2 bg-pickleball-600 text-white rounded-lg hover:bg-pickleball-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === data.items.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(data.items.map(item => item.id));
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        className="rounded border-gray-300 text-pickleball-600 focus:ring-pickleball-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contenido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Razón
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.items.map((item, index) => (
                    <ModerationRow key={item.id} item={item} index={index} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando {((data.pagination.page - 1) * data.pagination.limit) + 1} a{' '}
                    {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} de{' '}
                    {data.pagination.total} elementos
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      disabled={filters.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Página {filters.page} de {data.pagination.pages}
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      disabled={filters.page === data.pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FiShield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No hay contenido para moderar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;