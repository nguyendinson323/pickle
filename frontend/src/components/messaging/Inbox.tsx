import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { cn } from '../../utils/helpers';
import MessageList from './MessageList';
import ComposeMessage from './ComposeMessage';
import Button from '../ui/Button';
import SearchBox from '../ui/SearchBox';

interface InboxProps {
  className?: string;
}

const Inbox: React.FC<InboxProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const [activeView, setActiveView] = useState<'inbox' | 'compose'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const filters = [
    { key: 'all', label: 'All Messages', icon: '📧' },
    { key: 'unread', label: 'Unread', icon: '🔵' },
    { key: 'urgent', label: 'Urgent', icon: '⚠️' }
  ];

  return (
    <div className={cn('bg-white rounded-lg shadow', className)}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeView === 'inbox' ? 'Messages' : 'Compose Message'}
          </h2>
          
          <div className="flex space-x-2">
            <Button
              variant={activeView === 'inbox' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveView('inbox')}
            >
              Inbox
            </Button>
            <Button
              variant={activeView === 'compose' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveView('compose')}
            >
              Compose
            </Button>
          </div>
        </div>

        {activeView === 'inbox' && (
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <SearchBox
                placeholder="Search messages..."
                value={searchQuery}
                onChange={setSearchQuery}
                size="sm"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-1">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    filter === filterOption.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <span className="mr-1">{filterOption.icon}</span>
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'inbox' ? (
          <MessageList />
        ) : (
          <ComposeMessage
            onSent={() => setActiveView('inbox')}
            onCancel={() => setActiveView('inbox')}
          />
        )}
      </div>
    </div>
  );
};

export default Inbox;