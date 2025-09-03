module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const courtBookings = [
      {
        court_id: 1,
        user_id: 2,
        booking_date: '2024-12-15',
        start_time: '18:00:00',
        end_time: '20:00:00',
        duration: 120,
        total_amount: 800.00,
        currency: 'MXN',
        payment_status: 'paid',
        payment_method: 'stripe',
        payment_reference: 'ch_1ABC123DEF456GHI789',
        booking_status: 'confirmed',
        participant_count: 2,
        participants: JSON.stringify([
          { name: 'Carlos Méndez', role: 'player', phone: '+52 55 1234 5678' },
          { name: 'María González', role: 'partner', phone: '+52 55 8765 4321' }
        ]),
        booking_notes: 'Primera reserva del usuario',
        facility_notes: null,
        equipment_requests: JSON.stringify(['premium_paddles', 'new_balls']),
        additional_services: JSON.stringify([]),
        recurring_booking: null,
        cancellation: null,
        check_in: null,
        check_out: null,
        rating: null,
        weather_conditions: null,
        pricing: JSON.stringify({
          base_rate: 400.00,
          peak_multiplier: 1.0,
          weekend_multiplier: 1.0,
          subtotal: 800.00,
          taxes: 0.00,
          total: 800.00
        }),
        contact_info: JSON.stringify({
          primary_phone: '+52 55 1234 5678',
          emergency_contact: 'Juan Méndez - +52 55 9876 5432'
        }),
        special_requests: 'Favor de tener pelotas nuevas disponibles',
        access_code: 'BOOKING001',
        qr_code: null,
        reminders_sent: JSON.stringify({
          confirmation: true,
          dayBefore: false,
          hourBefore: false
        }),
        is_active: true,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        court_id: 2,
        user_id: 5,
        booking_date: '2024-12-10',
        start_time: '09:00:00',
        end_time: '11:00:00',
        duration: 120,
        total_amount: 600.00,
        currency: 'MXN',
        payment_status: 'paid',
        payment_method: 'stripe',
        payment_reference: 'ch_2ABC123DEF456GHI789',
        booking_status: 'confirmed',
        participant_count: 3,
        participants: JSON.stringify([
          { name: 'Luis Hernández', role: 'coach', phone: '+52 55 2345 6789' },
          { name: 'Ana Rodríguez', role: 'student', phone: '+52 55 3456 7890' },
          { name: 'Pedro Martínez', role: 'student', phone: '+52 55 4567 8901' }
        ]),
        booking_notes: 'Sesión de entrenamiento grupal',
        facility_notes: 'Acceso a equipo de video disponible',
        equipment_requests: JSON.stringify(['video_equipment', 'training_cones']),
        additional_services: JSON.stringify(['coaching_session']),
        recurring_booking: JSON.stringify({
          frequency: 'weekly',
          end_date: '2025-01-10'
        }),
        cancellation: null,
        check_in: null,
        check_out: null,
        rating: null,
        weather_conditions: null,
        pricing: JSON.stringify({
          base_rate: 300.00,
          coaching_fee: 300.00,
          subtotal: 600.00,
          taxes: 0.00,
          total: 600.00
        }),
        contact_info: JSON.stringify({
          primary_phone: '+52 55 2345 6789',
          emergency_contact: 'Carmen Hernández - +52 55 8765 4321'
        }),
        special_requests: 'Necesito acceso al equipo de video para análisis',
        access_code: 'TRAINING001',
        qr_code: null,
        reminders_sent: JSON.stringify({
          confirmation: true,
          dayBefore: true,
          hourBefore: false
        }),
        is_active: true,
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        court_id: 2,
        user_id: 3,
        booking_date: '2024-12-08',
        start_time: '14:00:00',
        end_time: '16:00:00',
        duration: 120,
        total_amount: 600.00,
        currency: 'MXN',
        payment_status: 'paid',
        payment_method: 'cash',
        payment_reference: 'CASH_001',
        booking_status: 'completed',
        participant_count: 2,
        participants: JSON.stringify([
          { name: 'María González', role: 'player', phone: '+52 55 8765 4321' },
          { name: 'Luis Hernández', role: 'partner', phone: '+52 55 2345 6789' }
        ]),
        booking_notes: 'Juego completado satisfactoriamente',
        facility_notes: null,
        equipment_requests: JSON.stringify([]),
        additional_services: JSON.stringify([]),
        recurring_booking: null,
        cancellation: null,
        check_in: JSON.stringify({
          time: '2024-12-08T13:50:00Z',
          staff_member: 'Recepcionista María'
        }),
        check_out: JSON.stringify({
          time: '2024-12-08T16:05:00Z',
          staff_member: 'Recepcionista María'
        }),
        rating: JSON.stringify({
          overall: 5,
          court_condition: 5,
          facilities: 4,
          service: 5,
          comment: 'Excelentes instalaciones y servicio'
        }),
        weather_conditions: JSON.stringify({
          temperature: 22,
          humidity: 65,
          conditions: 'sunny'
        }),
        pricing: JSON.stringify({
          base_rate: 300.00,
          subtotal: 600.00,
          taxes: 0.00,
          total: 600.00
        }),
        contact_info: JSON.stringify({
          primary_phone: '+52 55 8765 4321'
        }),
        special_requests: null,
        access_code: 'COMPLETED001',
        qr_code: null,
        reminders_sent: JSON.stringify({
          confirmation: true,
          dayBefore: true,
          hourBefore: true
        }),
        is_active: true,
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('court_bookings', courtBookings);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('court_bookings', {});
  }
};