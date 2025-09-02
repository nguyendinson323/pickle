module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('player_privacy_settings', [
    {
      player_id: 2, // Carlos Méndez Rivera (player001)
      profile_visibility: 'public',
      show_ranking: true,
      show_tournament_history: true,
      show_contact_info: false,
      allow_player_finder: true,
      show_location: true,
      show_skill_level: true,
      allow_coaching_requests: false,
      show_match_statistics: true,
      allow_direct_messages: true,
      notification_preferences: JSON.stringify({
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        tournament_updates: true,
        match_reminders: true,
        ranking_updates: true
      }),
      data_sharing_consent: true,
      marketing_consent: false,
      analytics_consent: true,
      created_at: now,
      updated_at: now
    },
    {
      player_id: 3, // María González López (player002)
      profile_visibility: 'friends_only',
      show_ranking: true,
      show_tournament_history: true,
      show_contact_info: true,
      allow_player_finder: true,
      show_location: false,
      show_skill_level: true,
      allow_coaching_requests: true,
      show_match_statistics: false,
      allow_direct_messages: true,
      notification_preferences: JSON.stringify({
        email_notifications: true,
        sms_notifications: true,
        push_notifications: true,
        tournament_updates: true,
        match_reminders: true,
        ranking_updates: false
      }),
      data_sharing_consent: true,
      marketing_consent: true,
      analytics_consent: true,
      created_at: now,
      updated_at: now
    },
    {
      player_id: 4, // Roberto Sánchez Torres (player003)
      profile_visibility: 'public',
      show_ranking: true,
      show_tournament_history: true,
      show_contact_info: true,
      allow_player_finder: true,
      show_location: true,
      show_skill_level: true,
      allow_coaching_requests: true,
      show_match_statistics: true,
      allow_direct_messages: true,
      notification_preferences: JSON.stringify({
        email_notifications: true,
        sms_notifications: true,
        push_notifications: true,
        tournament_updates: true,
        match_reminders: true,
        ranking_updates: true,
        sponsorship_opportunities: true
      }),
      data_sharing_consent: true,
      marketing_consent: true,
      analytics_consent: true,
      created_at: now,
      updated_at: now
    },
    {
      player_id: 5, // Luis Hernández Morales (coach001) - as player
      profile_visibility: 'public',
      show_ranking: true,
      show_tournament_history: true,
      show_contact_info: true,
      allow_player_finder: false, // Coaches typically don't use player finder
      show_location: true,
      show_skill_level: true,
      allow_coaching_requests: true,
      show_match_statistics: true,
      allow_direct_messages: true,
      notification_preferences: JSON.stringify({
        email_notifications: true,
        sms_notifications: true,
        push_notifications: true,
        tournament_updates: true,
        match_reminders: true,
        ranking_updates: true,
        coaching_requests: true,
        student_updates: true
      }),
      data_sharing_consent: true,
      marketing_consent: false,
      analytics_consent: true,
      created_at: now,
      updated_at: now
    },
    {
      player_id: 6, // Ana Patricia Ruiz Vega (coach002) - as player
      profile_visibility: 'public',
      show_ranking: true,
      show_tournament_history: true,
      show_contact_info: true,
      allow_player_finder: false, // Top level players often disable this
      show_location: false, // Privacy for high-profile players
      show_skill_level: true,
      allow_coaching_requests: true,
      show_match_statistics: true,
      allow_direct_messages: false, // Managed through official channels
      notification_preferences: JSON.stringify({
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        tournament_updates: true,
        match_reminders: true,
        ranking_updates: true,
        media_requests: true,
        sponsor_updates: true
      }),
      data_sharing_consent: false, // High-profile player limiting data sharing
      marketing_consent: false,
      analytics_consent: true,
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_privacy_settings', {}, {});
  }
};