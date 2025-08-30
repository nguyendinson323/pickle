import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface LocationResult {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  accuracy?: number;
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
  allowCurrentLocation?: boolean;
  initialAddress?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  placeholder = "Buscar ubicación...",
  className = "",
  allowCurrentLocation = true,
  initialAddress = ""
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clear debounce timer on cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const searchLocation = async (searchAddress: string) => {
    if (searchAddress.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/location/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ address: searchAddress })
      });

      const result = await response.json();

      if (result.success) {
        setSuggestions([result.data]);
        setShowSuggestions(true);
      } else {
        setError('No se pudo encontrar la ubicación');
        setSuggestions([]);
      }
    } catch (err) {
      setError('Error al buscar la ubicación');
      setSuggestions([]);
      console.error('Location search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setError(null);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const handleSuggestionClick = (location: LocationResult) => {
    setAddress(location.address);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible');
      return;
    }

    setIsGettingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch('/api/location/reverse-geocode', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          });

          const result = await response.json();

          if (result.success) {
            setAddress(result.data.address);
            onLocationSelect(result.data);
          } else {
            setError('No se pudo obtener la dirección');
          }
        } catch (err) {
          setError('Error al obtener la ubicación');
          console.error('Reverse geocoding error:', err);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (err) => {
        setError('No se pudo acceder a la ubicación');
        setIsGettingLocation(false);
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[0]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={address}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading || isGettingLocation}
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {suggestion.address}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {suggestion.city}, {suggestion.state}
                    {suggestion.accuracy && (
                      <span className="ml-2 text-green-600">
                        Precisión: {Math.round(suggestion.accuracy * 100)}%
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {allowCurrentLocation && (
          <Button
            variant="secondary"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isGettingLocation || isLoading}
            className="flex items-center gap-2 px-3"
            title="Usar ubicación actual"
          >
            {isGettingLocation ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span className="hidden sm:inline">Actual</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;