import React from 'react';
import { cn } from '../../utils/helpers';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 7,
  className,
  size = 'md'
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPageNumbers / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);

    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showEllipsisStart = visiblePages[0] > 2;
  const showEllipsisEnd = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      {/* Previous button */}
      <Button
        variant="secondary"
        size={size}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="sr-only">Previous</span>
      </Button>

      {showPageNumbers && (
        <>
          {/* First page */}
          {visiblePages[0] > 1 && (
            <>
              <Button
                variant={1 === currentPage ? 'primary' : 'secondary'}
                size={size}
                onClick={() => onPageChange(1)}
                className="min-w-[40px]"
              >
                1
              </Button>
              {showEllipsisStart && (
                <span className="px-2 py-1 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'secondary'}
              size={size}
              onClick={() => onPageChange(page)}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ))}

          {/* Last page */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {showEllipsisEnd && (
                <span className="px-2 py-1 text-gray-500">...</span>
              )}
              <Button
                variant={totalPages === currentPage ? 'primary' : 'secondary'}
                size={size}
                onClick={() => onPageChange(totalPages)}
                className="min-w-[40px]"
              >
                {totalPages}
              </Button>
            </>
          )}
        </>
      )}

      {/* Next button */}
      <Button
        variant="secondary"
        size={size}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="sr-only">Next</span>
      </Button>

      {!showPageNumbers && (
        <span className="px-3 py-1 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
      )}
    </div>
  );
};

export default Pagination;