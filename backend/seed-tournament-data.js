const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  'pickleball_federation',
  'postgres', 
  'password',
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

async function seedTournamentData() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Clear existing tournament data
    console.log('Clearing existing tournament data...');
    await sequelize.query('DELETE FROM tournament_matches CASCADE');
    await sequelize.query('DELETE FROM tournament_brackets CASCADE');
    await sequelize.query('DELETE FROM tournament_registrations CASCADE');
    await sequelize.query('DELETE FROM tournament_categories CASCADE');
    await sequelize.query('DELETE FROM tournaments CASCADE');

    console.log('Creating tournaments...');

    // Sample Tournaments
    const tournaments = [
      {
        name: 'Mexican National Championship 2024',
        description: 'Annual national championship featuring the best players from across Mexico. Multiple categories for all skill levels.',
        organizer_type: 'federation',
        organizer_id: 1,
        tournament_type: 'championship',
        level: 'national',
        state_id: 1,
        venue_name: 'Centro Nacional de Pickleball',
        venue_address: 'Av. Insurgentes Sur 1234, CDMX',
        venue_city: 'Ciudad de México',
        venue_state: 'CDMX',
        start_date: new Date('2024-03-15'),
        end_date: new Date('2024-03-17'),
        registration_start: new Date('2024-01-15'),
        registration_end: new Date('2024-03-01'),
        entry_fee: 500.00,
        max_participants: 256,
        current_participants: 0,
        status: 'open',
        prize_pool: 50000.00,
        images: JSON.stringify(['https://pickleball-images.com/tournament1.jpg']),
        requires_ranking: true,
        min_ranking_points: 100,
        allow_late_registration: false,
        enable_waiting_list: true,
        contact_email: 'tournaments@pickleballmexico.com',
        contact_phone: '+52-55-1234-5678',
        registration_message: 'This is the premier national tournament. All participants must have valid medical insurance.',
        sponsor_logos: JSON.stringify(['sponsor1.jpg', 'sponsor2.jpg'])
      },
      {
        name: 'Jalisco State Open 2024',
        description: 'State-level open tournament welcoming players from all over Jalisco and neighboring states.',
        organizer_type: 'state',
        organizer_id: 2,
        tournament_type: 'open',
        level: 'state',
        state_id: 2,
        venue_name: 'Guadalajara Sports Complex',
        venue_address: 'Av. López Mateos Norte 2375, Guadalajara, Jalisco',
        venue_city: 'Guadalajara',
        venue_state: 'Jalisco',
        start_date: new Date('2024-04-20'),
        end_date: new Date('2024-04-21'),
        registration_start: new Date('2024-02-01'),
        registration_end: new Date('2024-04-10'),
        entry_fee: 250.00,
        max_participants: 128,
        current_participants: 0,
        status: 'open',
        prize_pool: 15000.00,
        images: JSON.stringify(['https://pickleball-images.com/tournament2.jpg']),
        requires_ranking: false,
        allow_late_registration: true,
        enable_waiting_list: true,
        contact_email: 'jalisco@pickleballmexico.com',
        contact_phone: '+52-33-2345-6789'
      },
      {
        name: 'Club Deportivo Luna Local Tournament',
        description: 'Monthly local tournament for club members and guests. Family-friendly atmosphere.',
        organizer_type: 'club',
        organizer_id: 3,
        tournament_type: 'friendly',
        level: 'local',
        state_id: 1,
        venue_name: 'Club Deportivo Luna',
        venue_address: 'Calle Luna 123, Colonia Centro, CDMX',
        venue_city: 'Ciudad de México',
        venue_state: 'CDMX',
        start_date: new Date('2024-05-15'),
        end_date: new Date('2024-05-15'),
        registration_start: new Date('2024-04-01'),
        registration_end: new Date('2024-05-10'),
        entry_fee: 100.00,
        max_participants: 32,
        current_participants: 0,
        status: 'open',
        prize_pool: 2000.00,
        images: JSON.stringify(['https://pickleball-images.com/tournament3.jpg']),
        requires_ranking: false,
        allow_late_registration: true,
        enable_waiting_list: false,
        contact_email: 'luna@pickleballclub.com',
        contact_phone: '+52-55-3456-7890'
      },
      {
        name: 'Hotel Riviera Maya Pickleball Championship',
        description: 'Luxury resort tournament combining competitive play with vacation atmosphere.',
        organizer_type: 'partner',
        organizer_id: 4,
        tournament_type: 'championship',
        level: 'local',
        state_id: 3,
        venue_name: 'Hotel Riviera Maya Resort',
        venue_address: 'Carretera Federal Chetumal-Puerto Juárez Km 298, Quintana Roo',
        venue_city: 'Playa del Carmen',
        venue_state: 'Quintana Roo',
        start_date: new Date('2024-06-01'),
        end_date: new Date('2024-06-03'),
        registration_start: new Date('2024-03-01'),
        registration_end: new Date('2024-05-20'),
        entry_fee: 800.00,
        max_participants: 64,
        current_participants: 0,
        status: 'draft',
        prize_pool: 25000.00,
        images: JSON.stringify(['https://pickleball-images.com/tournament4.jpg']),
        requires_ranking: false,
        allow_late_registration: false,
        enable_waiting_list: true,
        contact_email: 'tournaments@rivieramaya.com',
        contact_phone: '+52-984-123-4567',
        transportation_info: 'Shuttle service available from Cancún airport',
        accommodation_info: 'Tournament package includes 3 nights accommodation'
      },
      {
        name: 'Youth Development League - Spring 2024',
        description: 'Special tournament for young players aged 12-18 to develop their skills in a competitive environment.',
        organizer_type: 'state',
        organizer_id: 2,
        tournament_type: 'league',
        level: 'state',
        state_id: 2,
        venue_name: 'Guadalajara Youth Sports Center',
        venue_address: 'Av. Patria 1891, Zapopan, Jalisco',
        venue_city: 'Zapopan',
        venue_state: 'Jalisco',
        start_date: new Date('2024-07-10'),
        end_date: new Date('2024-07-12'),
        registration_start: new Date('2024-05-01'),
        registration_end: new Date('2024-06-30'),
        entry_fee: 150.00,
        max_participants: 48,
        current_participants: 0,
        status: 'draft',
        prize_pool: 5000.00,
        images: JSON.stringify(['https://pickleball-images.com/youth-tournament.jpg']),
        requires_ranking: false,
        allow_late_registration: false,
        enable_waiting_list: true,
        contact_email: 'youth@jaliscosports.com',
        contact_phone: '+52-33-4567-8901',
        special_instructions: 'All participants must have parental consent form'
      }
    ];

    console.log('Inserting tournaments...');
    const tournamentIds = [];
    for (const tournament of tournaments) {
      const result = await sequelize.query(`
        INSERT INTO tournaments (
          name, description, organizer_type, organizer_id, tournament_type, 
          level, state_id, venue_name, venue_address, venue_city, venue_state,
          start_date, end_date, registration_start, registration_end, entry_fee,
          max_participants, current_participants, status, prize_pool, images,
          requires_ranking, min_ranking_points, allow_late_registration, 
          enable_waiting_list, contact_email, contact_phone, registration_message,
          sponsor_logos, transportation_info, accommodation_info, special_instructions,
          created_at, updated_at
        ) VALUES (
          :name, :description, :organizer_type, :organizer_id, :tournament_type,
          :level, :state_id, :venue_name, :venue_address, :venue_city, :venue_state,
          :start_date, :end_date, :registration_start, :registration_end, :entry_fee,
          :max_participants, :current_participants, :status, :prize_pool, :images,
          :requires_ranking, :min_ranking_points, :allow_late_registration,
          :enable_waiting_list, :contact_email, :contact_phone, :registration_message,
          :sponsor_logos, :transportation_info, :accommodation_info, :special_instructions,
          NOW(), NOW()
        ) RETURNING id
      `, {
        replacements: tournament,
        type: Sequelize.QueryTypes.INSERT
      });
      tournamentIds.push(result[0][0].id);
    }

    console.log('Creating tournament categories...');

    // Tournament Categories
    const categories = [
      // National Championship Categories
      { tournament_id: tournamentIds[0], name: 'Men\'s Singles Open', description: 'Open singles for men', gender_requirement: 'men', play_format: 'singles', entry_fee: 0, max_participants: 32, skill_level: 'open' },
      { tournament_id: tournamentIds[0], name: 'Women\'s Singles Open', description: 'Open singles for women', gender_requirement: 'women', play_format: 'singles', entry_fee: 0, max_participants: 32, skill_level: 'open' },
      { tournament_id: tournamentIds[0], name: 'Men\'s Doubles Open', description: 'Open doubles for men', gender_requirement: 'men', play_format: 'doubles', entry_fee: 0, max_participants: 32, skill_level: 'open' },
      { tournament_id: tournamentIds[0], name: 'Women\'s Doubles Open', description: 'Open doubles for women', gender_requirement: 'women', play_format: 'doubles', entry_fee: 0, max_participants: 32, skill_level: 'open' },
      { tournament_id: tournamentIds[0], name: 'Mixed Doubles Open', description: 'Mixed doubles open category', gender_requirement: 'mixed', play_format: 'mixed_doubles', entry_fee: 0, max_participants: 32, skill_level: 'open' },
      
      // State Open Categories
      { tournament_id: tournamentIds[1], name: 'Men\'s Singles Intermediate', description: 'Intermediate singles for men', gender_requirement: 'men', play_format: 'singles', entry_fee: 50, max_participants: 16, skill_level: 'intermediate' },
      { tournament_id: tournamentIds[1], name: 'Women\'s Singles Intermediate', description: 'Intermediate singles for women', gender_requirement: 'women', play_format: 'singles', entry_fee: 50, max_participants: 16, skill_level: 'intermediate' },
      { tournament_id: tournamentIds[1], name: 'Mixed Doubles Recreation', description: 'Recreational mixed doubles', gender_requirement: 'mixed', play_format: 'mixed_doubles', entry_fee: 50, max_participants: 24, skill_level: 'beginner' },
      
      // Club Tournament Categories  
      { tournament_id: tournamentIds[2], name: 'Open Singles', description: 'Open singles for all', gender_requirement: 'open', play_format: 'singles', entry_fee: 0, max_participants: 16, skill_level: 'open' },
      { tournament_id: tournamentIds[2], name: 'Family Doubles', description: 'Family-friendly doubles', gender_requirement: 'open', play_format: 'doubles', entry_fee: 0, max_participants: 16, skill_level: 'beginner' },
      
      // Resort Tournament Categories
      { tournament_id: tournamentIds[3], name: 'Resort Singles Championship', description: 'Singles championship at resort', gender_requirement: 'open', play_format: 'singles', entry_fee: 100, max_participants: 16, skill_level: 'intermediate' },
      { tournament_id: tournamentIds[3], name: 'Vacation Doubles', description: 'Doubles for vacation players', gender_requirement: 'open', play_format: 'doubles', entry_fee: 100, max_participants: 24, skill_level: 'beginner' },
      
      // Youth Tournament Categories
      { tournament_id: tournamentIds[4], name: 'Boys 12-15 Singles', description: 'Singles for boys 12-15', min_age: 12, max_age: 15, gender_requirement: 'men', play_format: 'singles', entry_fee: 0, max_participants: 12, skill_level: 'open' },
      { tournament_id: tournamentIds[4], name: 'Girls 12-15 Singles', description: 'Singles for girls 12-15', min_age: 12, max_age: 15, gender_requirement: 'women', play_format: 'singles', entry_fee: 0, max_participants: 12, skill_level: 'open' },
      { tournament_id: tournamentIds[4], name: 'Youth Mixed Doubles', description: 'Mixed doubles for youth', min_age: 12, max_age: 18, gender_requirement: 'mixed', play_format: 'mixed_doubles', entry_fee: 0, max_participants: 24, skill_level: 'open' }
    ];

    const categoryIds = [];
    for (const category of categories) {
      const result = await sequelize.query(`
        INSERT INTO tournament_categories (
          tournament_id, name, description, min_age, max_age, skill_level, 
          gender_requirement, play_format, entry_fee, max_participants, 
          current_participants, is_active, created_at, updated_at
        ) VALUES (
          :tournament_id, :name, :description, :min_age, :max_age, :skill_level,
          :gender_requirement, :play_format, :entry_fee, :max_participants,
          0, true, NOW(), NOW()
        ) RETURNING id
      `, {
        replacements: category,
        type: Sequelize.QueryTypes.INSERT
      });
      categoryIds.push(result[0][0].id);
    }

    console.log('Creating sample registrations...');

    // Sample Tournament Registrations
    const registrations = [
      // National Championship registrations
      { tournament_id: tournamentIds[0], category_id: categoryIds[0], player_id: 1, status: 'paid', amount_paid: 500, emergency_contact: JSON.stringify({ name: 'Juan Perez', phone: '555-0101' }), waiver_signed: true, is_checked_in: false },
      { tournament_id: tournamentIds[0], category_id: categoryIds[0], player_id: 2, status: 'paid', amount_paid: 500, emergency_contact: JSON.stringify({ name: 'Maria Garcia', phone: '555-0102' }), waiver_signed: true, is_checked_in: false },
      { tournament_id: tournamentIds[0], category_id: categoryIds[1], player_id: 3, status: 'paid', amount_paid: 500, emergency_contact: JSON.stringify({ name: 'Ana Lopez', phone: '555-0103' }), waiver_signed: true, is_checked_in: false },
      { tournament_id: tournamentIds[0], category_id: categoryIds[2], player_id: 1, partner_id: 2, status: 'paid', amount_paid: 500, emergency_contact: JSON.stringify({ name: 'Juan Perez', phone: '555-0101' }), waiver_signed: true, is_checked_in: false },
      
      // State Open registrations
      { tournament_id: tournamentIds[1], category_id: categoryIds[5], player_id: 4, status: 'paid', amount_paid: 300, emergency_contact: JSON.stringify({ name: 'Carlos Martinez', phone: '555-0104' }), waiver_signed: true, is_checked_in: false },
      { tournament_id: tournamentIds[1], category_id: categoryIds[6], player_id: 5, status: 'paid', amount_paid: 300, emergency_contact: JSON.stringify({ name: 'Sofia Rodriguez', phone: '555-0105' }), waiver_signed: true, is_checked_in: false },
      { tournament_id: tournamentIds[1], category_id: categoryIds[7], player_id: 1, partner_id: 3, status: 'paid', amount_paid: 300, emergency_contact: JSON.stringify({ name: 'Juan Perez', phone: '555-0101' }), waiver_signed: true, is_checked_in: false },
      
      // Club Tournament registrations
      { tournament_id: tournamentIds[2], category_id: categoryIds[8], player_id: 6, status: 'paid', amount_paid: 100, emergency_contact: JSON.stringify({ name: 'Luis Hernandez', phone: '555-0106' }), waiver_signed: true, is_checked_in: false },
      { tournament_id: tournamentIds[2], category_id: categoryIds[9], player_id: 7, partner_id: 8, status: 'paid', amount_paid: 100, emergency_contact: JSON.stringify({ name: 'Elena Vargas', phone: '555-0107' }), waiver_signed: true, is_checked_in: false }
    ];

    for (const registration of registrations) {
      await sequelize.query(`
        INSERT INTO tournament_registrations (
          tournament_id, category_id, player_id, partner_id, status, 
          registration_date, amount_paid, emergency_contact, waiver_signed, 
          is_checked_in, created_at, updated_at
        ) VALUES (
          :tournament_id, :category_id, :player_id, :partner_id, :status,
          NOW(), :amount_paid, :emergency_contact, :waiver_signed,
          :is_checked_in, NOW(), NOW()
        )
      `, {
        replacements: registration,
        type: Sequelize.QueryTypes.INSERT
      });
    }

    console.log('Creating sample brackets...');

    // Sample Tournament Brackets
    const brackets = [
      {
        tournament_id: tournamentIds[0],
        category_id: categoryIds[0],
        name: 'Men\'s Singles Open Bracket',
        bracket_type: 'single_elimination',
        seeding_method: 'ranking',
        total_rounds: 5,
        current_round: 1,
        is_complete: false,
        bracket_data: JSON.stringify({
          type: 'single_elimination',
          totalRounds: 5,
          brackets: [],
          players: []
        }),
        settings: JSON.stringify({
          bestOf: 3,
          consolationMatch: true,
          scoringSystem: 'standard'
        }),
        generated_date: new Date()
      }
    ];

    for (const bracket of brackets) {
      await sequelize.query(`
        INSERT INTO tournament_brackets (
          tournament_id, category_id, name, bracket_type, seeding_method,
          total_rounds, current_round, is_complete, bracket_data, settings,
          generated_date, created_at, updated_at
        ) VALUES (
          :tournament_id, :category_id, :name, :bracket_type, :seeding_method,
          :total_rounds, :current_round, :is_complete, :bracket_data, :settings,
          :generated_date, NOW(), NOW()
        )
      `, {
        replacements: bracket,
        type: Sequelize.QueryTypes.INSERT
      });
    }

    console.log('Creating sample matches...');

    // Sample Tournament Matches
    const matches = [
      {
        tournament_id: tournamentIds[0],
        category_id: categoryIds[0],
        round: 'quarterfinal',
        match_number: 1,
        court_id: 1,
        scheduled_date: '2024-03-15',
        scheduled_time: '09:00',
        player1_id: 1,
        player2_id: 2,
        status: 'scheduled'
      },
      {
        tournament_id: tournamentIds[0],
        category_id: categoryIds[0],
        round: 'quarterfinal',
        match_number: 2,
        court_id: 2,
        scheduled_date: '2024-03-15',
        scheduled_time: '09:00',
        player1_id: 4,
        player2_id: 5,
        status: 'scheduled'
      }
    ];

    for (const match of matches) {
      await sequelize.query(`
        INSERT INTO tournament_matches (
          tournament_id, category_id, round, match_number, court_id,
          scheduled_date, scheduled_time, player1_id, player2_id, status,
          is_third_place_match, created_at, updated_at
        ) VALUES (
          :tournament_id, :category_id, :round, :match_number, :court_id,
          :scheduled_date, :scheduled_time, :player1_id, :player2_id, :status,
          false, NOW(), NOW()
        )
      `, {
        replacements: match,
        type: Sequelize.QueryTypes.INSERT
      });
    }

    console.log('✅ Tournament seed data created successfully!');
    console.log(`Created ${tournaments.length} tournaments`);
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${registrations.length} registrations`);
    console.log(`Created ${brackets.length} brackets`);
    console.log(`Created ${matches.length} matches`);

  } catch (error) {
    console.error('Error seeding tournament data:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder
seedTournamentData();