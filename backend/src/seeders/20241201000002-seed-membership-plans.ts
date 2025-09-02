module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('membership_plans', [
      {
        name: 'Jugador Básico',
        role: 'player',
        plan_type: 'basic',
        annual_fee: 800.00,
        monthly_fee: 80.00,
        features: JSON.stringify(['Acceso a torneos locales', 'Ranking estatal', 'Certificado básico']),
        stripe_price_id: 'price_player_basic',
        description: 'Plan básico para jugadores recreativos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Jugador Premium',
        role: 'player',
        plan_type: 'premium',
        annual_fee: 1500.00,
        monthly_fee: 150.00,
        features: JSON.stringify(['Acceso a todos los torneos', 'Ranking nacional', 'Certificado premium', 'Descuentos en equipo']),
        stripe_price_id: 'price_player_premium',
        description: 'Plan premium para jugadores competitivos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Entrenador Básico',
        role: 'coach',
        plan_type: 'basic',
        annual_fee: 1200.00,
        monthly_fee: 120.00,
        features: JSON.stringify(['Certificación básica', 'Acceso a recursos de entrenamiento', 'Listado en directorio']),
        stripe_price_id: 'price_coach_basic',
        description: 'Plan básico para entrenadores',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Club Afiliado',
        role: 'club',
        plan_type: 'premium',
        annual_fee: 5000.00,
        monthly_fee: 500.00,
        features: JSON.stringify(['Certificación oficial', 'Organización de torneos', 'Micrositio web', 'Soporte técnico']),
        stripe_price_id: 'price_club_premium',
        description: 'Afiliación para clubes deportivos',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('membership_plans', null, {});
  }
};