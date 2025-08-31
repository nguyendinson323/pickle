import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  reservations: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  title?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  title = "Revenue", 
  period = 'daily' 
}) => {
  const [viewType, setViewType] = useState<'revenue' | 'reservations'>('revenue');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      notation: price >= 1000000 ? 'compact' : 'standard'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (period) {
      case 'daily':
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      case 'weekly':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString('en-US');
    }
  };

  const maxValue = Math.max(
    ...data.map(d => viewType === 'revenue' ? d.revenue : d.reservations)
  );

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 200 : 0;
  };

  const getBarColor = (isHovered: boolean = false) => {
    const colors = viewType === 'revenue' 
      ? ['bg-green-500', 'hover:bg-green-600']
      : ['bg-blue-500', 'hover:bg-blue-600'];
    
    return isHovered ? colors[1] : colors[0];
  };

  if (!data.length) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600">No data available for the selected period</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewType === 'revenue' ? 'primary' : 'outline'}
            onClick={() => setViewType('revenue')}
          >
            Revenue
          </Button>
          <Button
            size="sm"
            variant={viewType === 'reservations' ? 'primary' : 'outline'}
            onClick={() => setViewType('reservations')}
          >
            Reservations
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
            <div key={ratio} className="text-right pr-2">
              {viewType === 'revenue' 
                ? formatPrice(maxValue * ratio)
                : Math.round(maxValue * ratio)
              }
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-16 mr-4">
          {/* Horizontal grid lines */}
          <div className="relative h-52 border-l border-b border-gray-200">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <div
                key={ratio}
                className="absolute w-full border-t border-gray-100"
                style={{ bottom: `${ratio * 100}%` }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {data.map((point) => {
                const value = viewType === 'revenue' ? point.revenue : point.reservations;
                const height = getBarHeight(value);
                
                return (
                  <div
                    key={point.date}
                    className="flex flex-col items-center group"
                    style={{ width: `${90 / data.length}%` }}
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-16 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none z-10 transition-opacity">
                      <div className="text-center">
                        <div className="font-medium">
                          {viewType === 'revenue' 
                            ? formatPrice(point.revenue)
                            : `${point.reservations} reservations`
                          }
                        </div>
                        <div className="text-gray-300 text-xs">
                          {formatDate(point.date)}
                        </div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full ${getBarColor()} group-hover:${getBarColor(true)} transition-colors rounded-t cursor-pointer`}
                      style={{ height: `${height}px` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {data.map((point, index) => {
              // Show every nth label to avoid crowding
              const showLabel = data.length <= 7 || index % Math.ceil(data.length / 7) === 0;
              return (
                <div
                  key={point.date}
                  className="text-center"
                  style={{ width: `${90 / data.length}%` }}
                >
                  {showLabel && formatDate(point.date)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="font-semibold text-gray-900">
            {viewType === 'revenue' 
              ? formatPrice(data.reduce((sum, d) => sum + d.revenue, 0))
              : data.reduce((sum, d) => sum + d.reservations, 0)
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="font-semibold text-gray-900">
            {viewType === 'revenue' 
              ? formatPrice(data.reduce((sum, d) => sum + d.revenue, 0) / data.length)
              : Math.round(data.reduce((sum, d) => sum + d.reservations, 0) / data.length)
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Maximum</p>
          <p className="font-semibold text-gray-900">
            {viewType === 'revenue' 
              ? formatPrice(Math.max(...data.map(d => d.revenue)))
              : Math.max(...data.map(d => d.reservations))
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Minimum</p>
          <p className="font-semibold text-gray-900">
            {viewType === 'revenue' 
              ? formatPrice(Math.min(...data.map(d => d.revenue)))
              : Math.min(...data.map(d => d.reservations))
            }
          </p>
        </div>
      </div>
    </Card>
  );
};