import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TournamentBracket from '../../components/tournaments/TournamentBracket';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAppSelector } from '../../store';

interface Tournament {
  id: number;
  name: string;
  categories: TournamentCategory[];
}

interface TournamentCategory {
  id: number;
  name: string;
  bracketType: 'single_elimination' | 'double_elimination' | 'round_robin';
}

const TournamentBracketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch tournament data from API
        const response = await fetch(`/api/tournaments/${id}`);
        if (!response.ok) throw new Error('Failed to fetch tournament');
        
        const tournamentData: Tournament = await response.json();
        setTournament(tournamentData);
        
        // Set selected category from URL param or default to first category
        const category = categoryId 
          ? tournamentData.categories.find(cat => cat.id === parseInt(categoryId))
          : tournamentData.categories[0];
          
        if (category) {
          setSelectedCategory(category);
        } else {
          setError('Tournament category not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tournament');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id, categoryId]);

  const handleMatchUpdate = async (matchId: number, score: any) => {
    try {
      await fetch(`/api/matches/${matchId}/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(score),
      });
      // Optionally refresh bracket data
    } catch (err) {
      console.error('Failed to update match score:', err);
    }
  };

  // Determine if user can manage this tournament
  const canManage = user && (
    user.role === 'admin' ||
    user.role === 'state' ||
    user.role === 'club' ||
    user.role === 'partner'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tournament</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!tournament || !selectedCategory) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Tournament Data</h2>
          <p className="text-gray-600">Tournament or category not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournament.name}</h1>
        <h2 className="text-xl text-gray-600">{selectedCategory.name} - Tournament Bracket</h2>
      </div>
      
      <TournamentBracket
        tournamentId={tournament.id}
        categoryId={selectedCategory.id}
        categoryName={selectedCategory.name}
        bracketType={selectedCategory.bracketType}
        canManage={canManage || false}
        onMatchUpdate={handleMatchUpdate}
      />
    </div>
  );
};

export default TournamentBracketPage;