import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import ContentModeration from '../components/admin/ContentModeration';
import SystemMonitoring from '../components/admin/SystemMonitoring';
import FinancialAnalytics from '../components/admin/FinancialAnalytics';
import { 
  FiUsers, 
  FiShield, 
  FiAlertTriangle, 
  FiDollarSign, 
  FiMessageSquare,
  FiFileText,
  FiBarChart3,
  FiSettings,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';

interface AdminDashboardOverview {
  users: {
    total: number;
    new_today: number;
    active: number;
    by_role: {
      player: number;
      coach: number;
      club: number;
      partner: number;
      state_committee: number;
      federation: number;
    };
  };
  tournaments: {
    total: number;
    active: number;
    completed: number;
    revenue: number;
  };
  content_moderation: {
    pending: number;
    approved_today: number;
    rejected_today: number;
    flagged: number;
  };
  system_alerts: {
    critical: number;
    warning: number;
    info: number;
    open: number;
  };
  financial: {
    total_revenue: number;
    monthly_revenue: number;
    subscription_revenue: number;
    transaction_count: number;
  };
  platform_health: {
    uptime: number;
    response_time: number;
    error_rate: number;
    active_sessions: number;
  };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/overview');
      setOverview(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar panel administrativo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'federation') {
      fetchOverview();
    }
  }, [user]);

  if (!user || user.role !== 'federation') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiShield className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600">Solo administradores de federación pueden acceder a este panel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pickleball-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiXCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOverview}
            className="bg-pickleball-600 text-white px-4 py-2 rounded-lg hover:bg-pickleball-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Panel General', href: '/admin', icon: FiBarChart3, current: location.pathname === '/admin' },
    { name: 'Usuarios', href: '/admin/users', icon: FiUsers, current: location.pathname.startsWith('/admin/users') },
    { name: 'Moderación', href: '/admin/moderation', icon: FiShield, current: location.pathname.startsWith('/admin/moderation') },
    { name: 'Alertas', href: '/admin/alerts', icon: FiAlertTriangle, current: location.pathname.startsWith('/admin/alerts') },
    { name: 'Financiero', href: '/admin/financial', icon: FiDollarSign, current: location.pathname.startsWith('/admin/financial') },
    { name: 'Comunicación', href: '/admin/communication', icon: FiMessageSquare, current: location.pathname.startsWith('/admin/communication') },
    { name: 'Reportes', href: '/admin/reports', icon: FiFileText, current: location.pathname.startsWith('/admin/reports') },
  ];

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
    trend?: { value: number; direction: 'up' | 'down' };
  }> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
      red: 'bg-red-500 text-red-600 bg-red-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[2]}`}>
            <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
          </div>
          {trend && (
            <div className={`flex items-center text-sm ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? (
                <FiArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <FiArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Panel Administrativo</h1>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-pickleball-50 border-r-2 border-pickleball-600 text-pickleball-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <div className="px-6 py-8">
          <Routes>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/moderation" element={<ContentModeration />} />
            <Route path="/alerts" element={<SystemMonitoring />} />
            <Route path="/financial" element={<FinancialAnalytics />} />
            <Route path="/" element={
              <div>
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel General</h1>
                  <p className="text-gray-600">Vista general de la plataforma de Pickleball México</p>
                </div>

                {/* Overview Stats */}
                {overview && (
                  <div className="space-y-8">
                    {/* User Statistics */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas de Usuarios</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Total de Usuarios"
                          value={overview.users.total.toLocaleString()}
                          subtitle={`+${overview.users.new_today} hoy`}
                          icon={FiUsers}
                          color="blue"
                        />
                        <StatCard
                          title="Usuarios Activos"
                          value={overview.users.active.toLocaleString()}
                          subtitle="Últimos 30 días"
                          icon={FiTrendingUp}
                          color="green"
                        />
                        <StatCard
                          title="Jugadores"
                          value={overview.users.by_role.player.toLocaleString()}
                          icon={FiUsers}
                          color="purple"
                        />
                        <StatCard
                          title="Entrenadores"
                          value={overview.users.by_role.coach.toLocaleString()}
                          icon={FiUsers}
                          color="blue"
                        />
                      </div>
                    </div>

                    {/* System Health */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Tiempo de Actividad"
                          value={`${overview.platform_health.uptime}%`}
                          icon={FiCheckCircle}
                          color={overview.platform_health.uptime >= 99 ? 'green' : 'yellow'}
                        />
                        <StatCard
                          title="Tiempo de Respuesta"
                          value={`${overview.platform_health.response_time}ms`}
                          icon={FiClock}
                          color={overview.platform_health.response_time < 200 ? 'green' : 'yellow'}
                        />
                        <StatCard
                          title="Tasa de Error"
                          value={`${overview.platform_health.error_rate}%`}
                          icon={FiAlertCircle}
                          color={overview.platform_health.error_rate < 1 ? 'green' : 'red'}
                        />
                        <StatCard
                          title="Sesiones Activas"
                          value={overview.platform_health.active_sessions.toLocaleString()}
                          icon={FiUsers}
                          color="blue"
                        />
                      </div>
                    </div>

                    {/* Content Moderation */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Moderación de Contenido</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Pendientes"
                          value={overview.content_moderation.pending}
                          icon={FiClock}
                          color={overview.content_moderation.pending > 10 ? 'yellow' : 'green'}
                        />
                        <StatCard
                          title="Aprobados Hoy"
                          value={overview.content_moderation.approved_today}
                          icon={FiCheckCircle}
                          color="green"
                        />
                        <StatCard
                          title="Rechazados Hoy"
                          value={overview.content_moderation.rejected_today}
                          icon={FiXCircle}
                          color="red"
                        />
                        <StatCard
                          title="Marcados"
                          value={overview.content_moderation.flagged}
                          icon={FiAlertTriangle}
                          color="yellow"
                        />
                      </div>
                    </div>

                    {/* System Alerts */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Alertas del Sistema</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Críticas"
                          value={overview.system_alerts.critical}
                          icon={FiAlertTriangle}
                          color="red"
                        />
                        <StatCard
                          title="Advertencias"
                          value={overview.system_alerts.warning}
                          icon={FiAlertTriangle}
                          color="yellow"
                        />
                        <StatCard
                          title="Informativas"
                          value={overview.system_alerts.info}
                          icon={FiAlertCircle}
                          color="blue"
                        />
                        <StatCard
                          title="Abiertas"
                          value={overview.system_alerts.open}
                          icon={FiClock}
                          color="purple"
                        />
                      </div>
                    </div>

                    {/* Financial Overview */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen Financiero</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Ingresos Totales"
                          value={`$${(overview.financial.total_revenue / 100).toLocaleString()} MXN`}
                          icon={FiDollarSign}
                          color="green"
                        />
                        <StatCard
                          title="Ingresos Mensuales"
                          value={`$${(overview.financial.monthly_revenue / 100).toLocaleString()} MXN`}
                          icon={FiTrendingUp}
                          color="blue"
                        />
                        <StatCard
                          title="Suscripciones"
                          value={`$${(overview.financial.subscription_revenue / 100).toLocaleString()} MXN`}
                          icon={FiDollarSign}
                          color="purple"
                        />
                        <StatCard
                          title="Transacciones"
                          value={overview.financial.transaction_count.toLocaleString()}
                          icon={FiBarChart3}
                          color="yellow"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;