module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('notification_preferences', [
      {
        user_id: 1, // admin001
        global_enabled: true,
        quiet_hours_enabled: false,
        quiet_hours_start: '23:00',
        quiet_hours_end: '07:00',
        preferences: JSON.stringify({
          tournaments: {
            registration_open: { inApp: true, email: true, sms: false, push: true },
            registration_confirmed: { inApp: true, email: true, sms: true, push: true },
            bracket_released: { inApp: true, email: true, sms: false, push: true },
            match_scheduled: { inApp: true, email: true, sms: true, push: true },
            match_reminder: { inApp: true, email: false, sms: true, push: true },
            results_posted: { inApp: true, email: false, sms: false, push: true }
          },
          bookings: {
            booking_confirmed: { inApp: true, email: true, sms: true, push: true },
            booking_reminder: { inApp: true, email: false, sms: true, push: true },
            booking_cancelled: { inApp: true, email: true, sms: true, push: true },
            court_unavailable: { inApp: true, email: true, sms: true, push: true }
          },
          matches: {
            match_request: { inApp: true, email: false, sms: false, push: true },
            match_accepted: { inApp: true, email: true, sms: true, push: true },
            match_cancelled: { inApp: true, email: true, sms: true, push: true }
          },
          payments: {
            payment_successful: { inApp: true, email: true, sms: false, push: true },
            payment_failed: { inApp: true, email: true, sms: true, push: true },
            refund_processed: { inApp: true, email: true, sms: false, push: true }
          },
          social: {
            friend_request: { inApp: true, email: false, sms: false, push: true },
            message_received: { inApp: true, email: false, sms: false, push: true },
            group_invitation: { inApp: true, email: true, sms: false, push: true }
          },
          system: {
            maintenance_scheduled: { inApp: true, email: true, sms: false, push: false },
            feature_updates: { inApp: true, email: false, sms: false, push: false },
            security_alerts: { inApp: true, email: true, sms: true, push: true }
          }
        }),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 2, // player001
        global_enabled: true,
        quiet_hours_enabled: true,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        preferences: JSON.stringify({
          tournaments: {
            registration_open: { inApp: true, email: true, sms: false, push: true },
            registration_confirmed: { inApp: true, email: true, sms: true, push: true },
            bracket_released: { inApp: true, email: true, sms: false, push: true },
            match_scheduled: { inApp: true, email: true, sms: true, push: true },
            match_reminder: { inApp: true, email: false, sms: true, push: true },
            results_posted: { inApp: true, email: false, sms: false, push: true }
          },
          bookings: {
            booking_confirmed: { inApp: true, email: true, sms: true, push: true },
            booking_reminder: { inApp: true, email: false, sms: true, push: true },
            booking_cancelled: { inApp: true, email: true, sms: true, push: true },
            court_unavailable: { inApp: true, email: true, sms: true, push: true }
          },
          matches: {
            match_request: { inApp: true, email: false, sms: false, push: true },
            match_accepted: { inApp: true, email: true, sms: true, push: true },
            match_cancelled: { inApp: true, email: true, sms: true, push: true }
          },
          payments: {
            payment_successful: { inApp: true, email: true, sms: false, push: true },
            payment_failed: { inApp: true, email: true, sms: true, push: true },
            refund_processed: { inApp: true, email: true, sms: false, push: true }
          },
          social: {
            friend_request: { inApp: true, email: false, sms: false, push: true },
            message_received: { inApp: true, email: false, sms: false, push: true },
            group_invitation: { inApp: true, email: true, sms: false, push: true }
          },
          system: {
            maintenance_scheduled: { inApp: true, email: true, sms: false, push: false },
            feature_updates: { inApp: false, email: false, sms: false, push: false },
            security_alerts: { inApp: true, email: true, sms: true, push: true }
          }
        }),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 5, // coach001
        global_enabled: true,
        quiet_hours_enabled: true,
        quiet_hours_start: '23:30',
        quiet_hours_end: '07:30',
        preferences: JSON.stringify({
          tournaments: {
            registration_open: { inApp: true, email: true, sms: false, push: true },
            registration_confirmed: { inApp: true, email: true, sms: false, push: true },
            bracket_released: { inApp: true, email: true, sms: false, push: true },
            match_scheduled: { inApp: true, email: true, sms: true, push: true },
            match_reminder: { inApp: true, email: false, sms: false, push: true },
            results_posted: { inApp: true, email: false, sms: false, push: false }
          },
          bookings: {
            booking_confirmed: { inApp: true, email: true, sms: false, push: true },
            booking_reminder: { inApp: true, email: false, sms: false, push: true },
            booking_cancelled: { inApp: true, email: true, sms: false, push: true },
            court_unavailable: { inApp: true, email: true, sms: true, push: true }
          },
          matches: {
            match_request: { inApp: true, email: false, sms: false, push: true },
            match_accepted: { inApp: true, email: true, sms: false, push: true },
            match_cancelled: { inApp: true, email: true, sms: true, push: true }
          },
          payments: {
            payment_successful: { inApp: true, email: true, sms: false, push: false },
            payment_failed: { inApp: true, email: true, sms: true, push: true },
            refund_processed: { inApp: true, email: true, sms: false, push: false }
          },
          social: {
            friend_request: { inApp: true, email: false, sms: false, push: true },
            message_received: { inApp: true, email: false, sms: false, push: true },
            group_invitation: { inApp: true, email: false, sms: false, push: true }
          },
          system: {
            maintenance_scheduled: { inApp: true, email: true, sms: false, push: false },
            feature_updates: { inApp: false, email: false, sms: false, push: false },
            security_alerts: { inApp: true, email: true, sms: true, push: true }
          }
        }),
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_preferences', {}, {});
  }
};