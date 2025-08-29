import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('tournaments', [
    {
      name: 'Campeonato Nacional de Pickleball 2024',
      description: 'Torneo nacional de pickleball más importante del año, clasificatorio para competencias internacionales',
      organizer_type: 'federation',
      organizer_id: 1, // Admin/Federation
      tournament_type: 'championship',
      level: 'national',
      state_id: 7, // Ciudad de México
      venue_name: 'Centro Nacional de Pickleball',
      venue_address: 'Av. Insurgentes Sur 3000, Coyoacán, Ciudad de México',
      venue_city: 'Ciudad de México',
      venue_state: 'Ciudad de México',
      start_date: '2024-06-15',
      end_date: '2024-06-18',
      registration_start: '2024-04-01',
      registration_end: '2024-05-31',
      entry_fee: 1500.00,
      max_participants: 128,
      current_participants: 0,
      status: 'open',
      prize_pool: 50000.00,
      rules_document: 'Reglamento oficial IFP 2024 aplicable',
      images: JSON.stringify(['/tournaments/campeonato-2024-banner.jpg']),
      requires_ranking: true,
      min_ranking_points: 100,
      allow_late_registration: false,
      enable_waiting_list: true,
      contact_email: 'campeonato@federacionpickleball.mx',
      contact_phone: '+52 55 9876 5432',
      website_url: 'https://campeonato2024.federacionpickleball.mx',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('tournaments', {}, {});
}