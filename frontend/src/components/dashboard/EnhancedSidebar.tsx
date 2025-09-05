import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import { NavigationItem, RoleConfig } from '@/types/navigation';
import { useAuthActions } from '@/hooks/useAuthActions';
import {
  UserIcon,
  ChevronUpIcon,
  ArrowRightOnRectangleIcon,
  CogIcon as SettingsIcon
} from '@heroicons/react/24/outline';

interface EnhancedSidebarProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
  roleConfig: RoleConfig;
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ 
  navigation, 
  isOpen, 
  onClose,
  roleConfig 
}) => {
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const { logout } = useAuthActions();

  const isCurrentPath = (href: string) => {
    return location.pathname === href || 
           (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-900 text-red-100',
      blue: 'bg-blue-900 text-blue-100', 
      green: 'bg-green-900 text-green-100',
      purple: 'bg-purple-900 text-purple-100',
      indigo: 'bg-indigo-900 text-indigo-100',
      cyan: 'bg-cyan-900 text-cyan-100',
    };
    return colors[color] || colors.blue;
  };

  const SidebarContent = () => (
    <div className={`flex-1 flex flex-col min-h-0 ${getColorClasses(roleConfig.color)}`}>
      {/* Sidebar header */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img
            className="h-8 w-auto"
            src="/admin-logo-white.png"
            alt="Mexican Pickleball Federation"
            onError={(e) => {
              // Fallback to a colored rectangle if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="h-8 w-8 bg-white bg-opacity-20 rounded flex items-center justify-center ml-0" 
               style={{ display: 'none' }}
               onLoad={(e) => e.currentTarget.style.display = 'flex'}>
            <span className="text-white font-bold text-xs">FMP</span>
          </div>
          <h1 className="ml-3 text-sm font-semibold">
            {roleConfig.title}
          </h1>
        </div>

        {/* User info */}
        <div className="mt-6 px-4">
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src={(user?.profile as any)?.profilePhotoUrl || '/default-avatar.png'}
              alt=""
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png';
              }}
            />
            <div className="ml-3">
              <p className="text-sm font-medium">
                {(user?.profile as any)?.fullName || user?.username}
              </p>
              <p className="text-xs opacity-75 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const current = isCurrentPath(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  current
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-white text-opacity-75 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }`}
                onClick={() => onClose()}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    current ? 'text-white' : 'text-white text-opacity-75'
                  }`}
                />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User menu */}
      <div className="flex-shrink-0 bg-black bg-opacity-20 p-4">
        <Menu as="div" className="relative">
          <Menu.Button className="w-full text-left flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-25 rounded-md p-2 hover:bg-white hover:bg-opacity-10 transition-colors">
            <UserIcon className="h-5 w-5 mr-2" />
            Account Settings
            <ChevronUpIcon className="ml-auto h-4 w-4" />
          </Menu.Button>
          
          <Menu.Items className="absolute bottom-full left-0 w-full bg-white rounded-md shadow-lg py-1 mb-2">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/profile"
                  className={`block px-4 py-2 text-sm text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                  }`}
                >
                  Edit Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/settings"
                  className={`flex items-center px-4 py-2 text-sm text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                  }`}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 flex z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </div>
    </>
  );
};

export default EnhancedSidebar;