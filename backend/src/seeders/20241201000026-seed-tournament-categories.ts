module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('tournament_categories', [
      {
        tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
        category_name: 'Principiantes Mixto',
        skill_level_min: '1.0',
        skill_level_max: '2.5',
        age_group: 'Open',
        gender_restriction: 'Mixed',
        max_participants: 32,
        entry_fee: 50000, // $500.00 MXN in cents
        prize_pool: 200000, // $2,000.00 MXN in cents
        registration_deadline: new Date('2024-03-15'),
        category_description: 'Categoría para jugadores nuevos en el deporte, nivel NTRP 1.0-2.5',
        rules: JSON.stringify({
          format: 'double_elimination',
          match_format: 'best_of_3',
          time_limit: 60,
          scoring: '11_points_win_by_2'
        }),
        created_at: now,
        updated_at: now
      },
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      category_name: 'Intermedio Masculino',
      skill_level_min: '3.0',
      skill_level_max: '4.0',
      age_group: 'Open',
      gender_restriction: 'Male',
      max_participants: 24,
      entry_fee: 75000, // $750.00 MXN in cents
      prize_pool: 500000, // $5,000.00 MXN in cents
      registration_deadline: new Date('2024-03-15'),
      category_description: 'Categoría masculina nivel intermedio, NTRP 3.0-4.0',
      rules: JSON.stringify({
        format: 'round_robin_playoffs',
        match_format: 'best_of_3',
        time_limit: 90,
        scoring: '11_points_win_by_2'
      }),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      category_name: 'Avanzado Femenil',
      skill_level_min: '4.5',
      skill_level_max: '5.5',
      age_group: 'Open',
      gender_restriction: 'Female',
      max_participants: 16,
      entry_fee: 100000, // $1,000.00 MXN in cents
      prize_pool: 800000, // $8,000.00 MXN in cents
      registration_deadline: new Date('2024-03-15'),
      category_description: 'Categoría femenina nivel avanzado, NTRP 4.5-5.5',
      rules: JSON.stringify({
        format: 'single_elimination',
        match_format: 'best_of_5',
        time_limit: 120,
        scoring: '11_points_win_by_2'
      }),
        created_at: now,
        updated_at: now
      },
      {
        tournament_id: 2, // Copa Regional Jalisco 2024
        category_name: 'Senior 50+ Mixto',
        skill_level_min: '2.5',
        skill_level_max: '4.5',
        age_group: '50+',
        gender_restriction: 'Mixed',
        max_participants: 20,
        entry_fee: 60000, // $600.00 MXN in cents
        prize_pool: 300000, // $3,000.00 MXN in cents
        registration_deadline: new Date('2024-04-10'),
        category_description: 'Categoría senior para jugadores mayores de 50 años',
        rules: JSON.stringify({
          format: 'round_robin',
          match_format: 'best_of_3',
          time_limit: 75,
          scoring: '11_points_win_by_2'
        }),
        created_at: now,
        updated_at: now
      },
      {
        tournament_id: 3, // Campeonato Nuevo León Open 2024
        category_name: 'Profesional Open',
        skill_level_min: '5.0',
        skill_level_max: '6.0',
        age_group: 'Open',
        gender_restriction: 'Open',
        max_participants: 12,
        entry_fee: 150000, // $1,500.00 MXN in cents
        prize_pool: 1500000, // $15,000.00 MXN in cents
        registration_deadline: new Date('2024-05-20'),
        category_description: 'Categoría profesional abierta, nivel más alto de competencia',
        rules: JSON.stringify({
          format: 'single_elimination_seeded',
          match_format: 'best_of_5',
          time_limit: 180,
          scoring: '15_points_win_by_2'
        }),
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournament_categories', {}, {});
  }
};