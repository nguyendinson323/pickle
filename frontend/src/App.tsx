import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppSelector, useAppDispatch } from './store';
import { checkAuthStatus } from './store/authSlice';
import { ROUTES } from './utils/constants';

// Integration Services
import integrationService from './services/integrationService';
import NotificationSystem from './components/common/NotificationSystem';
import { MessagingProvider } from './contexts/MessagingContext';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LearnMorePage from './pages/LearnMorePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import DashboardPage from './pages/DashboardPage';
import { MembershipPage } from './pages/MembershipPage';
import MicrositesPage from './pages/microsites/MicrositesPage';
import MicrositeEditorPage from './pages/microsites/MicrositeEditorPage';
import MicrositeBuilderPage from './pages/MicrositeBuilderPage';
import MicrositeCreatePage from './pages/MicrositeCreatePage';
import MicrositeEditPage from './pages/MicrositeEditPage';
import PlayerConnectionPage from './pages/player/PlayerConnectionPage';
import TournamentsPage from './pages/tournaments/TournamentsPage';
import TournamentManagePage from './pages/tournaments/TournamentManagePage';
import TournamentAnalyticsPage from './pages/tournaments/TournamentAnalyticsPage';
import SearchPage from './pages/SearchPage';
import ExportPage from './pages/ExportPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagingPage from './pages/MessagingPage';
import MobileNavigation from './components/common/MobileNavigation';
import CreateTournamentForm from './components/tournaments/CreateTournamentForm';
import TournamentBracket from './components/tournaments/TournamentBracket';
import LiveScoring from './components/tournaments/LiveScoring';

// Styles
import './styles/globals.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const [systemInitialized, setSystemInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  // Initialize integration services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await integrationService.initialize({
          enableWebSocket: true,
          enableCache: true,
          enableErrorHandling: true
        });
        setSystemInitialized(true);
      } catch (error) {
        console.error('Failed to initialize integration services:', error);
        setInitializationError(error instanceof Error ? error.message : 'System initialization failed');
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      integrationService.cleanup();
    };
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    // Check authentication status on app load
    if (!isAuthenticated && !isLoading) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  // Handle user login integration
  useEffect(() => {
    if (isAuthenticated && user && systemInitialized) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        integrationService.handleUserLogin(user.id, token);
      }
    }
  }, [isAuthenticated, user, systemInitialized]);

  // Handle user logout
  const handleLogout = async () => {
    await integrationService.handleUserLogout();
    // Redux logout would be handled here
  };

  // Show initialization error
  if (initializationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">System Initialization Failed</h2>
          <p className="text-gray-600 mb-4">{initializationError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner during initial auth check or system initialization
  if (isLoading || !systemInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">
            {!systemInitialized ? 'Initializing system...' : 'Loading application...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <MessagingProvider>
        <div className="app-container">
          <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path="/about" element={<LearnMorePage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
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

        {/* New Microsite Builder Routes */}
        <Route
          path="/microsite-builder"
          element={
            <ProtectedRoute requiredRoles={['club', 'state']}>
              <MicrositeBuilderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/microsite-builder/create"
          element={
            <ProtectedRoute requiredRoles={['club', 'state']}>
              <MicrositeCreatePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/microsite-builder/:id/edit"
          element={
            <ProtectedRoute requiredRoles={['club', 'state']}>
              <MicrositeEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/microsite-builder/:id/analytics"
          element={
            <ProtectedRoute requiredRoles={['club', 'state']}>
              <MicrositeEditPage />
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
                  <p className="text-gray-600">This page will be implemented in the next step.</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TOURNAMENTS}
          element={<TournamentsPage />}
        />

        <Route
          path="/tournaments/create"
          element={
            <ProtectedRoute requiredRoles={['federation', 'state', 'club', 'partner']}>
              <CreateTournamentForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tournaments/manage"
          element={
            <ProtectedRoute requiredRoles={['federation', 'state', 'club', 'partner']}>
              <TournamentManagePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tournaments/:id"
          element={<TournamentsPage />}
        />

        <Route
          path="/tournaments/:id/bracket"
          element={
            <ProtectedRoute requiredRoles={['player', 'coach', 'federation', 'state', 'club', 'partner']}>
              <TournamentBracket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tournaments/:id/scoring"
          element={
            <ProtectedRoute requiredRoles={['federation', 'state', 'club', 'partner']}>
              <LiveScoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tournaments/analytics"
          element={
            <ProtectedRoute requiredRoles={['federation', 'state', 'club', 'partner']}>
              <TournamentAnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.COURTS}
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Courts</h1>
                <p className="text-gray-600">This page will be implemented in future steps.</p>
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
                <p className="text-gray-600">This page will be implemented in future steps.</p>
              </div>
            </div>
          }
        />

        <Route
          path={ROUTES.PLAYER_FINDER}
          element={
            <ProtectedRoute requiredRoles={['player', 'coach']}>
              <PlayerConnectionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.MESSAGING}
          element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={<SearchPage />}
        />

        <Route
          path="/export"
          element={
            <ProtectedRoute requiredRoles={['federation', 'state', 'club', 'partner']}>
              <ExportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['federation']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={['federation']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
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
                <p className="text-gray-600 mb-8">Page not found</p>
                <a href={ROUTES.HOME} className="btn-primary">
                  Back to Home
                </a>
              </div>
            </div>
          }
        />
        </Routes>
        
        <MobileNavigation />
        
        {/* Global Notification System */}
        <NotificationSystem />
        </div>
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