import Ranking, { RankingCategory, RankingType } from '../models/Ranking';
import RankingHistory from '../models/RankingHistory';
import Credential from '../models/Credential';
import PointCalculation from '../models/PointCalculation';
import Player from '../models/Player';

export const seedRankingsAndCredentials = async (users: any[], states: any[]): Promise<any> => {
  console.log('🏅 Seeding rankings and credentials...');
  
  // Get all players
  const playerUsers = users.filter(u => u.role === 'player');
  const players = await Player.findAll({
    where: {
      userId: playerUsers.map(u => u.id)
    }
  });

  if (players.length === 0) {
    console.log('⚠️ No players found, skipping rankings');
    return { rankings: [], credentials: [] };
  }

  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  // Create rankings with CORRECT enum values and decimal types
  const rankings = await Ranking.bulkCreate([
    // National Overall Rankings
    {
      playerId: players[0].id,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.NATIONAL,
      position: 25,
      points: 1250.50,
      previousPosition: 28,
      previousPoints: 1180.00,
      stateId: null,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 8,
      lastTournamentDate: lastMonth,
      activityBonus: 50.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },
    {
      playerId: players[1].id,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.NATIONAL,
      position: 12,
      points: 1850.75,
      previousPosition: 15,
      previousPoints: 1720.00,
      stateId: null,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 12,
      lastTournamentDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      activityBonus: 75.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },
    {
      playerId: players[2].id,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.NATIONAL,
      position: 45,
      points: 890.25,
      previousPosition: 42,
      previousPoints: 920.00,
      stateId: null,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 5,
      lastTournamentDate: twoMonthsAgo,
      activityBonus: 25.00,
      decayFactor: 0.95,
      lastCalculated: today,
      isActive: true
    },

    // State Rankings
    {
      playerId: players[0].id,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.STATE,
      position: 3,
      points: 1250.50,
      previousPosition: 4,
      previousPoints: 1180.00,
      stateId: states.find(s => s.code === 'CDMX')?.id,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 8,
      lastTournamentDate: lastMonth,
      activityBonus: 50.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },
    {
      playerId: players[1].id,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.STATE,
      position: 1,
      points: 1850.75,
      previousPosition: 2,
      previousPoints: 1720.00,
      stateId: states.find(s => s.code === 'JAL')?.id,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 12,
      lastTournamentDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      activityBonus: 75.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },

    // Singles Rankings
    {
      playerId: players[0].id,
      rankingType: RankingType.SINGLES,
      category: RankingCategory.NATIONAL,
      position: 22,
      points: 1320.00,
      previousPosition: 25,
      previousPoints: 1250.00,
      stateId: null,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 6,
      lastTournamentDate: lastMonth,
      activityBonus: 40.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },
    {
      playerId: players[1].id,
      rankingType: RankingType.SINGLES,
      category: RankingCategory.NATIONAL,
      position: 10,
      points: 1920.00,
      previousPosition: 12,
      previousPoints: 1850.00,
      stateId: null,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 10,
      lastTournamentDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      activityBonus: 70.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },

    // Doubles Rankings
    {
      playerId: players[0].id,
      rankingType: RankingType.DOUBLES,
      category: RankingCategory.NATIONAL,
      position: 28,
      points: 1180.00,
      previousPosition: 30,
      previousPoints: 1100.00,
      stateId: null,
      ageGroup: null,
      gender: null,
      tournamentsPlayed: 5,
      lastTournamentDate: lastMonth,
      activityBonus: 30.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },

    // Gender-specific ranking
    {
      playerId: players[1].id,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.GENDER,
      position: 5,
      points: 1850.75,
      previousPosition: 6,
      previousPoints: 1720.00,
      stateId: null,
      ageGroup: null,
      gender: 'F',
      tournamentsPlayed: 12,
      lastTournamentDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      activityBonus: 75.00,
      decayFactor: 1.0,
      lastCalculated: today,
      isActive: true
    },

    // Age group ranking
    {
      playerId: players[2].id,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.AGE_GROUP,
      position: 8,
      points: 890.25,
      previousPosition: 7,
      previousPoints: 920.00,
      stateId: null,
      ageGroup: '35-39',
      gender: null,
      tournamentsPlayed: 5,
      lastTournamentDate: twoMonthsAgo,
      activityBonus: 25.00,
      decayFactor: 0.95,
      lastCalculated: today,
      isActive: true
    }
  ], { returning: true });

  // Create ranking history
  const rankingHistory = await RankingHistory.bulkCreate([
    {
      rankingId: rankings[0].id,
      playerId: players[0].id,
      position: 28,
      points: 1180.00,
      tournamentsPlayed: 7,
      calculationDate: lastMonth,
      periodStart: twoMonthsAgo,
      periodEnd: lastMonth,
      changes: {
        tournamentsAdded: ['Copa CDMX', 'Torneo Primavera'],
        pointsGained: 150,
        positionChange: 3
      }
    },
    {
      rankingId: rankings[1].id,
      playerId: players[1].id,
      position: 15,
      points: 1720.00,
      tournamentsPlayed: 11,
      calculationDate: lastMonth,
      periodStart: twoMonthsAgo,
      periodEnd: lastMonth,
      changes: {
        tournamentsAdded: ['Nacional Sub-23', 'Abierto Jalisco'],
        pointsGained: 200,
        positionChange: 3
      }
    }
  ], { ignoreDuplicates: true });

  // Create point calculations
  const pointCalculations = await PointCalculation.bulkCreate([
    {
      playerId: players[0].id,
      tournamentId: 1,
      rankingType: RankingType.OVERALL,
      category: RankingCategory.NATIONAL,
      basePoints: 100.00,
      bonusPoints: 20.00,
      penaltyPoints: 0.00,
      totalPoints: 120.00,
      calculationDate: lastMonth,
      tournamentResult: 'quarterfinals',
      opponentsDefeated: 3,
      averageOpponentRanking: 35.5,
      performanceMultiplier: 1.2,
      metadata: {
        tournamentLevel: 'state',
        tournamentType: 'open',
        participants: 64
      }
    },
    {
      playerId: players[1].id,
      tournamentId: 1,
      rankingType: RankingType.SINGLES,
      category: RankingCategory.NATIONAL,
      basePoints: 150.00,
      bonusPoints: 30.00,
      penaltyPoints: 0.00,
      totalPoints: 180.00,
      calculationDate: lastMonth,
      tournamentResult: 'finals',
      opponentsDefeated: 5,
      averageOpponentRanking: 18.2,
      performanceMultiplier: 1.5,
      metadata: {
        tournamentLevel: 'state',
        tournamentType: 'open',
        participants: 64,
        finalPosition: 2
      }
    }
  ], { ignoreDuplicates: true });

  // Create digital credentials with proper data types
  const credentials = await Credential.bulkCreate([
    {
      userId: playerUsers[0].id,
      credentialType: 'player',
      credentialNumber: 'FPM-2024-001',
      issueDate: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(today.getTime() + 185 * 24 * 60 * 60 * 1000),
      status: 'active',
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
      verificationCode: 'VER-FPM-001-2024',
      digitalSignature: 'signature_hash_player1',
      metadata: {
        fullName: 'Carlos Rodríguez García',
        stateAffiliation: 'Ciudad de México',
        nrtpLevel: '3.5',
        rankingPosition: 25,
        clubAffiliation: 'Independiente',
        nationality: 'Mexicana',
        profilePhoto: 'https://example.com/photos/player1.jpg'
      }
    },
    {
      userId: playerUsers[1].id,
      credentialType: 'player',
      credentialNumber: 'FPM-2024-002',
      issueDate: new Date(today.getTime() - 200 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(today.getTime() + 165 * 24 * 60 * 60 * 1000),
      status: 'active',
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
      verificationCode: 'VER-FPM-002-2024',
      digitalSignature: 'signature_hash_player2',
      metadata: {
        fullName: 'María Elena Sánchez López',
        stateAffiliation: 'Jalisco',
        nrtpLevel: '4.0',
        rankingPosition: 12,
        clubAffiliation: 'Club Elite Guadalajara',
        nationality: 'Mexicana',
        profilePhoto: 'https://example.com/photos/player2.jpg'
      }
    },
    {
      userId: users.find(u => u.role === 'coach')?.id,
      credentialType: 'coach',
      credentialNumber: 'FPM-ENT-2024-001',
      issueDate: new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000),
      expiryDate: oneYearFromNow(),
      status: 'active',
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
      verificationCode: 'VER-FPM-ENT-001-2024',
      digitalSignature: 'signature_hash_coach1',
      metadata: {
        fullName: 'Ana Patricia González Ruiz',
        stateAffiliation: 'Ciudad de México',
        nrtpLevel: '5.0',
        licenseType: 'Nivel 2 - Instructor Avanzado',
        rankingPosition: 3,
        nationality: 'Mexicana',
        certifications: ['Certificación Internacional ITF', 'Primeros Auxilios Deportivos'],
        profilePhoto: 'https://example.com/photos/coach1.jpg'
      }
    },
    {
      userId: users.find(u => u.role === 'club')?.id,
      credentialType: 'organization',
      credentialNumber: 'FPM-CLUB-2024-001',
      issueDate: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(today.getTime() + 185 * 24 * 60 * 60 * 1000),
      status: 'active',
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
      verificationCode: 'VER-FPM-CLUB-001-2024',
      digitalSignature: 'signature_hash_club1',
      metadata: {
        organizationName: 'Club Pickleball Ciudad de México',
        stateAffiliation: 'Ciudad de México',
        clubType: 'Privado',
        membershipType: 'Premium',
        activePlayers: 125,
        courts: 2,
        logo: 'https://example.com/logos/club1.png'
      }
    },
    {
      userId: playerUsers[2]?.id,
      credentialType: 'player',
      credentialNumber: 'FPM-2024-003',
      issueDate: new Date(today.getTime() - 400 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000),
      status: 'expired',
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
      verificationCode: 'VER-FPM-003-2024',
      digitalSignature: 'signature_hash_player3',
      metadata: {
        fullName: 'Roberto Martínez Hernández',
        stateAffiliation: 'Nuevo León',
        nrtpLevel: '3.0',
        rankingPosition: 45,
        clubAffiliation: 'Centro Deportivo Monterrey',
        nationality: 'Mexicana',
        profilePhoto: 'https://example.com/photos/player3.jpg'
      }
    }
  ], { returning: true });

  console.log(`✅ Seeded ${rankings.length} rankings, ${rankingHistory.length} history records, ${pointCalculations.length} point calculations, and ${credentials.length} credentials`);
  return { rankings, rankingHistory, pointCalculations, credentials };
};

function oneYearFromNow(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
}

export default seedRankingsAndCredentials;