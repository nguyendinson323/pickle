module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('tournament_brackets', [
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      category_id: 1, // Principiantes Mixto
      bracket_name: 'Bracket A - Principiantes',
      bracket_type: 'double_elimination',
      total_rounds: 5,
      current_round: 3,
      bracket_data: JSON.stringify({
        teams: [
          { id: 1, name: 'Carlos/María', seed: 1 },
          { id: 2, name: 'Luis/Ana', seed: 2 },
          { id: 3, name: 'Roberto/Elena', seed: 3 },
          { id: 4, name: 'José/Carmen', seed: 4 }
        ],
        matches: [
          {
            round: 1,
            match_id: 'M1',
            team1_id: 1,
            team2_id: 4,
            winner_id: 1,
            score: '11-6, 11-8'
          },
          {
            round: 1,
            match_id: 'M2',
            team1_id: 2,
            team2_id: 3,
            winner_id: 2,
            score: '11-9, 10-12, 11-7'
          }
        ]
      }),
      status: 'in_progress',
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      category_id: 2, // Intermedio Masculino
      bracket_name: 'Bracket B - Intermedio Masculino',
      bracket_type: 'round_robin',
      total_rounds: 3,
      current_round: 2,
      bracket_data: JSON.stringify({
        players: [
          { id: 4, name: 'Roberto Sánchez', seed: 1, wins: 2, losses: 0 },
          { id: 11, name: 'Miguel Torres', seed: 2, wins: 1, losses: 1 },
          { id: 12, name: 'Fernando López', seed: 3, wins: 0, losses: 2 }
        ],
        matches: [
          {
            round: 1,
            match_id: 'M3',
            player1_id: 4,
            player2_id: 11,
            winner_id: 4,
            score: '11-5, 11-7'
          },
          {
            round: 1,
            match_id: 'M4',
            player1_id: 4,
            player2_id: 12,
            winner_id: 4,
            score: '11-3, 11-4'
          }
        ]
      }),
      status: 'in_progress',
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 2, // Copa Regional Jalisco 2024
      category_id: 4, // Senior 50+ Mixto
      bracket_name: 'Bracket C - Senior Mixto',
      bracket_type: 'single_elimination',
      total_rounds: 4,
      current_round: 1,
      bracket_data: JSON.stringify({
        teams: [
          { id: 5, name: 'Luis/Ana', seed: 1 },
          { id: 6, name: 'Ricardo/Sofía', seed: 2 },
          { id: 7, name: 'Andrés/Patricia', seed: 3 },
          { id: 8, name: 'Manuel/Rosa', seed: 4 }
        ],
        matches: [
          {
            round: 1,
            match_id: 'M5',
            team1_id: 5,
            team2_id: 8,
            winner_id: null,
            score: null,
            scheduled_time: '2024-04-15T10:00:00Z'
          }
        ]
      }),
      status: 'not_started',
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 3, // Campeonato Nuevo León Open 2024
      category_id: 5, // Profesional Open
      bracket_name: 'Bracket Elite - Profesional',
      bracket_type: 'single_elimination',
      total_rounds: 4,
      current_round: 4,
      bracket_data: JSON.stringify({
        teams: [
          { id: 9, name: 'Roberto/Carlos', seed: 1 },
          { id: 10, name: 'Eduardo/Sebastián', seed: 2 }
        ],
        matches: [
          {
            round: 4,
            match_id: 'FINAL',
            team1_id: 9,
            team2_id: 10,
            winner_id: 9,
            score: '15-13, 10-15, 15-12, 15-10',
            completed_time: '2024-06-02T16:30:00Z'
          }
        ]
      }),
      status: 'completed',
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournament_brackets', {}, {});
  }
};