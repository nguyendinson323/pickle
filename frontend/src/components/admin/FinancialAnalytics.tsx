import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { FinancialOverview } from '../../types/admin';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiCreditCard,
  FiUsers,
  FiHome,
  FiArrowUp,
  FiArrowDown,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';

const FinancialAnalytics: React.FC = () => {
  const [data, setData] = useState<FinancialOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/financial?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar análisis financiero');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount / 100); // Convert from cents to pesos
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    change?: number;
    icon: React.ComponentType<any>;
    color: 'blue' | 'green' | 'purple' | 'orange';
  }> = ({ title, value, change, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[2]}`}>
            <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
          </div>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <FiArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <FiArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </motion.div>
    );
  };

  const RevenueSourceChart: React.FC<{ data: Array<{ source: string; amount: number; percentage: number }> }> = ({ data }) => {
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.source} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded mr-3"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {item.source.replace('_', ' ')}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(item.amount)}
              </div>
              <div className="text-xs text-gray-500">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const MonthlyTrendChart: React.FC<{ data: Array<{ month: string; revenue: number; transactions: number }> }> = ({ data }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-2">
          {data.map((item, index) => {
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full h-32 bg-gray-100 rounded-t">
                  <div 
                    className="absolute bottom-0 w-full bg-pickleball-500 rounded-t transition-all duration-300 hover:bg-pickleball-600"
                    style={{ height: `${height}%` }}
                    title={`${item.month}: ${formatCurrency(item.revenue)}`}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {item.month}
                </div>
                <div className="text-xs font-semibold text-gray-900">
                  {formatCurrency(item.revenue)}
                </div>
                <div className="text-xs text-gray-500">
                  {item.transactions} txn
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis Financiero</h1>
          <p className="text-gray-600 mt-1">Supervisa los ingresos y métricas financieras de la plataforma</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedPeriod === period
                    ? 'bg-pickleball-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {period === '1y' ? '1 año' : period}
              </button>
            ))}
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FiDownload className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rango de Fechas Personalizado</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pickleball-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchFinancialData}
              className="w-full px-4 py-2 bg-pickleball-600 text-white rounded-lg hover:bg-pickleball-700 transition-colors"
            >
              Aplicar Filtro
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pickleball-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FiDollarSign className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchFinancialData}
              className="mt-2 px-4 py-2 bg-pickleball-600 text-white rounded-lg hover:bg-pickleball-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Ingresos Totales"
              value={formatCurrency(data.summary.totalRevenue)}
              change={data.summary.revenueGrowth}
              icon={FiDollarSign}
              color="green"
            />
            <MetricCard
              title="Ingresos Mensuales"
              value={formatCurrency(data.summary.monthlyRevenue)}
              icon={FiTrendingUp}
              color="blue"
            />
            <MetricCard
              title="Valor Promedio"
              value={formatCurrency(data.summary.averageTransactionValue)}
              icon={FiCreditCard}
              color="purple"
            />
            <MetricCard
              title="Transacciones"
              value={data.summary.transactionCount.toLocaleString()}
              icon={FiBarChart2}
              color="orange"
            />
          </div>

          {/* Revenue Breakdown and Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Fuentes de Ingresos</h3>
                <FiPieChart className="h-5 w-5 text-gray-400" />
              </div>
              <RevenueSourceChart data={data.revenueBreakdown} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tendencia Mensual</h3>
                <FiBarChart2 className="h-5 w-5 text-gray-400" />
              </div>
              <MonthlyTrendChart data={data.monthlyTrends} />
            </motion.div>
          </div>

          {/* Top Clubs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Clubes por Ingresos</h3>
                <FiHome className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posición
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Club
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transacciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promedio por Transacción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.topClubs.map((club, index) => (
                    <motion.tr
                      key={club.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{club.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(club.revenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{club.transactions.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(club.revenue / club.transactions)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ingresos por Suscripciones</h3>
                <FiUsers className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatCurrency(data.summary.subscriptionRevenue)}
              </div>
              <p className="text-sm text-gray-600">
                {((data.summary.subscriptionRevenue / data.summary.totalRevenue) * 100).toFixed(1)}% del total
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Crecimiento</h3>
                <div className={`p-2 rounded-lg ${data.summary.revenueGrowth >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  {data.summary.revenueGrowth >= 0 ? (
                    <FiTrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <FiTrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <div className={`text-3xl font-bold mb-2 ${
                data.summary.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.summary.revenueGrowth >= 0 ? '+' : ''}{data.summary.revenueGrowth.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">
                vs período anterior
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Procesamiento</h3>
                <FiCreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                99.8%
              </div>
              <p className="text-sm text-gray-600">
                Tasa de éxito en pagos
              </p>
            </motion.div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default FinancialAnalytics;