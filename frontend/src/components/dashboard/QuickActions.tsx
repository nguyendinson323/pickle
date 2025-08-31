import React from 'react';
import { cn } from '../../utils/helpers';
import Button from '../ui/Button';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
  title?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  className,
  title = 'Quick Actions'
}) => {
  if (actions.length === 0) return null;

  return (
    <div className={cn('bg-white rounded-lg shadow p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  {action.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  {action.description}
                </p>
                
                <Button
                  variant={action.variant || 'primary'}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="w-full"
                >
                  {action.title}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;