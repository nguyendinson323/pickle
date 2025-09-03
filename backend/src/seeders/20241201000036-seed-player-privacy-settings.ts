module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('player_privacy_settings', [
    {
      player_id: 1, // Carlos Méndez Rivera (player001)
      show_location: true,
      show_real_name: true,
      show_age: false,
      show_phone: false,
      show_email: false,
      show_skill_level: true,
      show_ranking: true,
      allow_finder_requests: true,
      allow_direct_messages: true,
      allow_tournament_invites: true,
      allow_club_invites: true,
      max_distance: 25,
      online_status: 'online',
      profile_visibility: 'public',
      location_precision: 'approximate',
      auto_decline_finder_requests: false,
      block_list: JSON.stringify([]),
      preferred_contact_method: 'app',
      notification_preferences: JSON.stringify({
        newFinderRequest: true,
        finderRequestAccepted: true,
        finderRequestDeclined: true,
        newMessage: true,
        tournamentReminder: true,
        clubUpdate: true
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 2, // María González López (player002)
      show_location: false,
      show_real_name: true,
      show_age: true,
      show_phone: true,
      show_email: false,
      show_skill_level: true,
      show_ranking: true,
      allow_finder_requests: true,
      allow_direct_messages: true,
      allow_tournament_invites: true,
      allow_club_invites: true,
      max_distance: 15,
      online_status: 'online',
      profile_visibility: 'public',
      location_precision: 'city',
      auto_decline_finder_requests: false,
      block_list: JSON.stringify([]),
      preferred_contact_method: 'app',
      notification_preferences: JSON.stringify({
        newFinderRequest: true,
        finderRequestAccepted: true,
        finderRequestDeclined: false,
        newMessage: true,
        tournamentReminder: true,
        clubUpdate: false
      }),
      created_at: now,
      updated_at: now
    },
    {
      player_id: 3, // Roberto Sánchez Torres (player003)
      show_location: true,
      show_real_name: true,
      show_age: true,
      show_phone: true,
      show_email: true,
      show_skill_level: true,
      show_ranking: true,
      allow_finder_requests: true,
      allow_direct_messages: true,
      allow_tournament_invites: true,
      allow_club_invites: true,
      max_distance: 50,
      online_status: 'online',
      profile_visibility: 'public',
      location_precision: 'exact',
      auto_decline_finder_requests: false,
      block_list: JSON.stringify([]),
      preferred_contact_method: 'app',
      notification_preferences: JSON.stringify({
        newFinderRequest: true,
        finderRequestAccepted: true,
        finderRequestDeclined: true,
        newMessage: true,
        tournamentReminder: true,
        clubUpdate: true
      }),
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_privacy_settings', {}, {});
  }
};