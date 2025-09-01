import React, { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'tournament' | 'player' | 'court' | 'club' | 'page';
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  relevanceScore?: number;
  metadata?: {
    location?: string;
    date?: string;
    status?: string;
    level?: string;
    category?: string;
  };
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onResultSelect?: (result: SearchResult) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className = '',
  placeholder = 'Search tournaments, players, courts...',
  autoFocus = false,
  onResultSelect
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>([
    'Mexico City tournaments',
    'Guadalajara courts',
    'Professional players',
    'Beginner tournaments',
    'Singles matches'
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Mock search API - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockResults: SearchResult[] = [
        // Tournaments
        {
          id: 't1',
          type: 'tournament',
          title: 'Mexico City Open 2024',
          subtitle: 'Tournament',
          description: 'Annual championship tournament featuring players from across Mexico',
          url: '/tournaments/1',
          relevanceScore: 95,
          metadata: {
            location: 'Mexico City',
            date: 'March 15-17, 2024',
            status: 'Registration Open',
            level: 'State'
          }
        },
        {
          id: 't2',
          type: 'tournament',
          title: 'Guadalajara Championship',
          subtitle: 'Tournament',
          description: 'Regional tournament for advanced players',
          url: '/tournaments/2',
          relevanceScore: 88,
          metadata: {
            location: 'Guadalajara, Jalisco',
            date: 'February 20-22, 2024',
            status: 'In Progress',
            level: 'Municipal'
          }
        },
        // Players
        {
          id: 'p1',
          type: 'player',
          title: 'Carlos Martinez',
          subtitle: 'Professional Player',
          description: 'Ranked #3 in Mexico, specializes in singles matches',
          url: '/players/1',
          relevanceScore: 92,
          metadata: {
            location: 'Mexico City',
            category: 'Professional'
          }
        },
        {
          id: 'p2',
          type: 'player',
          title: 'Ana Rodriguez',
          subtitle: 'Amateur Player',
          description: 'Rising star in women\'s doubles',
          url: '/players/2',
          relevanceScore: 85,
          metadata: {
            location: 'Guadalajara, Jalisco',
            category: 'Amateur'
          }
        },
        // Courts
        {
          id: 'c1',
          type: 'court',
          title: 'Centro Deportivo Nacional',
          subtitle: 'Sports Complex',
          description: '8 outdoor courts, professional lighting, equipment rental',
          url: '/courts/1',
          relevanceScore: 90,
          metadata: {
            location: 'Mexico City',
            status: 'Available'
          }
        },
        // Clubs
        {
          id: 'cl1',
          type: 'club',
          title: 'Club Deportivo Guadalajara',
          subtitle: 'Pickleball Club',
          description: 'Premier pickleball club with training programs',
          url: '/clubs/1',
          relevanceScore: 87,
          metadata: {
            location: 'Guadalajara, Jalisco'
          }
        }
      ];

      // Filter results based on query
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.metadata?.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Sort by relevance score
      filteredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      setResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(query);
    setIsOpen(false);
    setQuery('');
    
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      navigate(result.url);
    }
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const addToRecentSearches = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalResults = results.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalResults - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          // Navigate to search results page
          navigate(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    const iconClass = "w-10 h-10 rounded-full flex items-center justify-center text-white";
    
    switch (type) {
      case 'tournament':
        return <div className={`${iconClass} bg-blue-500`}>🏆</div>;
      case 'player':
        return <div className={`${iconClass} bg-green-500`}>👤</div>;
      case 'court':
        return <div className={`${iconClass} bg-purple-500`}>🏟️</div>;
      case 'club':
        return <div className={`${iconClass} bg-orange-500`}>🏢</div>;
      case 'page':
        return <div className={`${iconClass} bg-gray-500`}>📄</div>;
      default:
        return <div className={`${iconClass} bg-gray-500`}>🔍</div>;
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-gray-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query && results.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  {results.length} results for "{query}"
                </span>
              </div>
              
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getResultIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">
                        {highlightText(result.title, query)}
                      </h4>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500 mt-1">
                          {result.subtitle}
                        </p>
                      )}
                      {result.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {highlightText(result.description, query)}
                        </p>
                      )}
                      {result.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.metadata.location && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              📍 {result.metadata.location}
                            </span>
                          )}
                          {result.metadata.date && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                              📅 {result.metadata.date}
                            </span>
                          )}
                          {result.metadata.status && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              result.metadata.status === 'Registration Open' 
                                ? 'bg-green-100 text-green-600'
                                : result.metadata.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {result.metadata.status}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-2">
                Try searching for tournaments, players, courts, or clubs
              </p>
            </div>
          )}

          {/* Recent & Popular Searches */}
          {!query && (
            <div>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear
                    </button>
                  </div>
                  
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    Popular Searches
                  </span>
                </div>
                
                {popularSearches.map((search, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <div className="flex items-center gap-3">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;