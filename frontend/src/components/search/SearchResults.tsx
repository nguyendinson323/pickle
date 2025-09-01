import React from 'react';
import { Calendar, MapPin, Users, Trophy, Star, Clock, DollarSign } from 'lucide-react';
import Card from '../ui/Card';

interface SearchResultItem {
  id: string;
  type: 'tournament' | 'player' | 'court' | 'event';
  title: string;
  description: string;
  image?: string;
  location: {
    city: string;
    state: string;
  };
  date?: string;
  price?: number;
  rating?: number;
  participants?: number;
  maxParticipants?: number;
  skillLevel?: string;
  status: string;
  tags?: string[];
}

interface SearchResultsProps {
  results: SearchResultItem[];
  loading: boolean;
  onItemClick: (item: SearchResultItem) => void;
  searchType: 'tournaments' | 'players' | 'courts' | 'events';
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  onItemClick,
  searchType
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'registration_open':
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'occupied':
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'player':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'court':
        return <MapPin className="h-5 w-5 text-green-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Trophy className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or filters.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {results.map((item) => (
        <Card
          key={item.id}
          className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onItemClick(item)}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {item.image && (
              <div className="w-full sm:w-24 h-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {getTypeIcon(item.type)}
                  <h3 className="text-lg sm:text-lg font-semibold text-gray-900 truncate">
                    {item.title}
                  </h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{item.location.city}, {item.location.state}</span>
                </div>

                {item.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{formatDate(item.date)}</span>
                  </div>
                )}

                {item.price !== undefined && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>${item.price}</span>
                  </div>
                )}

                {item.participants !== undefined && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{item.participants}/{item.maxParticipants || '∞'}</span>
                  </div>
                )}

                {item.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                )}

                {item.skillLevel && (
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{item.skillLevel}</span>
                  </div>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;