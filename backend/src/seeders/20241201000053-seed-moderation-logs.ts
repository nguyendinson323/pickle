module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('moderation_logs', [
    {
      microsite_id: 1, // Club Pickleball CDMX
      moderator_id: 1, // admin001
      resource_type: 'content_block',
      resource_id: 1,
      action: 'approved',
      reason: 'Contenido apropiado para la comunidad, sin violaciones de términos de servicio',
      previous_content: {
        status: 'pending',
        flags: ['language_check_passed', 'toxicity_score_low', 'spam_probability_minimal']
      },
      new_content: {
        status: 'approved',
        review_time_seconds: 45,
        ai_confidence: 0.92,
        human_override: false,
        community_reports: 0
      },
      status: 'active',
      notes: 'Contenido revisado y aprobado automáticamente - cumple con todas las políticas de la comunidad',
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX
      moderator_id: 1, // admin001
      resource_type: 'microsite_page',
      resource_id: 2,
      action: 'flagged_for_review',
      reason: 'Lenguaje inapropiado detectado por sistema automático - requiere revisión humana',
      previous_content: {
        status: 'pending',
        flags: ['profanity_detected', 'aggressive_language_high', 'community_guidelines_violation_possible']
      },
      new_content: {
        status: 'flagged',
        flagged_words: ['***censored***', '***censored***'],
        ai_confidence: 0.87,
        human_review_required: true,
        community_reports: 2,
        escalation_level: 'medium'
      },
      status: 'active',
      notes: 'Contenido marcado para revisión humana debido a detección automática de lenguaje inapropiado',
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX
      moderator_id: 1, // admin001 - human review follow up
      resource_type: 'microsite_page',
      resource_id: 2, // Same content - follow up action
      action: 'content_edited',
      reason: 'Contenido editado por usuario después de notificación - lenguaje corregido',
      previous_content: {
        status: 'flagged',
        original_length: 156,
        flagged_content: true
      },
      new_content: {
        status: 'approved',
        edited_length: 134,
        removed_words: 3,
        ai_recheck_passed: true,
        human_approval: true,
        edit_type: 'user_self_edit'
      },
      status: 'active',
      notes: 'Usuario corrigió el contenido tras notificación. Revisión humana confirmó cumplimiento de políticas.',
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia
      moderator_id: 1, // admin001
      resource_type: 'content_block',
      resource_id: 3,
      action: 'auto_blocked',
      reason: 'Contenido spam detectado automáticamente - múltiples enlaces externos y texto repetitivo',
      previous_content: {
        status: 'pending',
        external_links_count: 8,
        original_content: 'detected_patterns'
      },
      new_content: {
        status: 'blocked',
        spam_probability: 0.94,
        duplicate_patterns_found: 5,
        user_post_frequency_suspicious: true,
        auto_block_triggered: true,
        human_review_scheduled: true
      },
      status: 'active',
      notes: 'Sistema automático detectó patrones de spam con alta confianza. Contenido bloqueado preventivamente.',
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia
      moderator_id: 1, // admin001
      resource_type: 'microsite_page',
      resource_id: 4,
      action: 'approved_with_warning',
      reason: 'Contenido límite aprobado con advertencia al usuario sobre tono agresivo',
      previous_content: {
        status: 'pending',
        flags: ['borderline_aggressive_language', 'competitive_trash_talk_detected', 'context_sports_related']
      },
      new_content: {
        status: 'approved',
        warning_sent_to_user: true,
        warning_type: 'tone_guidance',
        context_considered: 'sports_competition',
        community_tolerance_level: 'moderate',
        educational_resources_provided: true,
        strike_count: 0
      },
      status: 'active',
      notes: 'Contenido aprobado considerando contexto deportivo, pero se envió advertencia educativa al usuario.',
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 3, // Wilson México Partner
      moderator_id: 1, // admin001
      resource_type: 'content_block',
      resource_id: 5,
      action: 'rejected',
      reason: 'Contenido comercial no autorizado - promoción de servicios externos sin permiso',
      previous_content: {
        status: 'pending',
        content_type: 'commercial_promotion',
        unauthorized: true
      },
      new_content: {
        status: 'rejected',
        violation_type: 'unauthorized_commercial_content',
        promoted_service: 'external_coaching_business',
        user_notified: true,
        appeal_available: true,
        commercial_posting_guidelines_sent: true,
        strike_count: 1
      },
      status: 'active',
      notes: 'Contenido comercial rechazado por violación de políticas. Usuario notificado con opciones de apelación.',
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia
      moderator_id: 1, // admin001
      resource_type: 'microsite_page',
      resource_id: 6,
      action: 'quarantined',
      reason: 'Contenido en cuarentena - posible información médica incorrecta detectada',
      previous_content: {
        status: 'pending',
        detected_content: 'medical_information',
        confidence: 0.78
      },
      new_content: {
        status: 'quarantined',
        health_claims_detected: ['injury_treatment_advice', 'supplement_recommendations'],
        expert_review_requested: true,
        visibility_restricted: true,
        awaiting_medical_expert_review: true
      },
      status: 'active',
      notes: 'Contenido médico detectado requiere revisión por experto. Cuarentena preventiva aplicada.',
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX
      moderator_id: 1, // admin001
      resource_type: 'content_block',
      resource_id: 7,
      action: 'approved',
      reason: 'Contenido educativo de alta calidad - contribuye positivamente a la comunidad',
      previous_content: {
        status: 'pending',
        content_type: 'educational'
      },
      new_content: {
        status: 'approved',
        quality_score: 0.89,
        educational_value: 'high',
        community_benefit: 'significant',
        fast_track_approved: true,
        featured_content_candidate: true,
        author_reputation_boost: 5
      },
      status: 'active',
      notes: 'Contenido educativo excepcional aprobado para destacar. Contribución valiosa a la comunidad.',
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('moderation_logs', {}, {});
  }
};