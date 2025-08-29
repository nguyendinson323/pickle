import Tournament from '../models/Tournament';
import TournamentCategory from '../models/TournamentCategory';
import TournamentRegistration from '../models/TournamentRegistration';
import TournamentMatch from '../models/TournamentMatch';
import TournamentBracket from '../models/TournamentBracket';

export const seedTournaments = async (states: any[], users: any[]): Promise<any[]> => {
  console.log('🏆 Seeding tournaments...');
  
  const federationUser = users.find(u => u.role === 'federation');
  const stateUsers = users.filter(u => u.role === 'state');
  const clubUsers = users.filter(u => u.role === 'club');
  const partnerUsers = users.filter(u => u.role === 'partner');
  const playerUsers = users.filter(u => u.role === 'player');

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const twoMonthsFromNow = new Date(today);
  twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Create tournaments with CORRECT data types
  const tournaments = await Tournament.bulkCreate([
    // National Championship - Federation
    {
      name: 'Campeonato Nacional de Pickleball 2024',
      description: 'El torneo más importante del año, donde los mejores jugadores de México compiten por el título nacional.',
      organizerType: 'federation',
      organizerId: federationUser?.id || 1,
      tournamentType: 'championship',
      level: 'national',
      stateId: states.find(s => s.code === 'CDMX')?.id,
      venueName: 'Centro Deportivo Nacional',
      venueAddress: 'Av. Río Churubusco s/n, Granjas México',
      venueCity: 'Ciudad de México',
      venueState: 'CDMX',
      startDate: formatDate(twoMonthsFromNow),
      endDate: formatDate(new Date(twoMonthsFromNow.getTime() + 3 * 24 * 60 * 60 * 1000)),
      registrationStart: formatDate(today),
      registrationEnd: formatDate(nextMonth),
      entryFee: 1500.00,
      maxParticipants: 256,
      currentParticipants: 0,
      status: 'open',
      prizePool: 150000.00,
      rulesDocument: 'https://federacionpickleball.mx/reglamentos/campeonato-nacional-2024.pdf',
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=800'
      ],
      requiresRanking: true,
      minRankingPoints: 100,
      maxRankingPoints: null,
      allowLateRegistration: false,
      enableWaitingList: true,
      registrationMessage: 'Solo jugadores federados con ranking activo pueden participar.',
      sponsorLogos: [
        'https://example.com/sponsor1.png',
        'https://example.com/sponsor2.png'
      ],
      contactEmail: 'torneos@federacionpickleball.mx',
      contactPhone: '+525551234567',
      websiteUrl: 'https://federacionpickleball.mx/campeonato-nacional-2024',
      socialMediaLinks: {
        facebook: 'https://facebook.com/events/campeonato-nacional-2024',
        instagram: 'https://instagram.com/pickleballmx'
      },
      specialInstructions: 'Presentar credencial de la federación al momento del registro.',
      weatherContingency: 'En caso de lluvia, los partidos se reprogramarán para el día siguiente.',
      transportationInfo: 'Metro Línea 9 - Estación Ciudad Deportiva. Estacionamiento disponible.',
      accommodationInfo: 'Hotel oficial: Fiesta Inn Ciudad de México. Tarifa especial para participantes.'
    },

    // State Championship - CDMX
    {
      name: 'Copa Ciudad de México Primavera 2024',
      description: 'Torneo estatal clasificatorio para el Campeonato Nacional. Abierto a todos los jugadores del estado.',
      organizerType: 'state',
      organizerId: stateUsers[0]?.id || 1,
      tournamentType: 'open',
      level: 'state',
      stateId: states.find(s => s.code === 'CDMX')?.id,
      venueName: 'Club Pickleball Ciudad de México',
      venueAddress: 'Av. Insurgentes Sur 1234, Col. Del Valle',
      venueCity: 'Ciudad de México',
      venueState: 'CDMX',
      startDate: formatDate(nextMonth),
      endDate: formatDate(new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000)),
      registrationStart: formatDate(today),
      registrationEnd: formatDate(new Date(nextMonth.getTime() - 7 * 24 * 60 * 60 * 1000)),
      entryFee: 800.00,
      maxParticipants: 128,
      currentParticipants: 45,
      status: 'open',
      prizePool: 50000.00,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      requiresRanking: false,
      allowLateRegistration: true,
      enableWaitingList: true,
      contactEmail: 'torneos@pickleballcdmx.mx',
      contactPhone: '+525554455667'
    },

    // Club Tournament
    {
      name: 'Torneo de Verano Club Elite Guadalajara',
      description: 'Torneo amistoso abierto a miembros del club y jugadores invitados. Categorías por nivel de juego.',
      organizerType: 'club',
      organizerId: clubUsers[2]?.id || clubUsers[0]?.id || 1,
      tournamentType: 'friendly',
      level: 'local',
      stateId: states.find(s => s.code === 'JAL')?.id,
      venueName: 'Club Elite Pickleball Guadalajara',
      venueAddress: 'Av. Patria 789, Col. Providencia',
      venueCity: 'Guadalajara',
      venueState: 'Jalisco',
      startDate: formatDate(new Date(nextMonth.getTime() + 15 * 24 * 60 * 60 * 1000)),
      endDate: formatDate(new Date(nextMonth.getTime() + 16 * 24 * 60 * 60 * 1000)),
      registrationStart: formatDate(today),
      registrationEnd: formatDate(new Date(nextMonth.getTime() + 10 * 24 * 60 * 60 * 1000)),
      entryFee: 500.00,
      maxParticipants: 64,
      currentParticipants: 28,
      status: 'open',
      prizePool: 20000.00,
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
      requiresRanking: false,
      allowLateRegistration: true,
      enableWaitingList: false,
      contactEmail: 'torneos@pickleballgdl.mx',
      contactPhone: '+523312233445',
      specialInstructions: 'Incluye almuerzo para todos los participantes.'
    },

    // Past Tournament - Completed
    {
      name: 'Liga Invernal Monterrey 2024',
      description: 'Liga de pickleball con formato round-robin durante 8 semanas.',
      organizerType: 'club',
      organizerId: clubUsers[1]?.id || clubUsers[0]?.id || 1,
      tournamentType: 'league',
      level: 'municipal',
      stateId: states.find(s => s.code === 'NL')?.id,
      venueName: 'Centro Deportivo Monterrey',
      venueAddress: 'Av. Constitución 456, Col. Centro',
      venueCity: 'Monterrey',
      venueState: 'Nuevo León',
      startDate: formatDate(new Date(lastMonth.getTime() - 60 * 24 * 60 * 60 * 1000)),
      endDate: formatDate(lastMonth),
      registrationStart: formatDate(new Date(lastMonth.getTime() - 90 * 24 * 60 * 60 * 1000)),
      registrationEnd: formatDate(new Date(lastMonth.getTime() - 65 * 24 * 60 * 60 * 1000)),
      entryFee: 1200.00,
      maxParticipants: 48,
      currentParticipants: 48,
      status: 'completed',
      prizePool: 30000.00,
      images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a8a?w=800'],
      requiresRanking: false,
      allowLateRegistration: false,
      enableWaitingList: false,
      contactEmail: 'info@deportesmonterrey.mx',
      contactPhone: '+528112233445'
    },

    // Partner Tournament - Resort
    {
      name: 'Torneo Internacional Riviera Maya 2024',
      description: 'Torneo internacional en el paraíso del Caribe mexicano. Incluye hospedaje y actividades.',
      organizerType: 'partner',
      organizerId: partnerUsers[1]?.id || partnerUsers[0]?.id || 1,
      tournamentType: 'open',
      level: 'national',
      stateId: states.find(s => s.code === 'QROO')?.id,
      venueName: 'Hotel Riviera Maya Resort & Spa',
      venueAddress: 'Carretera Chetumal-Puerto Juárez Km 298',
      venueCity: 'Playa del Carmen',
      venueState: 'Quintana Roo',
      startDate: formatDate(new Date(twoMonthsFromNow.getTime() + 30 * 24 * 60 * 60 * 1000)),
      endDate: formatDate(new Date(twoMonthsFromNow.getTime() + 34 * 24 * 60 * 60 * 1000)),
      registrationStart: formatDate(today),
      registrationEnd: formatDate(new Date(twoMonthsFromNow.getTime() + 15 * 24 * 60 * 60 * 1000)),
      entryFee: 2500.00,
      maxParticipants: 96,
      currentParticipants: 12,
      status: 'open',
      prizePool: 100000.00,
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'
      ],
      requiresRanking: false,
      allowLateRegistration: true,
      enableWaitingList: true,
      contactEmail: 'eventos@hotelriviera.mx',
      contactPhone: '+529984455667',
      websiteUrl: 'https://hotelriviera.mx/torneo-pickleball-2024',
      specialInstructions: 'Paquete todo incluido disponible para participantes y acompañantes.',
      accommodationInfo: 'Tarifa especial en el hotel sede. Código de descuento: PICKLEBALL2024'
    }
  ], { returning: true });

  // Create tournament categories
  const categories = await TournamentCategory.bulkCreate([
    // National Championship Categories
    {
      tournamentId: tournaments[0].id,
      name: 'Singles Varonil Abierto',
      categoryType: 'singles',
      gender: 'male',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: null,
      maxNrtpLevel: null,
      maxParticipants: 64,
      currentParticipants: 0,
      entryFee: 1500.00
    },
    {
      tournamentId: tournaments[0].id,
      name: 'Singles Femenil Abierto',
      categoryType: 'singles',
      gender: 'female',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: null,
      maxNrtpLevel: null,
      maxParticipants: 64,
      currentParticipants: 0,
      entryFee: 1500.00
    },
    {
      tournamentId: tournaments[0].id,
      name: 'Dobles Mixtos',
      categoryType: 'mixed_doubles',
      gender: 'mixed',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: null,
      maxNrtpLevel: null,
      maxParticipants: 64,
      currentParticipants: 0,
      entryFee: 1500.00
    },
    {
      tournamentId: tournaments[0].id,
      name: 'Senior 50+ Varonil',
      categoryType: 'singles',
      gender: 'male',
      ageGroup: 'senior',
      minAge: 50,
      maxAge: null,
      minNrtpLevel: null,
      maxNrtpLevel: null,
      maxParticipants: 32,
      currentParticipants: 0,
      entryFee: 1500.00
    },

    // State Championship Categories  
    {
      tournamentId: tournaments[1].id,
      name: 'Nivel 3.0 - 3.5',
      categoryType: 'singles',
      gender: 'mixed',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: '3.0',
      maxNrtpLevel: '3.5',
      maxParticipants: 32,
      currentParticipants: 12,
      entryFee: 800.00
    },
    {
      tournamentId: tournaments[1].id,
      name: 'Nivel 4.0+',
      categoryType: 'singles',
      gender: 'mixed',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: '4.0',
      maxNrtpLevel: null,
      maxParticipants: 32,
      currentParticipants: 8,
      entryFee: 800.00
    },

    // Club Tournament Categories
    {
      tournamentId: tournaments[2].id,
      name: 'Principiantes',
      categoryType: 'doubles',
      gender: 'mixed',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: null,
      maxNrtpLevel: '2.5',
      maxParticipants: 16,
      currentParticipants: 8,
      entryFee: 500.00
    },
    {
      tournamentId: tournaments[2].id,
      name: 'Intermedio',
      categoryType: 'doubles',
      gender: 'mixed',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: '3.0',
      maxNrtpLevel: '3.5',
      maxParticipants: 24,
      currentParticipants: 12,
      entryFee: 500.00
    },
    {
      tournamentId: tournaments[2].id,
      name: 'Avanzado',
      categoryType: 'doubles',
      gender: 'mixed',
      ageGroup: 'open',
      minAge: null,
      maxAge: null,
      minNrtpLevel: '4.0',
      maxNrtpLevel: null,
      maxParticipants: 24,
      currentParticipants: 8,
      entryFee: 500.00
    }
  ], { returning: true });

  // Create tournament registrations
  if (playerUsers.length >= 3) {
    await TournamentRegistration.bulkCreate([
      {
        tournamentId: tournaments[1].id, // State Championship
        categoryId: categories[4]?.id || categories[0].id,
        playerId: playerUsers[0].id,
        partnerId: null,
        registrationStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentId: null,
        registrationDate: new Date(),
        confirmationCode: 'CDMX2024-001',
        seedNumber: null,
        notes: 'Jugador local con experiencia'
      },
      {
        tournamentId: tournaments[1].id,
        categoryId: categories[5]?.id || categories[1].id,
        playerId: playerUsers[1].id,
        partnerId: null,
        registrationStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentId: null,
        registrationDate: new Date(),
        confirmationCode: 'CDMX2024-002',
        seedNumber: 2,
        notes: 'Segundo sembrado del torneo'
      },
      {
        tournamentId: tournaments[2].id, // Club Tournament
        categoryId: categories[7]?.id || categories[2].id,
        playerId: playerUsers[0].id,
        partnerId: playerUsers[2]?.id,
        registrationStatus: 'confirmed',
        paymentStatus: 'pending',
        paymentId: null,
        registrationDate: new Date(),
        confirmationCode: 'GDL2024-001',
        seedNumber: null,
        notes: 'Pareja confirmada'
      }
    ], { ignoreDuplicates: true });
  }

  console.log(`✅ Seeded ${tournaments.length} tournaments with ${categories.length} categories`);
  return { tournaments, categories };
};

export default seedTournaments;