import React, { useState, useEffect, useCallback } from 'react';
import { RankingCard } from './RankingCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../ui/Button';

interface RankingListProps {
  category: string;
  rankingType: string;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  limit?: number;
  onPlayerClick?: (playerId: number) => void;
}

interface Ranking {
  id: number;
  playerId: number;
  position: number;
  points: number;
  previousPosition: number;
  previousPoints: number;
  category: string;
  rankingType: string;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  tournamentsPlayed: number;
  lastTournamentDate?: string;
  isActive: boolean;
  Player?: {
    firstName: string;
    lastName: string;
    nrtpLevel?: string;
    photo?: string;
  };
  State?: {
    name: string;
    abbreviation: string;
  };
}

interface RankingResponse {
  success: boolean;
  data: Ranking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export const RankingList: React.FC<RankingListProps> = ({
  category,
  rankingType,
  stateId,
  ageGroup,
  gender,
  limit = 50,
  onPlayerClick
}) => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    totalPages: 0
  });
  const [currentPage, setCurrentPage] = useState(0);

  const fetchRankings = useCallback(async (offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (stateId) params.append('stateId', stateId.toString());
      if (ageGroup) params.append('ageGroup', ageGroup);
      if (gender) params.append('gender', gender);

      const response = await fetch(
        `/api/rankings/category/${category}/${rankingType}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }

      const data: RankingResponse = await response.json();

      if (data.success) {
        setRankings(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error('Failed to load rankings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [category, rankingType, stateId, ageGroup, gender, limit]);

  useEffect(() => {
    fetchRankings(0);
    setCurrentPage(0);
  }, [fetchRankings]);

  const handlePageChange = (newPage: number) => {
    const offset = newPage * pagination.limit;
    setCurrentPage(newPage);
    fetchRankings(offset);
  };

  const handleRefresh = () => {
    fetchRankings(currentPage * pagination.limit);
  };

  if (loading && rankings.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={handleRefresh} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg mb-2">No rankings found</div>
        <div className="text-sm">
          There are no players ranked in this category yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Rankings ({pagination.total} players)
        </div>
        <Button 
          onClick={handleRefresh}
          variant="secondary"
          size="sm"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.map((ranking) => (
          <RankingCard
            key={ranking.id}
            ranking={ranking}
            showDetails={true}
            onClick={onPlayerClick ? () => onPlayerClick(ranking.playerId) : undefined}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            variant="secondary"
            size="sm"
          >
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 7) {
                pageNum = i;
              } else if (currentPage <= 3) {
                pageNum = i;
              } else if (currentPage >= pagination.totalPages - 4) {
                pageNum = pagination.totalPages - 7 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={currentPage === pageNum ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-10"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages - 1}
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}

      {/* Loading overlay for pagination */}
      {loading && rankings.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <LoadingSpinner />
          </div>
        </div>
      )}
    </div>
  );
};