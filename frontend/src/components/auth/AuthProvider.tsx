import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { checkAuthStatus } from '../../store/authSlice';
import subscriptionAuthService from '../../services/subscriptionAuthService';
import LoadingSpinner from '../common/LoadingSpinner';

interface AuthProviderProps {
  children: React.ReactNode;
  showLoadingScreen?: boolean;
}

/**
 * Enhanced AuthProvider that handles both authentication and subscription loading
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  showLoadingScreen = true 
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user, subscriptionLoaded } = useAppSelector(state => state.auth);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check authentication status
        await dispatch(checkAuthStatus()).unwrap();
        
        // If authenticated, load subscription data
        if (isAuthenticated && user) {
          await subscriptionAuthService.syncUserSubscription();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    if (!initialLoadComplete) {
      initializeAuth();
    }
  }, [dispatch, isAuthenticated, user, initialLoadComplete]);

  // Show loading screen during initial auth check
  if (!initialLoadComplete && showLoadingScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Cargando...
          </h2>
          <p className="text-gray-600">
            Inicializando la aplicación
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Hook to check if auth and subscription are fully loaded
 */
export const useAuthReady = () => {
  const { isAuthenticated, subscriptionLoaded, user } = useAppSelector(state => state.auth);
  
  return {
    authReady: true, // Auth is always ready after initial load
    subscriptionReady: !isAuthenticated || subscriptionLoaded,
    userReady: !isAuthenticated || (user !== null),
    fullyReady: (!isAuthenticated || (subscriptionLoaded && user !== null)),
  };
};