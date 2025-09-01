import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Trophy, 
  MapPin, 
  Settings, 
  FileText, 
  DollarSign,
  Mail,
  Activity
} from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import Card from '../components/ui/Card';

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'courts' | 'payments' | 'reports' | 'settings' | 'system';

const AdminPage: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const navigationItems = [
    {
      key: 'dashboard' as const,
      label: 'Dashboard',
      icon: Activity,
      description: 'System overview'
    },
    {
      key: 'users' as const,
      label: 'Users',
      icon: Users,
      description: 'User management'
    },
    {
      key: 'tournaments' as const,
      label: 'Tournaments',
      icon: Trophy,
      description: 'Tournament administration'
    },
    {
      key: 'courts' as const,
      label: 'Courts',
      icon: MapPin,
      description: 'Court management'
    },
    {
      key: 'payments' as const,
      label: 'Payments',
      icon: DollarSign,
      description: 'Payment processing'
    },
    {
      key: 'reports' as const,
      label: 'Reports',
      icon: FileText,
      description: 'Analytics & reports'
    },
    {
      key: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'tournaments':
        return (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Tournament Management</h2>
            <p className="text-gray-500">Tournament administration features coming soon.</p>
          </div>
        );
      case 'courts':
        return (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Court Management</h2>
            <p className="text-gray-500">Court administration features coming soon.</p>
          </div>
        );
      case 'payments':
        return (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Payment Management</h2>
            <p className="text-gray-500">Payment administration features coming soon.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Reports & Analytics</h2>
            <p className="text-gray-500">Advanced reporting features coming soon.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">System Settings</h2>
            <p className="text-gray-500">System configuration features coming soon.</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <div className="lg:fixed lg:h-full lg:w-64 lg:overflow-y-auto bg-white border-r border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-red-600" />
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-sm text-gray-500">System Management</p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveView(item.key)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeView === item.key
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* Quick Stats */}
              <div className="p-4 border-t border-gray-200 mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Live Tournaments</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">System Health</span>
                    <span className="text-green-600 font-medium">Good</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-600" />
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>
            <div className="flex overflow-x-auto px-4 pb-4 space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === item.key
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-64">
            <main className="p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;