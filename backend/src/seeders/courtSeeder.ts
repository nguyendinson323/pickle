import Court from '../models/Court';

export const seedCourts = async (states: any[], users: any[]): Promise<any[]> => {
  console.log('🏟️  Seeding courts...');
  
  const clubUsers = users.filter(u => u.role === 'club');
  const partnerUsers = users.filter(u => u.role === 'partner');
  
  const courtData = [
    // Club courts - Ciudad de México
    {
      name: 'Cancha Principal CDMX',
      description: 'Cancha principal del Club Pickleball Ciudad de México con superficie profesional y excelente iluminación LED.',
      surfaceType: 'concrete',
      ownerType: 'club',
      ownerId: clubUsers[0]?.id,
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      address: 'Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México, CDMX 03100',
      latitude: 19.3910,
      longitude: -99.1620,
      amenities: ['lighting', 'seating', 'parking', 'restrooms', 'water_fountain', 'equipment_rental'],
      hourlyRate: 350.00,
      peakHourRate: 450.00,
      weekendRate: 400.00,
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '08:00', endTime: '20:00' }, // Sunday
        1: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Monday
        2: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Tuesday
        3: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Wednesday
        4: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Thursday
        5: { isOpen: true, startTime: '06:00', endTime: '22:00' }, // Friday
        6: { isOpen: true, startTime: '07:00', endTime: '21:00' }  // Saturday
      },
      maxAdvanceBookingDays: 30,
      minBookingDuration: 60,
      maxBookingDuration: 180,
      cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
    },
    {
      name: 'Cancha Secundaria CDMX',
      description: 'Segunda cancha del club con las mismas especificaciones técnicas que la cancha principal.',
      surfaceType: 'asphalt',
      ownerType: 'club',
      ownerId: clubUsers[0]?.id,
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      address: 'Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México, CDMX 03100',
      latitude: 19.3912,
      longitude: -99.1618,
      amenities: ['lighting', 'seating', 'parking', 'restrooms', 'water_fountain'],
      hourlyRate: 300.00,
      peakHourRate: 400.00,
      weekendRate: 350.00,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '08:00', endTime: '20:00' },
        1: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        2: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        3: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        4: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        5: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        6: { isOpen: true, startTime: '07:00', endTime: '21:00' }
      },
      maxAdvanceBookingDays: 30,
      minBookingDuration: 60,
      maxBookingDuration: 180,
      cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
    },

    // Club courts - Monterrey
    {
      name: 'Cancha Norte Monterrey',
      description: 'Cancha al aire libre con vista panorámica de la Sierra Madre Oriental.',
      surfaceType: 'concrete',
      ownerType: 'club',
      ownerId: clubUsers[1]?.id,
      stateId: states.find(s => s.code === 'NL')?.id || states[2].id,
      address: 'Av. Constitución 456, Col. Centro, Monterrey, NL 64000',
      latitude: 25.6866,
      longitude: -100.3161,
      amenities: ['lighting', 'seating', 'parking', 'restrooms', 'cafeteria'],
      hourlyRate: 280.00,
      peakHourRate: 380.00,
      weekendRate: 320.00,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a8a?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '07:00', endTime: '19:00' },
        1: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        2: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        3: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        4: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        5: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        6: { isOpen: true, startTime: '07:00', endTime: '20:00' }
      },
      maxAdvanceBookingDays: 21,
      minBookingDuration: 60,
      maxBookingDuration: 120,
      cancellationPolicy: 'Cancelación gratuita hasta 12 horas antes.'
    },
    {
      name: 'Cancha Sur Monterrey',
      description: 'Segunda cancha del Centro Deportivo Monterrey con superficie de primera calidad.',
      surfaceType: 'composite',
      ownerType: 'club',
      ownerId: clubUsers[1]?.id,
      stateId: states.find(s => s.code === 'NL')?.id || states[2].id,
      address: 'Av. Constitución 456, Col. Centro, Monterrey, NL 64000',
      latitude: 25.6864,
      longitude: -100.3163,
      amenities: ['lighting', 'seating', 'parking', 'restrooms'],
      hourlyRate: 260.00,
      peakHourRate: 360.00,
      weekendRate: 300.00,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '07:00', endTime: '19:00' },
        1: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        2: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        3: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        4: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        5: { isOpen: true, startTime: '06:00', endTime: '21:00' },
        6: { isOpen: true, startTime: '07:00', endTime: '20:00' }
      },
      maxAdvanceBookingDays: 21,
      minBookingDuration: 60,
      maxBookingDuration: 120,
      cancellationPolicy: 'Cancelación gratuita hasta 12 horas antes.'
    },

    // Club courts - Guadalajara
    {
      name: 'Cancha Elite Guadalajara',
      description: 'Cancha premium con superficie acrílica y tecnología avanzada de iluminación.',
      surfaceType: 'acrylic',
      ownerType: 'club',
      ownerId: clubUsers[2]?.id,
      stateId: states.find(s => s.code === 'JAL')?.id || states[1].id,
      address: 'Av. Patria 789, Col. Providencia, Guadalajara, JAL 44630',
      latitude: 20.6765,
      longitude: -103.3918,
      amenities: ['professional_lighting', 'premium_seating', 'vip_parking', 'premium_restrooms', 'pro_shop', 'equipment_rental'],
      hourlyRate: 420.00,
      peakHourRate: 550.00,
      weekendRate: 480.00,
      images: [
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '08:00', endTime: '21:00' },
        1: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        2: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        3: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        4: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        5: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        6: { isOpen: true, startTime: '07:00', endTime: '22:00' }
      },
      maxAdvanceBookingDays: 45,
      minBookingDuration: 90,
      maxBookingDuration: 240,
      cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes. 25% de reembolso entre 24-48 horas antes.'
    },

    // Partner courts - Deportes México
    {
      name: 'Cancha Premium Deportes México',
      description: 'Cancha de exhibición con las más altas especificaciones técnicas, ideal para torneos profesionales.',
      surfaceType: 'acrylic',
      ownerType: 'partner',
      ownerId: partnerUsers[0]?.id,
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      address: 'Polanco Business Center, Av. Presidente Masaryk 111, Polanco, CDMX 11560',
      latitude: 19.4326,
      longitude: -99.1949,
      amenities: ['professional_lighting', 'vip_seating', 'valet_parking', 'premium_restrooms', 'pro_shop', 'equipment_rental', 'cafeteria'],
      hourlyRate: 500.00,
      peakHourRate: 650.00,
      weekendRate: 580.00,
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '08:00', endTime: '22:00' },
        1: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        2: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        3: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        4: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        5: { isOpen: true, startTime: '06:00', endTime: '23:00' },
        6: { isOpen: true, startTime: '07:00', endTime: '22:00' }
      },
      maxAdvanceBookingDays: 60,
      minBookingDuration: 90,
      maxBookingDuration: 240,
      cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes. 25% de reembolso entre 24-48 horas antes.'
    },
    {
      name: 'Cancha Entrenamiento Deportes México',
      description: 'Cancha dedicada a entrenamientos y clínicas con entrenadores certificados.',
      surfaceType: 'concrete',
      ownerType: 'partner',
      ownerId: partnerUsers[0]?.id,
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      address: 'Polanco Business Center, Av. Presidente Masaryk 111, Polanco, CDMX 11560',
      latitude: 19.4328,
      longitude: -99.1947,
      amenities: ['lighting', 'seating', 'parking', 'restrooms', 'equipment_rental', 'coaching_area'],
      hourlyRate: 400.00,
      peakHourRate: 520.00,
      weekendRate: 460.00,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '08:00', endTime: '20:00' },
        1: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        2: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        3: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        4: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        5: { isOpen: true, startTime: '06:00', endTime: '22:00' },
        6: { isOpen: true, startTime: '07:00', endTime: '21:00' }
      },
      maxAdvanceBookingDays: 45,
      minBookingDuration: 60,
      maxBookingDuration: 180,
      cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes. 50% de reembolso entre 2-24 horas antes.'
    },

    // Partner courts - Hotel Riviera Maya
    {
      name: 'Cancha Resort Riviera Maya',
      description: 'Cancha de resort con vista al mar Caribe, perfecta para huéspedes y eventos especiales.',
      surfaceType: 'composite',
      ownerType: 'partner',
      ownerId: partnerUsers[1]?.id,
      stateId: states.find(s => s.code === 'QROO')?.id || states[5].id,
      address: 'Carretera Chetumal-Puerto Juárez Km 298, Riviera Maya, QROO 77750',
      latitude: 20.6296,
      longitude: -87.0739,
      amenities: ['ocean_view', 'lighting', 'resort_seating', 'vip_parking', 'resort_restrooms', 'beach_access', 'equipment_rental'],
      hourlyRate: 600.00,
      peakHourRate: 750.00,
      weekendRate: 680.00,
      images: [
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a8a?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
      ],
      isActive: true,
      operatingHours: {
        0: { isOpen: true, startTime: '07:00', endTime: '21:00' },
        1: { isOpen: true, startTime: '07:00', endTime: '21:00' },
        2: { isOpen: true, startTime: '07:00', endTime: '21:00' },
        3: { isOpen: true, startTime: '07:00', endTime: '21:00' },
        4: { isOpen: true, startTime: '07:00', endTime: '21:00' },
        5: { isOpen: true, startTime: '07:00', endTime: '22:00' },
        6: { isOpen: true, startTime: '07:00', endTime: '22:00' }
      },
      maxAdvanceBookingDays: 90,
      minBookingDuration: 60,
      maxBookingDuration: 180,
      cancellationPolicy: 'Cancelación gratuita hasta 48 horas antes. Para huéspedes del hotel: cancelación gratuita hasta 2 horas antes.'
    }
  ];

  const courts = await Court.bulkCreate(courtData, {
    ignoreDuplicates: true,
    returning: true
  });

  console.log(`✅ Seeded ${courts.length} courts`);
  return courts;
};

export default seedCourts;