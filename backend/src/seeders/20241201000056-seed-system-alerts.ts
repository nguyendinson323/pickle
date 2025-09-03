module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const systemAlerts = [
      // Critical security alert - acknowledged by admin (user id 1)
      {
        type: 'security',
        severity: 'critical',
        title: 'Múltiples intentos de acceso fallidos detectados',
        message: 'Se han detectado más de 150 intentos de acceso fallidos desde múltiples IPs en los últimos 15 minutos. Posible ataque de fuerza bruta en curso.',
        details: JSON.stringify({
          failed_attempts: 156,
          unique_ips: 8,
          target_accounts: ['admin', 'coach001', 'partner001'],
          blocked_ips: ['192.168.1.100', '10.0.0.55', '172.16.0.23']
        }),
        source: 'automated_check',
        source_data: JSON.stringify({
          monitoring_system: 'fail2ban',
          detection_time: new Date(now.getTime() - 45 * 60 * 1000)
        }),
        threshold: JSON.stringify({
          metric: 'failed_login_attempts',
          operator: 'greater_than',
          value: 50,
          actual_value: 156
        }),
        status: 'investigating',
        acknowledged_by: 1, // admin
        acknowledged_at: new Date(now.getTime() - 30 * 60 * 1000),
        resolved_by: null,
        resolved_at: null,
        resolution_notes: null,
        actions_taken: JSON.stringify({
          ip_blocks: 8,
          account_locks: 3,
          security_review: 'in_progress'
        }),
        is_escalated: true,
        escalated_to: 1, // admin (self-escalated)
        escalated_at: new Date(now.getTime() - 25 * 60 * 1000),
        is_recurring: false,
        related_alerts: JSON.stringify([]),
        created_at: new Date(now.getTime() - 45 * 60 * 1000),
        updated_at: new Date(now.getTime() - 25 * 60 * 1000)
      },

      // Performance warning - resolved by admin
      {
        type: 'performance',
        severity: 'warning',
        title: 'Alto tiempo de respuesta en consultas de base de datos',
        message: 'Las consultas a la tabla de tournaments están tardando más de 800ms en promedio durante las últimas 2 horas.',
        details: JSON.stringify({
          average_response_time: 847,
          affected_queries: 23,
          slowest_query: 'SELECT * FROM tournaments WHERE status = active AND date >= NOW()',
          query_count: 156
        }),
        source: 'monitoring',
        source_data: JSON.stringify({
          monitoring_tool: 'pgstat',
          server: 'db-primary',
          connection_pool: 'main'
        }),
        threshold: JSON.stringify({
          metric: 'database_response_time',
          operator: 'greater_than',
          value: 500,
          actual_value: 847
        }),
        status: 'resolved',
        acknowledged_by: 1, // admin
        acknowledged_at: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        resolved_by: 1, // admin
        resolved_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        resolution_notes: 'Optimización de índices aplicada. Query reescrita para mejor performance. Tiempo promedio ahora: 145ms',
        actions_taken: JSON.stringify({
          index_optimization: true,
          query_rewrite: true,
          performance_test: 'passed'
        }),
        is_escalated: false,
        escalated_to: null,
        escalated_at: null,
        is_recurring: true,
        related_alerts: JSON.stringify(['performance_db_slow_202409021400']),
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },

      // Business info alert - resolved
      {
        type: 'business',
        severity: 'info',
        title: 'Nuevo récord de usuarios activos simultáneos',
        message: 'Se ha alcanzado un nuevo récord histórico de 3,847 usuarios activos simultáneos a las 20:15 horas.',
        details: JSON.stringify({
          concurrent_users: 3847,
          previous_record: 3456,
          growth_percentage: 11.3,
          peak_time: new Date(now.getTime() - 8 * 60 * 60 * 1000)
        }),
        source: 'system',
        source_data: JSON.stringify({
          monitoring_component: 'user_session_tracker',
          measurement_interval: '5_minutes'
        }),
        threshold: null,
        status: 'resolved',
        acknowledged_by: 1, // admin
        acknowledged_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        resolved_by: 1, // admin
        resolved_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        resolution_notes: 'Registro positivo documentado para análisis de crecimiento. Sistema mantuvo estabilidad.',
        actions_taken: JSON.stringify({
          documentation: 'completed',
          performance_monitoring: 'enhanced',
          capacity_planning: 'reviewed'
        }),
        is_escalated: false,
        escalated_to: null,
        escalated_at: null,
        is_recurring: false,
        related_alerts: JSON.stringify([]),
        created_at: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },

      // Error alert - open
      {
        type: 'error',
        severity: 'error',
        title: 'Fallas en el servicio de notificaciones por email',
        message: 'El servicio de notificaciones por email está fallando intermitentemente. 23% de los emails no se están enviando correctamente.',
        details: JSON.stringify({
          success_rate: 77,
          failed_emails: 89,
          total_attempts: 387,
          error_types: ['SMTP_TIMEOUT', 'INVALID_RECIPIENT', 'QUOTA_EXCEEDED']
        }),
        source: 'system',
        source_data: JSON.stringify({
          email_service: 'sendgrid',
          error_log: '/var/log/email_service.log',
          last_successful: new Date(now.getTime() - 15 * 60 * 1000)
        }),
        threshold: JSON.stringify({
          metric: 'email_success_rate',
          operator: 'less_than',
          value: 95,
          actual_value: 77
        }),
        status: 'open',
        acknowledged_by: null,
        acknowledged_at: null,
        resolved_by: null,
        resolved_at: null,
        resolution_notes: null,
        actions_taken: JSON.stringify({}),
        is_escalated: false,
        escalated_to: null,
        escalated_at: null,
        is_recurring: false,
        related_alerts: JSON.stringify([]),
        created_at: new Date(now.getTime() - 30 * 60 * 1000),
        updated_at: new Date(now.getTime() - 30 * 60 * 1000)
      },

      // Maintenance alert - acknowledged
      {
        type: 'maintenance',
        severity: 'warning',
        title: 'Mantenimiento programado de base de datos pendiente',
        message: 'El mantenimiento programado de la base de datos principal está programado para esta noche a las 02:00 AM. Duración estimada: 2 horas.',
        details: JSON.stringify({
          scheduled_time: new Date(now.getTime() + 6 * 60 * 60 * 1000),
          estimated_duration: 7200, // seconds
          maintenance_type: 'database_optimization',
          affected_services: ['tournaments', 'user_profiles', 'payments']
        }),
        source: 'system',
        source_data: JSON.stringify({
          maintenance_scheduler: 'cron',
          backup_completed: false,
          notification_sent: true
        }),
        threshold: null,
        status: 'acknowledged',
        acknowledged_by: 1, // admin
        acknowledged_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        resolved_by: null,
        resolved_at: null,
        resolution_notes: null,
        actions_taken: JSON.stringify({
          user_notification: 'sent',
          backup_schedule: 'confirmed',
          rollback_plan: 'prepared'
        }),
        is_escalated: false,
        escalated_to: null,
        escalated_at: null,
        is_recurring: true,
        related_alerts: JSON.stringify(['maintenance_weekly_db']),
        created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 60 * 60 * 1000)
      },

      // User behavior alert - open
      {
        type: 'user_behavior',
        severity: 'warning',
        title: 'Patrón de comportamiento sospechoso detectado',
        message: 'Usuario player003 (ID: 4) muestra patrones de actividad anómalos: 47 búsquedas de torneos en 10 minutos, posible scraping de datos.',
        details: JSON.stringify({
          user_id: 4,
          suspicious_activities: {
            tournament_searches: 47,
            time_window: 600, // seconds
            requests_per_second: 0.78,
            unique_search_terms: 3
          }
        }),
        source: 'automated_check',
        source_data: JSON.stringify({
          detection_system: 'rate_limiter',
          user_agent: 'Mozilla/5.0 (automated)',
          ip_address: '192.168.1.75'
        }),
        threshold: JSON.stringify({
          metric: 'requests_per_minute',
          operator: 'greater_than',
          value: 30,
          actual_value: 47
        }),
        status: 'open',
        acknowledged_by: null,
        acknowledged_at: null,
        resolved_by: null,
        resolved_at: null,
        resolution_notes: null,
        actions_taken: JSON.stringify({}),
        is_escalated: false,
        escalated_to: null,
        escalated_at: null,
        is_recurring: false,
        related_alerts: JSON.stringify([]),
        created_at: new Date(now.getTime() - 15 * 60 * 1000),
        updated_at: new Date(now.getTime() - 15 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('system_alerts', systemAlerts);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('system_alerts', {});
  }
};