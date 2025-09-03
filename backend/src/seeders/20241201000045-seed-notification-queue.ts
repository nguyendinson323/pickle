module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('notification_queue', [
    {
      user_id: 2, // Carlos Méndez Rivera
      type: 'push',
      template: 'tournament_reminder',
      recipient: 'carlos@example.com',
      subject: 'Recordatorio de Torneo',
      content: 'Tu torneo comienza mañana a las 9:00 AM. ¡Prepárate!',
      data: JSON.stringify({
        tournament_id: 1,
        tournament_name: 'Torneo Nacional de Primavera CDMX 2024',
        reminder_type: 'pre_tournament',
        hours_before: 24
      }),
      status: 'pending',
      priority: 1, // High priority (integer)
      scheduled_at: new Date('2024-12-15T08:00:00Z'),
      sent_at: null,
      failed_at: null,
      retry_count: 0,
      max_retries: 3,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 3, // María González López
      type: 'email',
      template: 'payment_reminder',
      recipient: 'maria@example.com',
      subject: 'Recordatorio de Pago',
      content: 'Tu suscripción vence pronto. Por favor realiza tu pago para continuar disfrutando del servicio.',
      data: JSON.stringify({
        subscription_id: 2,
        amount_due: 75000,
        currency: 'MXN',
        due_date: '2024-12-07',
        payment_method: 'credit_card',
        late_fee_warning: true
      }),
      status: 'failed',
      priority: 0, // Urgent priority (integer)
      scheduled_at: new Date('2024-12-05T10:00:00Z'),
      sent_at: null,
      failed_at: new Date('2024-12-05T12:00:00Z'),
      retry_count: 2,
      max_retries: 5,
      error_message: 'SMTP timeout error',
      created_at: now,
      updated_at: now
    },
    {
      user_id: 4, // Roberto Sánchez Torres
      type: 'push',
      template: 'match_result',
      recipient: 'roberto@example.com',
      subject: null,
      content: '¡Felicidades! Has ganado tu partido en el Campeonato Nuevo León Open 2024.',
      data: JSON.stringify({
        match_id: 4,
        tournament_name: 'Campeonato Nuevo León Open 2024',
        result: 'victory',
        final_score: '15-13, 10-15, 15-12, 15-10',
        opponent: 'Luis/Ana',
        congratulations: true
      }),
      status: 'sent',
      priority: 2, // Medium priority (integer)
      scheduled_at: new Date('2024-12-02T16:30:00Z'),
      sent_at: new Date('2024-12-02T16:31:00Z'),
      failed_at: null,
      retry_count: 0,
      max_retries: 3,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 5, // Luis Hernández Morales (coach)
      type: 'email',
      template: 'coaching_request',
      recipient: 'luis@example.com',
      subject: 'Nueva solicitud de entrenamiento',
      content: 'María González López ha solicitado clases privadas contigo.',
      data: JSON.stringify({
        requester_id: 3,
        requester_name: 'María González López',
        session_type: 'private_lesson',
        preferred_dates: ['2024-12-15', '2024-12-16'],
        skill_focus: 'serving_technique',
        location_preference: 'CDMX'
      }),
      status: 'pending',
      priority: 2, // Medium priority (integer)
      scheduled_at: new Date('2024-12-08T14:00:00Z'),
      sent_at: null,
      failed_at: null,
      retry_count: 0,
      max_retries: 3,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 6, // Ana Patricia Ruiz Vega (coach)
      type: 'push',
      template: 'ranking_update',
      recipient: 'ana@example.com',
      subject: null,
      content: 'Tu ranking nacional se ha actualizado. Mantuviste el puesto #1.',
      data: JSON.stringify({
        ranking_type: 'national',
        current_position: 1,
        previous_position: 1,
        points_gained: 50,
        total_points: 3100,
        period: '2024-Q4'
      }),
      status: 'sent',
      priority: 3, // Low priority (integer)
      scheduled_at: new Date('2024-12-01T09:00:00Z'),
      sent_at: new Date('2024-12-01T09:01:00Z'),
      failed_at: null,
      retry_count: 0,
      max_retries: 2,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 9, // club001
      type: 'sms',
      template: 'maintenance_alert',
      recipient: '+52 55 1234-5678',
      subject: null,
      content: 'Mantenimiento programado en Complejo Deportivo Roma Norte para el 15/12/2024.',
      data: JSON.stringify({
        facility_id: 1,
        facility_name: 'Complejo Deportivo Roma Norte',
        maintenance_type: 'lighting_repair',
        scheduled_date: '2024-12-15',
        affected_courts: ['A1', 'A2'],
        estimated_duration: '4 hours'
      }),
      status: 'failed',
      priority: 1, // High priority (integer)
      scheduled_at: new Date('2024-12-10T07:00:00Z'),
      sent_at: null,
      failed_at: new Date('2024-12-10T07:00:00Z'),
      retry_count: 1,
      max_retries: 4,
      error_message: 'SMS delivery failed - invalid number format',
      created_at: now,
      updated_at: now
    },
    {
      user_id: 1, // admin001
      type: 'email',
      template: 'system_alert',
      recipient: 'admin@example.com',
      subject: 'ALERTA: Alto uso de CPU en servidor',
      content: 'El servidor api-server-01 presenta un uso de CPU del 92%. Se requiere acción inmediata.',
      data: JSON.stringify({
        alert_type: 'high_cpu_usage',
        server: 'api-server-01',
        cpu_usage: '92%',
        memory_usage: '78%',
        action_required: true,
        severity: 'critical'
      }),
      status: 'sent',
      priority: 0, // Urgent priority (integer)
      scheduled_at: new Date('2024-12-03T23:45:00Z'),
      sent_at: new Date('2024-12-03T23:45:30Z'),
      failed_at: null,
      retry_count: 0,
      max_retries: 10,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 2, // Carlos Méndez Rivera
      type: 'push',
      template: 'player_match',
      recipient: 'carlos@example.com',
      subject: null,
      content: '¡Hemos encontrado un oponente compatible para ti! Roberto Sánchez Torres está disponible.',
      data: JSON.stringify({
        match_id: 1,
        matched_player: 'Roberto Sánchez Torres',
        skill_compatibility: 95,
        location_distance: '2.3 km',
        preferred_time: '2024-12-15T18:00:00Z'
      }),
      status: 'failed',
      priority: 2, // Medium priority (integer)
      scheduled_at: new Date('2024-12-12T15:30:00Z'),
      sent_at: null,
      failed_at: new Date('2024-12-12T15:30:00Z'),
      retry_count: 0,
      max_retries: 3,
      error_message: 'User device not registered for push notifications',
      created_at: now,
      updated_at: now
    }
  ]);
},

 
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_queue', {}, {});
  }
};