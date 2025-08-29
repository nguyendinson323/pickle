import TournamentMatch from '../models/TournamentMatch';
import TournamentBracket from '../models/TournamentBracket';

export const seedTournamentMatches = async (tournaments: any[], categories: any[], users: any[], courts: any[]): Promise<any> => {
  console.log('🎾 Seeding tournament matches and brackets...');
  
  const playerUsers = users.filter(u => u.role === 'player');
  const coachUsers = users.filter(u => u.role === 'coach');
  
  if (tournaments.length === 0 || categories.length === 0) {
    console.log('⚠️ No tournaments or categories found');
    return {};
  }

  // Create tournament brackets with proper data types
  const brackets = await TournamentBracket.bulkCreate([
    {
      tournamentId: tournaments[0]?.id,
      categoryId: categories[0]?.id,
      bracketType: 'single_elimination',
      name: 'Cuadro Principal - Singles Varonil',
      round: 'round_of_16',
      position: 1,
      totalRounds: 4,
      currentRound: 1,
      bracketData: {
        seeds: [
          { position: 1, playerId: playerUsers[0]?.id, playerName: 'Carlos Rodríguez' },
          { position: 2, playerId: playerUsers[1]?.id, playerName: 'María Sánchez' },
          { position: 3, playerId: playerUsers[2]?.id, playerName: 'Roberto Martínez' },
          { position: 4, playerId: playerUsers[3]?.id, playerName: 'María Santos' }
        ],
        structure: 'standard',
        consolationBracket: false
      },
      isComplete: false,
      winnerPlayerId: null,
      runnerUpPlayerId: null
    },
    {
      tournamentId: tournaments[0]?.id,
      categoryId: categories[2]?.id,
      bracketType: 'double_elimination',
      name: 'Cuadro Principal - Dobles Mixtos',
      round: 'quarterfinals',
      position: 1,
      totalRounds: 3,
      currentRound: 2,
      bracketData: {
        seeds: [
          { position: 1, team: [playerUsers[0]?.id, playerUsers[1]?.id] },
          { position: 2, team: [playerUsers[2]?.id, playerUsers[3]?.id] }
        ],
        structure: 'double_elimination',
        winnersB bracket: true,
        losersBracket: true
      },
      isComplete: false,
      winnerPlayerId: null,
      runnerUpPlayerId: null
    },
    {
      tournamentId: tournaments[3]?.id, // Completed tournament
      categoryId: categories[6]?.id || categories[0]?.id,
      bracketType: 'round_robin',
      name: 'Grupo A - Liga',
      round: 'group_stage',
      position: 1,
      totalRounds: 1,
      currentRound: 1,
      bracketData: {
        groupSize: 4,
        qualifyingPositions: 2,
        standings: [
          { position: 1, playerId: playerUsers[1]?.id, points: 9, wins: 3, losses: 0 },
          { position: 2, playerId: playerUsers[0]?.id, points: 6, wins: 2, losses: 1 },
          { position: 3, playerId: playerUsers[2]?.id, points: 3, wins: 1, losses: 2 },
          { position: 4, playerId: playerUsers[3]?.id, points: 0, wins: 0, losses: 3 }
        ]
      },
      isComplete: true,
      winnerPlayerId: playerUsers[1]?.id,
      runnerUpPlayerId: playerUsers[0]?.id,
      completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ], { returning: true });

  // Create tournament matches with proper enums and data types
  const matches = await TournamentMatch.bulkCreate([
    // Active tournament matches
    {
      tournamentId: tournaments[0]?.id,
      categoryId: categories[0]?.id,
      bracketId: brackets[0]?.id,
      matchType: 'singles',
      round: 'round_of_16',
      matchNumber: 1,
      courtId: courts[0]?.id,
      player1Id: playerUsers[0]?.id,
      player2Id: playerUsers[4]?.id || playerUsers[2]?.id,
      player1PartnerId: null,
      player2PartnerId: null,
      scheduledDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTime: '10:00',
      status: 'scheduled',
      scores: [],
      winnerId: null,
      loserId: null,
      matchDuration: null,
      refereeId: coachUsers[0]?.id,
      notes: 'Partido inaugural del torneo'
    },
    {
      tournamentId: tournaments[0]?.id,
      categoryId: categories[0]?.id,
      bracketId: brackets[0]?.id,
      matchType: 'singles',
      round: 'round_of_16',
      matchNumber: 2,
      courtId: courts[1]?.id,
      player1Id: playerUsers[1]?.id,
      player2Id: playerUsers[3]?.id || playerUsers[0]?.id,
      player1PartnerId: null,
      player2PartnerId: null,
      scheduledDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTime: '10:00',
      status: 'scheduled',
      scores: [],
      winnerId: null,
      loserId: null,
      matchDuration: null,
      refereeId: coachUsers[1]?.id || coachUsers[0]?.id,
      notes: null
    },
    
    // In-progress match
    {
      tournamentId: tournaments[1]?.id,
      categoryId: categories[4]?.id || categories[0]?.id,
      bracketId: null,
      matchType: 'singles',
      round: 'semifinals',
      matchNumber: 3,
      courtId: courts[0]?.id,
      player1Id: playerUsers[0]?.id,
      player2Id: playerUsers[1]?.id,
      player1PartnerId: null,
      player2PartnerId: null,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '14:00',
      actualStartTime: new Date(Date.now() - 30 * 60 * 1000),
      status: 'in_progress',
      scores: [
        { set: 1, player1Score: 11, player2Score: 9, winner: 'player1' },
        { set: 2, player1Score: 8, player2Score: 11, winner: 'player2' },
        { set: 3, player1Score: 5, player2Score: 4, winner: null }
      ],
      winnerId: null,
      loserId: null,
      matchDuration: null,
      refereeId: coachUsers[0]?.id,
      notes: 'Partido muy reñido'
    },

    // Completed matches
    {
      tournamentId: tournaments[3]?.id,
      categoryId: categories[6]?.id || categories[0]?.id,
      bracketId: brackets[2]?.id,
      matchType: 'doubles',
      round: 'group_stage',
      matchNumber: 1,
      courtId: courts[2]?.id,
      player1Id: playerUsers[0]?.id,
      player2Id: playerUsers[1]?.id,
      player1PartnerId: playerUsers[2]?.id,
      player2PartnerId: playerUsers[3]?.id || playerUsers[0]?.id,
      scheduledDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTime: '09:00',
      actualStartTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
      actualEndTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000 + 10.5 * 60 * 60 * 1000),
      status: 'completed',
      scores: [
        { set: 1, player1Score: 11, player2Score: 7, winner: 'player1' },
        { set: 2, player1Score: 11, player2Score: 9, winner: 'player1' }
      ],
      winnerId: playerUsers[0]?.id,
      loserId: playerUsers[1]?.id,
      matchDuration: 90,
      refereeId: coachUsers[0]?.id,
      notes: 'Victoria contundente del equipo 1',
      statisticsData: {
        player1: {
          aces: 5,
          winners: 18,
          errors: 12,
          firstServePercentage: 68
        },
        player2: {
          aces: 2,
          winners: 14,
          errors: 16,
          firstServePercentage: 55
        }
      }
    },
    {
      tournamentId: tournaments[3]?.id,
      categoryId: categories[6]?.id || categories[0]?.id,
      bracketId: brackets[2]?.id,
      matchType: 'doubles',
      round: 'group_stage',
      matchNumber: 2,
      courtId: courts[2]?.id,
      player1Id: playerUsers[1]?.id,
      player2Id: playerUsers[2]?.id,
      player1PartnerId: playerUsers[3]?.id || playerUsers[0]?.id,
      player2PartnerId: playerUsers[4]?.id || playerUsers[1]?.id,
      scheduledDate: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTime: '11:00',
      actualStartTime: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
      actualEndTime: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
      status: 'completed',
      scores: [
        { set: 1, player1Score: 11, player2Score: 13, winner: 'player2' },
        { set: 2, player1Score: 11, player2Score: 8, winner: 'player1' },
        { set: 3, player1Score: 15, player2Score: 13, winner: 'player1' }
      ],
      winnerId: playerUsers[1]?.id,
      loserId: playerUsers[2]?.id,
      matchDuration: 120,
      refereeId: coachUsers[1]?.id || coachUsers[0]?.id,
      notes: 'Partido épico de 3 sets con remontada',
      statisticsData: {
        player1: {
          aces: 8,
          winners: 25,
          errors: 18,
          firstServePercentage: 72
        },
        player2: {
          aces: 6,
          winners: 22,
          errors: 20,
          firstServePercentage: 65
        }
      }
    },

    // Walkover/Forfeit example
    {
      tournamentId: tournaments[1]?.id,
      categoryId: categories[5]?.id || categories[1]?.id,
      bracketId: null,
      matchType: 'singles',
      round: 'quarterfinals',
      matchNumber: 4,
      courtId: courts[0]?.id,
      player1Id: playerUsers[2]?.id,
      player2Id: playerUsers[3]?.id || playerUsers[1]?.id,
      player1PartnerId: null,
      player2PartnerId: null,
      scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTime: '16:00',
      status: 'walkover',
      scores: [],
      winnerId: playerUsers[2]?.id,
      loserId: playerUsers[3]?.id || playerUsers[1]?.id,
      matchDuration: 0,
      refereeId: null,
      notes: 'Jugador 2 no se presentó - WO',
      forfeitedBy: playerUsers[3]?.id || playerUsers[1]?.id,
      forfeitReason: 'no_show'
    },

    // Cancelled match
    {
      tournamentId: tournaments[1]?.id,
      categoryId: categories[4]?.id || categories[0]?.id,
      bracketId: null,
      matchType: 'singles',
      round: 'round_of_32',
      matchNumber: 5,
      courtId: courts[1]?.id,
      player1Id: playerUsers[0]?.id,
      player2Id: playerUsers[4]?.id || playerUsers[2]?.id,
      player1PartnerId: null,
      player2PartnerId: null,
      scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTime: '18:00',
      status: 'cancelled',
      scores: [],
      winnerId: null,
      loserId: null,
      matchDuration: null,
      refereeId: coachUsers[0]?.id,
      notes: 'Cancelado por lluvia',
      cancelledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
      cancelReason: 'weather'
    },

    // Mixed doubles match
    {
      tournamentId: tournaments[0]?.id,
      categoryId: categories[2]?.id,
      bracketId: brackets[1]?.id,
      matchType: 'mixed_doubles',
      round: 'quarterfinals',
      matchNumber: 1,
      courtId: courts[0]?.id,
      player1Id: playerUsers[0]?.id,
      player2Id: playerUsers[2]?.id,
      player1PartnerId: playerUsers[1]?.id,
      player2PartnerId: playerUsers[3]?.id || playerUsers[0]?.id,
      scheduledDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTime: '14:00',
      status: 'scheduled',
      scores: [],
      winnerId: null,
      loserId: null,
      matchDuration: null,
      refereeId: coachUsers[0]?.id,
      notes: 'Cuartos de final dobles mixtos'
    }
  ], { returning: true });

  console.log(`✅ Seeded ${brackets.length} tournament brackets and ${matches.length} tournament matches`);
  return { brackets, matches };
};

export default seedTournamentMatches;