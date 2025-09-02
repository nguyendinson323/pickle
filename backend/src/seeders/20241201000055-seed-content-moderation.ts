module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const moderationItems = [
      // User profile content moderation - reported by player (user id 2)
      {
        content_type: 'user_profile',
        content_id: '3',
        reported_by: 2, // player001
        content_data: {
          username: 'player003',
          bio: 'Contenido inapropiado en la biografía del usuario...',
          location: 'Ciudad de México'
        },
        content_url: null,
        content_preview: 'Perfil de usuario con lenguaje ofensivo en la biografía',
        status: 'pending',
        moderator_id: null,
        moderated_at: null,
        report_reason: 'Lenguaje ofensivo e inapropiado en la biografía del usuario',
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
      
      // Message content moderation - reported by coach (user id 5)
      {
        content_type: 'message',
        content_id: '1',
        reported_by: 5, // coach001
        content_data: {
          sender_id: 4, // player003
          recipient_id: 5, // coach001
          message: 'Mensaje spam promocional sobre productos externos no relacionados con pickleball...'
        },
        content_url: null,
        content_preview: 'Mensaje promocional no solicitado sobre productos externos',
        status: 'flagged',
        moderator_id: 1, // admin
        moderated_at: now,
        report_reason: 'Spam comercial no relacionado con pickleball',
        moderation_reason: 'Contenido promocional no autorizado detectado por IA',
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
        notes: 'Primera infracción del usuario, se envió advertencia',
        created_at: lastWeek,
        updated_at: now
      },
      
      // Tournament content moderation - reported by partner (user id 7)
      {
        content_type: 'tournament',
        content_id: '1',
        reported_by: 7, // partner001
        content_data: {
          name: 'Torneo Sospechoso de Premios',
          description: 'Información engañosa sobre premios monetarios y patrocinios falsos',
          organizer_id: 8 // partner002
        },
        content_url: null,
        content_preview: 'Torneo con información falsa sobre premios monetarios de $50,000 MXN',
        status: 'escalated',
        moderator_id: 1, // admin
        moderated_at: now,
        report_reason: 'Información falsa sobre premios y patrocinadores inexistentes',
        moderation_reason: 'Posible estafa, requiere revisión legal inmediata',
        action_taken: 'content_removed',
        severity: 'critical',
        category: ['fake_information', 'fraud'],
        ai_flags: null,
        requires_follow_up: true,
        follow_up_date: new Date(now.getTime() + 72 * 60 * 60 * 1000),
        notes: 'Escalado a supervisión legal, torneo suspendido temporalmente',
        created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        updated_at: now
      },
      
      // Microsite content moderation - reported by club (user id 9)
      {
        content_type: 'microsite',
        content_id: '1',
        reported_by: 9, // club001
        content_data: {
          name: 'Club Competidor Falso',
          description: 'Micrositio con información falsa sobre instalaciones y servicios',
          owner_id: 10 // club002
        },
        content_url: 'https://club-falso.federacionpickleball.mx',
        content_preview: 'Micrositio de club con fotos falsas de instalaciones',
        status: 'approved',
        moderator_id: 1, // admin
        moderated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        report_reason: 'Uso de imágenes de otras instalaciones sin autorización',
        moderation_reason: 'Revisión completada, imágenes actualizadas por el propietario',
        action_taken: 'warning',
        severity: 'low',
        category: ['copyright_violation'],
        ai_flags: {
          toxicity: 0.05,
          spam: 0.15,
          inappropriate: 0.25,
          confidence: 0.45
        },
        requires_follow_up: false,
        follow_up_date: null,
        notes: 'Propietario cooperativo, reemplazó imágenes problemáticas',
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      },
      
      // Review content moderation - reported by player (user id 3)
      {
        content_type: 'review',
        content_id: '1',
        reported_by: 3, // player002
        content_data: {
          reviewer_id: 4, // player003
          court_id: 1,
          rating: 1,
          comment: 'Comentario difamatorio contra el establecimiento y personal...'
        },
        content_url: null,
        content_preview: 'Reseña con acusaciones infundadas y lenguaje difamatorio',
        status: 'rejected',
        moderator_id: 1, // admin
        moderated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        report_reason: 'Comentarios difamatorios sin fundamento',
        moderation_reason: 'Violación de políticas de respeto y veracidad',
        action_taken: 'content_removed',
        severity: 'high',
        category: ['harassment', 'fake_information'],
        ai_flags: {
          toxicity: 0.78,
          spam: 0.1,
          inappropriate: 0.85,
          confidence: 0.82
        },
        requires_follow_up: true,
        follow_up_date: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        notes: 'Usuario notificado, reseña eliminada, seguimiento pendiente',
        created_at: new Date(now.getTime() - 18 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },
      
      // Media content moderation - reported by state committee (user id 11)
      {
        content_type: 'media',
        content_id: '1',
        reported_by: 11, // state_committee001
        content_data: {
          uploader_id: 2, // player001
          file_type: 'image',
          file_name: 'inappropriate_image.jpg',
          file_size: 2458000
        },
        content_url: 'https://media.federacionpickleball.mx/uploads/inappropriate_image.jpg',
        content_preview: 'Imagen con contenido inapropiado subida en perfil público',
        status: 'pending',
        moderator_id: null,
        moderated_at: null,
        report_reason: 'Imagen con contenido no apto para la plataforma deportiva',
        moderation_reason: null,
        action_taken: null,
        severity: 'medium',
        category: ['adult_content'],
        ai_flags: {
          toxicity: 0.1,
          spam: 0.05,
          inappropriate: 0.95,
          confidence: 0.98
        },
        requires_follow_up: true,
        follow_up_date: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        notes: 'Detección automática por IA, requiere revisión manual urgente',
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('content_moderation', moderationItems);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('content_moderation', {});
  }
};