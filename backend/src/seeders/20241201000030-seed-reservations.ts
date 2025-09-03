module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('reservations', [
      {
        court_id: 1,
        user_id: 2,
        reservation_date: '2024-12-10',
        start_time: '08:00:00',
        end_time: '09:30:00',
        duration: 90, // 90 minutes
        base_rate: 400.00,
        peak_rate_multiplier: 1.0,
        weekend_rate_multiplier: 1.0,
        subtotal: 600.00,
        tax_amount: 96.00,
        total_amount: 696.00,
        payment_id: null,
        status: 'confirmed',
        notes: 'Solicitar pelotas nuevas y toallas',
        check_in_time: null,
        check_out_time: null,
        actual_duration: null,
        rating: null,
        review: null,
        cancellation_reason: null,
        cancelled_at: null,
        refund_amount: null,
        refund_processed_at: null,
        created_at: new Date('2024-12-08'),
        updated_at: new Date('2024-12-08')
      },
      {
        court_id: 2,
        user_id: 3,
        reservation_date: '2024-12-12',
        start_time: '18:00:00',
        end_time: '20:00:00',
        duration: 120, // 120 minutes
        base_rate: 500.00,
        peak_rate_multiplier: 1.0,
        weekend_rate_multiplier: 1.0,
        subtotal: 1000.00,
        tax_amount: 160.00,
        total_amount: 1160.00,
        payment_id: null,
        status: 'confirmed',
        notes: 'Entrenamiento con máquina lanzapelotas',
        check_in_time: null,
        check_out_time: null,
        actual_duration: null,
        rating: 5,
        review: 'Excelentes instalaciones',
        cancellation_reason: null,
        cancelled_at: null,
        refund_amount: null,
        refund_processed_at: null,
        created_at: new Date('2024-12-10'),
        updated_at: new Date('2024-12-10')
      },
      {
        court_id: 3,
        user_id: 4,
        reservation_date: '2024-12-15',
        start_time: '10:00:00',
        end_time: '11:30:00',
        duration: 90, // 90 minutes
        base_rate: 600.00,
        peak_rate_multiplier: 1.0,
        weekend_rate_multiplier: 1.2,
        subtotal: 720.00,
        tax_amount: 115.20,
        total_amount: 835.20,
        payment_id: null,
        status: 'pending',
        notes: 'Reserva para práctica antes del torneo',
        check_in_time: null,
        check_out_time: null,
        actual_duration: null,
        rating: null,
        review: null,
        cancellation_reason: null,
        cancelled_at: null,
        refund_amount: null,
        refund_processed_at: null,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reservations', null, {});
  }
};