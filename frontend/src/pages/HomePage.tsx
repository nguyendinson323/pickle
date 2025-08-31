import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated, selectUser } from '@/store/authSlice';
import { 
  TrophyIcon, 
  UserGroupIcon, 
  MapIcon, 
  ChartBarIcon,
  StarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { ROUTES, USER_ROLES } from '@/utils/constants';
import Layout from '@/components/common/Layout';

const HomePage: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const features = [
    {
      name: 'Official Tournaments',
      description: 'Participate in national, state and local tournaments organized by the federation.',
      icon: TrophyIcon,
      href: ROUTES.TOURNAMENTS,
    },
    {
      name: 'Player Search',
      description: 'Find players near you to train and play matches.',
      icon: UserGroupIcon,
      href: ROUTES.PLAYER_FINDER,
      premium: true,
    },
    {
      name: 'Available Courts',
      description: 'Discover and book pickleball courts in your area.',
      icon: MapIcon,
      href: ROUTES.COURTS,
    },
    {
      name: 'Official Rankings',
      description: 'Check national and state player rankings.',
      icon: ChartBarIcon,
      href: ROUTES.RANKINGS,
    },
  ];

  const stats = [
    { name: 'Registered Players', value: '2,500+', icon: UserGroupIcon },
    { name: 'Tournaments Organized', value: '150+', icon: TrophyIcon },
    { name: 'Participating States', value: '32', icon: MapIcon },
    { name: 'Registered Courts', value: '200+', icon: StarIcon },
  ];

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return ROUTES.LOGIN;
    return ROUTES.DASHBOARD;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Mexican Pickleball
              <span className="block text-primary-200">Federation</span>
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              The official platform that connects players, coaches, clubs and 
              pickleball organizers throughout Mexico. Join the fastest growing 
              community in racket sports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to={getDashboardLink()}
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
                  >
                    Register Now
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    className="btn-ghost border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for pickleball
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers all the tools necessary for 
              players, coaches, clubs and organizers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="card-hover text-center group">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  {feature.premium && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <Link
                  to={feature.href}
                  className="btn-primary w-full group-hover:bg-primary-700 transition-colors duration-200"
                >
                  Explore
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to join the federation?
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Register today and start enjoying all the benefits of being 
            part of the official pickleball community in Mexico.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Start Now
              </Link>
              <Link
                to="/about"
                className="btn-ghost border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
              >
                Learn More
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* User-specific welcome section */}
      {isAuthenticated && user && (
        <div className="bg-success-50 border-t-4 border-success-400 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-success-900 mb-2">
                Welcome back, {user.username}!
              </h3>
              <p className="text-success-700 mb-4">
                As a registered {user.role === USER_ROLES.PLAYER ? 'player' : 
                     user.role === USER_ROLES.COACH ? 'coach' :
                     user.role === USER_ROLES.CLUB ? 'club' :
                     user.role === USER_ROLES.PARTNER ? 'partner' :
                     user.role === USER_ROLES.STATE ? 'state committee' : 'user'}, 
                you have access to all platform functionalities.
              </p>
              <Link
                to={ROUTES.DASHBOARD}
                className="btn-success"
              >
                Go to my Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;