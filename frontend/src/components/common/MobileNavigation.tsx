import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Trophy, Users, MessageCircle, User, Bell } from 'lucide-react';
import { useAppSelector } from '../../store';

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Don't show mobile navigation on login/register pages
  if (['/login', '/register', '/register-success'].includes(location.pathname)) {
    return null;
  }

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      requireAuth: false
    },
    {
      path: '/search',
      icon: Search,
      label: 'Search',
      requireAuth: false
    },
    {
      path: '/tournaments',
      icon: Trophy,
      label: 'Tournaments',
      requireAuth: false
    },
    {
      path: '/player-finder',
      icon: Users,
      label: 'Players',
      requireAuth: true
    },
    {
      path: '/messaging',
      icon: MessageCircle,
      label: 'Messages',
      requireAuth: true
    },
    {
      path: '/notifications',
      icon: Bell,
      label: 'Notifications',
      requireAuth: true
    },
    {
      path: isAuthenticated ? '/dashboard' : '/login',
      icon: User,
      label: isAuthenticated ? 'Profile' : 'Login',
      requireAuth: false
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string, requireAuth: boolean) => {
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path, item.requireAuth)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg touch-target transition-colors ${
                active
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;