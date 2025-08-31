import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { 
  fetchTournament, 
  fetchUserRegistrations,
  clearSelectedTournament,
  clearError
} from '../../store/tournamentSlice';
import TournamentDetails from '../../components/tournaments/TournamentDetails';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import { Tournament } from '../../types/tournament';

const TournamentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    selectedTournament,
    userRegistrations,
    isLoading,
    error
  } = useSelector((state: RootState) => state.tournaments);
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTournament(Number(id)));
      
      if (user) {
        dispatch(fetchUserRegistrations());
      }
    }

    return () => {
      dispatch(clearSelectedTournament());
    };
  }, [dispatch, id, user]);

  const handleRegister = async (tournament: Tournament, categoryId?: number) => {
    if (!user) {
      navigate('/login', { 
        state: { 
          returnUrl: `/tournaments/${tournament.id}`,
          message: 'Log in to register for tournaments'
        }
      });
      return;
    }

    setIsRegistering(true);
    
    try {
      // Navigate to registration page with optional category pre-selected
      const registerUrl = `/tournaments/${tournament.id}/register${categoryId ? `?category=${categoryId}` : ''}`;
      navigate(registerUrl);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    navigate(`/tournaments/${tournament.id}/edit`);
  };

  const handleBackToList = () => {
    navigate('/tournaments');
  };

  const handleShare = async (tournament: Tournament) => {
    const url = window.location.href;
    const title = `${tournament.name} - Pickleball Tournament`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: tournament.description,
          url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  const canEditTournament = () => {
    if (!user || !selectedTournament) return false;
    
    return user.role === 'federation' || 
           (selectedTournament.organizerType === user.role && selectedTournament.organizerId === user.id);
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading tournament...</span>
        </div>
      </div>
    );
  }

  if (error && !selectedTournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error loading tournament
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" onClick={handleBackToList}>
              Back to Tournaments
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTournament && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tournament not found
          </h2>
          <p className="text-gray-600 mb-6">
            The tournament you are looking for does not exist or has been deleted.
          </p>
          <Button variant="primary" onClick={handleBackToList}>
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Tournaments
              </button>
            </div>
            
            {selectedTournament && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(selectedTournament)}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </Button>
                
                {canEditTournament() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(selectedTournament)}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && selectedTournament && (
        <div className="container mx-auto px-4 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
        </div>
      )}

      {/* Main Content */}
      {selectedTournament && (
        <div className="container mx-auto px-4 py-8">
          <TournamentDetails
            tournament={selectedTournament}
            userRegistrations={userRegistrations}
            onRegister={handleRegister}
            onEdit={canEditTournament() ? handleEdit : undefined}
            canEdit={canEditTournament()}
            isRegistering={isRegistering}
          />
        </div>
      )}

      {/* Related Tournaments */}
      {selectedTournament && (
        <div className="bg-white border-t border-gray-200 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Tournaments
            </h2>
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>You will soon see similar tournaments here</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Call to Action */}
      {selectedTournament && !userRegistrations.some(reg => reg.tournamentId === selectedTournament.id) && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-12">
          <div className="container mx-auto px-4 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to compete?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join {selectedTournament.name} and become part of Mexico's most active pickleball community.
            </p>
            {user ? (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleRegister(selectedTournament)}
                disabled={isRegistering}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                {isRegistering ? 'Processing...' : 'Register Now'}
              </Button>
            ) : (
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/registration')}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Create Account
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Log In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentDetailsPage;