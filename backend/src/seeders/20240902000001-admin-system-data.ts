import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Create platform statistics for the last 30 days
    const platformStats = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseUsers = 1000 + (30 - i) * 10;
      const newUsers = Math.floor(Math.random() * 20) + 5;
      const activeUsers = Math.floor(baseUsers * 0.3);
      
      platformStats.push({
        date: date.toISOString().split('T')[0],
        total_users: baseUsers + newUsers,
        new_users: newUsers,
        active_users: activeUsers,
        users_by_role: {
          player: Math.floor(baseUsers * 0.7),
          coach: Math.floor(baseUsers * 0.15),
          club: Math.floor(baseUsers * 0.08),
          partner: Math.floor(baseUsers * 0.04),
          state_committee: Math.floor(baseUsers * 0.02),
          federation: Math.floor(baseUsers * 0.01)
        },
        total_tournaments: 150 + i,
        new_tournaments: Math.floor(Math.random() * 5) + 1,
        active_tournaments: Math.floor(Math.random() * 10) + 5,
        completed_tournaments: 140 + i - 5,
        tournament_revenue: (Math.floor(Math.random() * 50000) + 20000) * 100, // in cents
        subscription_revenue: (Math.floor(Math.random() * 30000) + 15000) * 100,
        total_revenue: 0, // will be calculated
        transaction_count: Math.floor(Math.random() * 200) + 100,
        system_uptime: Math.random() * 2 + 98.5,
        average_response_time: Math.floor(Math.random() * 100) + 120,
        error_rate: Math.random() * 0.5,
        peak_concurrent_users: Math.floor(Math.random() * 500) + 1000,
        api_calls: Math.floor(Math.random() * 50000) + 20000,
        database_connections: Math.floor(Math.random() * 50) + 20,
        storage_used: Math.floor(Math.random() * 1000000000) + 500000000, // bytes
        bandwidth_used: Math.floor(Math.random() * 100000000) + 50000000, // bytes
        created_at: now,
        updated_at: now
      });
    }

    // Calculate total revenue
    platformStats.forEach(stat => {
      stat.total_revenue = stat.tournament_revenue + stat.subscription_revenue;
    });

    await queryInterface.bulkInsert('platform_statistics', platformStats);

    // Create sample content moderation items
    const moderationItems = [
      {
        content_type: 'user_profile',
        content_id: '1',
        reported_by: 2,
        content_data: {
          username: 'usuario_problematico',
          bio: 'Contenido inapropiado en la biografía...',
          location: 'Ciudad de México'
        },
        content_url: null,
        content_preview: 'Perfil de usuario con lenguaje ofensivo en la biografía',
        status: 'pending',
        moderator_id: null,
        moderated_at: null,
        report_reason: 'Lenguaje ofensivo e inapropiado',
        moderation_reason: null,
        action_taken: null,
        severity: 'high',
        category: ['inappropriate_language', 'harassment'],
        ai_flags: {
          toxicity: 0.85,
          spam: 0.2,
          inappropriate: 0.9,
          confidence: 0.92
        },
        requires_follow_up: true,
        follow_up_date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        notes: 'Reportado múltiples veces por diferentes usuarios',
        created_at: yesterday,
        updated_at: yesterday
      },
      {
        content_type: 'message',
        content_id: '5',
        reported_by: 3,
        content_data: {
          sender_id: 4,
          recipient_id: 3,
          message: 'Mensaje spam promocional...'
        },
        content_url: null,
        content_preview: 'Mensaje promocional no solicitado sobre productos externos',
        status: 'flagged',
        moderator_id: 1,
        moderated_at: now,
        report_reason: 'Spam comercial',
        moderation_reason: 'Contenido promocional no autorizado',
        action_taken: 'warning',
        severity: 'medium',
        category: ['spam'],
        ai_flags: {
          toxicity: 0.1,
          spam: 0.95,
          inappropriate: 0.3,
          confidence: 0.88
        },
        requires_follow_up: false,
        follow_up_date: null,
        notes: 'Primera infracción del usuario',
        created_at: lastWeek,
        updated_at: now
      },
      {
        content_type: 'tournament',
        content_id: '10',
        reported_by: 5,
        content_data: {
          name: 'Torneo Sospechoso',
          description: 'Información engañosa sobre premios',
          organizer_id: 6
        },
        content_url: null,
        content_preview: 'Torneo con información falsa sobre premios monetarios',
        status: 'escalated',
        moderator_id: 1,
        moderated_at: now,
        report_reason: 'Información falsa sobre premios',
        moderation_reason: 'Necesita revisión legal por posibles estafas',
        action_taken: 'content_removed',
        severity: 'critical',
        category: ['fake_information', 'fraud'],
        ai_flags: null,
        requires_follow_up: true,
        follow_up_date: new Date(now.getTime() + 72 * 60 * 60 * 1000),
        notes: 'Escalado a supervisión legal',
        created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('content_moderation', moderationItems);

    // Create system alerts
    const systemAlerts = [
      {
        type: 'performance',
        severity: 'warning',
        title: 'Alto tiempo de respuesta en base de datos',
        message: 'Las consultas a la base de datos están tardando más de 500ms en promedio. Esto puede afectar la experiencia del usuario.',
        status: 'acknowledged',
        source: 'monitoring',
        priority_score: 75,
        threshold: {
          metric: 'database_response_time',
          operator: 'greater_than',
          value: 500,
          actualValue: 642
        },
        affected_component: 'database',
        affected_users: null,
        escalation_level: 1,
        escalated_at: null,
        acknowledged_by: 1,
        acknowledged_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        resolved_by: null,
        resolved_at: null,
        resolution_notes: null,
        recurrence_pattern: {
          type: 'daily_peak',
          hours: [14, 15, 16, 20, 21]
        },
        occurrence_count: 5,
        last_occurrence: now,
        suppressed_until: null,
        tags: ['performance', 'database', 'response_time'],
        metadata: {
          server: 'db-primary',
          region: 'us-east-1',
          connection_pool: 'main'
        },
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        type: 'security',
        severity: 'critical',
        title: 'Múltiples intentos de acceso fallidos',
        message: 'Se han detectado más de 100 intentos de acceso fallidos desde la IP 192.168.1.100 en los últimos 10 minutos.',
        status: 'investigating',
        source: 'automated_check',
        priority_score: 95,
        threshold: {
          metric: 'failed_login_attempts',
          operator: 'greater_than',
          value: 50,
          actualValue: 127
        },
        affected_component: 'authentication',
        affected_users: null,
        escalation_level: 2,
        escalated_at: new Date(now.getTime() - 30 * 60 * 1000),
        acknowledged_by: 1,
        acknowledged_at: new Date(now.getTime() - 25 * 60 * 1000),
        resolved_by: null,
        resolved_at: null,
        resolution_notes: null,
        recurrence_pattern: null,
        occurrence_count: 1,
        last_occurrence: now,
        suppressed_until: null,
        tags: ['security', 'brute_force', 'authentication'],
        metadata: {
          source_ip: '192.168.1.100',
          user_agent: 'automated_scanner',
          blocked: true
        },
        created_at: new Date(now.getTime() - 45 * 60 * 1000),
        updated_at: new Date(now.getTime() - 25 * 60 * 1000)
      },
      {
        type: 'business',
        severity: 'info',
        title: 'Nuevo récord de usuarios activos',
        message: 'Se ha alcanzado un nuevo récord de 3,456 usuarios activos simultáneos.',
        status: 'resolved',
        source: 'system',
        priority_score: 20,
        threshold: null,
        affected_component: 'user_sessions',
        affected_users: 3456,
        escalation_level: 1,
        escalated_at: null,
        acknowledged_by: 1,
        acknowledged_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        resolved_by: 1,
        resolved_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        resolution_notes: 'Información registrada para análisis de crecimiento',
        recurrence_pattern: null,
        occurrence_count: 1,
        last_occurrence: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        suppressed_until: null,
        tags: ['business', 'growth', 'milestone'],
        metadata: {
          previous_record: 2834,
          growth_percentage: 21.9
        },
        created_at: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('system_alerts', systemAlerts);

    // Create admin logs
    const adminLogs = [
      {
        admin_id: 1,
        action: 'user_status_update',
        category: 'user_management',
        description: 'Usuario suspendido por violación de términos',
        target_id: 15,
        target_type: 'user',
        previous_data: { status: 'active' },
        new_data: { status: 'suspended', reason: 'Violación de términos de servicio' },
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        session_id: 'sess_admin_123456',
        severity: 'high',
        affected_users: 1,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        admin_id: 1,
        action: 'content_moderation',
        category: 'content_moderation',
        description: 'Contenido rechazado por lenguaje inapropiado',
        target_id: 1,
        target_type: 'content_moderation',
        previous_data: { status: 'pending' },
        new_data: { status: 'rejected', action: 'content_removed' },
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        session_id: 'sess_admin_123456',
        severity: 'medium',
        affected_users: 1,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      },
      {
        admin_id: 1,
        action: 'system_alert_resolution',
        category: 'system_config',
        description: 'Alerta de rendimiento resuelta mediante optimización de consultas',
        target_id: 1,
        target_type: 'system_alert',
        previous_data: { status: 'investigating' },
        new_data: { status: 'resolved', resolution: 'Optimización de índices de base de datos' },
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        session_id: 'sess_admin_123456',
        severity: 'low',
        affected_users: null,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },
      {
        admin_id: 1,
        action: 'broadcast_announcement',
        category: 'communication',
        description: 'Anuncio enviado sobre nuevas funcionalidades',
        target_id: null,
        target_type: 'announcement',
        previous_data: null,
        new_data: { 
          title: 'Nuevas funciones disponibles',
          audience: 'all_users',
          priority: 'medium'
        },
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        session_id: 'sess_admin_123456',
        severity: 'low',
        affected_users: 1300,
        status: 'success',
        error_message: null,
        created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('admin_logs', adminLogs);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('admin_logs', {}, {});
    await queryInterface.bulkDelete('system_alerts', {}, {});
    await queryInterface.bulkDelete('content_moderation', {}, {});
    await queryInterface.bulkDelete('platform_statistics', {}, {});
  }
};