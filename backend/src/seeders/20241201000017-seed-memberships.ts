module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const memberships = [
      // Player memberships
      {
        user_id: 2, // player001
        plan_id: 1, // Básico
        status: 'active',
        start_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000), // ~1 year
        auto_renew: true,
        payment_method_id: 1, // player001's card
        last_payment_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        next_payment_date: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000),
        benefits_used: JSON.stringify({
          tournament_registrations: 3,
          court_reservations: 2,
          storage_used_mb: 15
        }),
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 3, // player002
        plan_id: 2, // Pro
        status: 'active',
        start_date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 320 * 24 * 60 * 60 * 1000),
        auto_renew: true,
        payment_method_id: 2, // player002's card
        last_payment_date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        next_payment_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        benefits_used: JSON.stringify({
          tournament_registrations: 8,
          court_reservations: 12,
          storage_used_mb: 245,
          tournaments_created: 1
        }),
        created_at: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 4, // player003
        plan_id: 1, // Básico
        status: 'expired',
        start_date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        auto_renew: false,
        payment_method_id: null,
        last_payment_date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        next_payment_date: null,
        benefits_used: JSON.stringify({
          tournament_registrations: 5,
          court_reservations: 4,
          storage_used_mb: 28
        }),
        created_at: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
      },
      // Coach memberships
      {
        user_id: 5, // coach001
        plan_id: 2, // Pro
        status: 'active',
        start_date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 305 * 24 * 60 * 60 * 1000),
        auto_renew: true,
        payment_method_id: 3, // coach001's card
        last_payment_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        next_payment_date: new Date(now.getTime()),
        benefits_used: JSON.stringify({
          tournament_registrations: 15,
          court_reservations: 45,
          storage_used_mb: 380,
          tournaments_created: 3
        }),
        created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 6, // coach002
        plan_id: 2, // Pro
        status: 'trial',
        start_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 355 * 24 * 60 * 60 * 1000),
        auto_renew: true,
        payment_method_id: null,
        last_payment_date: null,
        next_payment_date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // after trial
        benefits_used: JSON.stringify({
          tournament_registrations: 2,
          court_reservations: 8,
          storage_used_mb: 45,
          tournaments_created: 0
        }),
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      // Partner membership
      {
        user_id: 7, // partner001
        plan_id: 2, // Pro
        status: 'active',
        start_date: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 245 * 24 * 60 * 60 * 1000),
        auto_renew: true,
        payment_method_id: 6, // partner001's card
        last_payment_date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        next_payment_date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        benefits_used: JSON.stringify({
          tournament_registrations: 25,
          court_reservations: 78,
          storage_used_mb: 450,
          tournaments_created: 5
        }),
        created_at: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      // Club memberships
      {
        user_id: 9, // club001
        plan_id: 3, // Club
        status: 'active',
        start_date: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 185 * 24 * 60 * 60 * 1000),
        auto_renew: true,
        payment_method_id: 4, // club001's card
        last_payment_date: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
        next_payment_date: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        benefits_used: JSON.stringify({
          court_facilities: 1,
          courts: 4,
          members: 156,
          storage_used_mb: 1200
        }),
        created_at: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 10, // club002
        plan_id: 3, // Club
        status: 'active',
        start_date: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 215 * 24 * 60 * 60 * 1000),
        auto_renew: true,
        payment_method_id: 5, // club002's bank transfer
        last_payment_date: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        next_payment_date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        benefits_used: JSON.stringify({
          court_facilities: 1,
          courts: 6,
          members: 287,
          storage_used_mb: 1850
        }),
        created_at: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      // State committee membership
      {
        user_id: 11, // state_committee001
        plan_id: 4, // Federación
        status: 'active',
        start_date: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        end_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        auto_renew: true,
        payment_method_id: null, // Federation covers this
        last_payment_date: new Date(now.getTime() - 335 * 24 * 60 * 60 * 1000),
        next_payment_date: new Date(now.getTime() - 305 * 24 * 60 * 60 * 1000),
        benefits_used: JSON.stringify({
          tournaments_official: 12,
          coaches_certified: 8,
          clubs_affiliated: 15,
          storage_used_mb: 5600
        }),
        created_at: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('memberships', memberships);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('memberships', {});
  }
};