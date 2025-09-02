import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default {
  async up(queryInterface: QueryInterface) {
    const subscriptionPlans = [
      {
        id: uuidv4(),
        name: 'Plan Básico',
        description: 'Perfecto para jugadores casuales que buscan conectar con la comunidad de pickleball',
        stripePriceId: 'price_basic_monthly_mx', // This would be created in Stripe
        stripeProductId: 'prod_basic_plan_mx', // This would be created in Stripe
        amount: 19900, // $199 MXN in cents
        currency: 'MXN',
        interval: 'month',
        intervalCount: 1,
        features: JSON.stringify([
          {
            name: 'Registros de Torneos',
            description: 'Participa en torneos locales',
            included: true,
            limit: 2
          },
          {
            name: 'Reservas de Cancha',
            description: 'Reserva canchas en instalaciones afiliadas',
            included: true,
            limit: 4
          },
          {
            name: 'Búsqueda de Jugadores',
            description: 'Encuentra compañeros de juego',
            included: true,
            limit: 10
          },
          {
            name: 'Mensajería Básica',
            description: 'Comunícate con otros jugadores',
            included: true
          },
          {
            name: 'Perfil Público',
            description: 'Crea tu perfil de jugador',
            included: true
          }
        ]),
        maxTournamentRegistrations: 2,
        maxCourtBookings: 4,
        maxPlayerMatches: 10,
        advancedFilters: false,
        prioritySupport: false,
        analyticsAccess: false,
        customBranding: false,
        isActive: true,
        isPopular: false,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Plan Pro',
        description: 'Ideal para jugadores activos que participan regularmente en torneos y eventos',
        stripePriceId: 'price_pro_monthly_mx',
        stripeProductId: 'prod_pro_plan_mx',
        amount: 39900, // $399 MXN in cents
        currency: 'MXN',
        interval: 'month',
        intervalCount: 1,
        features: JSON.stringify([
          {
            name: 'Registros de Torneos Ilimitados',
            description: 'Participa en todos los torneos disponibles',
            included: true
          },
          {
            name: 'Reservas de Cancha',
            description: 'Reserva canchas con descuentos especiales',
            included: true,
            limit: 12
          },
          {
            name: 'Búsqueda Avanzada',
            description: 'Filtros avanzados para encontrar jugadores',
            included: true
          },
          {
            name: 'Mensajería Premium',
            description: 'Chat grupal y notificaciones push',
            included: true
          },
          {
            name: 'Análisis de Rendimiento',
            description: 'Estadísticas detalladas de tus partidos',
            included: true
          },
          {
            name: 'Soporte Prioritario',
            description: 'Atención al cliente prioritaria',
            included: true
          }
        ]),
        maxTournamentRegistrations: null, // Unlimited
        maxCourtBookings: 12,
        maxPlayerMatches: null, // Unlimited
        advancedFilters: true,
        prioritySupport: true,
        analyticsAccess: true,
        customBranding: false,
        isActive: true,
        isPopular: true, // Mark as most popular
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Plan Elite',
        description: 'Para clubes y organizadores de torneos que necesitan herramientas profesionales',
        stripePriceId: 'price_elite_monthly_mx',
        stripeProductId: 'prod_elite_plan_mx',
        amount: 79900, // $799 MXN in cents
        currency: 'MXN',
        interval: 'month',
        intervalCount: 1,
        features: JSON.stringify([
          {
            name: 'Todo de Plan Pro',
            description: 'Todas las características del Plan Pro',
            included: true
          },
          {
            name: 'Organización de Torneos',
            description: 'Crea y administra tus propios torneos',
            included: true
          },
          {
            name: 'Marca Personalizada',
            description: 'Personaliza tu perfil con logo y colores',
            included: true
          },
          {
            name: 'Análisis Avanzado',
            description: 'Reportes detallados y métricas de negocio',
            included: true
          },
          {
            name: 'Gestión de Instalaciones',
            description: 'Administra múltiples canchas y instalaciones',
            included: true
          },
          {
            name: 'API Access',
            description: 'Integración con sistemas externos',
            included: true
          },
          {
            name: 'Soporte Dedicado',
            description: 'Gerente de cuenta dedicado',
            included: true
          }
        ]),
        maxTournamentRegistrations: null,
        maxCourtBookings: null,
        maxPlayerMatches: null,
        advancedFilters: true,
        prioritySupport: true,
        analyticsAccess: true,
        customBranding: true,
        isActive: true,
        isPopular: false,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Plan Anual Básico',
        description: 'Plan Básico con descuento por pago anual - Ahorra 20%',
        stripePriceId: 'price_basic_yearly_mx',
        stripeProductId: 'prod_basic_plan_mx',
        amount: 191040, // $1910.40 MXN in cents (20% discount)
        currency: 'MXN',
        interval: 'year',
        intervalCount: 1,
        features: JSON.stringify([
          {
            name: 'Registros de Torneos',
            description: 'Participa en torneos locales',
            included: true,
            limit: 2
          },
          {
            name: 'Reservas de Cancha',
            description: 'Reserva canchas en instalaciones afiliadas',
            included: true,
            limit: 4
          },
          {
            name: 'Búsqueda de Jugadores',
            description: 'Encuentra compañeros de juego',
            included: true,
            limit: 10
          },
          {
            name: 'Mensajería Básica',
            description: 'Comunícate con otros jugadores',
            included: true
          },
          {
            name: 'Ahorro del 20%',
            description: 'Descuento por pago anual',
            included: true
          }
        ]),
        maxTournamentRegistrations: 2,
        maxCourtBookings: 4,
        maxPlayerMatches: 10,
        advancedFilters: false,
        prioritySupport: false,
        analyticsAccess: false,
        customBranding: false,
        isActive: true,
        isPopular: false,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Plan Anual Pro',
        description: 'Plan Pro con descuento por pago anual - Ahorra 25%',
        stripePriceId: 'price_pro_yearly_mx',
        stripeProductId: 'prod_pro_plan_mx',
        amount: 359100, // $3591 MXN in cents (25% discount)
        currency: 'MXN',
        interval: 'year',
        intervalCount: 1,
        features: JSON.stringify([
          {
            name: 'Todas las características Pro',
            description: 'Acceso completo a funciones profesionales',
            included: true
          },
          {
            name: 'Ahorro del 25%',
            description: 'Descuento por pago anual',
            included: true
          },
          {
            name: 'Meses adicionales gratis',
            description: '2 meses adicionales incluidos',
            included: true
          }
        ]),
        maxTournamentRegistrations: null,
        maxCourtBookings: 12,
        maxPlayerMatches: null,
        advancedFilters: true,
        prioritySupport: true,
        analyticsAccess: true,
        customBranding: false,
        isActive: true,
        isPopular: false,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('SubscriptionPlans', subscriptionPlans);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('SubscriptionPlans', {}, {});
  }
};