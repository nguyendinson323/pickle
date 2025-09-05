import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppSelector, useAppDispatch } from './store';
import { checkAuthStatus } from './store/authSlice';
import { fetchStates, fetchNrtpLevels, fetchGenderOptions } from './store/dataSlice';

// Components
import NotificationSystem from './components/common/NotificationSystem';
import { MessagingProvider } from './contexts/MessagingContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Routes Configuration
import routes, { RouteConfig } from './routes';

// Styles
import './styles/globals.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Handle authentication state changes and load global data
  useEffect(() => {
    // Load global data that's needed throughout the app
    dispatch(fetchStates());
    dispatch(fetchNrtpLevels());
    dispatch(fetchGenderOptions());
    
    // Only check auth status if there's a stored token
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated && !isLoading) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  // Show loading spinner during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <MessagingProvider>
        <div className="app-container">
          <Routes>
            {routes.map((route: RouteConfig) => {
              // Handle public routes
              if (route.public) {
                // Special handling for login/register routes when user is already authenticated
                if ((route.path === '/login' || route.path === '/register') && isAuthenticated) {
                  return (
                    <Route
                      key={route.key}
                      path={route.path}
                      element={<Navigate to="/dashboard" replace />}
                    />
                  );
                }
                return (
                  <Route
                    key={route.key}
                    path={route.path}
                    element={route.element}
                  />
                );
              }
              
              // Handle protected routes
              return (
                <Route
                  key={route.key}
                  path={route.path}
                  element={
                    route.requiredRoles ? (
                      <ProtectedRoute requiredRoles={route.requiredRoles as any}>
                        {route.element}
                      </ProtectedRoute>
                    ) : (
                      <ProtectedRoute requiredRoles={['player', 'coach', 'admin', 'state', 'club', 'partner'] as any}>
                        {route.element}
                      </ProtectedRoute>
                    )
                  }
                />
              );
            })}
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global notification system */}
        <NotificationSystem />
      </MessagingProvider>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;