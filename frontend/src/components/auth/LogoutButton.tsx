import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { logoutUser, selectAuthLoading } from '@/store/authSlice';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  children,
  showIcon = true 
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isDisabled = isLoading || isLoggingOut;

  return (
    <button
      onClick={handleLogout}
      disabled={isDisabled}
      className={`inline-flex items-center ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoggingOut ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Signing out...
        </>
      ) : (
        <>
          {showIcon && <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />}
          {children || 'Sign Out'}
        </>
      )}
    </button>
  );
};

export default LogoutButton;