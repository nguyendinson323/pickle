module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const preferences = [
      // Player preferences
      {
        user_id: 2, // player001
        email_enabled: true,
        push_enabled: true,
        sms_enabled: false,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: true,
        marketing_notifications: false,
        system_notifications: true,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'daily',
        created_at: now,
        updated_at: now
      },
      {
        user_id: 3, // player002  
        email_enabled: true,
        push_enabled: false,
        sms_enabled: true,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: false,
        marketing_notifications: true,
        system_notifications: true,
        quiet_hours_start: '23:00',
        quiet_hours_end: '07:00',
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'weekly',
        created_at: now,
        updated_at: now
      },
      {
        user_id: 4, // player003
        email_enabled: false,
        push_enabled: true,
        sms_enabled: false,
        in_app_enabled: true,
        tournament_notifications: false,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: true,
        marketing_notifications: false,
        system_notifications: false,
        quiet_hours_start: '21:00',
        quiet_hours_end: '09:00',
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'none',
        created_at: now,
        updated_at: now
      },
      // Coach preferences
      {
        user_id: 5, // coach001
        email_enabled: true,
        push_enabled: true,
        sms_enabled: true,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: true,
        marketing_notifications: true,
        system_notifications: true,
        quiet_hours_start: '22:30',
        quiet_hours_end: '06:30',
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'daily',
        created_at: now,
        updated_at: now
      },
      {
        user_id: 6, // coach002
        email_enabled: true,
        push_enabled: true,
        sms_enabled: false,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: true,
        marketing_notifications: false,
        system_notifications: true,
        quiet_hours_start: '23:30',
        quiet_hours_end: '07:30',
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'weekly',
        created_at: now,
        updated_at: now
      },
      // Partner preferences
      {
        user_id: 7, // partner001
        email_enabled: true,
        push_enabled: true,
        sms_enabled: true,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: false,
        marketing_notifications: true,
        system_notifications: true,
        quiet_hours_start: '20:00',
        quiet_hours_end: '08:00',
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'daily',
        created_at: now,
        updated_at: now
      },
      // Club preferences
      {
        user_id: 9, // club001
        email_enabled: true,
        push_enabled: false,
        sms_enabled: false,
        in_app_enabled: true,
        tournament_notifications: false,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: false,
        marketing_notifications: false,
        system_notifications: true,
        quiet_hours_start: null,
        quiet_hours_end: null,
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'daily',
        created_at: now,
        updated_at: now
      },
      {
        user_id: 10, // club002
        email_enabled: true,
        push_enabled: true,
        sms_enabled: true,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: false,
        marketing_notifications: true,
        system_notifications: true,
        quiet_hours_start: '21:00',
        quiet_hours_end: '07:00',
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'weekly',
        created_at: now,
        updated_at: now
      },
      // State committee preferences
      {
        user_id: 11, // state_committee001
        email_enabled: true,
        push_enabled: true,
        sms_enabled: true,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: false,
        payment_notifications: true,
        match_notifications: false,
        marketing_notifications: false,
        system_notifications: true,
        quiet_hours_start: null,
        quiet_hours_end: null,
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'daily',
        created_at: now,
        updated_at: now
      },
      // Admin preferences
      {
        user_id: 1, // admin
        email_enabled: true,
        push_enabled: true,
        sms_enabled: true,
        in_app_enabled: true,
        tournament_notifications: true,
        booking_notifications: true,
        payment_notifications: true,
        match_notifications: true,
        marketing_notifications: false,
        system_notifications: true,
        quiet_hours_start: null,
        quiet_hours_end: null,
        timezone: 'America/Mexico_City',
        language: 'es',
        frequency_digest: 'realtime',
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('notification_preferences', preferences);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_preferences', {});
  }
};