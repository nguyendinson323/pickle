import MembershipPlan from '../models/MembershipPlan';

export const membershipPlanData = [
  // Player Plans
  {
    name: 'Membresía Básica de Jugador',
    role: 'player' as const,
    planType: 'basic' as const,
    annualFee: 800.00,
    monthlyFee: 75.00,
    features: [
      'Credencial digital oficial',
      'Acceso a ranking nacional',
      'Participación en torneos oficiales',
      'Sistema de mensajería básico',
      'Perfil en el directorio público'
    ],
    stripePriceId: 'price_player_basic_annual',
    description: 'Membresía básica para jugadores que incluye los servicios esenciales de la federación.',
    isActive: true
  },
  {
    name: 'Membresía Premium de Jugador',
    role: 'player' as const,
    planType: 'premium' as const,
    annualFee: 1500.00,
    monthlyFee: 135.00,
    features: [
      'Todos los beneficios del plan básico',
      'Buscador de jugadores nearby',
      'Notificaciones por SMS',
      'Estadísticas avanzadas de juego',
      'Descuentos en torneos premium',
      'Acceso prioritario a eventos',
      'Coaching virtual básico'
    ],
    stripePriceId: 'price_player_premium_annual',
    description: 'Membresía premium para jugadores con funciones avanzadas y beneficios exclusivos.',
    isActive: true
  },

  // Coach Plans
  {
    name: 'Membresía de Entrenador',
    role: 'coach' as const,
    planType: 'basic' as const,
    annualFee: 1200.00,
    monthlyFee: 110.00,
    features: [
      'Credencial digital de entrenador',
      'Certificaciones oficiales',
      'Historial de arbitrajes',
      'Acceso a recursos de entrenamiento',
      'Perfil en directorio de entrenadores',
      'Sistema de calificaciones',
      'Gestión de estudiantes'
    ],
    stripePriceId: 'price_coach_basic_annual',
    description: 'Membresía para entrenadores certificados con acceso a herramientas profesionales.',
    isActive: true
  },

  // Club Plans
  {
    name: 'Afiliación Básica de Club',
    role: 'club' as const,
    planType: 'basic' as const,
    annualFee: 3000.00,
    monthlyFee: 275.00,
    features: [
      'Reconocimiento oficial como club afiliado',
      'Listado en directorio de clubes',
      'Participación en eventos federados',
      'Gestión básica de miembros',
      'Sistema de mensajería',
      'Micrositio básico'
    ],
    stripePriceId: 'price_club_basic_annual',
    description: 'Afiliación básica para clubes que buscan reconocimiento oficial.',
    isActive: true
  },
  {
    name: 'Membresía Premium de Club',
    role: 'club' as const,
    planType: 'premium' as const,
    annualFee: 6000.00,
    monthlyFee: 550.00,
    features: [
      'Todos los beneficios del plan básico',
      'Gestión avanzada de canchas',
      'Sistema de reservas integrado',
      'Organización de torneos',
      'Facturación y pagos',
      'Reportes de uso de canchas',
      'Micrositio personalizado',
      'Marketing digital básico'
    ],
    stripePriceId: 'price_club_premium_annual',
    description: 'Membresía premium para clubes con canchas y servicios comerciales.',
    isActive: true
  },

  // Partner Plans
  {
    name: 'Membresía de Socio Comercial',
    role: 'partner' as const,
    planType: 'premium' as const,
    annualFee: 8000.00,
    monthlyFee: 750.00,
    features: [
      'Reconocimiento como socio oficial',
      'Micrositio comercial personalizado',
      'Gestión de canchas comerciales',
      'Sistema de reservas y pagos',
      'Organización de eventos comerciales',
      'Exposición en directorio premium',
      'Analytics de negocio',
      'Soporte comercial prioritario',
      'Branded marketing materials'
    ],
    stripePriceId: 'price_partner_premium_annual',
    description: 'Membresía para socios comerciales, hoteles, y proveedores de servicios.',
    isActive: true
  },

  // State Committee Plans
  {
    name: 'Afiliación de Comité Estatal',
    role: 'state' as const,
    planType: 'basic' as const,
    annualFee: 15000.00,
    monthlyFee: 1350.00,
    features: [
      'Reconocimiento oficial como comité estatal',
      'Administración de jugadores del estado',
      'Organización de torneos estatales',
      'Sistema de rankings estatales',
      'Micrositio institucional',
      'Gestión de clubes afiliados',
      'Sistema de comunicaciones masivas',
      'Reportes estadísticos estatales',
      'Certificación de entrenadores locales'
    ],
    stripePriceId: 'price_state_basic_annual',
    description: 'Afiliación para comités estatales con autoridad regional.',
    isActive: true
  }
];

export const seedMembershipPlans = async (): Promise<any[]> => {
  console.log('💳 Seeding membership plans...');
  
  const plans = await MembershipPlan.bulkCreate(membershipPlanData, {
    ignoreDuplicates: true,
    returning: true
  });
  
  console.log(`✅ Seeded ${plans.length} membership plans`);
  return plans;
};

export default seedMembershipPlans;