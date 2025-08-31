import React from 'react';
import { cn } from '../../utils/helpers';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  className?: string;
  showValues?: boolean;
  showGrid?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  height = 300,
  className,
  showValues = false,
  showGrid = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
  ];

  const getColor = (index: number, customColor?: string) => {
    return customColor || colors[index % colors.length];
  };

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full px-4 pb-8">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 60);
        return (
          <div key={index} className="flex flex-col items-center flex-1 mx-1">
            <div className="relative flex-1 w-full flex items-end">
              {showGrid && (
                <div className="absolute inset-0 border-l border-gray-200 opacity-30"></div>
              )}
              <div
                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: getColor(index, item.color)
                }}
              >
                {showValues && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                    {item.value}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center truncate w-full">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80;
      return { x, y, ...item };
    });

    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return (
      <div className="relative h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {showGrid && (
            <g className="text-gray-200">
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.2" />
              ))}
            </g>
          )}
          
          <path
            d={pathData}
            fill="none"
            stroke={colors[0]}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={getColor(index, point.color)}
              className="drop-shadow-sm hover:r-3 transition-all"
            />
          ))}
        </svg>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-600">
          {data.map((item, index) => (
            <span key={index} className="truncate">{item.label}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = 40;
    const centerX = 50;
    const centerY = 50;

    const paths = data.map((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      currentAngle += angle;

      const startAngleRad = (startAngle - 90) * (Math.PI / 180);
      const endAngleRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return {
        path: pathData,
        color: getColor(index, item.color),
        label: item.label,
        value: item.value,
        percentage: Math.round(percentage * 100)
      };
    });

    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <svg className="w-64 h-64" viewBox="0 0 100 100">
            {paths.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                data-title={`${segment.label}: ${segment.value} (${segment.percentage}%)`}
              />
            ))}
          </svg>
          
          <div className="absolute right-full top-0 mr-4 space-y-1">
            {paths.map((segment, index) => (
              <div key={index} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-gray-600">
                  {segment.label}: {segment.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
      case 'doughnut':
        return renderPieChart();
      default:
        return <div className="flex items-center justify-center h-full text-gray-500">Chart type not supported</div>;
    }
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {title}
        </h3>
      )}
      
      <div style={{ height: `${height}px` }} className="relative">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
};

export default Chart;