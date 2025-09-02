module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('reservations', [
      {
        court_id: 1, // Court A1 at Complejo Deportivo Roma Norte
        user_id: 2, // Carlos Méndez Rivera (player001)
        reservation_date: new Date('2024-12-10'),
        start_time: '08:00:00',
        end_time: '09:30:00',
        duration_hours: 1.5,
        total_cost: 60000, // $600.00 MXN in cents (1.5 hours * $400/hour)
        reservation_status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'credit_card',
        number_of_players: 4,
        reservation_type: 'doubles_match',
        special_requests: 'Solicitar pelotas nuevas y toallas',
        cancellation_policy: JSON.stringify({
          free_cancellation_hours: 24,
          partial_refund_hours: 12,
          no_refund_hours: 2
        }),
        recurring_reservation: false,
        created_at: new Date('2024-12-08'),
        updated_at: new Date('2024-12-08')
      },
      {
        court_id: 2, // Court A2 at Complejo Deportivo Roma Norte
        user_id: 3, // María González López (player002)
        reservation_date: new Date('2024-12-12'),
        start_time: '18:00:00',
        end_time: '20:00:00',
        duration_hours: 2,
        total_cost: 100000, // $1,000.00 MXN in cents (2 hours * $500/hour evening rate)
        reservation_status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'transfer',
        number_of_players: 2,
        reservation_type: 'singles_practice',
        special_requests: 'Entrenamiento con máquina lanzapelotas',
        cancellation_policy: JSON.stringify({
          free_cancellation_hours: 24,
          partial_refund_hours: 12,
          no_refund_hours: 2
        }),
        recurring_reservation: false,
        created_at: new Date('2024-12-10'),
        updated_at: new Date('2024-12-10')
      },
      {
        court_id: 3, // Court B1 at Club Pickleball Polanco
        user_id: 4, // Roberto Sánchez Torres (player003)
        reservation_date: new Date('2024-12-15'),
        start_time: '10:00:00',
        end_time: '11:30:00',
        duration_hours: 1.5,
        total_cost: 90000, // $900.00 MXN in cents (1.5 hours * $600/hour weekend rate)
        reservation_status: 'pending',
        payment_status: 'pending',
        payment_method: 'card_on_file',
        number_of_players: 4,
        reservation_type: 'tournament_practice',
        special_requests: 'Reserva para práctica antes del torneo',
        cancellation_policy: JSON.stringify({
          free_cancellation_hours: 48,
          partial_refund_hours: 24,
          no_refund_hours: 6
        }),
        recurring_reservation: false,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reservations', null, {});
  }
};