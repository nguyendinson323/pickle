module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('ranking_history', [
    {
      player_id: 3, // Roberto Sánchez Torres (player003)
      ranking_type: 'overall',
      category: 'national',
      old_position: 3,
      new_position: 2,
      old_points: 2500.00,
      new_points: 2650.00,
      points_change: 150.00,
      position_change: -1,
      change_reason: 'quarterly_calculation',
      tournament_id: null,
      change_date: new Date('2024-09-30'),
      state_id: 21, // Nuevo León
      age_group: null,
      gender: 'male',
      created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updated_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      player_id: 1, // Carlos Méndez Rivera (player001)
      ranking_type: 'overall',
      category: 'national',
      old_position: 13,
      new_position: 15,
      old_points: 1850.00,
      new_points: 1800.00,
      points_change: -50.00,
      position_change: 2,
      change_reason: 'quarterly_calculation',
      tournament_id: null,
      change_date: new Date('2024-09-30'),
      state_id: 9, // Ciudad de México
      age_group: null,
      gender: 'male',
      created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updated_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      player_id: 2, // María González López (player002)
      ranking_type: 'overall',
      category: 'national',
      old_position: 9,
      new_position: 9,
      old_points: 2050.00,
      new_points: 2100.00,
      points_change: 50.00,
      position_change: 0,
      change_reason: 'quarterly_calculation',
      tournament_id: null,
      change_date: new Date('2024-09-30'),
      state_id: 17, // Jalisco
      age_group: null,
      gender: 'female',
      created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updated_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      player_id: 3, // Roberto Sánchez Torres (player003) - Historical record
      ranking_type: 'overall',
      category: 'national',
      old_position: 4,
      new_position: 3,
      old_points: 2300.00,
      new_points: 2500.00,
      points_change: 200.00,
      position_change: -1,
      change_reason: 'tournament_win',
      tournament_id: 1,
      change_date: new Date('2024-06-30'),
      state_id: 21, // Nuevo León
      age_group: null,
      gender: 'male',
      created_at: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
      updated_at: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000)
    },
    {
      player_id: 1, // Carlos Méndez Rivera (player001) - Historical record
      ranking_type: 'overall',
      category: 'national',
      old_position: 15,
      new_position: 13,
      old_points: 1750.00,
      new_points: 1850.00,
      points_change: 100.00,
      position_change: -2,
      change_reason: 'tournament_performance',
      tournament_id: 1,
      change_date: new Date('2024-06-30'),
      state_id: 9, // Ciudad de México
      age_group: null,
      gender: 'male',
      created_at: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
      updated_at: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000)
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ranking_history', {}, {});
  }
};