import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout, selectUser } from '@/store/authSlice';
import { selectUnreadCount } from '@/store/messageSlice';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';

export interface EnhancedTopBarProps {
  onMenuClick: () => void;
  onNotificationsClick: () => void;
}

const EnhancedTopBar: React.FC<EnhancedTopBarProps> = ({ 
  onMenuClick, 
  onNotificationsClick 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const unreadCount = useAppSelector(selectUnreadCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const getUserRoleLabel = (role: string) => {
    const roleLabels = {
      player: 'Player',
      coach: 'Coach',
      club: 'Club Manager',
      partner: 'Business Partner',
      state: 'State Administrator',
      federation: 'Federation Administrator'
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getUserRoleColor = (role: string) => {
    const roleColors = {
      player: 'bg-blue-100 text-blue-800',
      coach: 'bg-green-100 text-green-800',
      club: 'bg-purple-100 text-purple-800',
      partner: 'bg-orange-100 text-orange-800',
      state: 'bg-indigo-100 text-indigo-800',
      federation: 'bg-red-100 text-red-800'
    };
    return roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={onMenuClick}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <div className="flex-shrink-0 ml-4 lg:ml-0">
                <div className="flex items-center">
                  <img
                    className="h-8 w-auto"
                    src="/logo-horizontal.png"
                    alt="Mexican Pickleball Federation"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTIwIDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMzIiIGZpbGw9IiMzYjgyZjYiLz48dGV4dCB4PSI2MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZNUDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                  <div className="hidden sm:block ml-3">
                    <span className="text-lg font-semibold text-gray-900">FMP</span>
                    <span className="ml-2 text-sm text-gray-500">Dashboard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 justify-center px-6 max-w-md">
              {showSearch ? (
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Search players, tournaments, clubs..."
                      autoFocus
                      onBlur={() => {
                        if (!searchQuery.trim()) setShowSearch(false);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearch(false);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 mr-3 text-gray-400" />
                    Search...
                  </div>
                </button>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Mobile search */}
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>

              {/* Messages */}
              <button
                type="button"
                className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
                onClick={() => navigate('/messages')}
              >
                <span className="sr-only">View messages</span>
                <ChatBubbleLeftIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Badge variant="error" size="sm" className="text-xs min-w-[1.25rem] px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  </div>
                )}
              </button>

              {/* Notifications */}
              <button
                type="button"
                className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
                onClick={onNotificationsClick}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {/* Notification indicator */}
                <div className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></div>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <div className="flex items-center mt-0.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user && getUserRoleColor(user.role)}`}>
                        {user && getUserRoleLabel(user.role)}
                      </span>
                    </div>
                  </div>
                  <svg className="ml-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 ring-1 ring-black ring-opacity-5">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    {/* Profile section */}
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                      My Profile
                    </button>

                    {/* Membership/Account */}
                    {(user?.role === 'player' || user?.role === 'coach') && (
                      <button
                        onClick={() => {
                          navigate('/membership');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <CreditCardIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Membership
                      </button>
                    )}

                    {/* Admin access */}
                    {(user?.role === 'state' || user?.role === 'federation') && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ShieldCheckIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Admin Panel
                      </button>
                    )}

                    {/* Settings */}
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Settings
                    </button>

                    {/* Help */}
                    <button
                      onClick={() => {
                        navigate('/help');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <QuestionMarkCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Help Center
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          {showSearch && (
            <div className="md:hidden border-t border-gray-200 px-4 py-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search players, tournaments, clubs..."
                    autoFocus
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Click outside handler */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to sign out? You'll need to sign in again to access your account.
        </p>
      </Modal>
    </>
  );
};

export default EnhancedTopBar;