module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('notification_queue', [
    {
      user_id: 2, // Carlos Méndez Rivera
      notification_type: 'tournament_reminder',
      priority: 'high',
      scheduled_time: new Date('2024-12-15T08:00:00Z'),
      max_retry_attempts: 3,
      current_retry_count: 0,
      status: 'pending',
      delivery_method: 'push_notification',
      notification_data: JSON.stringify({
        tournament_id: 1,
        tournament_name: 'Torneo Nacional de Primavera CDMX 2024',
        reminder_type: 'pre_tournament',
        hours_before: 24,
        message: 'Tu torneo comienza mañana a las 9:00 AM. ¡Prepárate!'
      }),
      template_id: 1, // Tournament reminder template
      last_attempt: null,
      next_retry: new Date('2024-12-15T08:00:00Z'),
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 3, // María González López
      notification_type: 'payment_due',
      priority: 'urgent',
      scheduled_time: new Date('2024-12-05T10:00:00Z'),
      max_retry_attempts: 5,
      current_retry_count: 2,
      status: 'retrying',
      delivery_method: 'email',
      notification_data: JSON.stringify({
        subscription_id: 2,
        amount_due: 75000, // $750.00 MXN
        currency: 'MXN',
        due_date: '2024-12-07',
        payment_method: 'credit_card',
        late_fee_warning: true
      }),
      template_id: 2, // Payment reminder template
      last_attempt: new Date('2024-12-05T12:00:00Z'),
      next_retry: new Date('2024-12-05T18:00:00Z'),
      error_message: 'SMTP timeout error',
      created_at: now,
      updated_at: now
    },
    {
      user_id: 4, // Roberto Sánchez Torres
      notification_type: 'match_result',
      priority: 'medium',
      scheduled_time: new Date('2024-12-02T16:30:00Z'),
      max_retry_attempts: 3,
      current_retry_count: 0,
      status: 'delivered',
      delivery_method: 'push_notification',
      notification_data: JSON.stringify({
        match_id: 4,
        tournament_name: 'Campeonato Nuevo León Open 2024',
        result: 'victory',
        final_score: '15-13, 10-15, 15-12, 15-10',
        opponent: 'Luis/Ana',
        congratulations: true
      }),
      template_id: 3, // Match result template
      last_attempt: new Date('2024-12-02T16:31:00Z'),
      next_retry: null,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 5, // Luis Hernández Morales (coach)
      notification_type: 'coaching_request',
      priority: 'medium',
      scheduled_time: new Date('2024-12-08T14:00:00Z'),
      max_retry_attempts: 3,
      current_retry_count: 0,
      status: 'pending',
      delivery_method: 'email',
      notification_data: JSON.stringify({
        requester_id: 3, // María González López
        requester_name: 'María González López',
        session_type: 'private_lesson',
        preferred_dates: ['2024-12-15', '2024-12-16'],
        skill_focus: 'serving_technique',
        location_preference: 'CDMX'
      }),
      template_id: 4, // Coaching request template
      last_attempt: null,
      next_retry: new Date('2024-12-08T14:00:00Z'),
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 6, // Ana Patricia Ruiz Vega (coach)
      notification_type: 'ranking_update',
      priority: 'low',
      scheduled_time: new Date('2024-12-01T09:00:00Z'),
      max_retry_attempts: 2,
      current_retry_count: 0,
      status: 'delivered',
      delivery_method: 'push_notification',
      notification_data: JSON.stringify({
        ranking_type: 'national',
        current_position: 1,
        previous_position: 1,
        points_gained: 50,
        total_points: 3100,
        period: '2024-Q4'
      }),
      template_id: 5, // Ranking update template
      last_attempt: new Date('2024-12-01T09:01:00Z'),
      next_retry: null,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 9, // club001
      notification_type: 'facility_maintenance',
      priority: 'high',
      scheduled_time: new Date('2024-12-10T07:00:00Z'),
      max_retry_attempts: 4,
      current_retry_count: 1,
      status: 'retrying',
      delivery_method: 'sms',
      notification_data: JSON.stringify({
        facility_id: 1,
        facility_name: 'Complejo Deportivo Roma Norte',
        maintenance_type: 'lighting_repair',
        scheduled_date: '2024-12-15',
        affected_courts: ['A1', 'A2'],
        estimated_duration: '4 hours'
      }),
      template_id: 6, // Maintenance alert template
      last_attempt: new Date('2024-12-10T07:00:00Z'),
      next_retry: new Date('2024-12-10T09:00:00Z'),
      error_message: 'SMS delivery failed - invalid number format',
      created_at: now,
      updated_at: now
    },
    {
      user_id: 1, // admin001
      notification_type: 'system_alert',
      priority: 'urgent',
      scheduled_time: new Date('2024-12-03T23:45:00Z'),
      max_retry_attempts: 10,
      current_retry_count: 0,
      status: 'delivered',
      delivery_method: 'email',
      notification_data: JSON.stringify({
        alert_type: 'high_cpu_usage',
        server: 'api-server-01',
        cpu_usage: '92%',
        memory_usage: '78%',
        action_required: true,
        severity: 'critical'
      }),
      template_id: 7, // System alert template
      last_attempt: new Date('2024-12-03T23:45:30Z'),
      next_retry: null,
      error_message: null,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 2, // Carlos Méndez Rivera
      notification_type: 'player_finder_match',
      priority: 'medium',
      scheduled_time: new Date('2024-12-12T15:30:00Z'),
      max_retry_attempts: 3,
      current_retry_count: 0,
      status: 'failed',
      delivery_method: 'push_notification',
      notification_data: JSON.stringify({
        match_id: 1,
        matched_player: 'Roberto Sánchez Torres',
        skill_compatibility: 95,
        location_distance: '2.3 km',
        preferred_time: '2024-12-15T18:00:00Z'
      }),
      template_id: 8, // Player finder match template
      last_attempt: new Date('2024-12-12T15:30:00Z'),
      next_retry: null,
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