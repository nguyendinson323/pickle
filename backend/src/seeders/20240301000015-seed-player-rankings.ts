import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('rankings', [
    {
      player_id: 1, // Carlos Méndez
      ranking_type: 'singles',
      category: 'national',
      position: 1,
      points: 2450.75,
      previous_position: 2,
      previous_points: 2380.50,
      state_id: 7,
      tournaments_played: 8,
      last_tournament_date: new Date('2024-02-15'),
      activity_bonus: 50.25,
      decay_factor: 1.0000,
      last_calculated: new Date(),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('rankings', {}, {});
}