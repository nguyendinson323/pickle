module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const courtFacilities = [
      // Club001 facility
      {
        owner_id: 7, // club001
        owner_type: 'club',
        name: 'Complejo Deportivo Roma Norte',
        description: 'Moderno complejo deportivo especializado en pickleball ubicado en el corazón de Roma Norte',
        address: 'Av. Álvaro Obregón 123, Roma Norte',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '06700',
        country: 'Mexico',
        coordinates: JSON.stringify({
          latitude: 19.418851,
          longitude: -99.166425
        }),
        total_courts: 4,
        facility_type: 'mixed',
        contact_phone: '+52 55 1234 5678',
        contact_email: 'contacto@complejoromanorte.mx',
        website: 'https://complejoromanorte.mx',
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
        parking_spaces: 25,
        has_restrooms: true,
        has_showers: true,
        has_pro_shop: true,
        has_rental: true,
        operating_hours: JSON.stringify({
          monday: { open: '06:00', close: '22:00', is_closed: false },
          tuesday: { open: '06:00', close: '22:00', is_closed: false },
          wednesday: { open: '06:00', close: '22:00', is_closed: false },
          thursday: { open: '06:00', close: '22:00', is_closed: false },
          friday: { open: '06:00', close: '23:00', is_closed: false },
          saturday: { open: '07:00', close: '23:00', is_closed: false },
          sunday: { open: '07:00', close: '21:00', is_closed: false }
        }),
        social_media: JSON.stringify({
          facebook: '@complejoromanorte',
          instagram: '@complejoromanorte',
          twitter: '@complejoroma'
        }),
        is_active: true,
        is_verified: true,
        verification_date: new Date('2024-01-15'),
        photos: JSON.stringify([
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg'
        ]),
        rating: 4.5,
        total_reviews: 28,
        policies: JSON.stringify({
          cancellation_hours: 24,
          max_advance_booking_days: 30,
          deposit_required: true,
          deposit_percentage: 50
        }),
        pricing: JSON.stringify({
          base_hourly_rate: 35000,
          peak_hourly_rate: 50000,
          member_discount: 20
        }),
        booking_settings: JSON.stringify({
          advance_booking_days: 30,
          min_booking_duration: 60,
          max_booking_duration: 180
        }),
        integrations: JSON.stringify({
          payment_gateway: 'stripe',
          calendar_sync: true
        }),
        business_hours: JSON.stringify({
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '07:00', close: '23:00' },
          sunday: { open: '07:00', close: '21:00' }
        }),
        created_at: now,
        updated_at: now
      },
      // Club002 facility
      {
        owner_id: 8, // club002
        owner_type: 'club',
        name: 'Centro Deportivo Polanco Elite',
        description: 'Exclusivo centro deportivo con instalaciones de lujo para pickleball profesional',
        address: 'Av. Presidente Masaryk 456, Polanco',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '11560',
        country: 'Mexico',
        coordinates: JSON.stringify({
          latitude: 19.433141,
          longitude: -99.192851
        }),
        total_courts: 6,
        facility_type: 'indoor',
        contact_phone: '+52 55 9876 5432',
        contact_email: 'info@polancoelite.mx',
        website: 'https://polancoelite.mx',
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
        parking_spaces: 40,
        has_restrooms: true,
        has_showers: true,
        has_pro_shop: true,
        has_rental: true,
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
        booking_settings: JSON.stringify({
          advance_booking_days: 60,
          min_booking_duration: 60,
          max_booking_duration: 240
        }),
        integrations: JSON.stringify({
          payment_gateway: 'stripe',
          calendar_sync: true
        }),
        business_hours: JSON.stringify({
          monday: { open: '05:30', close: '23:30' },
          tuesday: { open: '05:30', close: '23:30' },
          wednesday: { open: '05:30', close: '23:30' },
          thursday: { open: '05:30', close: '23:30' },
          friday: { open: '05:30', close: '24:00' },
          saturday: { open: '06:00', close: '24:00' },
          sunday: { open: '06:00', close: '22:00' }
        }),
        social_media: JSON.stringify({
          facebook: '@polancoelite',
          instagram: '@polancoelite',
          twitter: '@polancoelite'
        }),
        verification_date: new Date('2024-02-01'),
        photos: JSON.stringify([
          'https://example.com/polanco1.jpg',
          'https://example.com/polanco2.jpg'
        ]),
        rating: 4.8,
        total_reviews: 45,
        is_active: true,
        is_verified: true,
        created_at: now,
        updated_at: now
      },
      // Partner001 facility
      {
        owner_id: 6, // partner001
        owner_type: 'independent',
        name: 'Academia de Pickleball Condesa',
        description: 'Academia especializada en entrenamiento de pickleball con enfoque en desarrollo técnico',
        address: 'Calle Amsterdam 789, Condesa',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '06100',
        country: 'Mexico',
        coordinates: JSON.stringify({
          latitude: 19.410389,
          longitude: -99.165577
        }),
        contact_phone: '+52 55 5555 1234',
        contact_email: 'academia@pickleballcondesa.mx',
        website: 'https://pickleballcondesa.mx',
        total_courts: 2,
        facility_type: 'outdoor',
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
        parking_spaces: 8,
        has_restrooms: true,
        has_showers: false,
        has_pro_shop: false,
        has_rental: true,
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
        booking_settings: JSON.stringify({
          advance_booking_days: 14,
          min_booking_duration: 60,
          max_booking_duration: 120
        }),
        integrations: JSON.stringify({
          payment_gateway: 'stripe',
          calendar_sync: false
        }),
        business_hours: JSON.stringify({
          monday: { open: '07:00', close: '21:00' },
          tuesday: { open: '07:00', close: '21:00' },
          wednesday: { open: '07:00', close: '21:00' },
          thursday: { open: '07:00', close: '21:00' },
          friday: { open: '07:00', close: '20:00' },
          saturday: { open: '08:00', close: '18:00' },
          sunday: { open: '08:00', close: '16:00' }
        }),
        social_media: JSON.stringify({
          facebook: '@pickleballcondesa',
          instagram: '@pickleballcondesa'
        }),
        verification_date: new Date('2024-03-10'),
        photos: JSON.stringify([
          'https://example.com/condesa1.jpg',
          'https://example.com/condesa2.jpg'
        ]),
        rating: 4.2,
        total_reviews: 18,
        is_active: true,
        is_verified: true,
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