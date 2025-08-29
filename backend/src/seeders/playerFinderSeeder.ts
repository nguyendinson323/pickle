import PlayerLocation from '../models/PlayerLocation';
import PlayerPrivacySetting from '../models/PlayerPrivacySetting';
import PlayerFinderRequest from '../models/PlayerFinderRequest';
import PlayerFinderMatch from '../models/PlayerFinderMatch';
import Player from '../models/Player';

export const seedPlayerFinder = async (users: any[], states: any[]): Promise<any> => {
  console.log('📍 Seeding player finder data...');
  
  // Get all players
  const playerUsers = users.filter(u => u.role === 'player');
  const players = await Player.findAll({
    where: {
      userId: playerUsers.map(u => u.id)
    }
  });

  if (players.length === 0) {
    console.log('⚠️ No players found, skipping player finder data');
    return {};
  }

  // Create player locations with proper data types
  const playerLocations = await PlayerLocation.bulkCreate([
    {
      playerId: players[0].id,
      locationType: 'current',
      latitude: 19.4326,
      longitude: -99.1332,
      city: 'Ciudad de México',
      state: 'CDMX',
      country: 'México',
      postalCode: '06600',
      address: 'Colonia Juárez, Cuauhtémoc',
      radiusKm: 10,
      isActive: true,
      lastUpdated: new Date()
    },
    {
      playerId: players[1].id,
      locationType: 'current',
      latitude: 20.6597,
      longitude: -103.3496,
      city: 'Guadalajara',
      state: 'Jalisco',
      country: 'México',
      postalCode: '44100',
      address: 'Centro Histórico',
      radiusKm: 15,
      isActive: true,
      lastUpdated: new Date()
    },
    {
      playerId: players[2].id,
      locationType: 'current',
      latitude: 25.6866,
      longitude: -100.3161,
      city: 'Monterrey',
      state: 'Nuevo León',
      country: 'México',
      postalCode: '64000',
      address: 'Centro de Monterrey',
      radiusKm: 20,
      isActive: true,
      lastUpdated: new Date()
    },
    {
      playerId: players[0].id,
      locationType: 'travel',
      latitude: 20.6296,
      longitude: -87.0739,
      city: 'Playa del Carmen',
      state: 'Quintana Roo',
      country: 'México',
      postalCode: '77710',
      address: 'Playacar',
      radiusKm: 25,
      isActive: true,
      lastUpdated: new Date(),
      travelStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      travelEndDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000)
    },
    {
      playerId: players[3]?.id || players[0].id,
      locationType: 'home',
      latitude: 19.3911,
      longitude: -99.1407,
      city: 'Ciudad de México',
      state: 'CDMX',
      country: 'México',
      postalCode: '03100',
      address: 'Colonia Del Valle',
      radiusKm: 5,
      isActive: true,
      lastUpdated: new Date()
    }
  ], { returning: true });

  // Create player privacy settings
  const privacySettings = await PlayerPrivacySetting.bulkCreate([
    {
      playerId: players[0].id,
      canBeFound: true,
      showFullName: true,
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showNrtpLevel: true,
      showRanking: true,
      showClubAffiliation: true,
      showPlaySchedule: true,
      allowDirectMessages: true,
      allowMatchRequests: true,
      blockedPlayers: [],
      preferredContactMethod: 'in_app',
      availableDays: ['monday', 'wednesday', 'friday', 'saturday', 'sunday'],
      availableTimeSlots: {
        monday: ['18:00-20:00'],
        wednesday: ['18:00-20:00'],
        friday: ['17:00-21:00'],
        saturday: ['08:00-12:00', '16:00-20:00'],
        sunday: ['08:00-14:00']
      },
      playStyle: 'competitive',
      lookingFor: ['singles', 'doubles', 'mixed_doubles']
    },
    {
      playerId: players[1].id,
      canBeFound: true,
      showFullName: true,
      showEmail: true,
      showPhone: false,
      showLocation: true,
      showNrtpLevel: true,
      showRanking: true,
      showClubAffiliation: true,
      showPlaySchedule: false,
      allowDirectMessages: true,
      allowMatchRequests: true,
      blockedPlayers: [],
      preferredContactMethod: 'email',
      availableDays: ['tuesday', 'thursday', 'saturday', 'sunday'],
      availableTimeSlots: {
        tuesday: ['07:00-09:00'],
        thursday: ['07:00-09:00'],
        saturday: ['10:00-14:00'],
        sunday: ['10:00-14:00']
      },
      playStyle: 'recreational',
      lookingFor: ['doubles', 'mixed_doubles']
    },
    {
      playerId: players[2].id,
      canBeFound: false,
      showFullName: false,
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showNrtpLevel: false,
      showRanking: false,
      showClubAffiliation: false,
      showPlaySchedule: false,
      allowDirectMessages: false,
      allowMatchRequests: false,
      blockedPlayers: [],
      preferredContactMethod: 'none',
      availableDays: [],
      availableTimeSlots: {},
      playStyle: 'competitive',
      lookingFor: []
    },
    {
      playerId: players[3]?.id || players[0].id,
      canBeFound: true,
      showFullName: true,
      showEmail: false,
      showPhone: true,
      showLocation: true,
      showNrtpLevel: true,
      showRanking: true,
      showClubAffiliation: false,
      showPlaySchedule: true,
      allowDirectMessages: true,
      allowMatchRequests: true,
      blockedPlayers: [],
      preferredContactMethod: 'phone',
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableTimeSlots: {
        monday: ['06:00-08:00', '19:00-21:00'],
        tuesday: ['06:00-08:00', '19:00-21:00'],
        wednesday: ['06:00-08:00', '19:00-21:00'],
        thursday: ['06:00-08:00', '19:00-21:00'],
        friday: ['06:00-08:00', '19:00-21:00']
      },
      playStyle: 'both',
      lookingFor: ['singles', 'doubles']
    }
  ], { returning: true });

  // Create player finder requests
  const finderRequests = await PlayerFinderRequest.bulkCreate([
    {
      requesterId: players[0].id,
      locationId: playerLocations[0].id,
      requestType: 'immediate',
      playType: 'singles',
      skillLevel: '3.5',
      preferredDate: new Date(),
      preferredTimeStart: '18:00',
      preferredTimeEnd: '20:00',
      radiusKm: 10,
      status: 'active',
      message: 'Buscando jugador para partido de singles esta tarde. Nivel intermedio.',
      courtPreference: 'any',
      isRecurring: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      requesterId: players[1].id,
      locationId: playerLocations[1].id,
      requestType: 'scheduled',
      playType: 'doubles',
      skillLevel: '4.0',
      preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      preferredTimeStart: '10:00',
      preferredTimeEnd: '12:00',
      radiusKm: 15,
      status: 'active',
      message: 'Necesitamos una pareja más para dobles el sábado. Nivel avanzado.',
      courtPreference: 'indoor',
      isRecurring: false,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      requesterId: players[0].id,
      locationId: playerLocations[3].id,
      requestType: 'travel',
      playType: 'mixed_doubles',
      skillLevel: '3.5',
      preferredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      preferredTimeStart: '16:00',
      preferredTimeEnd: '18:00',
      radiusKm: 25,
      status: 'active',
      message: 'Estaré en Playa del Carmen el próximo mes. Buscando jugadores locales para partidos amistosos.',
      courtPreference: 'outdoor',
      isRecurring: false,
      expiresAt: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000)
    },
    {
      requesterId: players[3]?.id || players[0].id,
      locationId: playerLocations[4]?.id || playerLocations[0].id,
      requestType: 'recurring',
      playType: 'singles',
      skillLevel: '4.5',
      preferredDate: new Date(),
      preferredTimeStart: '06:00',
      preferredTimeEnd: '08:00',
      radiusKm: 5,
      status: 'active',
      message: 'Buscando compañero regular para entrenar por las mañanas entre semana.',
      courtPreference: 'any',
      isRecurring: true,
      recurringDays: ['monday', 'wednesday', 'friday'],
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    },
    {
      requesterId: players[1].id,
      locationId: playerLocations[1].id,
      requestType: 'immediate',
      playType: 'doubles',
      skillLevel: '4.0',
      preferredDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      preferredTimeStart: '10:00',
      preferredTimeEnd: '12:00',
      radiusKm: 15,
      status: 'expired',
      message: 'Buscando pareja para dobles.',
      courtPreference: 'any',
      isRecurring: false,
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ], { returning: true });

  // Create player finder matches
  const finderMatches = await PlayerFinderMatch.bulkCreate([
    {
      requestId: finderRequests[0].id,
      playerId: players[3]?.id || players[1].id,
      matchScore: 0.85,
      distanceKm: 3.5,
      status: 'pending',
      matchedAt: new Date(),
      matchCriteria: {
        skillLevelMatch: true,
        availabilityMatch: true,
        distanceMatch: true,
        playTypeMatch: true
      },
      playerMessage: null
    },
    {
      requestId: finderRequests[0].id,
      playerId: players[4]?.id || players[2].id,
      matchScore: 0.72,
      distanceKm: 8.2,
      status: 'pending',
      matchedAt: new Date(),
      matchCriteria: {
        skillLevelMatch: true,
        availabilityMatch: false,
        distanceMatch: true,
        playTypeMatch: true
      },
      playerMessage: null
    },
    {
      requestId: finderRequests[1].id,
      playerId: players[0].id,
      matchScore: 0.90,
      distanceKm: 0,
      status: 'accepted',
      matchedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      matchCriteria: {
        skillLevelMatch: true,
        availabilityMatch: true,
        distanceMatch: true,
        playTypeMatch: true
      },
      playerMessage: '¡Perfecto! Cuenten conmigo para el sábado.',
      acceptedAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
    },
    {
      requestId: finderRequests[1].id,
      playerId: players[2].id,
      matchScore: 0.65,
      distanceKm: 12.0,
      status: 'rejected',
      matchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      matchCriteria: {
        skillLevelMatch: false,
        availabilityMatch: true,
        distanceMatch: true,
        playTypeMatch: true
      },
      playerMessage: 'No puedo ese día, gracias.',
      rejectedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      rejectionReason: 'not_available'
    },
    {
      requestId: finderRequests[3].id,
      playerId: players[1].id,
      matchScore: 0.78,
      distanceKm: 4.5,
      status: 'contacted',
      matchedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      matchCriteria: {
        skillLevelMatch: true,
        availabilityMatch: true,
        distanceMatch: true,
        playTypeMatch: true
      },
      playerMessage: 'Me interesa. ¿Podemos hablar por teléfono para coordinar?',
      contactedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  ], { returning: true });

  console.log(`✅ Seeded ${playerLocations.length} locations, ${privacySettings.length} privacy settings, ${finderRequests.length} finder requests, and ${finderMatches.length} matches`);
  return { playerLocations, privacySettings, finderRequests, finderMatches };
};

export default seedPlayerFinder;