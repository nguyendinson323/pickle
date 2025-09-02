module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('rankings', [
      {
        player_id: 4, // Roberto Sánchez Torres (player003)
        ranking_type: 'national',
        current_position: 1,
        previous_position: 2,
        points: 2850,
        skill_level: '4.5',
        category: 'Open Masculino',
        age_group: 'Open',
        state_id: 21, // Nuevo León
        ranking_period: '2024-Q4',
        last_updated: new Date('2024-12-01'),
        tournaments_played: 8,
        wins: 34,
        losses: 12,
        win_percentage: 73.9,
        ranking_notes: JSON.stringify({
          recent_performance: 'Excelente',
          trend: 'ascending',
          notable_wins: ['Campeonato Nuevo León Open 2024'],
          weakness: 'Juego defensivo en redes'
        }),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        player_id: 2, // Carlos Méndez Rivera (player001)
        ranking_type: 'national',
        current_position: 5,
        previous_position: 7,
        points: 2125,
        skill_level: '4.0',
        category: 'Open Masculino',
        age_group: 'Open',
        state_id: 9, // Ciudad de México
        ranking_period: '2024-Q4',
        last_updated: new Date('2024-12-01'),
        tournaments_played: 6,
        wins: 24,
        losses: 18,
        win_percentage: 57.1,
        ranking_notes: JSON.stringify({
          recent_performance: 'Buena',
          trend: 'ascending',
          notable_wins: ['Torneo CDMX Amateur 2024'],
          weakness: 'Consistencia en voleas'
        }),
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        player_id: 3, // María González López (player002)
        ranking_type: 'national',
        current_position: 3,
        previous_position: 4,
        points: 2430,
        skill_level: '3.5',
        category: 'Open Femenino',
        age_group: 'Open',
        state_id: 17, // Jalisco
        ranking_period: '2024-Q4',
        last_updated: new Date('2024-12-01'),
        tournaments_played: 7,
        wins: 28,
        losses: 14,
        win_percentage: 66.7,
        ranking_notes: JSON.stringify({
          recent_performance: 'Muy Buena',
          trend: 'ascending',
          notable_wins: ['Campeonato Jalisco Femenil 2024'],
          weakness: 'Potencia en smash'
        }),
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