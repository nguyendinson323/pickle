import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { logoutUser, selectUser, selectIsAuthenticated } from '@/store/authSlice';
import { Bars3Icon, XMarkIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { APP_NAME, ROUTES, USER_ROLES } from '@/utils/constants';
import { cn } from '@/utils/helpers';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.HOME);
    setIsUserMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user?.profile) return user?.username || 'Usuario';
    
    switch (user.role) {
      case USER_ROLES.PLAYER:
      case USER_ROLES.COACH:
        return (user.profile as any).fullName || user.username;
      case USER_ROLES.CLUB:
        return (user.profile as any).name || user.username;
      case USER_ROLES.PARTNER:
        return (user.profile as any).businessName || user.username;
      case USER_ROLES.STATE:
        return (user.profile as any).name || user.username;
      default:
        return user.username || 'Usuario';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case USER_ROLES.PLAYER:
        return 'bg-blue-100 text-blue-800';
      case USER_ROLES.COACH:
        return 'bg-green-100 text-green-800';
      case USER_ROLES.CLUB:
        return 'bg-purple-100 text-purple-800';
      case USER_ROLES.PARTNER:
        return 'bg-orange-100 text-orange-800';
      case USER_ROLES.STATE:
        return 'bg-red-100 text-red-800';
      case USER_ROLES.FEDERATION:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigation = [
    { name: 'Inicio', href: ROUTES.HOME },
    { name: 'Torneos', href: ROUTES.TOURNAMENTS },
    { name: 'Canchas', href: ROUTES.COURTS },
    { name: 'Rankings', href: ROUTES.RANKINGS },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏓</span>
              </div>
              <span className="font-bold text-gray-900 text-lg hidden sm:block">
                {APP_NAME}
              </span>
              <span className="font-bold text-gray-900 text-lg sm:hidden">
                FMP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Login Button */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    <div className="hidden sm:block text-left">
                      <div className="font-medium text-gray-900">
                        {getUserDisplayName()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span 
                          className={cn(
                            'px-2 py-1 text-xs rounded-full font-medium',
                            getRoleBadgeColor(user.role)
                          )}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link
                        to={ROUTES.DASHBOARD}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <Link
                        to={ROUTES.PROFILE}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="w-4 h-4 mr-3" />
                        Perfil
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="btn-primary"
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;