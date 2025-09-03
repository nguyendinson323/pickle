module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('point_calculations', [
    {
      tournament_id: 1,
      player_id: 3, // Roberto Sánchez Torres (player003)
      match_id: 4,
      base_points: 500.00,
      placement_multiplier: 1.5000,
      level_multiplier: 2.00,
      opponent_bonus: 100.00,
      activity_bonus: 50.00,
      participation_bonus: 1.2000,
      total_points: 850.00,
      final_placement: 1,
      total_players: 32,
      matches_won: 6,
      matches_lost: 0,
      average_opponent_rating: 4.25,
      calculation_details: JSON.stringify({
        formula: '(base_points * placement_multiplier * level_multiplier) + opponent_bonus + activity_bonus',
        factors: {
          tournament_level: 'professional',
          placement: 'winner',
          opponent_avg_rating: 4.25,
          dominance_factor: 'high'
        }
      }),
      calculated_at: new Date('2024-06-02'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 1,
      player_id: 1, // Carlos Méndez Rivera (player001)
      match_id: 1,
      base_points: 150.00,
      placement_multiplier: 1.2000,
      level_multiplier: 1.50,
      opponent_bonus: 25.00,
      activity_bonus: 15.00,
      participation_bonus: 1.0000,
      total_points: 205.00,
      final_placement: 8,
      total_players: 24,
      matches_won: 3,
      matches_lost: 2,
      average_opponent_rating: 3.85,
      calculation_details: JSON.stringify({
        formula: '(base_points * placement_multiplier * level_multiplier) + opponent_bonus + activity_bonus',
        factors: {
          tournament_level: 'regional',
          placement: 'quarterfinals',
          upset_bonus: true,
          consistency_factor: 'good'
        }
      }),
      calculated_at: new Date('2024-03-22'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 2,
      player_id: 2, // María González López (player002)
      match_id: null,
      base_points: 100.00,
      placement_multiplier: 0.8000,
      level_multiplier: 1.25,
      opponent_bonus: 10.00,
      activity_bonus: 20.00,
      participation_bonus: 1.1000,
      total_points: 140.00,
      final_placement: 16,
      total_players: 20,
      matches_won: 2,
      matches_lost: 3,
      average_opponent_rating: 3.60,
      calculation_details: JSON.stringify({
        formula: '(base_points * placement_multiplier * level_multiplier) + opponent_bonus + activity_bonus',
        factors: {
          tournament_level: 'regional',
          placement: 'first_round_exit',
          participation: 'full',
          improvement_potential: 'high'
        }
      }),
      calculated_at: new Date('2024-04-15'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 2,
      player_id: 3, // Roberto Sánchez Torres (player003) - Different tournament
      match_id: 2,
      base_points: 200.00,
      placement_multiplier: 1.3000,
      level_multiplier: 1.80,
      opponent_bonus: 40.00,
      activity_bonus: 25.00,
      participation_bonus: 1.0000,
      total_points: 533.00,
      final_placement: 2,
      total_players: 16,
      matches_won: 4,
      matches_lost: 1,
      average_opponent_rating: 4.10,
      calculation_details: JSON.stringify({
        formula: '(base_points * placement_multiplier * level_multiplier) + opponent_bonus + activity_bonus',
        factors: {
          tournament_level: 'regional',
          placement: 'finalist',
          category: 'intermediate_male',
          performance: 'excellent'
        }
      }),
      calculated_at: new Date('2024-03-22'),
      created_at: now,
      updated_at: now
    },
    {
      tournament_id: 2,
      player_id: 1, // Carlos Méndez Rivera (player001) - Practice tournament
      match_id: null,
      base_points: 50.00,
      placement_multiplier: 1.0000,
      level_multiplier: 1.00,
      opponent_bonus: 0.00,
      activity_bonus: 15.00,
      participation_bonus: 1.5000,
      total_points: 90.00,
      final_placement: 24,
      total_players: 24,
      matches_won: 1,
      matches_lost: 2,
      average_opponent_rating: 3.20,
      calculation_details: JSON.stringify({
        formula: '(base_points * placement_multiplier * level_multiplier) + activity_bonus',
        factors: {
          tournament_level: 'local',
          placement: 'participation',
          first_tournament: true,
          learning_experience: 'valuable'
        }
      }),
      calculated_at: new Date('2024-11-30'),
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('point_calculations', {}, {});
  }
};