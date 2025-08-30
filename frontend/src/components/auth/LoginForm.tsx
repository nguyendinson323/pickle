import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginUser, clearError, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '@/store/authSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '@/utils/constants';
import { validateEmail } from '@/utils/helpers';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })).unwrap();
      
      // Navigation will be handled by useEffect
    } catch (err) {
      // Error is handled by Redux
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">🏓</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de la Federación Mexicana de Pickleball
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Global error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`form-input ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`form-input pr-10 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between text-sm">
            <a
              href="/forgot-password"
              className="text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </a>
            <a
              href="/register"
              className="text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Crear cuenta
            </a>
          </div>
        </form>

        {/* Demo credentials for testing */}
        {(import.meta as any).env?.MODE === 'development' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">
              Credenciales de prueba:
            </h3>
            <p className="text-xs text-yellow-600 mt-1">
              Email: admin@pickleballfed.mx<br />
              Contraseña: admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;