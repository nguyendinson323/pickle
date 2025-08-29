import React, { useState, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState<{ width: number; left: number }>({
    width: 0,
    left: 0
  });

  useEffect(() => {
    const activeElement = document.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeElement) {
      setIndicatorStyle({
        width: activeElement.offsetWidth,
        left: activeElement.offsetLeft
      });
    }
  }, [activeTab]);

  const containerClasses = `
    flex relative
    ${fullWidth ? 'w-full' : ''}
    ${variant === 'pills' ? 'space-x-1 p-1 bg-gray-100 rounded-lg' : ''}
    ${variant === 'underline' ? 'border-b border-gray-200' : ''}
    ${className}
  `;

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const getTabClasses = (item: TabItem, isActive: boolean) => {
    const base = `
      relative inline-flex items-center justify-center font-medium
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
      ${fullWidth ? 'flex-1' : ''}
      ${sizeStyles[size]}
      ${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    `;

    switch (variant) {
      case 'pills':
        return `
          ${base}
          rounded-md
          ${isActive 
            ? 'bg-white text-primary-700 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }
        `;
      
      case 'underline':
        return `
          ${base}
          border-b-2 transition-colors
          ${isActive 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }
        `;
      
      default:
        return `
          ${base}
          border border-gray-300
          ${isActive 
            ? 'bg-primary-50 text-primary-700 border-primary-300' 
            : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }
          ${items.indexOf(item) === 0 ? 'rounded-l-md' : ''}
          ${items.indexOf(item) === items.length - 1 ? 'rounded-r-md' : ''}
          ${items.indexOf(item) > 0 ? '-ml-px' : ''}
        `;
    }
  };

  const handleTabClick = (item: TabItem) => {
    if (!item.disabled) {
      onChange(item.id);
    }
  };

  return (
    <div className={containerClasses}>
      {/* Animated Indicator for underline variant */}
      {variant === 'underline' && (
        <div
          className="absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-300 ease-out"
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`
          }}
        />
      )}
      
      {items.map((item) => {
        const isActive = item.id === activeTab;
        
        return (
          <button
            key={item.id}
            data-tab-id={item.id}
            className={getTabClasses(item, isActive)}
            onClick={() => handleTabClick(item)}
            disabled={item.disabled}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
          >
            {item.icon && (
              <span className="mr-2 flex-shrink-0">
                {item.icon}
              </span>
            )}
            
            <span>{item.label}</span>
            
            {item.badge && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full min-w-[1.25rem]">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;