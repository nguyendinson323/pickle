import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { 
  fetchTournaments, 
  fetchUserRegistrations,
  setSearchFilters,
  clearError
} from '../../store/tournamentSlice';
import { AppDispatch } from '../../store';
import TournamentSearch from '../../components/tournaments/TournamentSearch';
import TournamentList from '../../components/tournaments/TournamentList';
import Button from '../../components/ui/Button';
import { Tournament, TournamentSearchFilters } from '../../types/tournament';

const TournamentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const {
    tournaments,
    userRegistrations,
    searchFilters,
    isLoading,
    error
  } = useSelector((state: RootState) => state.tournaments);
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [states] = useState([
    { id: 1, name: 'Mexico City' },
    { id: 2, name: 'Jalisco' },
    { id: 3, name: 'Quintana Roo' },
    // Add more states as needed
  ]);

  useEffect(() => {
    // Initial load
    dispatch(fetchTournaments(searchFilters));
    
    // Load user registrations if authenticated
    if (user) {
      dispatch(fetchUserRegistrations());
    }
  }, [dispatch, user]);

  const handleFiltersChange = (newFilters: TournamentSearchFilters) => {
    dispatch(setSearchFilters(newFilters));
    dispatch(fetchTournaments(newFilters));
  };

  const handleViewTournament = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}`);
  };

  const handleRegisterForTournament = (tournament: Tournament) => {
    if (!user) {
      navigate('/login', { 
        state: { 
          returnUrl: `/tournaments/${tournament.id}`,
          message: 'Log in to register for tournaments'
        }
      });
      return;
    }
    
    navigate(`/tournaments/${tournament.id}/register`);
  };

  const handleCreateTournament = () => {
    navigate('/tournaments/create');
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  const canCreateTournament = () => {
    return user && ['admin', 'state', 'club', 'partner'].includes(user.role);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pickleball Tournaments
          </h1>
          <p className="text-gray-600">
            Discover and participate in pickleball tournaments throughout Mexico
          </p>
        </div>
        
        {canCreateTournament() && (
          <Button
            variant="primary"
            onClick={handleCreateTournament}
            className="flex items-center gap-2"
          >
            <span>➕</span>
            Create Tournament
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={clearErrorMessage}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <TournamentSearch
        filters={searchFilters}
        onFiltersChange={handleFiltersChange}
        states={states}
        isLoading={isLoading}
      />

      {/* Featured Tournaments Section */}
      {tournaments.length > 0 && !searchFilters.search && !Object.keys(searchFilters).some(key => 
        searchFilters[key as keyof TournamentSearchFilters] && 
        key !== 'page' && 
        key !== 'limit'
      ) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Featured Tournaments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.slice(0, 3).map((tournament) => (
              <div key={tournament.id} className="relative">
                {/* Featured badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ FEATURED
                  </div>
                </div>
                {/* Tournament card would go here */}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {tournaments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tournaments.filter(t => t.status === 'registration_open').length}
            </div>
            <div className="text-sm text-blue-800">Registration Open</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tournaments.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-green-800">In Progress</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {tournaments.filter(t => t.level === 'National').length}
            </div>
            <div className="text-sm text-purple-800">National Tournaments</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {user ? userRegistrations.length : 0}
            </div>
            <div className="text-sm text-yellow-800">My Registrations</div>
          </div>
        </div>
      )}

      {/* Tournament List */}
      <TournamentList
        tournaments={tournaments}
        userRegistrations={userRegistrations}
        isLoading={isLoading}
        onViewTournament={handleViewTournament}
        onRegisterForTournament={handleRegisterForTournament}
        showLoadMore={false} // Could be extended for pagination
        view="grid"
      />

      {/* Call to Action for Non-authenticated Users */}
      {!user && tournaments.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Join the Pickleball Community!
          </h3>
          <p className="text-blue-100 mb-6">
            Register to participate in tournaments, connect with other players and improve your ranking.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/registration')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Create Account
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Log In
            </Button>
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-12 bg-gray-50 rounded-xl p-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📧 Stay Informed
          </h3>
          <p className="text-gray-600 mb-6">
            Receive notifications about new tournaments and pickleball events.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button variant="primary">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            No spam. Cancel your subscription at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;