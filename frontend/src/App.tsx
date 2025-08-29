import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from '@/store';
import { verifyToken, selectIsAuthenticated, selectAuthLoading } from '@/store/authSlice';
import { ROUTES } from '@/utils/constants';

// Components
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegistrationPage from '@/pages/RegistrationPage';
import RegistrationSuccessPage from '@/pages/RegistrationSuccessPage';
import DashboardPage from '@/pages/DashboardPage';
import MembershipPage from '@/pages/MembershipPage';
import MicrositesPage from '@/pages/microsites/MicrositesPage';
import MicrositeEditorPage from '@/pages/microsites/MicrositeEditorPage';

// Styles
import '@/styles/globals.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  // Show loading spinner during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route 
          path={ROUTES.LOGIN} 
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.DASHBOARD} replace />
            ) : (
              <LoginPage />
            )
          } 
        />
        
        <Route 
          path={ROUTES.REGISTER} 
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.DASHBOARD} replace />
            ) : (
              <RegistrationPage />
            )
          } 
        />
        
        <Route 
          path={ROUTES.REGISTER_SUCCESS} 
          element={<RegistrationSuccessPage />} 
        />

        {/* Protected Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.MEMBERSHIP}
          element={
            <ProtectedRoute>
              <MembershipPage />
            </ProtectedRoute>
          }
        />

        {/* Microsite Routes */}
        <Route
          path="/dashboard/microsites"
          element={
            <ProtectedRoute>
              <MicrositesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/microsites/:id/editor"
          element={
            <ProtectedRoute>
              <MicrositeEditorPage />
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for future implementation */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Perfil</h1>
                  <p className="text-gray-600">Esta página se implementará en el siguiente paso.</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TOURNAMENTS}
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Torneos</h1>
                <p className="text-gray-600">Esta página se implementará en pasos futuros.</p>
              </div>
            </div>
          }
        />

        <Route
          path={ROUTES.COURTS}
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Canchas</h1>
                <p className="text-gray-600">Esta página se implementará en pasos futuros.</p>
              </div>
            </div>
          }
        />

        <Route
          path={ROUTES.RANKINGS}
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Rankings</h1>
                <p className="text-gray-600">Esta página se implementará en pasos futuros.</p>
              </div>
            </div>
          }
        />

        <Route
          path={ROUTES.PLAYER_FINDER}
          element={
            <ProtectedRoute requiredRoles={['player', 'coach']}>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Buscador de Jugadores</h1>
                  <p className="text-gray-600">Esta funcionalidad premium se implementará en pasos futuros.</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.MESSAGING}
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Mensajería</h1>
                  <p className="text-gray-600">Esta página se implementará en pasos futuros.</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Página no encontrada</p>
                <a href={ROUTES.HOME} className="btn-primary">
                  Volver al Inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
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