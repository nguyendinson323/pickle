module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('rankings', [
      {
        player_id: 3, // Roberto Sánchez Torres (player003 -> player_id 3)
        ranking_type: 'overall',
        category: 'national',
        position: 1,
        points: 2850.00,
        previous_position: 2,
        previous_points: 2720.00,
        state_id: 21, // Nuevo León
        age_group: null,
        gender: 'male',
        tournaments_played: 8,
        last_tournament_date: new Date('2024-11-30'),
        activity_bonus: 150.00,
        decay_factor: 1.0000,
        last_calculated: new Date('2024-12-01'),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        player_id: 1, // Carlos Méndez Rivera (player001 -> player_id 1)
        ranking_type: 'overall',
        category: 'national',
        position: 5,
        points: 2125.00,
        previous_position: 7,
        previous_points: 1980.00,
        state_id: 9, // Ciudad de México
        age_group: null,
        gender: 'male',
        tournaments_played: 6,
        last_tournament_date: new Date('2024-11-25'),
        activity_bonus: 100.00,
        decay_factor: 1.0000,
        last_calculated: new Date('2024-12-01'),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        player_id: 2, // María González López (player002 -> player_id 2)
        ranking_type: 'overall',
        category: 'national',
        position: 3,
        points: 2430.00,
        previous_position: 4,
        previous_points: 2350.00,
        state_id: 17, // Jalisco
        age_group: null,
        gender: 'female',
        tournaments_played: 7,
        last_tournament_date: new Date('2024-11-28'),
        activity_bonus: 125.00,
        decay_factor: 1.0000,
        last_calculated: new Date('2024-12-01'),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        player_id: 3, // Roberto Sánchez Torres (player003 -> player_id 3) - Singles ranking
        ranking_type: 'singles',
        category: 'state',
        position: 1,
        points: 1450.00,
        previous_position: 1,
        previous_points: 1380.00,
        state_id: 21, // Nuevo León
        age_group: null,
        gender: 'male',
        tournaments_played: 5,
        last_tournament_date: new Date('2024-11-30'),
        activity_bonus: 75.00,
        decay_factor: 1.0000,
        last_calculated: new Date('2024-12-01'),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        player_id: 2, // María González López (player002 -> player_id 2) - Doubles ranking
        ranking_type: 'doubles',
        category: 'gender',
        position: 2,
        points: 1850.00,
        previous_position: 3,
        previous_points: 1720.00,
        state_id: 17, // Jalisco
        age_group: null,
        gender: 'female',
        tournaments_played: 4,
        last_tournament_date: new Date('2024-11-28'),
        activity_bonus: 90.00,
        decay_factor: 1.0000,
        last_calculated: new Date('2024-12-01'),
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rankings', null, {});
  }
};