import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { createCourt, clearCourtError } from '../../store/slices/courtSlice';
import { CourtForm } from '../../components/courts/CourtForm';
import { Button } from '../../components/ui/Button';

export const CourtRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { loading, error } = useAppSelector(state => state.courts);

  useEffect(() => {
    // Check if user can register courts
    if (!user) {
      navigate('/login', { state: { returnUrl: '/courts/register' } });
      return;
    }

    if (!['club', 'partner', 'federation'].includes(user.role)) {
      navigate('/courts', { replace: true });
      return;
    }

    // Clear any existing errors
    dispatch(clearCourtError());
  }, [user, navigate, dispatch]);

  const handleSubmit = async (courtData: any) => {
    try {
      const result = await dispatch(createCourt(courtData)).unwrap();
      
      // Navigate to the newly created court
      navigate(`/courts/${result.id}`, {
        state: { 
          message: 'Cancha registrada exitosamente. Será revisada por nuestro equipo antes de ser publicada.' 
        }
      });
    } catch (err) {
      // Error is handled by Redux and displayed in the form
    }
  };

  const handleCancel = () => {
    navigate('/courts');
  };

  if (!user || !['club', 'partner', 'federation'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
          <p className="text-gray-600 mb-4">
            Solo los clubes, socios y la federación pueden registrar canchas.
          </p>
          <Button onClick={() => navigate('/courts')}>
            Volver a Canchas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/courts')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Canchas
                </button>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 font-medium">Registrar Cancha</span>
              </li>
            </ol>
          </nav>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registrar Nueva Cancha</h1>
              <p className="text-gray-600 mt-1">
                Completa la información para registrar tu cancha en la red de pickleball
              </p>
            </div>

            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Information Card */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">Información Importante</h3>
              <div className="mt-2 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>Tu cancha será revisada por nuestro equipo antes de ser publicada</li>
                  <li>Asegúrate de proporcionar información precisa y completa</li>
                  <li>Las imágenes deben ser claras y representativas de la cancha</li>
                  <li>Los precios deben incluir todos los impuestos aplicables</li>
                  <li>Podrás editar la información después de la aprobación</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <CourtForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              error={error}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">¿Necesitas Ayuda?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Requisitos para Canchas</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dimensiones reglamentarias de pickleball</li>
                <li>• Superficie adecuada (concreto, asfalto, etc.)</li>
                <li>• Iluminación para juegos nocturnos (opcional)</li>
                <li>• Acceso seguro para jugadores</li>
                <li>• Seguro de responsabilidad civil</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Documentación Necesaria</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Registro ante la federación mexicana</li>
                <li>• Comprobante de domicilio de la cancha</li>
                <li>• Identificación oficial del responsable</li>
                <li>• Póliza de seguro vigente</li>
                <li>• Permisos municipales requeridos</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  ¿Tienes preguntas sobre el proceso de registro?
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Nuestro equipo está aquí para ayudarte
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('mailto:soporte@federacionpickleball.mx', '_blank')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contactar por Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://wa.me/52XXXXXXXXXX', '_blank')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};