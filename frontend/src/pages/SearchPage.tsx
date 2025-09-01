import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdvancedSearch from '../components/search/AdvancedSearch';
import SearchResults from '../components/search/SearchResults';
import MobileNavigation from '../components/common/MobileNavigation';
import { Search } from 'lucide-react';
import apiService from '../services/api';

interface SearchFilters {
  searchTerm: string;
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
  location: {
    state: string;
    city: string;
    radius: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  skillLevel: string;
  status: string;
  sortBy: string;
}

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

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'tournaments' | 'players' | 'courts' | 'events'>('tournaments');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type') as 'tournaments' | 'players' | 'courts' | 'events';
    const query = params.get('q');
    
    if (type && ['tournaments', 'players', 'courts', 'events'].includes(type)) {
      setSearchType(type);
    }
    
    if (query) {
      performSearch({
        searchTerm: query,
        category: '',
        dateRange: { start: '', end: '' },
        location: { state: '', city: '', radius: 10 },
        priceRange: { min: 0, max: 1000 },
        skillLevel: '',
        status: '',
        sortBy: 'relevance'
      });
    }
  }, [location.search]);

  const searchRealData = async (filters: SearchFilters, type: string): Promise<SearchResultItem[]> => {
    try {
      let results: SearchResultItem[] = [];
      
      switch (type) {
        case 'tournaments': {
          const data = await apiService.get('/api/tournaments/search', {
            q: filters.searchTerm,
            status: filters.status,
            category: filters.category,
            state: filters.location.state,
            city: filters.location.city,
            skillLevel: filters.skillLevel,
            sortBy: filters.sortBy,
            startDate: filters.dateRange.start,
            endDate: filters.dateRange.end,
            minPrice: filters.priceRange.min.toString(),
            maxPrice: filters.priceRange.max.toString()
          });
          results = data.tournaments?.map((tournament: any) => ({
            id: tournament.id,
            type: 'tournament' as const,
            title: tournament.name,
            description: tournament.description || `Tournament in ${tournament.location}`,
            location: { 
              city: tournament.city || tournament.location?.split(',')[0] || '', 
              state: tournament.state || tournament.location?.split(',')[1]?.trim() || '' 
            },
            date: tournament.startDate || tournament.date,
            price: tournament.entryFee || tournament.price,
            participants: tournament.currentParticipants || 0,
            maxParticipants: tournament.maxParticipants,
            skillLevel: tournament.skillLevel,
            status: tournament.status || 'upcoming',
            tags: tournament.categories || []
          })) || [];
          break;
        }
        
        case 'players': {
          const data = await apiService.post('/api/location/search-players', {
            searchTerm: filters.searchTerm,
            state: filters.location.state,
            city: filters.location.city,
            skillLevel: filters.skillLevel,
            radius: filters.location.radius
          });
          results = data.players?.map((player: any) => ({
            id: player.id,
            type: 'player' as const,
            title: player.name || `${player.firstName} ${player.lastName}`,
            description: player.bio || `${player.skillLevel} level player looking for partners`,
            location: { 
              city: player.city || '', 
              state: player.state || '' 
            },
            skillLevel: player.skillLevel,
            rating: player.rating,
            status: player.status || 'active',
            tags: [player.skillLevel, player.preferredPlayStyle].filter(Boolean)
          })) || [];
          break;
        }
        
        case 'courts': {
          const data = await apiService.get('/api/courts', {
            q: filters.searchTerm,
            state: filters.location.state,
            city: filters.location.city,
            minPrice: filters.priceRange.min.toString(),
            maxPrice: filters.priceRange.max.toString()
          });
          results = data.courts?.map((court: any) => ({
            id: court.id,
            type: 'court' as const,
            title: court.name,
            description: court.description || `Court facility in ${court.location}`,
            location: { 
              city: court.city || court.location?.split(',')[0] || '', 
              state: court.state || court.location?.split(',')[1]?.trim() || '' 
            },
            price: court.hourlyRate || court.price,
            rating: court.rating,
            status: court.isAvailable ? 'available' : 'occupied',
            tags: court.amenities || []
          })) || [];
          break;
        }
        
        default:
          results = [];
      }
      
      return results;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  const performSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = await searchRealData(filters, searchType);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: SearchResultItem) => {
    // Navigate to detail page based on item type
    switch (item.type) {
      case 'tournament':
        navigate(`/tournaments/${item.id}`);
        break;
      case 'player':
        navigate(`/players/${item.id}`);
        break;
      case 'court':
        navigate(`/courts/${item.id}`);
        break;
      case 'event':
        navigate(`/events/${item.id}`);
        break;
    }
  };

  const getPlaceholderText = () => {
    switch (searchType) {
      case 'tournaments':
        return 'Search tournaments by name, location, or skill level...';
      case 'players':
        return 'Search players by name, skill level, or location...';
      case 'courts':
        return 'Search courts by name, location, or amenities...';
      case 'events':
        return 'Search events by name, type, or location...';
      default:
        return 'Search...';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto mobile-container">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Search</h1>
            </div>

            {/* Search Type Tabs */}
            <div className="flex overflow-x-auto scrollbar-none space-x-1 bg-gray-100 p-1 rounded-lg mb-4 sm:mb-6 w-full sm:w-fit">
              {[
                { key: 'tournaments', label: 'Tournaments' },
                { key: 'players', label: 'Players' },
                { key: 'courts', label: 'Courts' },
                { key: 'events', label: 'Events' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSearchType(tab.key as any)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors touch-target ${
                    searchType === tab.key
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          <AdvancedSearch
            onSearch={performSearch}
            searchType={searchType}
            placeholder={getPlaceholderText()}
          />
        </div>

        {hasSearched && (
          <SearchResults
            results={results}
            loading={loading}
            onItemClick={handleItemClick}
            searchType={searchType}
          />
        )}

          {!hasSearched && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                Start your search
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Use the search bar above to find tournaments, players, courts, or events.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Import and use MobileNavigation */}
      <MobileNavigation />
    </>
  );
};

export default SearchPage;