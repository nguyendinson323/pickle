import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, showHome = true }) => {
  // Always include home as first item if showHome is true
  const breadcrumbItems = showHome 
    ? [{ label: 'Dashboard', href: '/dashboard' }, ...items]
    : items;

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0 && showHome;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" />
              )}
              
              {isLast || !item.href ? (
                <span 
                  className={`text-sm font-medium ${
                    isLast 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isFirst && (
                    <HomeIcon className="inline h-4 w-4 mr-1 mb-0.5" />
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {isFirst && (
                    <HomeIcon className="inline h-4 w-4 mr-1 mb-0.5" />
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;