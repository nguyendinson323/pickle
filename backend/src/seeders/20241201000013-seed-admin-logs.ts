module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const adminLogs = [
      // User management actions
      {
        admin_id: 1, // admin user
        action: 'user_status_update',
        category: 'user_management',
        description: 'Usuario player003 suspendido por violación repetida de términos de servicio',
        target_id: 4, // player003
        target_type: 'user',
        previous_data: JSON.stringify({
          status: 'active',
          is_active: true,
          suspension_count: 1
        }),
        new_data: JSON.stringify({
          status: 'suspended',
          is_active: false,
          suspension_count: 2,
          suspension_reason: 'Violación repetida de términos de servicio - spam comercial',
          suspension_duration: '7_days'
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'high',
        affected_users: 1,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 60 * 60 * 1000)
      },

      {
        admin_id: 1, // admin user
        action: 'user_role_change',
        category: 'user_management',
        description: 'Promoción de usuario coach002 a rol de partner por cumplir métricas de rendimiento',
        target_id: 6, // coach002
        target_type: 'user',
        previous_data: JSON.stringify({
          role: 'coach',
          permissions: ['coach_basic', 'tournament_participate'],
          certification_level: 'intermediate'
        }),
        new_data: JSON.stringify({
          role: 'partner',
          permissions: ['coach_basic', 'tournament_participate', 'tournament_organize', 'partner_benefits'],
          certification_level: 'advanced',
          promotion_reason: 'Excellent performance metrics and user feedback'
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'medium',
        affected_users: 1,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 5 * 60 * 60 * 1000)
      },

      // Content moderation actions  
      {
        admin_id: 1, // admin user
        action: 'content_moderation_decision',
        category: 'content_moderation',
        description: 'Contenido de perfil rechazado por lenguaje inapropiado y escalado a revisión legal',
        target_id: 1, // content_moderation record id
        target_type: 'content_moderation',
        previous_data: JSON.stringify({
          status: 'pending',
          severity: 'high',
          moderator_id: null
        }),
        new_data: JSON.stringify({
          status: 'escalated',
          severity: 'critical',
          moderator_id: 1,
          action_taken: 'content_removed',
          escalation_reason: 'Potential legal implications require specialized review'
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'high',
        affected_users: 2, // reporter and content owner
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      },

      {
        admin_id: 1, // admin user
        action: 'bulk_content_approval',
        category: 'content_moderation',
        description: 'Aprobación masiva de 12 elementos de moderación de contenido de bajo riesgo',
        target_id: null,
        target_type: 'content_moderation_batch',
        previous_data: JSON.stringify({
          pending_items: 12,
          low_risk_items: 12
        }),
        new_data: JSON.stringify({
          approved_items: 12,
          batch_approval_criteria: 'AI confidence > 0.9 AND severity = low',
          processing_time: '45_seconds'
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'low',
        affected_users: 8,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },

      // System configuration actions
      {
        admin_id: 1, // admin user
        action: 'system_alert_resolution',
        category: 'system_config',
        description: 'Alerta crítica de seguridad resuelta mediante bloqueo de IPs y fortalecimiento de autenticación',
        target_id: 1, // system_alert record id
        target_type: 'system_alert',
        previous_data: JSON.stringify({
          status: 'investigating',
          severity: 'critical',
          escalation_level: 2
        }),
        new_data: JSON.stringify({
          status: 'resolved',
          resolution_method: 'IP_blocking_and_2FA_enforcement',
          security_measures_applied: ['fail2ban_rules', 'rate_limiting', 'account_monitoring'],
          resolution_time: '2_hours_15_minutes'
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'critical',
        affected_users: null,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },

      {
        admin_id: 1, // admin user
        action: 'database_optimization',
        category: 'system_config',
        description: 'Optimización de base de datos completada - mejora del 40% en tiempo de respuesta',
        target_id: null,
        target_type: 'database',
        previous_data: JSON.stringify({
          avg_response_time: 847,
          slow_queries: 23,
          index_efficiency: 67
        }),
        new_data: JSON.stringify({
          avg_response_time: 145,
          slow_queries: 2,
          index_efficiency: 94,
          optimization_actions: ['index_rebuild', 'query_optimization', 'statistics_update']
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'medium',
        affected_users: null,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 60 * 60 * 1000)
      },

      // Communication actions
      {
        admin_id: 1, // admin user  
        action: 'broadcast_announcement',
        category: 'communication',
        description: 'Anuncio masivo enviado sobre nuevas funcionalidades de la plataforma y mantenimiento programado',
        target_id: null,
        target_type: 'announcement',
        previous_data: null,
        new_data: JSON.stringify({
          title: 'Nuevas funcionalidades y mantenimiento programado',
          message: 'Estimados usuarios, les informamos sobre las nuevas funciones disponibles y el mantenimiento programado para esta noche.',
          target_audience: 'all_users',
          priority: 'medium',
          delivery_channels: ['email', 'in_app', 'push_notification'],
          recipients_count: 1387
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'low',
        affected_users: 1387,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      },

      // Tournament management action
      {
        admin_id: 1, // admin user
        action: 'tournament_suspension',
        category: 'tournament',
        description: 'Torneo suspendido por información fraudulenta sobre premios - investigación en curso',
        target_id: 1, // tournament id
        target_type: 'tournament',
        previous_data: JSON.stringify({
          status: 'active',
          registration_open: true,
          participants_count: 47,
          prize_amount: 5000000 // in cents
        }),
        new_data: JSON.stringify({
          status: 'suspended',
          registration_open: false,
          suspension_reason: 'Fraudulent prize information under investigation',
          legal_review: 'initiated',
          participant_notification: 'sent'
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'critical',
        affected_users: 47,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 36 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 36 * 60 * 60 * 1000)
      },

      // Financial action
      {
        admin_id: 1, // admin user
        action: 'payment_dispute_resolution',
        category: 'financial',
        description: 'Disputa de pago resuelta a favor del usuario - reembolso procesado',
        target_id: 1, // payment id
        target_type: 'payment',
        previous_data: JSON.stringify({
          status: 'disputed',
          amount: 150000, // in cents
          dispute_reason: 'Service not provided as advertised'
        }),
        new_data: JSON.stringify({
          status: 'refunded',
          resolution: 'favor_customer',
          refund_amount: 150000,
          processing_fee_waived: true,
          resolution_notes: 'Service provider failed to meet advertised standards'
        }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        session_id: 'sess_admin_abc123456',
        severity: 'medium',
        affected_users: 2, // customer and service provider
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('admin_logs', adminLogs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin_logs', {});
  }
};