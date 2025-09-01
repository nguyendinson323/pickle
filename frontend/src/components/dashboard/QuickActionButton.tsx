import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  badge?: number | string;
  onClick?: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  title,
  subtitle,
  href,
  badge,
  onClick
}) => {
  const content = (
    <div className="relative bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 text-gray-400 group-hover:text-primary-500 transition-colors">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-900 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>
      
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </div>
      )}
      
      <ArrowRightIcon className="absolute top-2 right-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <Link to={href} className="block">
      {content}
    </Link>
  );
};

export default QuickActionButton;