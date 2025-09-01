import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  UserCheck,
  FileText,
  Calendar,
  Activity
} from 'lucide-react';
import Card from '../ui/Card';
import apiService from '../../services/api';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTournaments: number;
  activeTournaments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCourts: number;
  activeCourts: number;
  pendingApprovals: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'tournament_created' | 'court_added' | 'payment_processed';
  description: string;
  timestamp: string;
  user?: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTournaments: 0,
    activeTournaments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalCourts: 0,
    activeCourts: 0,
    pendingApprovals: 0,
    systemHealth: 'healthy'
  });

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await apiService.get('/dashboard/admin');
        
        if (data.success && data.data) {
          const adminData = data.data;
          setStats({
            totalUsers: adminData.statistics?.totalUsers || adminData.userBreakdown?.total || 0,
            activeUsers: adminData.statistics?.activeUsers || 0,
            totalTournaments: adminData.statistics?.totalTournaments || 0,
            activeTournaments: adminData.statistics?.activeTournaments || 0,
            totalRevenue: adminData.statistics?.totalRevenue || adminData.revenueChart?.total || 0,
            monthlyRevenue: adminData.statistics?.monthlyRevenue || 0,
            totalCourts: adminData.statistics?.totalCourts || 0,
            activeCourts: adminData.statistics?.activeCourts || 0,
            pendingApprovals: adminData.statistics?.pendingApprovals || adminData.recentRegistrations?.length || 0,
            systemHealth: adminData.statistics?.systemHealth || 'healthy'
          });
          
          setSystemAlerts(adminData.systemAlerts || []);
          setRecentActivity(adminData.recentActivity || []);
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'tournament_created':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'payment_processed':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'court_added':
        return <MapPin className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthStatus = () => {
    const { systemHealth } = stats;
    switch (systemHealth) {
      case 'healthy':
        return {
          color: 'text-green-600 bg-green-100',
          label: 'Sistema Saludable',
          icon: <Activity className="h-5 w-5" />
        };
      case 'warning':
        return {
          color: 'text-yellow-600 bg-yellow-100',
          label: 'Advertencias Menores',
          icon: <AlertTriangle className="h-5 w-5" />
        };
      case 'critical':
        return {
          color: 'text-red-600 bg-red-100',
          label: 'Atención Requerida',
          icon: <AlertTriangle className="h-5 w-5" />
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100',
          label: 'Desconocido',
          icon: <AlertTriangle className="h-5 w-5" />
        };
    }
  };

  const healthStatus = getHealthStatus();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and management</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${healthStatus.color}`}>
          {healthStatus.icon}
          <span className="font-medium">{healthStatus.label}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{stats.activeUsers} active</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTournaments}</p>
              <p className="text-xs text-green-600">{stats.activeTournaments} active</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-600">+{formatCurrency(stats.monthlyRevenue)} this month</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Courts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourts}</p>
              <p className="text-xs text-green-600">{stats.activeCourts} active</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
            {stats.pendingApprovals > 0 && (
              <span className="mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {stats.pendingApprovals} pending
              </span>
            )}
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Tournaments</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin className="h-6 w-6 text-purple-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Courts</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-6 w-6 text-green-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Reports</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Payments</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="h-6 w-6 text-gray-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h2>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <span className="text-xs opacity-75">{formatTime(alert.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {activity.user && (
                      <span className="text-xs text-gray-600">{activity.user}</span>
                    )}
                    <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Charts Placeholder */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">+15.2%</p>
            <p className="text-sm text-gray-600">User Growth</p>
          </div>
          
          <div className="text-center">
            <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-600">Active Tournaments</p>
          </div>
          
          <div className="text-center">
            <Activity className="h-12 w-12 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">98.5%</p>
            <p className="text-sm text-gray-600">System Uptime</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;