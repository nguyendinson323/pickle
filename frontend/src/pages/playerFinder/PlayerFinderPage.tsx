import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import PlayerFinderCard from '../../components/playerFinder/PlayerFinderCard';
import LocationSearch from '../../components/location/LocationSearch';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';

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

interface FilterState {
  skillLevel: string;
  maxDistance: number;
  playingStyle: string;
  location: LocationResult | null;
}

const PlayerFinderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    skillLevel: '',
    maxDistance: 25,
    playingStyle: '',
    location: null
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async (searchFilters?: Partial<FilterState>) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      const activeFilters = { ...filters, ...searchFilters };
      
      if (activeFilters.skillLevel) {
        queryParams.append('skillLevel', activeFilters.skillLevel);
      }
      if (activeFilters.maxDistance) {
        queryParams.append('maxDistance', activeFilters.maxDistance.toString());
      }
      if (activeFilters.playingStyle) {
        queryParams.append('playingStyle', activeFilters.playingStyle);
      }
      if (activeFilters.location) {
        queryParams.append('latitude', activeFilters.location.latitude.toString());
        queryParams.append('longitude', activeFilters.location.longitude.toString());
      }

      const response = await fetch(`/api/player-finder/requests?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setRequests(result.data);
      } else {
        setError('Error al cargar las solicitudes');
      }
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchRequests(newFilters);
  };

  const handleLocationSelect = (location: LocationResult) => {
    handleFilterChange({ location });
  };

  const handleRespond = async (requestId: number, action: 'interested' | 'not_interested') => {
    try {
      const response = await fetch(`/api/player-finder/matches/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          status: action === 'interested' ? 'accepted' : 'declined',
          message: action === 'interested' ? 'Me interesa jugar contigo!' : ''
        })
      });

      const result = await response.json();

      if (result.success) {
        // Refresh requests
        fetchRequests();
        
        if (action === 'interested') {
          alert('¡Respuesta enviada! El organizador será notificado.');
        }
      } else {
        alert('Error al responder a la solicitud');
      }
    } catch (err) {
      alert('Error al responder a la solicitud');
      console.error('Error responding to request:', err);
    }
  };

  const clearFilters = () => {
    setFilters({
      skillLevel: '',
      maxDistance: 25,
      playingStyle: '',
      location: null
    });
    fetchRequests({
      skillLevel: '',
      maxDistance: 25,
      playingStyle: '',
      location: null
    });
  };

  const hasActiveFilters = filters.skillLevel || filters.playingStyle || filters.location || filters.maxDistance !== 25;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Buscar Jugadores
              </h1>
              <p className="text-sm text-gray-600">
                Encuentra jugadores para partidos cercanos
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
                {hasActiveFilters && (
                  <Badge variant="primary" size="sm">
                    {[filters.skillLevel, filters.playingStyle, filters.location].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="primary"
                onClick={() => window.location.href = '/player-finder/create'}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Solicitud
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  placeholder="Buscar cerca de..."
                  className="w-full"
                  initialAddress={filters.location?.address || ''}
                />
              </div>

              {/* Skill Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Habilidad
                </label>
                <select
                  value={filters.skillLevel}
                  onChange={(e) => handleFilterChange({ skillLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los niveles</option>
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                  <option value="pro">Profesional</option>
                </select>
              </div>

              {/* Playing Style Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo de Juego
                </label>
                <select
                  value={filters.playingStyle}
                  onChange={(e) => handleFilterChange({ playingStyle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los estilos</option>
                  <option value="casual">Casual</option>
                  <option value="competitive">Competitivo</option>
                  <option value="training">Entrenamiento</option>
                </select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distancia Máxima: {filters.maxDistance} km
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={filters.maxDistance}
                  onChange={(e) => handleFilterChange({ maxDistance: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Filter Actions */}
            {hasActiveFilters && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Filtros activos:</span>
                  {filters.skillLevel && (
                    <Badge variant="primary" size="sm">
                      {filters.skillLevel}
                    </Badge>
                  )}
                  {filters.playingStyle && (
                    <Badge variant="primary" size="sm">
                      {filters.playingStyle}
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge variant="primary" size="sm">
                      {filters.location.city}
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
            <span className="ml-3 text-gray-600">Buscando jugadores...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay solicitudes disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters 
                ? 'Intenta cambiar los filtros o ampliar tu búsqueda.'
                : 'Sé el primero en crear una solicitud para buscar jugadores.'
              }
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} encontrada{requests.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {requests.map((request) => (
                <PlayerFinderCard
                  key={request.id}
                  request={request}
                  onRespond={handleRespond}
                  distance={request.distance}
                  matchScore={request.matchScore}
                  isOwn={request.requester?.user?.id === user?.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!isLoading && requests.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-600 mb-4">
              Crea tu propia solicitud y deja que otros jugadores te encuentren.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/player-finder/create'}
            >
              Crear mi solicitud
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerFinderPage;