module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const subscriptionPlans = [
      {
        name: 'Básico',
        description: 'Plan básico para jugadores individuales con acceso a funcionalidades esenciales',
        stripe_price_id: 'price_basic_monthly_mx',
        stripe_product_id: 'prod_basic_mx',
        amount: 19900, // $199.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        trial_period_days: 7,
        features: JSON.stringify([
          {
            name: 'Búsqueda de torneos',
            description: 'Acceso completo a búsqueda de torneos',
            included: true
          },
          {
            name: 'Perfil de jugador',
            description: 'Perfil personal completo',
            included: true
          },
          {
            name: 'Ranking básico',
            description: 'Acceso al sistema de ranking',
            included: true
          },
          {
            name: 'Reservas de cancha',
            description: 'Hasta 5 reservas por mes',
            included: true,
            limit: 5
          }
        ]),
        max_tournament_registrations: 10,
        max_court_bookings: 5,
        max_player_matches: 20,
        advanced_filters: false,
        priority_support: false,
        analytics_access: false,
        custom_branding: false,
        is_active: true,
        is_popular: false,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Pro',
        description: 'Plan profesional para entrenadores y jugadores avanzados',
        stripe_price_id: 'price_pro_monthly_mx',
        stripe_product_id: 'prod_pro_mx',
        amount: 49900, // $499.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        trial_period_days: 14,
        features: JSON.stringify([
          {
            name: 'Todas las funciones básicas',
            description: 'Incluye todas las características del plan básico',
            included: true
          },
          {
            name: 'Creación de torneos',
            description: 'Capacidad para crear y gestionar torneos',
            included: true
          },
          {
            name: 'Análisis de rendimiento',
            description: 'Estadísticas detalladas de rendimiento',
            included: true
          },
          {
            name: 'Reservas ilimitadas',
            description: 'Sin límite en reservas de cancha',
            included: true
          },
          {
            name: 'Micrositio personal',
            description: 'Sitio web personalizado',
            included: true
          }
        ]),
        max_tournament_registrations: null, // unlimited
        max_court_bookings: null, // unlimited  
        max_player_matches: null, // unlimited
        advanced_filters: true,
        priority_support: true,
        analytics_access: true,
        custom_branding: false,
        is_active: true,
        is_popular: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Club',
        description: 'Plan especializado para clubes deportivos',
        stripe_price_id: 'price_club_monthly_mx',
        stripe_product_id: 'prod_club_mx',
        amount: 99900, // $999.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        trial_period_days: 30,
        features: JSON.stringify([
          {
            name: 'Gestión completa de instalaciones',
            description: 'Administración total de instalaciones deportivas',
            included: true
          },
          {
            name: 'Sistema de reservas',
            description: 'Sistema avanzado de reservas',
            included: true
          },
          {
            name: 'Micrositio personalizado',
            description: 'Sitio web con branding personalizado',
            included: true
          },
          {
            name: 'Análisis de ocupación',
            description: 'Reportes detallados de uso de instalaciones',
            included: true
          },
          {
            name: 'Gestión de miembros',
            description: 'Administración completa de membresías',
            included: true
          }
        ]),
        max_tournament_registrations: null, // unlimited
        max_court_bookings: null, // unlimited
        max_player_matches: null, // unlimited  
        advanced_filters: true,
        priority_support: true,
        analytics_access: true,
        custom_branding: true,
        is_active: true,
        is_popular: false,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Federación',
        description: 'Plan premium para federaciones estatales',
        stripe_price_id: 'price_federation_monthly_mx',
        stripe_product_id: 'prod_federation_mx',
        amount: 199900, // $1999.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        trial_period_days: 0,
        features: JSON.stringify([
          {
            name: 'Gestión completa de estado',
            description: 'Administración a nivel estatal',
            included: true
          },
          {
            name: 'Organización de torneos oficiales',
            description: 'Gestión de torneos oficiales y certificados',
            included: true
          },
          {
            name: 'Certificación de entrenadores',
            description: 'Sistema de certificación oficial',
            included: true
          },
          {
            name: 'Ranking oficial',
            description: 'Sistema de ranking oficial estatal',
            included: true
          },
          {
            name: 'Panel administrativo completo',
            description: 'Herramientas administrativas avanzadas',
            included: true
          }
        ]),
        max_tournament_registrations: null, // unlimited
        max_court_bookings: null, // unlimited
        max_player_matches: null, // unlimited
        advanced_filters: true,
        priority_support: true,
        analytics_access: true,
        custom_branding: true,
        is_active: true,
        is_popular: false,
        sort_order: 4,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('subscription_plans', subscriptionPlans);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subscription_plans', {});
  }
};