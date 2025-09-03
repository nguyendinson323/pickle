module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('tournament_categories', [
      // Categories for Tournament 1
      {
        tournament_id: 1,
        name: 'Principiantes Mixto Dobles',
        description: 'Categoría para jugadores principiantes de ambos géneros en modalidad de dobles',
        min_age: null,
        max_age: null,
        skill_level: 'beginner',
        gender_requirement: 'mixed',
        play_format: 'doubles',
        entry_fee: 300.00,
        max_participants: 32,
        current_participants: 18,
        min_ranking_points: null,
        max_ranking_points: 500,
        prize_distribution: JSON.stringify({
          first: 5000, // $50 MXN
          second: 3000, // $30 MXN
          third: 2000 // $20 MXN
        }),
        special_rules: 'Partidos al mejor de 3 sets. Límite de tiempo 45 minutos.',
        is_active: true,
        registration_deadline: '2024-12-15',
        created_at: now,
        updated_at: now
      },
      {
        tournament_id: 1,
        name: 'Intermedio Masculino Dobles',
        description: 'Categoría intermedia masculina en modalidad de dobles',
        min_age: null,
        max_age: null,
        skill_level: 'intermediate',
        gender_requirement: 'men',
        play_format: 'doubles',
        entry_fee: 500.00,
        max_participants: 24,
        current_participants: 20,
        min_ranking_points: 500,
        max_ranking_points: 1500,
        prize_distribution: JSON.stringify({
          first: 10000, // $100 MXN
          second: 6000, // $60 MXN
          third: 4000 // $40 MXN
        }),
        special_rules: 'Partidos al mejor de 3 sets. Sistema rally point a 11.',
        is_active: true,
        registration_deadline: '2024-12-15',
        created_at: now,
        updated_at: now
      },
      {
        tournament_id: 1,
        name: 'Avanzado Femenil Singles',
        description: 'Categoría avanzada femenina en modalidad individual',
        min_age: null,
        max_age: null,
        skill_level: 'advanced',
        gender_requirement: 'women',
        play_format: 'singles',
        entry_fee: 600.00,
        max_participants: 16,
        current_participants: 12,
        min_ranking_points: 1500,
        max_ranking_points: null,
        prize_distribution: JSON.stringify({
          first: 15000, // $150 MXN
          second: 10000, // $100 MXN
          third: 5000 // $50 MXN
        }),
        special_rules: 'Partidos al mejor de 5 sets en semifinales y final.',
        is_active: true,
        registration_deadline: '2024-12-15',
        created_at: now,
        updated_at: now
      },
      
      // Categories for Tournament 2
      {
        tournament_id: 2,
        name: 'Senior 50+ Mixto Dobles',
        description: 'Categoría para jugadores seniors de 50 años o más en modalidad mixta',
        min_age: 50,
        max_age: null,
        skill_level: 'intermediate',
        gender_requirement: 'mixed',
        play_format: 'mixed_doubles',
        entry_fee: 400.00,
        max_participants: 20,
        current_participants: 15,
        min_ranking_points: null,
        max_ranking_points: null,
        prize_distribution: JSON.stringify({
          first: 8000, // $80 MXN
          second: 5000, // $50 MXN
          third: 3000 // $30 MXN
        }),
        special_rules: 'Tiempo de descanso extendido entre sets. Partidos a 2 sets ganados.',
        is_active: true,
        registration_deadline: '2024-11-30',
        created_at: now,
        updated_at: now
      },
      
      // Categories for Tournament 3
      {
        tournament_id: 3,
        name: 'Open Profesional Singles',
        description: 'Categoría abierta profesional individual sin restricciones de género',
        min_age: 18,
        max_age: null,
        skill_level: 'advanced',
        gender_requirement: 'open',
        play_format: 'singles',
        entry_fee: 1000.00,
        max_participants: 32,
        current_participants: 28,
        min_ranking_points: 2000,
        max_ranking_points: null,
        prize_distribution: JSON.stringify({
          first: 50000, // $500 MXN
          second: 30000, // $300 MXN
          third: 20000, // $200 MXN
          fourth: 10000 // $100 MXN
        }),
        special_rules: 'Formato profesional. Partidos al mejor de 5 sets. Rally point a 15 en finales.',
        is_active: true,
        registration_deadline: '2024-12-31',
        created_at: now,
        updated_at: now
      },
      {
        tournament_id: 3,
        name: 'Open Profesional Dobles Mixtos',
        description: 'Categoría profesional de dobles mixtos sin restricciones de edad',
        min_age: 16,
        max_age: null,
        skill_level: 'advanced',
        gender_requirement: 'mixed',
        play_format: 'mixed_doubles',
        entry_fee: 800.00,
        max_participants: 24,
        current_participants: 20,
        min_ranking_points: 1800,
        max_ranking_points: null,
        prize_distribution: JSON.stringify({
          first: 40000, // $400 MXN (por pareja)
          second: 25000, // $250 MXN (por pareja)
          third: 15000 // $150 MXN (por pareja)
        }),
        special_rules: 'Formato profesional. Sistema suizo + eliminación directa.',
        is_active: true,
        registration_deadline: '2024-12-31',
        created_at: now,
        updated_at: now
      },
      
      // Categories for Tournament 4
      {
        tournament_id: 4,
        name: 'Nacional Elite Open',
        description: 'Categoría élite nacional abierta a los mejores jugadores del país',
        min_age: 18,
        max_age: null,
        skill_level: 'open',
        gender_requirement: 'open',
        play_format: 'singles',
        entry_fee: 2000.00,
        max_participants: 64,
        current_participants: 45,
        min_ranking_points: 3000,
        max_ranking_points: null,
        prize_distribution: JSON.stringify({
          first: 200000, // $2,000 MXN
          second: 120000, // $1,200 MXN
          third: 80000, // $800 MXN
          fourth: 50000, // $500 MXN
          semifinalists: 25000 // $250 MXN cada uno
        }),
        special_rules: 'Formato nacional. Ranking obligatorio. Partidos televisados en finales.',
        is_active: false, // Draft status
        registration_deadline: '2025-02-15',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournament_categories', {});
  }
};