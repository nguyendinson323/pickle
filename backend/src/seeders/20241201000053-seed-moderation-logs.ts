module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('moderation_logs', [
    {
      content_id: 1, // Reference to content_moderation table
      moderator_id: 1, // admin001
      action_taken: 'approved',
      previous_status: 'pending',
      new_status: 'approved',
      reason: 'Contenido apropiado para la comunidad, sin violaciones de términos de servicio',
      automated_flags: JSON.stringify([
        'language_check_passed',
        'toxicity_score_low',
        'spam_probability_minimal'
      ]),
      review_time_seconds: 45,
      action_details: JSON.stringify({
        reviewed_sections: ['title', 'description', 'content'],
        ai_confidence: 0.92,
        human_override: false,
        community_reports: 0
      }),
      created_at: now,
      updated_at: now
    },
    {
      content_id: 2, // Reference to content_moderation table
      moderator_id: 1, // admin001
      action_taken: 'flagged_for_review',
      previous_status: 'pending',
      new_status: 'flagged',
      reason: 'Lenguaje inapropiado detectado por sistema automático - requiere revisión humana',
      automated_flags: JSON.stringify([
        'profanity_detected',
        'aggressive_language_high',
        'community_guidelines_violation_possible'
      ]),
      review_time_seconds: 12,
      action_details: JSON.stringify({
        flagged_words: ['***censored***', '***censored***'],
        ai_confidence: 0.87,
        human_review_required: true,
        community_reports: 2,
        escalation_level: 'medium'
      }),
      created_at: now,
      updated_at: now
    },
    {
      content_id: 2, // Same content - follow up action
      moderator_id: 1, // admin001 - human review
      action_taken: 'content_edited',
      previous_status: 'flagged',
      new_status: 'approved',
      reason: 'Contenido editado por usuario después de notificación - lenguaje corregido',
      automated_flags: JSON.stringify([
        'edit_requested',
        'user_complied',
        'content_sanitized'
      ]),
      review_time_seconds: 120,
      action_details: JSON.stringify({
        edit_type: 'user_self_edit',
        original_length: 156,
        edited_length: 134,
        removed_words: 3,
        ai_recheck_passed: true,
        human_approval: true
      }),
      created_at: now,
      updated_at: now
    },
    {
      content_id: 3, // Reference to content_moderation table
      moderator_id: null, // Automated system action
      action_taken: 'auto_blocked',
      previous_status: 'pending',
      new_status: 'blocked',
      reason: 'Contenido spam detectado automáticamente - múltiples enlaces externos y texto repetitivo',
      automated_flags: JSON.stringify([
        'spam_detected_high_confidence',
        'excessive_external_links',
        'duplicate_content_pattern',
        'suspicious_user_behavior'
      ]),
      review_time_seconds: 3,
      action_details: JSON.stringify({
        spam_probability: 0.94,
        external_links_count: 8,
        duplicate_patterns_found: 5,
        user_post_frequency_suspicious: true,
        auto_block_triggered: true,
        human_review_scheduled: true
      }),
      created_at: now,
      updated_at: now
    },
    {
      content_id: 4, // Reference to content_moderation table
      moderator_id: 1, // admin001
      action_taken: 'approved_with_warning',
      previous_status: 'pending',
      new_status: 'approved',
      reason: 'Contenido límite aprobado con advertencia al usuario sobre tono agresivo',
      automated_flags: JSON.stringify([
        'borderline_aggressive_language',
        'competitive_trash_talk_detected',
        'context_sports_related'
      ]),
      review_time_seconds: 180,
      action_details: JSON.stringify({
        warning_sent_to_user: true,
        warning_type: 'tone_guidance',
        context_considered: 'sports_competition',
        community_tolerance_level: 'moderate',
        educational_resources_provided: true,
        strike_count: 0 // First warning
      }),
      created_at: now,
      updated_at: now
    },
    {
      content_id: 5, // Reference to content_moderation table  
      moderator_id: 1, // admin001
      action_taken: 'rejected',
      previous_status: 'pending',
      new_status: 'rejected',
      reason: 'Contenido comercial no autorizado - promoción de servicios externos sin permiso',
      automated_flags: JSON.stringify([
        'commercial_content_detected',
        'unauthorized_promotion',
        'terms_of_service_violation'
      ]),
      review_time_seconds: 90,
      action_details: JSON.stringify({
        violation_type: 'unauthorized_commercial_content',
        promoted_service: 'external_coaching_business',
        user_notified: true,
        appeal_available: true,
        commercial_posting_guidelines_sent: true,
        strike_count: 1
      }),
      created_at: now,
      updated_at: now
    },
    {
      content_id: 6, // Reference to content_moderation table
      moderator_id: null, // Automated system
      action_taken: 'quarantined',
      previous_status: 'pending',
      new_status: 'quarantined',
      reason: 'Contenido en cuarentena - posible información médica incorrecta detectada',
      automated_flags: JSON.stringify([
        'medical_information_detected',
        'health_claims_unverified',
        'potential_misinformation',
        'expert_review_required'
      ]),
      review_time_seconds: 8,
      action_details: JSON.stringify({
        ai_medical_flag_confidence: 0.78,
        health_claims_detected: [
          'injury_treatment_advice',
          'supplement_recommendations'
        ],
        expert_review_requested: true,
        visibility_restricted: true,
        awaiting_medical_expert_review: true
      }),
      created_at: now,
      updated_at: now
    },
    {
      content_id: 7, // Reference to content_moderation table
      moderator_id: 1, // admin001
      action_taken: 'approved',
      previous_status: 'pending',
      new_status: 'approved',
      reason: 'Contenido educativo de alta calidad - contribuye positivamente a la comunidad',
      automated_flags: JSON.stringify([
        'educational_content_detected',
        'high_quality_indicators',
        'positive_community_engagement',
        'expert_knowledge_demonstrated'
      ]),
      review_time_seconds: 30,
      action_details: JSON.stringify({
        quality_score: 0.89,
        educational_value: 'high',
        community_benefit: 'significant',
        fast_track_approved: true,
        featured_content_candidate: true,
        author_reputation_boost: 5
      }),
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('moderation_logs', {}, {});
  }
};