import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  EyeIcon,
  UsersIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { micrositeBuilderApi } from '../../services/micrositeBuilderApi';

interface AnalyticsData {
  analytics: DayAnalytics[];
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    formSubmissions: number;
  };
  period: string;
  micrositeName: string;
}

interface DayAnalytics {
  id: number;
  micrositeId: number;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  pageMetrics: {
    pageId: string;
    slug: string;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }[];
  trafficSources: {
    source: string;
    sessions: number;
    percentage: number;
  }[];
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserStats: {
    browser: string;
    sessions: number;
  }[];
  countryStats: {
    country: string;
    sessions: number;
  }[];
  formSubmissions: number;
  downloadClicks: number;
  socialClicks: number;
  externalLinkClicks: number;
}

interface AnalyticsPanelProps {
  micrositeId: number;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ micrositeId }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<string>('30');
  const [period, setPeriod] = useState<string>('daily');

  useEffect(() => {
    loadAnalytics();
  }, [micrositeId, dateRange, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await micrositeBuilderApi.getAnalytics(micrositeId, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        period
      });
      
      if (response.success) {
        setAnalyticsData(response.data);
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      toast.error('Error al cargar las analíticas');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateGrowth = (current: number, previous: number): { percentage: number; isPositive: boolean } => {
    if (previous === 0) return { percentage: 0, isPositive: true };
    const growth = ((current - previous) / previous) * 100;
    return { percentage: Math.abs(growth), isPositive: growth >= 0 };
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return ComputerDesktopIcon;
      case 'mobile': return DevicePhoneMobileIcon;
      case 'tablet': return DeviceTabletIcon;
      default: return ComputerDesktopIcon;
    }
  };

  const getTopTrafficSources = () => {
    if (!analyticsData?.analytics.length) return [];
    
    const sourceTotals: Record<string, number> = {};
    
    analyticsData.analytics.forEach(day => {
      day.trafficSources.forEach(source => {
        sourceTotals[source.source] = (sourceTotals[source.source] || 0) + source.sessions;
      });
    });

    return Object.entries(sourceTotals)
      .map(([source, sessions]) => ({ source, sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);
  };

  const getTopPages = () => {
    if (!analyticsData?.analytics.length) return [];
    
    const pageTotals: Record<string, { slug: string; views: number; uniqueViews: number }> = {};
    
    analyticsData.analytics.forEach(day => {
      day.pageMetrics.forEach(page => {
        const key = page.pageId;
        if (!pageTotals[key]) {
          pageTotals[key] = { slug: page.slug, views: 0, uniqueViews: 0 };
        }
        pageTotals[key].views += page.views;
        pageTotals[key].uniqueViews += page.uniqueViews;
      });
    });

    return Object.values(pageTotals)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const getDeviceStats = () => {
    if (!analyticsData?.analytics.length) return { desktop: 0, mobile: 0, tablet: 0 };
    
    const totals = { desktop: 0, mobile: 0, tablet: 0 };
    
    analyticsData.analytics.forEach(day => {
      totals.desktop += day.deviceStats.desktop;
      totals.mobile += day.deviceStats.mobile;
      totals.tablet += day.deviceStats.tablet;
    });

    return totals;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay datos de analíticas
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Los datos aparecerán cuando tu micrositio comience a recibir visitas.
          </p>
        </div>
      </div>
    );
  }

  const deviceStats = getDeviceStats();
  const totalDeviceViews = deviceStats.desktop + deviceStats.mobile + deviceStats.tablet;
  const topPages = getTopPages();
  const topTrafficSources = getTopTrafficSources();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">{analyticsData.micrositeName}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Vistas de página
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analyticsData.totals.pageViews.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Visitantes únicos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analyticsData.totals.uniqueVisitors.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sesiones
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analyticsData.totals.sessions.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Formularios enviados
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analyticsData.totals.formSubmissions.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Dispositivos
          </h3>
          
          {totalDeviceViews > 0 ? (
            <div className="space-y-4">
              {Object.entries(deviceStats).map(([device, count]) => {
                const Icon = getDeviceIcon(device);
                const percentage = totalDeviceViews > 0 ? (count / totalDeviceViews) * 100 : 0;
                
                return (
                  <div key={device} className="flex items-center">
                    <div className="flex items-center w-24">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 capitalize">
                        {device === 'desktop' && 'Escritorio'}
                        {device === 'mobile' && 'Móvil'}
                        {device === 'tablet' && 'Tablet'}
                      </span>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-4 text-gray-600 w-16 text-right">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No hay datos de dispositivos disponibles</p>
            </div>
          )}
        </div>

        {/* Top Traffic Sources */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Fuentes de Tráfico
          </h3>
          
          {topTrafficSources.length > 0 ? (
            <div className="space-y-3">
              {topTrafficSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {source.source === 'direct' && 'Directo'}
                      {source.source === 'search' && 'Búsqueda'}
                      {source.source === 'social' && 'Redes Sociales'}
                      {source.source === 'referral' && 'Referencia'}
                      {!['direct', 'search', 'social', 'referral'].includes(source.source) && source.source}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {source.sessions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      sesiones
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No hay datos de tráfico disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Páginas Más Visitadas
        </h3>
        
        {topPages.length > 0 ? (
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.slug} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-4">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      /{page.slug || 'inicio'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {page.views.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">vistas</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {page.uniqueViews.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">únicas</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No hay datos de páginas disponibles</p>
          </div>
        )}
      </div>

      {/* Timeline Chart Placeholder */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Vistas por Día
        </h3>
        
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <ChartBarIcon className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">Gráfico de líneas temporal</p>
            <p className="text-xs">(Implementación de gráficos pendiente)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;