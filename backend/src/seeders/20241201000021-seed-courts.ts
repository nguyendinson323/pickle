module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const courts = [
      // Courts for facility 1 (Club001 - Roma Norte)
      {
        facility_id: 1,
        court_number: 'A1',
        name: 'Cancha Principal',
        court_type: 'indoor',
        surface: 'sport_court',
        dimensions: JSON.stringify({
          length: 20,
          width: 10,
          unit: 'meters'
        }),
        net_height: 0.86,
        lighting: 'led',
        has_lights: true,
        windscreen: false,
        covered: true,
        accessibility: JSON.stringify({
          wheelchair_accessible: true,
          handicap_parking: true,
          accessible_restrooms: true
        }),
        condition: 'excellent',
        last_inspection: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        next_maintenance_date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        is_active: true,
        is_available_for_booking: true,
        booking_notes: 'Cancha premium con sistema de iluminación LED y superficie profesional',
        hourly_rate: 40000, // $400.00 MXN in cents
        peak_hour_rate: 55000, // $550.00 MXN in cents
        currency: 'MXN',
        minimum_booking_duration: 60,
        maximum_booking_duration: 180,
        advance_booking_days: 30,
        cancellation_deadline_hours: 24,
        equipment_included: JSON.stringify(['Red profesional', 'Marcador digital', 'Sistema de sonido']),
        additional_equipment: JSON.stringify(['Pelotas premium', 'Paletas de demostración', 'Cronómetro']),
        special_features: JSON.stringify(['Cámara de video', 'Transmisión en vivo', 'Análisis de juego']),
        photos: JSON.stringify(['/uploads/courts/court_a1_1.jpg', '/uploads/courts/court_a1_2.jpg']),
        maintenance_history: JSON.stringify({
          last_cleaning: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          last_repair: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          last_surface_work: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
          last_net_replacement: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        }),
        utilization_stats: JSON.stringify({
          total_bookings: 145,
          total_hours: 290,
          average_rating: 4.8,
          last_booking: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }),
        restrictions: JSON.stringify({
          min_age: null,
          max_players: 4,
          skill_level_restriction: 'none',
          member_only: false,
          coach_required: false,
          tournament_use: true
        }),
        operating_hours: JSON.stringify({
          monday: { open: '06:00', close: '22:00', closed: false },
          tuesday: { open: '06:00', close: '22:00', closed: false },
          wednesday: { open: '06:00', close: '22:00', closed: false },
          thursday: { open: '06:00', close: '22:00', closed: false },
          friday: { open: '06:00', close: '23:00', closed: false },
          saturday: { open: '07:00', close: '23:00', closed: false },
          sunday: { open: '07:00', close: '21:00', closed: false }
        }),
        created_at: now,
        updated_at: now
      },
      {
        facility_id: 1,
        court_number: 'A2',
        name: 'Cancha Norte',
        court_type: 'indoor',
        surface: 'sport_court',
        dimensions: JSON.stringify({
          length: 20,
          width: 10,
          unit: 'meters'
        }),
        net_height: 0.86,
        lighting: 'led',
        has_lights: true,
        windscreen: false,
        covered: true,
        accessibility: JSON.stringify({
          wheelchair_accessible: true,
          handicap_parking: false,
          accessible_restrooms: true
        }),
        condition: 'good',
        last_inspection: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        next_maintenance_date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        is_active: true,
        is_available_for_booking: true,
        booking_notes: 'Cancha estándar ideal para entrenamientos y juegos recreativos',
        hourly_rate: 30000, // $300.00 MXN in cents
        peak_hour_rate: 40000, // $400.00 MXN in cents
        currency: 'MXN',
        minimum_booking_duration: 60,
        maximum_booking_duration: 180,
        advance_booking_days: 30,
        cancellation_deadline_hours: 24,
        equipment_included: JSON.stringify(['Red estándar', 'Marcador manual']),
        additional_equipment: JSON.stringify(['Pelotas estándar', 'Conos de entrenamiento']),
        special_features: JSON.stringify(['Ventilación natural', 'Iluminación natural']),
        photos: JSON.stringify(['/uploads/courts/court_a2_1.jpg']),
        maintenance_history: JSON.stringify({
          last_cleaning: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          last_repair: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
          last_surface_work: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
          last_net_replacement: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
        }),
        utilization_stats: JSON.stringify({
          total_bookings: 98,
          total_hours: 185,
          average_rating: 4.3,
          last_booking: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        }),
        restrictions: JSON.stringify({
          min_age: null,
          max_players: 4,
          skill_level_restriction: 'none',
          member_only: false,
          coach_required: false,
          tournament_use: false
        }),
        operating_hours: JSON.stringify({
          monday: { open: '06:00', close: '22:00', closed: false },
          tuesday: { open: '06:00', close: '22:00', closed: false },
          wednesday: { open: '06:00', close: '22:00', closed: false },
          thursday: { open: '06:00', close: '22:00', closed: false },
          friday: { open: '06:00', close: '23:00', closed: false },
          saturday: { open: '07:00', close: '23:00', closed: false },
          sunday: { open: '07:00', close: '21:00', closed: false }
        }),
        created_at: now,
        updated_at: now
      },
      // Courts for facility 2 (Club002 - Polanco Elite)
      {
        facility_id: 2,
        court_number: 'P1',
        name: 'Cancha Championship',
        court_type: 'indoor',
        surface: 'acrylic',
        dimensions: JSON.stringify({
          length: 20,
          width: 10,
          unit: 'meters'
        }),
        net_height: 0.86,
        lighting: 'professional',
        has_lights: true,
        windscreen: true,
        covered: true,
        accessibility: JSON.stringify({
          wheelchair_accessible: true,
          handicap_parking: true,
          accessible_restrooms: true
        }),
        condition: 'excellent',
        last_inspection: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        next_maintenance_date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        is_active: true,
        is_available_for_booking: true,
        booking_notes: 'Cancha premium para competencias profesionales con superficie ITF certificada',
        hourly_rate: 90000, // $900.00 MXN in cents
        peak_hour_rate: 120000, // $1200.00 MXN in cents
        currency: 'MXN',
        minimum_booking_duration: 90,
        maximum_booking_duration: 240,
        advance_booking_days: 60,
        cancellation_deadline_hours: 48,
        equipment_included: JSON.stringify(['Red ITF certificada', 'Sistema de audio premium', 'Pantalla digital', 'Cronometraje automático']),
        additional_equipment: JSON.stringify(['Pelotas oficiales ITF', 'Kit médico', 'Sistema de replay']),
        special_features: JSON.stringify(['Transmisión 4K', 'Estadísticas en tiempo real', 'Clima controlado', 'Asientos VIP']),
        photos: JSON.stringify(['/uploads/courts/court_p1_1.jpg', '/uploads/courts/court_p1_2.jpg', '/uploads/courts/court_p1_3.jpg']),
        maintenance_history: JSON.stringify({
          last_cleaning: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
          last_repair: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          last_surface_work: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          last_net_replacement: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        }),
        utilization_stats: JSON.stringify({
          total_bookings: 67,
          total_hours: 201,
          average_rating: 4.95,
          last_booking: new Date(now.getTime() - 3 * 60 * 60 * 1000)
        }),
        restrictions: JSON.stringify({
          min_age: 16,
          max_players: 4,
          skill_level_restriction: 'intermediate',
          member_only: true,
          coach_required: false,
          tournament_use: true
        }),
        operating_hours: JSON.stringify({
          monday: { open: '05:30', close: '23:30', closed: false },
          tuesday: { open: '05:30', close: '23:30', closed: false },
          wednesday: { open: '05:30', close: '23:30', closed: false },
          thursday: { open: '05:30', close: '23:30', closed: false },
          friday: { open: '05:30', close: '24:00', closed: false },
          saturday: { open: '06:00', close: '24:00', closed: false },
          sunday: { open: '06:00', close: '22:00', closed: false }
        }),
        created_at: now,
        updated_at: now
      },
      // Courts for facility 3 (Partner001 - Academia Condesa)
      {
        facility_id: 3,
        court_number: 'T1',
        name: 'Cancha de Entrenamiento',
        court_type: 'outdoor',
        surface: 'concrete',
        dimensions: JSON.stringify({
          length: 20,
          width: 10,
          unit: 'meters'
        }),
        net_height: 0.86,
        lighting: 'basic',
        has_lights: true,
        windscreen: true,
        covered: false,
        accessibility: JSON.stringify({
          wheelchair_accessible: false,
          handicap_parking: false,
          accessible_restrooms: false
        }),
        condition: 'good',
        last_inspection: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        next_maintenance_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        is_active: true,
        is_available_for_booking: true,
        booking_notes: 'Cancha al aire libre ideal para entrenamientos técnicos y clases grupales',
        hourly_rate: 20000, // $200.00 MXN in cents
        peak_hour_rate: 25000, // $250.00 MXN in cents
        currency: 'MXN',
        minimum_booking_duration: 60,
        maximum_booking_duration: 120,
        advance_booking_days: 14,
        cancellation_deadline_hours: 12,
        equipment_included: JSON.stringify(['Red estándar', 'Marcas de entrenamiento']),
        additional_equipment: JSON.stringify(['Conos', 'Pelotas de práctica', 'Paletas de entrenamiento']),
        special_features: JSON.stringify(['Área de teoría adyacente', 'Pizarra táctica']),
        photos: JSON.stringify(['/uploads/courts/court_t1_1.jpg']),
        maintenance_history: JSON.stringify({
          last_cleaning: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          last_repair: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          last_surface_work: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
          last_net_replacement: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)
        }),
        utilization_stats: JSON.stringify({
          total_bookings: 156,
          total_hours: 234,
          average_rating: 4.1,
          last_booking: new Date(now.getTime() - 4 * 60 * 60 * 1000)
        }),
        restrictions: JSON.stringify({
          min_age: 8,
          max_players: 6,
          skill_level_restriction: 'none',
          member_only: false,
          coach_required: true,
          tournament_use: false
        }),
        operating_hours: JSON.stringify({
          monday: { open: '07:00', close: '21:00', closed: false },
          tuesday: { open: '07:00', close: '21:00', closed: false },
          wednesday: { open: '07:00', close: '21:00', closed: false },
          thursday: { open: '07:00', close: '21:00', closed: false },
          friday: { open: '07:00', close: '20:00', closed: false },
          saturday: { open: '08:00', close: '18:00', closed: false },
          sunday: { open: '08:00', close: '16:00', closed: false }
        }),
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('courts', courts);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('courts', {});
  }
};