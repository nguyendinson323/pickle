import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCourtAnalytics, setAnalyticsDateRange } from '../../store/slices/analyticsSlice';
import { AnalyticsOverview } from './AnalyticsOverview';
import { RevenueChart } from './RevenueChart';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Badge } from '../ui/Badge';

interface CourtAnalyticsDashboardProps {
  courtId?: number;
  showFilters?: boolean;
}

export const CourtAnalyticsDashboard: React.FC<CourtAnalyticsDashboardProps> = ({ 
  courtId,
  showFilters = true 
}) => {
  const dispatch = useAppDispatch();
  const { 
    overview, 
    revenue, 
    loading, 
    error, 
    dateRange 
  } = useAppSelector(state => state.analytics);
  const { courts } = useAppSelector(state => state.courts);

  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '3months' | '1year'>('30days');
  const [selectedCourt, setSelectedCourt] = useState<number | undefined>(courtId);

  useEffect(() => {
    if (selectedCourt || !courtId) {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '3months':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      dispatch(setAnalyticsDateRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }));

      dispatch(fetchCourtAnalytics({
        courtId: selectedCourt,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [dispatch, selectedPeriod, selectedCourt, courtId]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case '7days': return 'Últimos 7 días';
      case '30days': return 'Últimos 30 días';
      case '3months': return 'Últimos 3 meses';
      case '1year': return 'Último año';
      default: return 'Período';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const currentCourt = selectedCourt ? courts.find(c => c.id === selectedCourt) : null;

  if (loading && !overview) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar analíticas</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentCourt ? `Analíticas - ${currentCourt.name}` : 'Analíticas Generales'}
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis de rendimiento y estadísticas de uso
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Court Selector */}
            {!courtId && courts.length > 0 && (
              <select
                value={selectedCourt || ''}
                onChange={(e) => setSelectedCourt(e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las canchas</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            )}

            {/* Period Selector */}
            <div className="flex gap-1 border border-gray-300 rounded-md overflow-hidden">
              {[
                { key: '7days' as const, label: '7D' },
                { key: '30days' as const, label: '30D' },
                { key: '3months' as const, label: '3M' },
                { key: '1year' as const, label: '1A' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    selectedPeriod === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && overview && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-blue-600">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Actualizando datos...</span>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      {overview ? (
        <>
          {/* Overview Cards */}
          <AnalyticsOverview 
            analytics={overview} 
            period={getPeriodLabel()} 
          />

          {/* Revenue Chart */}
          {revenue && revenue.length > 0 && (
            <RevenueChart 
              data={revenue}
              title={`Evolución de Ingresos - ${getPeriodLabel()}`}
              period={selectedPeriod === '7days' || selectedPeriod === '30days' ? 'daily' : 'weekly'}
            />
          )}

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Horarios Pico
              </h3>
              
              <div className="space-y-3">
                {overview.topRevenueHours.slice(0, 3).map((hour, index) => (
                  <div key={hour.hour} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'success' : index === 1 ? 'warning' : 'outline'}>
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-900">
                          {hour.hour}:00 - {(parseInt(hour.hour) + 1).toString().padStart(2, '0')}:00
                        </p>
                        <p className="text-sm text-gray-500">
                          {hour.reservations} reservas
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">
                      {formatPrice(hour.revenue)}
                    </p>
                  </div>
                ))}
              </div>

              {overview.topRevenueHours.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay datos suficientes para mostrar horarios pico</p>
                </div>
              )}
            </Card>

            {/* Performance Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de Rendimiento
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ingreso promedio por reserva</span>
                  <span className="font-semibold text-gray-900">
                    {overview.totalReservations > 0 
                      ? formatPrice(overview.totalRevenue / overview.totalReservations)
                      : formatPrice(0)
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tasa de ocupación</span>
                  <Badge variant={
                    overview.occupancyRate >= 0.8 ? 'success' :
                    overview.occupancyRate >= 0.6 ? 'warning' : 'danger'
                  }>
                    {(overview.occupancyRate * 100).toFixed(1)}%
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Calificación promedio</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {overview.averageRating.toFixed(1)}
                    </span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ingresos por día</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(overview.totalRevenue / Math.max(overview.revenueByDay.length, 1))}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-600">
            Selecciona una cancha y período para ver las analíticas
          </p>
        </div>
      )}
    </div>
  );
};