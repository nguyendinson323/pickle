import React, { useState } from 'react';
import { Bell, Mail, Settings, BarChart3 } from 'lucide-react';
import Card from '../components/ui/Card';
import EmailNotificationSettings from '../components/notifications/EmailNotificationSettings';
import EmailCampaignManager from '../components/admin/EmailCampaignManager';
import { useAppSelector } from '../store';

type NotificationView = 'settings' | 'campaigns' | 'analytics';

const NotificationsPage: React.FC = () => {
  const [activeView, setActiveView] = useState<NotificationView>('settings');
  const { user } = useAppSelector(state => state.auth);
  
  const isAdmin = user?.role === 'admin';

  const navigationItems = [
    {
      key: 'settings' as const,
      label: 'Email Settings',
      icon: Settings,
      description: 'Manage your notification preferences'
    },
    ...(isAdmin ? [
      {
        key: 'campaigns' as const,
        label: 'Email Campaigns',
        icon: Mail,
        description: 'Create and manage email campaigns'
      },
      {
        key: 'analytics' as const,
        label: 'Analytics',
        icon: BarChart3,
        description: 'View email performance metrics'
      }
    ] : [])
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return <EmailNotificationSettings />;
      case 'campaigns':
        return isAdmin ? <EmailCampaignManager /> : null;
      case 'analytics':
        return isAdmin ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Email Analytics</h2>
            <p className="text-gray-500">Advanced analytics dashboard coming soon.</p>
          </div>
        ) : null;
      default:
        return <EmailNotificationSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto mobile-container">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <Card className="p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveView(item.key)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeView === item.key
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
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
              </nav>
            </Card>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === item.key
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>

        {/* Email Templates Preview (for admin) */}
        {isAdmin && activeView === 'campaigns' && (
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Email Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Welcome Email</h4>
                <p className="text-sm text-gray-600">Sent to new users upon registration</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Tournament Reminder</h4>
                <p className="text-sm text-gray-600">Remind players about upcoming tournaments</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Payment Confirmation</h4>
                <p className="text-sm text-gray-600">Confirm successful payments</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Partner Request</h4>
                <p className="text-sm text-gray-600">Notify about new partner requests</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Weekly Digest</h4>
                <p className="text-sm text-gray-600">Weekly activity summary</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">System Updates</h4>
                <p className="text-sm text-gray-600">Important platform announcements</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;