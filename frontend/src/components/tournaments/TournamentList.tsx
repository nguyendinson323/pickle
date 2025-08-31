import React, { useState } from 'react';
import { Tournament } from '../../types/tournament';
import TournamentCard from './TournamentCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface TournamentListProps {
  tournaments: Tournament[];
  userRegistrations?: any[];
  isLoading?: boolean;
  onViewTournament?: (tournament: Tournament) => void;
  onRegisterForTournament?: (tournament: Tournament) => void;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  view?: 'grid' | 'list';
}

const TournamentList: React.FC<TournamentListProps> = ({
  tournaments,
  userRegistrations = [],
  isLoading = false,
  onViewTournament,
  onRegisterForTournament,
  showLoadMore = false,
  onLoadMore,
  hasMore = false,
  view = 'grid'
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(view);

  const isUserRegistered = (tournamentId: number) => {
    return userRegistrations.some(reg => reg.tournamentId === tournamentId);
  };

  if (isLoading && tournaments.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-gray-600">Loading tournaments...</span>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tournaments available
        </h3>
        <p className="text-gray-500">
          No tournaments found matching your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''} found
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="List view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tournament Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            onView={onViewTournament}
            onRegister={onRegisterForTournament}
            isRegistered={isUserRegistered(tournament.id)}
            showActions={true}
          />
        ))}
      </div>

      {/* Loading More */}
      {isLoading && tournaments.length > 0 && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading more tournaments...</span>
        </div>
      )}

      {/* Load More Button */}
      {showLoadMore && hasMore && !isLoading && (
        <div className="flex justify-center py-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Load more tournaments
          </button>
        </div>
      )}

      {/* No More Results */}
      {showLoadMore && !hasMore && tournaments.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No more tournaments to show
        </div>
      )}
    </div>
  );
};

export default TournamentList;