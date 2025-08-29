import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('tournament_categories', [
    {
      tournament_id: 1,
      name: 'Singles Masculino Open',
      description: 'Categoría individual masculina abierta',
      min_age: null,
      max_age: null,
      skill_level: 'open',
      gender_requirement: 'men',
      play_format: 'singles',
      entry_fee: 750.00,
      max_participants: 32,
      current_participants: 0,
      min_ranking_points: null,
      max_ranking_points: null,
      prize_distribution: JSON.stringify({"1st": 5000, "2nd": 3000, "3rd": 2000}),
      special_rules: null,
      is_active: true,
      registration_deadline: new Date('2024-05-15'),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tournament_id: 1,
      name: 'Dobles Femenino Avanzado',
      description: 'Categoría dobles femenina para jugadoras avanzadas',
      min_age: null,
      max_age: null,
      skill_level: 'advanced',
      gender_requirement: 'women',
      play_format: 'doubles',
      entry_fee: 600.00,
      max_participants: 16,
      current_participants: 0,
      min_ranking_points: null,
      max_ranking_points: null,
      prize_distribution: JSON.stringify({"1st": 4000, "2nd": 2500, "3rd": 1500}),
      special_rules: null,
      is_active: true,
      registration_deadline: new Date('2024-05-15'),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('tournament_categories', {}, {});
}