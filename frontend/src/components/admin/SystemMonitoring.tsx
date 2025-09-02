import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { SystemAlertsResponse, SystemAlertFilters, SystemAlert } from '../../types/admin';
import { 
  FiActivity, 
  FiSearch, 
  FiFilter, 
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiAlertCircle,
  FiServer,
  FiShield,
  FiTrendingUp,
  FiTrendingDown,
  FiZap,
  FiDatabase,
  FiUsers,
  FiGlobe
} from 'react-icons/fi';

const SystemMonitoring: React.FC = () => {
  const [data, setData] = useState<SystemAlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SystemAlertFilters>({
    page: 1,
    limit: 20
  });
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchSystemAlerts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get(`/admin/alerts?${queryParams.toString()}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar alertas del sistema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemAlerts();
    
    // Auto-refresh every 30 seconds for real-time monitoring
    const interval = setInterval(fetchSystemAlerts, 30000);
    return () => clearInterval(interval);
  }, [filters]);

  const updateAlert = async (alertId: number, status: string, notes?: string) => {
    try {
      await api.patch(`/admin/alerts/${alertId}`, { status, notes });
      fetchSystemAlerts(); // Refresh the data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar alerta');
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <FiAlertCircle className="h-5 w-5 text-blue-500" />;
      case 'warning': return <FiAlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <FiXCircle className="h-5 w-5 text-orange-500" />;
      case 'critical': return <FiAlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <FiAlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <FiTrendingUp className="h-4 w-4" />;
      case 'security': return <FiShield className="h-4 w-4" />;
      case 'error': return <FiXCircle className="h-4 w-4" />;
      case 'maintenance': return <FiServer className="h-4 w-4" />;
      case 'business': return <FiTrendingUp className="h-4 w-4" />;
      case 'user_behavior': return <FiUsers className="h-4 w-4" />;
      default: return <FiAlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <FiClock className="h-4 w-4 text-red-500" />;
      case 'acknowledged': return <FiCheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'investigating': return <FiActivity className="h-4 w-4 text-blue-500" />;
      case 'resolved': return <FiCheckCircle className="h-4 w-4 text-green-500" />;
      case 'false_positive': return <FiXCircle className="h-4 w-4 text-gray-500" />;
      default: return <FiClock className="h-4 w-4 text-gray-500" />;
    }
  };

  const AlertRow: React.FC<{ alert: SystemAlert; index: number }> = ({ alert, index }) => {
    const [showActions, setShowActions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    return (
      <motion.tr
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`border-b border-gray-200 hover:bg-gray-50 ${
          alert.severity === 'critical' ? 'bg-red-50' : 
          alert.severity === 'error' ? 'bg-orange-50' : 
          'bg-white'
        }`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedAlerts.includes(alert.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedAlerts([...selectedAlerts, alert.id]);
              } else {
                setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id));
              }
            }}
            className="rounded border-gray-300 text-pickleball-600 focus:ring-pickleball-500"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {getSeverityIcon(alert.severity)}
            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {getTypeIcon(alert.type)}
            <span className="ml-2 text-sm text-gray-900 capitalize">
              {alert.type.replace('_', ' ')}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div>
            <div className="text-sm font-medium text-gray-900">{alert.title}</div>
            <div className="text-sm text-gray-500 max-w-md">
              {alert.message.length > 100 ? (
                <>
                  {showDetails ? alert.message : `${alert.message.substring(0, 100)}...`}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-pickleball-600 hover:text-pickleball-800 ml-1"
                  >
                    {showDetails ? 'Ver menos' : 'Ver más'}
                  </button>
                </>
              ) : (
                alert.message
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {getStatusIcon(alert.status)}
            <span className="ml-2 text-sm text-gray-900 capitalize">
              {alert.status.replace('_', ' ')}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-900 capitalize">{alert.source.replace('_', ' ')}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(alert.createdAt).toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : '-'}
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
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {alert.status === 'open' && (
                    <button
                      onClick={() => {
                        updateAlert(alert.id, 'acknowledged', 'Alerta reconocida por administrador');
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 w-full text-left"
                    >
                      <FiCheckCircle className="h-4 w-4 mr-2" />
                      Reconocer
                    </button>
                  )}
                  {['open', 'acknowledged'].includes(alert.status) && (
                    <button
                      onClick={() => {
                        updateAlert(alert.id, 'investigating', 'Investigación iniciada');
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 w-full text-left"
                    >
                      <FiActivity className="h-4 w-4 mr-2" />
                      Investigar
                    </button>
                  )}
                  {['acknowledged', 'investigating'].includes(alert.status) && (
                    <button
                      onClick={() => {
                        updateAlert(alert.id, 'resolved', 'Problema resuelto');
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full text-left"
                    >
                      <FiCheckCircle className="h-4 w-4 mr-2" />
                      Resolver
                    </button>
                  )}
                  <button
                    onClick={() => {
                      updateAlert(alert.id, 'false_positive', 'Marcado como falso positivo');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <FiXCircle className="h-4 w-4 mr-2" />
                    Falso Positivo
                  </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Monitoreo del Sistema</h1>
          <p className="text-gray-600 mt-1">Supervisa el estado y rendimiento de la plataforma</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Actualización automática
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FiFilter className="h-4 w-4 mr-2" />
            Filtros
          </button>
          <button
            onClick={fetchSystemAlerts}
            className="flex items-center px-4 py-2 bg-pickleball-600 text-white rounded-lg text-sm font-medium hover:bg-pickleball-700 transition-colors"
          >
            <FiActivity className="h-4 w-4 mr-2" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.alerts.filter(alert => alert.severity === 'critical').length}
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
              <div className="p-3 rounded-lg bg-orange-50">
                <FiXCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.alerts.filter(alert => alert.severity === 'error').length}
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
              <div className="p-3 rounded-lg bg-yellow-50">
                <FiAlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Advertencias</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.alerts.filter(alert => alert.severity === 'warning').length}
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
              <div className="p-3 rounded-lg bg-red-50">
                <FiClock className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Abiertas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.alerts.filter(alert => alert.status === 'open').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
            <FiServer className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tiempo de Actividad</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">99.8%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Respuesta Promedio</span>
              <span className="text-sm font-medium text-green-600">145ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tasa de Error</span>
              <span className="text-sm font-medium text-green-600">0.2%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Base de Datos</h3>
            <FiDatabase className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conexiones Activas</span>
              <span className="text-sm font-medium">42/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Consultas/seg</span>
              <span className="text-sm font-medium text-blue-600">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uso de Memoria</span>
              <span className="text-sm font-medium text-yellow-600">68%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Usuarios Activos</h3>
            <FiUsers className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sesiones Activas</span>
              <span className="text-sm font-medium text-green-600">2,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Nuevos Registros</span>
              <span className="text-sm font-medium">+127 hoy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pico Concurrente</span>
              <span className="text-sm font-medium">3,456</span>
            </div>
          </div>
        </motion.div>
      </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Severidad</label>
              <select
                value={filters.severity || ''}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value="">Todas las severidades</option>
                <option value="info">Info</option>
                <option value="warning">Advertencia</option>
                <option value="error">Error</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="open">Abierta</option>
                <option value="acknowledged">Reconocida</option>
                <option value="investigating">Investigando</option>
                <option value="resolved">Resuelta</option>
                <option value="false_positive">Falso Positivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                <option value="performance">Rendimiento</option>
                <option value="security">Seguridad</option>
                <option value="error">Error</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="business">Negocio</option>
                <option value="user_behavior">Comportamiento de Usuario</option>
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
      {selectedAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pickleball-50 border border-pickleball-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-pickleball-700">
              {selectedAlerts.length} alerta(s) seleccionada(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Handle bulk acknowledge
                  setSelectedAlerts([]);
                }}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Reconocer Todo
              </button>
              <button
                onClick={() => {
                  // Handle bulk resolve
                  setSelectedAlerts([]);
                }}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Resolver Todo
              </button>
              <button
                onClick={() => setSelectedAlerts([])}
                className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alerts Table */}
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
                onClick={fetchSystemAlerts}
                className="mt-2 px-4 py-2 bg-pickleball-600 text-white rounded-lg hover:bg-pickleball-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : data && data.alerts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.length === data.alerts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAlerts(data.alerts.map(alert => alert.id));
                          } else {
                            setSelectedAlerts([]);
                          }
                        }}
                        className="rounded border-gray-300 text-pickleball-600 focus:ring-pickleball-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alerta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reconocida
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.alerts.map((alert, index) => (
                    <AlertRow key={alert.id} alert={alert} index={index} />
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
                    {data.pagination.total} alertas
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
              <FiActivity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No hay alertas del sistema</p>
              <p className="text-sm text-gray-500 mt-1">¡Todo funciona correctamente!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemMonitoring;