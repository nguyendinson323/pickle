module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const courtFacilities = [
      // Club001 facility
      {
        owner_id: 9, // club001
        owner_type: 'club',
        name: 'Complejo Deportivo Roma Norte',
        description: 'Moderno complejo deportivo especializado en pickleball ubicado en el corazón de Roma Norte',
        address: JSON.stringify({
          street: 'Av. Álvaro Obregón 123',
          neighborhood: 'Roma Norte',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '06700',
          country: 'México'
        }),
        coordinates: JSON.stringify({
          latitude: 19.418851,
          longitude: -99.166425
        }),
        contact_info: JSON.stringify({
          phone: '+52 55 1234 5678',
          email: 'contacto@complejoromanorte.mx',
          website: 'https://complejoromanorte.mx',
          manager: 'Roberto Sánchez'
        }),
        amenities: JSON.stringify([
          'Estacionamiento gratuito',
          'Vestidores con regaderas',
          'Cafetería',
          'Tienda de equipos',
          'Wi-Fi gratuito',
          'Aire acondicionado',
          'Área de descanso',
          'Primeros auxilios'
        ]),
        capacity: JSON.stringify({
          total_courts: 4,
          max_players_simultaneous: 32,
          parking_spaces: 25,
          seating_capacity: 80
        }),
        operating_hours: JSON.stringify({
          monday: { open: '06:00', close: '22:00', is_closed: false },
          tuesday: { open: '06:00', close: '22:00', is_closed: false },
          wednesday: { open: '06:00', close: '22:00', is_closed: false },
          thursday: { open: '06:00', close: '22:00', is_closed: false },
          friday: { open: '06:00', close: '23:00', is_closed: false },
          saturday: { open: '07:00', close: '23:00', is_closed: false },
          sunday: { open: '07:00', close: '21:00', is_closed: false }
        }),
        policies: JSON.stringify({
          cancellation_hours: 24,
          max_advance_booking_days: 30,
          deposit_required: true,
          deposit_percentage: 50,
          dress_code: 'Ropa deportiva y tenis apropiados',
          age_restrictions: 'Menores de 12 años requieren supervisión adulta'
        }),
        pricing: JSON.stringify({
          base_hourly_rate: 35000, // $350.00 MXN in cents
          peak_hourly_rate: 50000, // $500.00 MXN in cents
          member_discount: 20,
          group_discount: 15,
          tournament_rate: 25000 // $250.00 MXN in cents
        }),
        certifications: JSON.stringify([
          {
            name: 'Certificación CONADE',
            number: 'CONADE-2024-001',
            expiry: '2025-03-15'
          }
        ]),
        is_active: true,
        is_verified: true,
        verified_at: new Date('2024-01-15'),
        verification_notes: 'Instalaciones inspeccionadas y aprobadas',
        created_at: now,
        updated_at: now
      },
      // Club002 facility
      {
        owner_id: 10, // club002
        owner_type: 'club',
        name: 'Centro Deportivo Polanco Elite',
        description: 'Exclusivo centro deportivo con instalaciones de lujo para pickleball profesional',
        address: JSON.stringify({
          street: 'Av. Presidente Masaryk 456',
          neighborhood: 'Polanco',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '11560',
          country: 'México'
        }),
        coordinates: JSON.stringify({
          latitude: 19.433141,
          longitude: -99.192851
        }),
        contact_info: JSON.stringify({
          phone: '+52 55 9876 5432',
          email: 'info@polancoelite.mx',
          website: 'https://polancoelite.mx',
          manager: 'Patricia Mendoza'
        }),
        amenities: JSON.stringify([
          'Valet parking',
          'Vestidores premium con lockers',
          'Spa y sauna',
          'Restaurant gourmet',
          'Pro shop exclusivo',
          'Wi-Fi premium',
          'Climatización avanzada',
          'Área VIP',
          'Servicio médico',
          'Servicio de toallas'
        ]),
        capacity: JSON.stringify({
          total_courts: 6,
          max_players_simultaneous: 48,
          parking_spaces: 40,
          seating_capacity: 120
        }),
        operating_hours: JSON.stringify({
          monday: { open: '05:30', close: '23:30', is_closed: false },
          tuesday: { open: '05:30', close: '23:30', is_closed: false },
          wednesday: { open: '05:30', close: '23:30', is_closed: false },
          thursday: { open: '05:30', close: '23:30', is_closed: false },
          friday: { open: '05:30', close: '24:00', is_closed: false },
          saturday: { open: '06:00', close: '24:00', is_closed: false },
          sunday: { open: '06:00', close: '22:00', is_closed: false }
        }),
        policies: JSON.stringify({
          cancellation_hours: 48,
          max_advance_booking_days: 60,
          deposit_required: true,
          deposit_percentage: 100,
          dress_code: 'Código de vestimenta business casual fuera de canchas',
          age_restrictions: 'Solo mayores de 16 años sin restricciones'
        }),
        pricing: JSON.stringify({
          base_hourly_rate: 75000, // $750.00 MXN in cents
          peak_hourly_rate: 100000, // $1000.00 MXN in cents
          member_discount: 30,
          group_discount: 10,
          tournament_rate: 50000 // $500.00 MXN in cents
        }),
        certifications: JSON.stringify([
          {
            name: 'Certificación CONADE Premium',
            number: 'CONADE-PREM-2024-002',
            expiry: '2025-06-30'
          },
          {
            name: 'Certificación Internacional ITF',
            number: 'ITF-2024-MX-002',
            expiry: '2025-12-31'
          }
        ]),
        is_active: true,
        is_verified: true,
        verified_at: new Date('2024-02-01'),
        verification_notes: 'Instalaciones premium certificadas para competencias internacionales',
        created_at: now,
        updated_at: now
      },
      // Partner001 facility
      {
        owner_id: 7, // partner001
        owner_type: 'partner',
        name: 'Academia de Pickleball Condesa',
        description: 'Academia especializada en entrenamiento de pickleball con enfoque en desarrollo técnico',
        address: JSON.stringify({
          street: 'Calle Amsterdam 789',
          neighborhood: 'Condesa',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '06100',
          country: 'México'
        }),
        coordinates: JSON.stringify({
          latitude: 19.410389,
          longitude: -99.165577
        }),
        contact_info: JSON.stringify({
          phone: '+52 55 5555 1234',
          email: 'academia@pickleballcondesa.mx',
          website: 'https://pickleballcondesa.mx',
          manager: 'Luis Fernando Ríos'
        }),
        amenities: JSON.stringify([
          'Estacionamiento limitado',
          'Vestidores básicos',
          'Área de hidratación',
          'Equipo de entrenamiento',
          'Wi-Fi',
          'Ventilación natural',
          'Área de teoría',
          'Video análisis'
        ]),
        capacity: JSON.stringify({
          total_courts: 2,
          max_players_simultaneous: 16,
          parking_spaces: 8,
          seating_capacity: 30
        }),
        operating_hours: JSON.stringify({
          monday: { open: '07:00', close: '21:00', is_closed: false },
          tuesday: { open: '07:00', close: '21:00', is_closed: false },
          wednesday: { open: '07:00', close: '21:00', is_closed: false },
          thursday: { open: '07:00', close: '21:00', is_closed: false },
          friday: { open: '07:00', close: '20:00', is_closed: false },
          saturday: { open: '08:00', close: '18:00', is_closed: false },
          sunday: { open: '08:00', close: '16:00', is_closed: false }
        }),
        policies: JSON.stringify({
          cancellation_hours: 12,
          max_advance_booking_days: 14,
          deposit_required: false,
          deposit_percentage: 0,
          dress_code: 'Ropa deportiva obligatoria',
          age_restrictions: 'Programas especiales para menores de 14 años'
        }),
        pricing: JSON.stringify({
          base_hourly_rate: 25000, // $250.00 MXN in cents
          peak_hourly_rate: 30000, // $300.00 MXN in cents
          member_discount: 25,
          group_discount: 20,
          tournament_rate: 20000 // $200.00 MXN in cents
        }),
        certifications: JSON.stringify([
          {
            name: 'Licencia Deportiva Municipal',
            number: 'LDM-CDMX-2024-003',
            expiry: '2024-12-31'
          }
        ]),
        is_active: true,
        is_verified: true,
        verified_at: new Date('2024-03-10'),
        verification_notes: 'Academia certificada para programas de entrenamiento',
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('court_facilities', courtFacilities);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('court_facilities', {});
  }
};