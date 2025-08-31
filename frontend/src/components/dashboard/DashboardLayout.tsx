import React, { useState } from 'react';
import { useAppSelector } from '../../store';
import Tabs, { TabItem } from '../ui/Tabs';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  tabs: TabItem[];
  onTabChange: (tabId: string) => void;
  sidebarContent?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  tabs,
  onTabChange,
  sidebarContent
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <TopBar onMenuClick={toggleSidebar} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          content={sidebarContent}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Dashboard
                  </h1>
                  {user && (
                    <p className="mt-1 text-sm text-gray-500">
                      Welcome back, {user.username}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <Tabs
                items={tabs}
                activeTab={activeTab}
                onChange={(tabId) => {
                  setActiveTab(tabId);
                  onTabChange(tabId);
                }}
                variant="underline"
                fullWidth={false}
                className="border-b border-gray-200"
              />
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;