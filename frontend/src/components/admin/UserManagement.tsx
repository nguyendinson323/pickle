import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { UserManagementResponse, UserManagementFilters } from '../../types/admin';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiMail,
  FiShield
} from 'react-icons/fi';

const UserManagement: React.FC = () => {
  const [data, setData] = useState<UserManagementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserManagementFilters>({
    page: 1,
    limit: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get(`/admin/users?${queryParams.toString()}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const updateUserStatus = async (userId: number, status: string, reason: string) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status, reason });
      fetchUsers(); // Refresh the data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar usuario');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FiCheckCircle className="h-4 w-4 text-green-500" />;
      case 'suspended': return <FiClock className="h-4 w-4 text-yellow-500" />;
      case 'banned': return <FiXCircle className="h-4 w-4 text-red-500" />;
      default: return <FiAlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      state_committee: 'bg-blue-100 text-blue-800',
      club: 'bg-green-100 text-green-800',
      partner: 'bg-orange-100 text-orange-800',
      coach: 'bg-indigo-100 text-indigo-800',
      player: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const UserRow: React.FC<{ user: any; index: number }> = ({ user, index }) => {
    const [showActions, setShowActions] = useState(false);

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
            checked={selectedUsers.includes(user.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedUsers([...selectedUsers, user.id]);
              } else {
                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
              }
            }}
            className="rounded border-gray-300 text-pickleball-600 focus:ring-pickleball-500"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-pickleball-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
            {user.role}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {getStatusIcon(user.status)}
            <span className="ml-2 text-sm text-gray-900 capitalize">{user.status}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.profile_completion}%
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-pickleball-600 h-2 rounded-full" 
              style={{ width: `${user.profile_completion}%` }}
            ></div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(user.created_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
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
                      // Handle edit user
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiEdit className="h-4 w-4 mr-2" />
                    Editar Usuario
                  </button>
                  <button
                    onClick={() => {
                      // Handle send message
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiMail className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </button>
                  {user.status === 'active' && (
                    <>
                      <button
                        onClick={() => {
                          updateUserStatus(user.id, 'suspended', 'Suspendido por administrador');
                          setShowActions(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 w-full text-left"
                      >
                        <FiClock className="h-4 w-4 mr-2" />
                        Suspender
                      </button>
                      <button
                        onClick={() => {
                          updateUserStatus(user.id, 'banned', 'Baneado por administrador');
                          setShowActions(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                      >
                        <FiShield className="h-4 w-4 mr-2" />
                        Banear
                      </button>
                    </>
                  )}
                  {user.status !== 'active' && (
                    <button
                      onClick={() => {
                        updateUserStatus(user.id, 'active', 'Reactivado por administrador');
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full text-left"
                    >
                      <FiCheckCircle className="h-4 w-4 mr-2" />
                      Reactivar
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra todos los usuarios de la plataforma</p>
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre de usuario o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
            />
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={filters.role || ''}
                onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
              >
                <option value="">Todos los roles</option>
                <option value="player">Jugador</option>
                <option value="coach">Entrenador</option>
                <option value="club">Club</option>
                <option value="partner">Partner</option>
                <option value="state_committee">Comité Estatal</option>
                <option value="admin">Federación</option>
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
                <option value="active">Activo</option>
                <option value="suspended">Suspendido</option>
                <option value="banned">Baneado</option>
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
          </motion.div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pickleball-50 border border-pickleball-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-pickleball-700">
              {selectedUsers.length} usuario(s) seleccionado(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Handle bulk message
                  setSelectedUsers([]);
                }}
                className="px-3 py-1 text-sm bg-pickleball-600 text-white rounded hover:bg-pickleball-700 transition-colors"
              >
                Enviar Mensaje
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
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
                onClick={fetchUsers}
                className="mt-2 px-4 py-2 bg-pickleball-600 text-white rounded-lg hover:bg-pickleball-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : data && data.users.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === data.users.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(data.users.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-gray-300 text-pickleball-600 focus:ring-pickleball-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último acceso
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.users.map((user, index) => (
                  <UserRow key={user.id} user={user} index={index} />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando {((data.pagination.page - 1) * data.pagination.limit) + 1} a{' '}
                    {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} de{' '}
                    {data.pagination.total} usuarios
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
              <FiUsers className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No se encontraron usuarios</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;