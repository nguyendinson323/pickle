module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const courtBookings = [
      // Upcoming bookings
      {
        user_id: 2, // player001
        court_id: 1, // Cancha Principal
        booking_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        start_time: '18:00:00',
        end_time: '20:00:00',
        duration_minutes: 120,
        total_cost: 8000, // $80.00 MXN (2 hours * $40/hour)
        currency: 'MXN',
        payment_id: null, // Will pay on arrival
        status: 'confirmed',
        booking_type: 'recreational',
        participants: JSON.stringify([
          { name: 'Juan García López', role: 'player' },
          { name: 'María González', role: 'partner' }
        ]),
        special_requests: 'Favor de tener pelotas nuevas disponibles',
        equipment_rental: JSON.stringify(['paletas_premium']),
        cancellation_reason: null,
        cancelled_at: null,
        checked_in_at: null,
        checked_out_at: null,
        notes: 'Primera reserva del usuario - cliente VIP',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: 5, // coach001
        court_id: 2, // Cancha Norte
        booking_date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        start_time: '09:00:00',
        end_time: '11:00:00',
        duration_minutes: 120,
        total_cost: 6000, // $60.00 MXN (2 hours * $30/hour)
        currency: 'MXN',
        payment_id: 5, // Existing payment
        status: 'confirmed',
        booking_type: 'training',
        participants: JSON.stringify([
          { name: 'Carlos Méndez', role: 'coach' },
          { name: 'Ana Rodríguez', role: 'student' },
          { name: 'Pedro Martínez', role: 'student' }
        ]),
        special_requests: 'Necesito acceso al equipo de video para análisis',
        equipment_rental: JSON.stringify(['video_equipment', 'training_cones']),
        cancellation_reason: null,
        cancelled_at: null,
        checked_in_at: null,
        checked_out_at: null,
        notes: 'Sesión de entrenamiento grupal - nivel intermedio',
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      // Completed bookings
      {
        user_id: 3, // player002
        court_id: 2, // Cancha Norte
        booking_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        start_time: '14:00:00',
        end_time: '16:00:00',
        duration_minutes: 120,
        total_cost: 6000, // $60.00 MXN
        currency: 'MXN',
        payment_id: 5, // Existing payment reference
        status: 'completed',
        booking_type: 'recreational',
        participants: JSON.stringify([
          { name: 'María González Ruiz', role: 'player' },
          { name: 'Luis Hernández', role: 'partner' }
        ]),
        special_requests: null,
        equipment_rental: JSON.stringify([]),
        cancellation_reason: null,
        cancelled_at: null,
        checked_in_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 - 10 * 60 * 1000),
        checked_out_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        notes: 'Juego excelente, clientes satisfechos',
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
      },
      // Cancelled booking
      {
        user_id: 4, // player003
        court_id: 1, // Cancha Principal
        booking_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        start_time: '16:00:00',
        end_time: '18:00:00',
        duration_minutes: 120,
        total_cost: 8000, // $80.00 MXN
        currency: 'MXN',
        payment_id: 7, // Refunded payment
        status: 'cancelled',
        booking_type: 'recreational',
        participants: JSON.stringify([
          { name: 'Roberto Silva', role: 'player' }
        ]),
        special_requests: null,
        equipment_rental: JSON.stringify([]),
        cancellation_reason: 'Lesión en el tobillo - certificado médico presentado',
        cancelled_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        checked_in_at: null,
        checked_out_at: null,
        notes: 'Cancelación justificada - reembolso procesado',
        created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      // Premium court booking
      {
        user_id: 10, // club002
        court_id: 3, // Cancha Championship (Polanco Elite)
        booking_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        start_time: '19:00:00',
        end_time: '22:00:00',
        duration_minutes: 180,
        total_cost: 27000, // $270.00 MXN (3 hours * $90/hour)
        currency: 'MXN',
        payment_id: null,
        status: 'confirmed',
        booking_type: 'corporate_event',
        participants: JSON.stringify([
          { name: 'Evento Corporativo Polanco', role: 'organizer' },
          { name: 'Ejecutivos VIP', role: 'participants', count: 12 }
        ]),
        special_requests: 'Servicio de catering, setup para evento corporativo, fotografía profesional',
        equipment_rental: JSON.stringify(['sound_system', 'professional_lighting', 'catering_setup']),
        cancellation_reason: null,
        cancelled_at: null,
        checked_in_at: null,
        checked_out_at: null,
        notes: 'Evento corporativo premium - servicio completo incluido',
        created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      },
      // Training session booking
      {
        user_id: 7, // partner001
        court_id: 4, // Cancha de Entrenamiento (Academia Condesa)
        booking_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        start_time: '08:00:00',
        end_time: '10:00:00',
        duration_minutes: 120,
        total_cost: 4000, // $40.00 MXN (2 hours * $20/hour)
        currency: 'MXN',
        payment_id: null,
        status: 'confirmed',
        booking_type: 'group_lesson',
        participants: JSON.stringify([
          { name: 'Luis Fernando Ríos', role: 'coach' },
          { name: 'Grupo Principiantes A', role: 'students', count: 6 }
        ]),
        special_requests: 'Grupo de principiantes - necesito conos y pelotas de baja presión',
        equipment_rental: JSON.stringify(['training_balls_low_pressure', 'training_cones', 'instruction_board']),
        cancellation_reason: null,
        cancelled_at: null,
        checked_in_at: null,
        checked_out_at: null,
        notes: 'Clase grupal semanal - estudiantes regulares',
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      // Past regular booking
      {
        user_id: 6, // coach002
        court_id: 1, // Cancha Principal
        booking_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        start_time: '15:00:00',
        end_time: '17:00:00',
        duration_minutes: 120,
        total_cost: 8000, // $80.00 MXN
        currency: 'MXN',
        payment_id: null,
        status: 'completed',
        booking_type: 'private_lesson',
        participants: JSON.stringify([
          { name: 'Andrea Silva', role: 'coach' },
          { name: 'Roberto Domínguez', role: 'student' }
        ]),
        special_requests: 'Lección privada enfocada en técnica de saque',
        equipment_rental: JSON.stringify(['video_analysis_tablet', 'premium_balls']),
        cancellation_reason: null,
        cancelled_at: null,
        checked_in_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000),
        checked_out_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        notes: 'Excelente progreso del estudiante - siguiente sesión programada',
        created_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('court_bookings', courtBookings);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('court_bookings', {});
  }
};