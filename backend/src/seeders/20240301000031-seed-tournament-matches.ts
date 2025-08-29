import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('tournament_matches', [
    {
      tournament_id: 1, // Campeonato Nacional 2024
      category_id: 1, // Singles Masculino Open
      bracket_id: 1, // Cuadro Principal
      round: 'round_16',
      match_number: 1,
      court_id: 1, // Cancha Central
      scheduled_date: new Date('2024-06-15'),
      scheduled_time: '10:00:00',
      player1_id: 5, // player001 (user_id)
      player2_id: 6, // player002 (user_id)
      status: 'scheduled',
      referee_id: 3, // referee001
      is_third_place_match: false,
      court_assignment: 'Cancha Central',
      warmup_time: 10,
      estimated_duration: 90,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('tournament_matches', {}, {});
}