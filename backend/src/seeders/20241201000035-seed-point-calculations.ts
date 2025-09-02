module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('point_calculations', [
    {
      player_id: 4, // Roberto Sánchez Torres (player003)
      tournament_id: 3, // Campeonato Nuevo León Open 2024
      match_id: 4, // Final match from tournament_matches
      calculation_type: 'tournament_win',
      base_points: 500,
      multiplier: 1.5, // Professional tournament multiplier
      bonus_points: 100, // Winner bonus
      penalty_points: 0,
      final_points: 850, // (500 * 1.5) + 100
      calculation_formula: JSON.stringify({
        formula: '(base_points * tournament_multiplier) + winner_bonus',
        factors: {
          tournament_level: 'professional',
          opponent_rating: '5.0+',
          match_importance: 'final'
        }
      }),
      calculation_date: new Date('2024-06-02'),
      verified: true,
      verified_by: 1, // admin001
      calculation_notes: 'Victoria en final profesional contra oponente 5.0+',
      created_at: now,
      updated_at: now
    },
    {
      player_id: 2, // Carlos Méndez Rivera (player001)
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      match_id: 1, // Win against Roberto in round 1
      calculation_type: 'match_win',
      base_points: 150,
      multiplier: 1.2, // Regional tournament multiplier
      bonus_points: 25, // Upset bonus (beat higher ranked player)
      penalty_points: 0,
      final_points: 205, // (150 * 1.2) + 25
      calculation_formula: JSON.stringify({
        formula: '(base_points * tournament_multiplier) + upset_bonus',
        factors: {
          tournament_level: 'regional',
          opponent_rating: '4.5',
          skill_differential: '0.5'
        }
      }),
      calculation_date: new Date('2024-03-22'),
      verified: true,
      verified_by: 5, // Luis Hernández (referee)
      calculation_notes: 'Victoria contra oponente de ranking superior',
      created_at: now,
      updated_at: now
    },
    {
      player_id: 4, // Roberto Sánchez Torres (player003)
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      match_id: 2, // Win against Carlos in intermediate category
      calculation_type: 'match_win',
      base_points: 200,
      multiplier: 1.3, // Category advancement multiplier
      bonus_points: 0,
      penalty_points: 0,
      final_points: 260, // (200 * 1.3)
      calculation_formula: JSON.stringify({
        formula: 'base_points * category_multiplier',
        factors: {
          tournament_level: 'regional',
          category: 'intermediate_male',
          dominance_factor: 'high'
        }
      }),
      calculation_date: new Date('2024-03-22'),
      verified: true,
      verified_by: 6, // Ana Patricia Ruiz (referee)
      calculation_notes: 'Victoria dominante en categoría intermedia',
      created_at: now,
      updated_at: now
    },
    {
      player_id: 3, // María González López (player002)
      tournament_id: 2, // Copa Regional Jalisco 2024
      match_id: null, // Participation points (no specific match)
      calculation_type: 'participation',
      base_points: 50,
      multiplier: 1.0,
      bonus_points: 25, // First tournament participation bonus
      penalty_points: 0,
      final_points: 75, // 50 + 25
      calculation_formula: JSON.stringify({
        formula: 'base_points + first_tournament_bonus',
        factors: {
          tournament_level: 'regional',
          participation_type: 'debut',
          completion_status: 'full'
        }
      }),
      calculation_date: new Date('2024-04-15'),
      verified: true,
      verified_by: 1, // admin001
      calculation_notes: 'Puntos por primera participación en torneo regional',
      created_at: now,
      updated_at: now
    },
    {
      player_id: 6, // Ana Patricia Ruiz Vega (coach002)
      tournament_id: 1, // Torneo Nacional de Primavera CDMX 2024
      match_id: null, // Coaching/officiating points
      calculation_type: 'officiating',
      base_points: 100,
      multiplier: 1.0,
      bonus_points: 50, // Head referee bonus
      penalty_points: 0,
      final_points: 150, // 100 + 50
      calculation_formula: JSON.stringify({
        formula: 'base_points + head_official_bonus',
        factors: {
          official_role: 'head_referee',
          tournament_level: 'regional',
          matches_officiated: 8
        }
      }),
      calculation_date: new Date('2024-03-25'),
      verified: true,
      verified_by: 1, // admin001
      calculation_notes: 'Puntos por arbitraje como juez principal del torneo',
      created_at: now,
      updated_at: now
    },
    {
      player_id: 5, // Luis Hernández Morales (coach001)
      tournament_id: 2, // Copa Regional Jalisco 2024
      match_id: 3, // In progress match
      calculation_type: 'partial_match',
      base_points: 75,
      multiplier: 0.5, // Partial completion multiplier
      bonus_points: 0,
      penalty_points: 10, // Incomplete match penalty
      final_points: 28, // (75 * 0.5) - 10 = 37.5 - 10 = 27.5 rounded up
      calculation_formula: JSON.stringify({
        formula: '(base_points * partial_multiplier) - incomplete_penalty',
        factors: {
          completion_percentage: 50,
          match_status: 'in_progress',
          reason: 'weather_delay'
        }
      }),
      calculation_date: new Date('2024-04-15'),
      verified: false,
      verified_by: null, // Pending verification until match completion
      calculation_notes: 'Puntos parciales por partido suspendido, pendiente de finalización',
      created_at: now,
      updated_at: now
    },
    {
      player_id: 2, // Carlos Méndez Rivera (player001)
      tournament_id: null, // Practice session points
      match_id: null,
      calculation_type: 'practice_session',
      base_points: 10,
      multiplier: 1.0,
      bonus_points: 5, // Consistency bonus (5+ sessions this month)
      penalty_points: 0,
      final_points: 15, // 10 + 5
      calculation_formula: JSON.stringify({
        formula: 'base_points + consistency_bonus',
        factors: {
          session_type: 'structured_practice',
          duration_hours: 2,
          monthly_sessions: 6
        }
      }),
      calculation_date: new Date('2024-11-30'),
      verified: true,
      verified_by: 5, // Luis Hernández (supervising coach)
      calculation_notes: 'Puntos por práctica estructurada con coach certificado',
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('point_calculations', {}, {});
  }
};