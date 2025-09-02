module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('ranking_history', [
    {
      player_id: 4, // Roberto Sánchez Torres (player003)
      ranking_type: 'national',
      position: 2,
      points: 2650,
      ranking_period: '2024-Q3',
      recorded_date: new Date('2024-09-30'),
      category: 'Open Masculino',
      age_group: 'Open',
      state_id: 19, // Nuevo León
      tournaments_in_period: 3,
      wins_in_period: 18,
      losses_in_period: 6,
      points_change: 150, // From previous period
      position_change: 1, // Moved up from position 3
      period_notes: JSON.stringify({
        key_results: ['Semifinalista Nacional Q3'],
        performance: 'strong',
        trend: 'improving'
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 4, // Roberto Sánchez Torres (player003)
      ranking_type: 'national',
      position: 3,
      points: 2500,
      ranking_period: '2024-Q2',
      recorded_date: new Date('2024-06-30'),
      category: 'Open Masculino',
      age_group: 'Open',
      state_id: 19, // Nuevo León
      tournaments_in_period: 2,
      wins_in_period: 14,
      losses_in_period: 4,
      points_change: 200, // From previous period
      position_change: -1, // Moved down from position 2
      period_notes: JSON.stringify({
        key_results: ['Campeón Regional Q2'],
        performance: 'excellent',
        trend: 'recovering'
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 2, // Carlos Méndez Rivera (player001)
      ranking_type: 'national',
      position: 15,
      points: 1800,
      ranking_period: '2024-Q3',
      recorded_date: new Date('2024-09-30'),
      category: 'Open Masculino',
      age_group: 'Open',
      state_id: 7, // Ciudad de México
      tournaments_in_period: 2,
      wins_in_period: 8,
      losses_in_period: 6,
      points_change: -50, // Lost points
      position_change: -2, // Moved down from position 13
      period_notes: JSON.stringify({
        key_results: ['Primera ronda en 2 torneos'],
        performance: 'below_average',
        trend: 'declining'
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 2, // Carlos Méndez Rivera (player001)
      ranking_type: 'national',
      position: 13,
      points: 1850,
      ranking_period: '2024-Q2',
      recorded_date: new Date('2024-06-30'),
      category: 'Open Masculino',
      age_group: 'Open',
      state_id: 7, // Ciudad de México
      tournaments_in_period: 3,
      wins_in_period: 12,
      losses_in_period: 9,
      points_change: 100, // Gained points
      position_change: 2, // Moved up from position 15
      period_notes: JSON.stringify({
        key_results: ['Cuartos de final Torneo CDMX'],
        performance: 'improving',
        trend: 'ascending'
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 3, // María González López (player002)
      ranking_type: 'national',
      position: 9,
      points: 2100,
      ranking_period: '2024-Q3',
      recorded_date: new Date('2024-09-30'),
      category: 'Open Femenino',
      age_group: 'Open',
      state_id: 15, // Jalisco
      tournaments_in_period: 2,
      wins_in_period: 10,
      losses_in_period: 4,
      points_change: 50, // Gained points
      position_change: 0, // Maintained position
      period_notes: JSON.stringify({
        key_results: ['Semifinalista Copa Regional'],
        performance: 'consistent',
        trend: 'stable'
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 6, // Ana Patricia Ruiz Vega (coach002)
      ranking_type: 'national',
      position: 1,
      points: 3050,
      ranking_period: '2024-Q3',
      recorded_date: new Date('2024-09-30'),
      category: 'Open Femenino',
      age_group: 'Open',
      state_id: 7, // Ciudad de México
      tournaments_in_period: 2,
      wins_in_period: 16,
      losses_in_period: 1,
      points_change: 100, // Gained points
      position_change: 0, // Maintained #1
      period_notes: JSON.stringify({
        key_results: ['Campeona Nacional Q3', 'Invicta en 15 sets'],
        performance: 'dominant',
        trend: 'stable_at_top'
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 6, // Ana Patricia Ruiz Vega (coach002)
      ranking_type: 'national',
      position: 1,
      points: 2950,
      ranking_period: '2024-Q2',
      recorded_date: new Date('2024-06-30'),
      category: 'Open Femenino',
      age_group: 'Open',
      state_id: 7, // Ciudad de México
      tournaments_in_period: 2,
      wins_in_period: 18,
      losses_in_period: 2,
      points_change: 75, // Gained points
      position_change: 0, // Maintained #1
      period_notes: JSON.stringify({
        key_results: ['Campeona Master Series Q2'],
        performance: 'excellent',
        trend: 'dominant'
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 5, // Luis Hernández Morales (coach001)
      ranking_type: 'national',
      position: 3,
      points: 2600,
      ranking_period: '2024-Q3',
      recorded_date: new Date('2024-09-30'),
      category: 'Senior 45+',
      age_group: '45+',
      state_id: 19, // Nuevo León
      tournaments_in_period: 2,
      wins_in_period: 14,
      losses_in_period: 3,
      points_change: 25, // Small gain
      position_change: 0, // Maintained position
      period_notes: JSON.stringify({
        key_results: ['Finalista Senior Nacional Q3'],
        performance: 'consistent',
        trend: 'stable'
      }),
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ranking_history', {}, {});
  }
};