module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('tournament_brackets', [
      {
        tournament_id: 1,
        category_id: 1, // Principiantes Mixto Dobles
        name: 'Bracket A - Principiantes Mixto',
        bracket_type: 'double_elimination',
        seeding_method: 'ranking',
        total_rounds: 4,
        current_round: 3,
        is_complete: false,
        winner_player_id: null,
        runner_up_player_id: null,
        third_place_player_id: null,
        fourth_place_player_id: null,
        bracket_data: JSON.stringify({
          teams: [
            { 
              id: 1, 
              players: [2, 3], // player001 + player002
              names: ['Carlos Méndez', 'María González'],
              seed: 1 
            },
            { 
              id: 2, 
              players: [4, 5], // player003 + coach001
              names: ['Roberto Sánchez', 'Luis Hernández'],
              seed: 2 
            }
          ],
          matches: [
            {
              round: 1,
              match_id: 'M1-R1',
              team1_id: 1,
              team2_id: 2,
              winner_id: 1,
              score: '11-6, 11-9',
              completed: true,
              match_date: '2024-11-20'
            },
            {
              round: 2,
              match_id: 'M1-R2',
              team1_id: 1,
              team2_id: null,
              winner_id: null,
              score: null,
              completed: false,
              match_date: '2024-11-22'
            }
          ]
        }),
        seeding_data: JSON.stringify({
          method: 'ranking',
          criteria: 'tournament_points',
          applied_date: '2024-11-15'
        }),
        settings: JSON.stringify({
          consolation_bracket: true,
          third_place_match: true,
          best_of: 3,
          point_system: 'rally_point_11',
          timeout_rules: {
            timeouts_per_game: 1,
            timeout_duration: 60
          }
        }),
        generated_date: new Date('2024-11-15'),
        finalized_date: null,
        created_at: new Date('2024-11-15'),
        updated_at: now
      },
      
      {
        tournament_id: 1,
        category_id: 2, // Intermedio Masculino Dobles
        name: 'Bracket B - Intermedio Masculino',
        bracket_type: 'round_robin',
        seeding_method: 'random',
        total_rounds: 3,
        current_round: 2,
        is_complete: false,
        winner_player_id: null,
        runner_up_player_id: null,
        third_place_player_id: null,
        fourth_place_player_id: null,
        bracket_data: JSON.stringify({
          teams: [
            { 
              id: 1, 
              players: [4, 5], // player003 + coach001
              names: ['Roberto Sánchez', 'Luis Hernández'],
              seed: 1 
            },
            { 
              id: 2, 
              players: [2, 6], // player001 + coach002
              names: ['Carlos Méndez', 'Ana Ruiz'],
              seed: 2 
            }
          ],
          matches: [
            {
              round: 1,
              match_id: 'RR1-M1',
              team1_id: 1,
              team2_id: 2,
              winner_id: 1,
              score: '11-8, 9-11, 11-7',
              completed: true,
              match_date: '2024-11-18'
            }
          ]
        }),
        seeding_data: JSON.stringify({
          method: 'random',
          seed_date: '2024-11-12'
        }),
        settings: JSON.stringify({
          round_robin_format: true,
          matches_per_team: 4,
          advancement_criteria: 'top_2',
          point_system: 'rally_point_11'
        }),
        generated_date: new Date('2024-11-12'),
        finalized_date: null,
        created_at: new Date('2024-11-12'),
        updated_at: now
      },
      
      {
        tournament_id: 2,
        category_id: 4, // Senior 50+ Mixto Dobles
        name: 'Bracket C - Senior 50+ Mixto',
        bracket_type: 'single_elimination',
        seeding_method: 'manual',
        total_rounds: 3,
        current_round: 1,
        is_complete: false,
        winner_player_id: null,
        runner_up_player_id: null,
        third_place_player_id: null,
        fourth_place_player_id: null,
        bracket_data: JSON.stringify({
          teams: [
            { 
              id: 1, 
              players: [5, 6], // coach001 + coach002
              names: ['Luis Hernández', 'Ana Ruiz'],
              seed: 1 
            }
          ],
          matches: []
        }),
        seeding_data: JSON.stringify({
          method: 'manual',
          manual_seeds: [
            { team_id: 1, seed: 1, reason: 'Experience in senior tournaments' }
          ]
        }),
        settings: JSON.stringify({
          single_elimination: true,
          consolation_bracket: false,
          point_system: 'rally_point_11',
          special_rules: 'Extended rest periods between games'
        }),
        generated_date: new Date('2024-11-25'),
        finalized_date: null,
        created_at: new Date('2024-11-25'),
        updated_at: now
      },
      
      {
        tournament_id: 3,
        category_id: 5, // Open Profesional Singles
        name: 'Bracket Elite - Profesional Singles',
        bracket_type: 'single_elimination',
        seeding_method: 'ranking',
        total_rounds: 5,
        current_round: 5,
        is_complete: true,
        winner_player_id: 3, // player002 (María)
        runner_up_player_id: 4, // player003 (Roberto)
        third_place_player_id: 2, // player001 (Carlos)
        fourth_place_player_id: 5, // coach001 (Luis)
        bracket_data: JSON.stringify({
          teams: [
            { 
              id: 1, 
              players: [3], // player002 singles
              names: ['María González'],
              seed: 1 
            },
            { 
              id: 2, 
              players: [4], // player003 singles
              names: ['Roberto Sánchez'],
              seed: 2 
            },
            { 
              id: 3, 
              players: [2], // player001 singles
              names: ['Carlos Méndez'],
              seed: 3 
            },
            { 
              id: 4, 
              players: [5], // coach001 singles
              names: ['Luis Hernández'],
              seed: 4 
            }
          ],
          matches: [
            {
              round: 1,
              match_id: 'SF1',
              team1_id: 1,
              team2_id: 3,
              winner_id: 1,
              score: '11-7, 11-5, 11-8',
              completed: true,
              match_date: '2024-11-28'
            },
            {
              round: 1,
              match_id: 'SF2',
              team1_id: 2,
              team2_id: 4,
              winner_id: 2,
              score: '11-9, 9-11, 11-6, 11-4',
              completed: true,
              match_date: '2024-11-28'
            },
            {
              round: 2,
              match_id: 'FINAL',
              team1_id: 1,
              team2_id: 2,
              winner_id: 1,
              score: '11-8, 11-6, 9-11, 11-9',
              completed: true,
              match_date: '2024-11-30'
            }
          ]
        }),
        seeding_data: JSON.stringify({
          method: 'ranking',
          criteria: 'national_ranking_points',
          cutoff_date: '2024-11-01'
        }),
        settings: JSON.stringify({
          professional_format: true,
          best_of: 5,
          point_system: 'rally_point_15_final',
          video_review: true,
          live_scoring: true
        }),
        generated_date: new Date('2024-11-01'),
        finalized_date: new Date('2024-11-30'),
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2024-11-30')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournament_brackets', {});
  }
};