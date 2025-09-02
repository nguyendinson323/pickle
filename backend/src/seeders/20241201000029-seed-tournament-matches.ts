module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('tournament_matches', [
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      bracket_id: 1, // Bracket A - Principiantes
      round_number: 1,
      match_number: 1,
      player1_id: 2, // Carlos Méndez Rivera
      player2_id: 4, // Roberto Sánchez Torres
      partner1_id: 3, // María González López
      partner2_id: null,
      scheduled_time: new Date('2024-03-22T10:00:00Z'),
      court_id: 1, // Court A1
      match_status: 'completed',
      winner_id: 2, // Carlos wins
      loser_id: 4, // Roberto loses
      final_score: JSON.stringify({
        set1: { team1: 11, team2: 6 },
        set2: { team1: 11, team2: 8 },
        duration_minutes: 45
      }),
      game_stats: JSON.stringify({
        team1_winners: 18,
        team1_errors: 7,
        team2_winners: 12,
        team2_errors: 15,
        longest_rally: 23
      }),
      referee_id: 5, // Luis Hernández Morales (coach001)
      match_notes: 'Excelente partido, muy competitivo en el primer set',
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      bracket_id: 2, // Bracket B - Intermedio Masculino
      round_number: 1,
      match_number: 2,
      player1_id: 4, // Roberto Sánchez Torres
      player2_id: 2, // Carlos Méndez Rivera
      partner1_id: null, // Singles match
      partner2_id: null,
      scheduled_time: new Date('2024-03-22T14:00:00Z'),
      court_id: 2, // Court A2
      match_status: 'completed',
      winner_id: 4, // Roberto wins
      loser_id: 2, // Carlos loses
      final_score: JSON.stringify({
        set1: { team1: 11, team2: 5 },
        set2: { team1: 11, team2: 7 },
        duration_minutes: 38
      }),
      game_stats: JSON.stringify({
        player1_winners: 22,
        player1_errors: 8,
        player2_winners: 14,
        player2_errors: 18,
        longest_rally: 31
      }),
      referee_id: 6, // Ana Patricia Ruiz Vega (coach002)
      match_notes: 'Roberto mostró un nivel superior, excelentes dejadas',
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 2, // Copa Regional Jalisco 2024
      bracket_id: 3, // Bracket C - Senior Mixto
      round_number: 1,
      match_number: 1,
      player1_id: 5, // Luis Hernández Morales
      player2_id: 2, // Carlos Méndez Rivera
      partner1_id: 6, // Ana Patricia Ruiz Vega
      partner2_id: 3, // María González López
      scheduled_time: new Date('2024-04-15T10:00:00Z'),
      court_id: 4, // Court C1
      match_status: 'in_progress',
      winner_id: null,
      loser_id: null,
      final_score: JSON.stringify({
        set1: { team1: 11, team2: 9 },
        set2: { team1: 8, team2: 11 },
        set3: { team1: 6, team2: 4 }, // In progress
        duration_minutes: null
      }),
      game_stats: JSON.stringify({
        team1_winners: 15,
        team1_errors: 9,
        team2_winners: 12,
        team2_errors: 11,
        longest_rally: 28
      }),
      referee_id: 1, // admin001 as referee
      match_notes: 'Partido muy parejo, gran nivel técnico de ambos equipos',
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 3, // Campeonato Nuevo León Open 2024
      bracket_id: 4, // Bracket Elite - Profesional
      round_number: 4,
      match_number: 1,
      player1_id: 4, // Roberto Sánchez Torres
      player2_id: 5, // Luis Hernández Morales
      partner1_id: 2, // Carlos Méndez Rivera
      partner2_id: 6, // Ana Patricia Ruiz Vega
      scheduled_time: new Date('2024-06-02T16:00:00Z'),
      court_id: 3, // Court B1
      match_status: 'completed',
      winner_id: 4, // Roberto's team wins
      loser_id: 5, // Luis's team loses
      final_score: JSON.stringify({
        set1: { team1: 15, team2: 13 },
        set2: { team1: 10, team2: 15 },
        set3: { team1: 15, team2: 12 },
        set4: { team1: 15, team2: 10 },
        duration_minutes: 142
      }),
      game_stats: JSON.stringify({
        team1_winners: 67,
        team1_errors: 23,
        team2_winners: 52,
        team2_errors: 31,
        longest_rally: 45,
        aces: 8,
        double_faults: 3
      }),
      referee_id: 1, // admin001 as referee
      match_notes: 'Final espectacular, nivel profesional excepcional. Gran exhibición técnica.',
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      bracket_id: 1, // Bracket A - Principiantes
      round_number: 2,
      match_number: 1,
      player1_id: 2, // Carlos Méndez Rivera (winner from previous)
      player2_id: 3, // María González López
      partner1_id: 3, // María González López
      partner2_id: 4, // Roberto Sánchez Torres
      scheduled_time: new Date('2024-03-23T11:00:00Z'),
      court_id: 1, // Court A1
      match_status: 'scheduled',
      winner_id: null,
      loser_id: null,
      final_score: null,
      game_stats: null,
      referee_id: 6, // Ana Patricia Ruiz Vega
      match_notes: 'Semifinal de la categoría principiantes',
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournament_matches', {}, {});
  }
};