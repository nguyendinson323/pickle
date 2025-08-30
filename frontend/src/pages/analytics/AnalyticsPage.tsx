import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
// import { CourtAnalyticsDashboard } from '../../components/analytics/CourtAnalyticsDashboard';
// import { FederationAnalytics } from '../../components/analytics/FederationAnalytics';
import Button from '../../components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { courts: myCourts } = useAppSelector(state => state.courts);

  const [selectedView, setSelectedView] = useState<'federation' | 'courts'>('courts');

  // Check if user has access to analytics
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/analytics' } });
      return;
    }

    if (!['club', 'partner', 'federation'].includes(user.role)) {
      navigate('/courts', { replace: true });
      return;
    }
  }, [user, navigate]);

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
            Esta página es solo para propietarios de canchas y administradores.
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Centro de Analíticas</h1>
              <p className="text-gray-600 mt-1">
                Monitorea el rendimiento y crecimiento de tu negocio
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setSelectedView('courts')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedView === 'courts'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mis Canchas
                </button>
                
                {user.role === 'federation' && (
                  <button
                    onClick={() => setSelectedView('federation')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedView === 'federation'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Federación
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                onClick={() => navigate('/my-courts')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Gestionar Canchas
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  // Generate and download analytics report
                  const reportData = {
                    timestamp: new Date().toISOString(),
                    user: user.email,
                    view: selectedView,
                    generatedAt: new Date().toLocaleString('es-MX')
                  };
                  
                  const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
                    type: 'application/json' 
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Reporte
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Court Analytics View */}
        {selectedView === 'courts' && (
          <>
            {myCourts && myCourts.length > 0 ? (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Analíticas de Canchas</h3>
                <p className="text-gray-600">Dashboard de analíticas implementado pendiente</p>
                {/* <CourtAnalyticsDashboard /> - Component has import issues */}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes canchas registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  Registra tu primera cancha para comenzar a ver analíticas de rendimiento.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/courts/register')}
                  >
                    Registrar Cancha
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/courts')}
                  >
                    Explorar Canchas
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Federation Analytics View */}
        {selectedView === 'federation' && user.role === 'federation' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analíticas de la Federación</h3>
            <p className="text-gray-600">Dashboard de analíticas de la federación implementado pendiente</p>
            {/* <FederationAnalytics /> - Component has import issues */}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comprende tus Métricas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Ingresos Totales
              </h4>
              <p className="text-sm text-gray-600">
                Suma de todos los pagos recibidos por reservas confirmadas, incluyendo tarifas base y extras.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h6l2 2h6a2 2 0 012 2v4m-8 16H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1" />
                </svg>
                Total de Reservas
              </h4>
              <p className="text-sm text-gray-600">
                Número total de reservas realizadas, incluyendo completadas, canceladas y en progreso.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Tasa de Ocupación
              </h4>
              <p className="text-sm text-gray-600">
                Porcentaje de tiempo que tus canchas están ocupadas vs. tiempo disponible total.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Calificación Promedio
              </h4>
              <p className="text-sm text-gray-600">
                Promedio de calificaciones dejadas por los jugadores basado en su experiencia en tus canchas.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Horarios Pico
              </h4>
              <p className="text-sm text-gray-600">
                Horarios con mayor demanda y rentabilidad, útil para optimizar precios y disponibilidad.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Tendencia de Ingresos
              </h4>
              <p className="text-sm text-gray-600">
                Evolución de tus ingresos a lo largo del tiempo para identificar patrones y oportunidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};