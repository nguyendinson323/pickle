module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Get sample users for each role to create preferences
    const users = await queryInterface.sequelize.query(
      'SELECT id, role FROM users WHERE role IN (\'admin\', \'state_committee\', \'club\', \'partner\', \'coach\', \'player\') LIMIT 50',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const preferences = users.map(user => ({
      user_id: user.id,
      global_enabled: true,
      quiet_hours_enabled: true,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
      preferences: getPreferencesForRole(user.role),
      created_at: now,
      updated_at: now
    }));

    await queryInterface.bulkInsert('notification_preferences', preferences);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_preferences', {}, {});
  }
};

function getPreferencesForRole(role) {
  const basePreferences = {
    // Security and system notifications (always enabled for all users)
    system: {
      account_security: { inApp: true, email: true, sms: true, push: true },
      password_reset: { inApp: true, email: true, sms: true, push: true },
      login_alerts: { inApp: true, email: true, sms: false, push: false },
      maintenance_alerts: { inApp: true, email: true, sms: false, push: true },
      system_announcements: { inApp: true, email: true, sms: false, push: true }
    },
    
    // Payment notifications (important for all users)
    payments: {
      payment_successful: { inApp: true, email: true, sms: false, push: true },
      payment_failed: { inApp: true, email: true, sms: true, push: true },
      refund_processed: { inApp: true, email: true, sms: false, push: true },
      membership_renewal: { inApp: true, email: true, sms: false, push: true }
    }
  };

  // Role-specific preferences
  const roleSpecificPreferences = {
    admin: {
      ...basePreferences,
      
      // Federation admin receives all system notifications
      admin: {
        user_registration: { inApp: true, email: true, sms: false, push: true },
        user_verification: { inApp: true, email: false, sms: false, push: true },
        platform_alerts: { inApp: true, email: true, sms: true, push: true },
        financial_reports: { inApp: true, email: true, sms: false, push: false },
        system_errors: { inApp: true, email: true, sms: true, push: true }
      },
      
      // Tournament management notifications
      tournaments: {
        new_tournament: { inApp: true, email: true, sms: false, push: true },
        tournament_full: { inApp: true, email: true, sms: false, push: true },
        tournament_issues: { inApp: true, email: true, sms: true, push: true }
      },
      
      // Court management
      courts: {
        new_facility: { inApp: true, email: true, sms: false, push: true },
        facility_issues: { inApp: true, email: true, sms: false, push: true },
        booking_disputes: { inApp: true, email: true, sms: false, push: true }
      }
    },

    state_committee: {
      ...basePreferences,
      
      // State-level management
      state_management: {
        state_announcements: { inApp: true, email: true, sms: false, push: true },
        club_applications: { inApp: true, email: true, sms: false, push: true },
        player_registrations: { inApp: true, email: false, sms: false, push: true },
        state_tournaments: { inApp: true, email: true, sms: false, push: true },
        committee_meetings: { inApp: true, email: true, sms: false, push: true }
      },
      
      // Regional tournaments
      tournaments: {
        registration_open: { inApp: true, email: true, sms: false, push: true },
        tournament_full: { inApp: true, email: true, sms: false, push: true },
        tournament_updates: { inApp: true, email: true, sms: false, push: true }
      },
      
      // Messages from admin
      messages: {
        federation_messages: { inApp: true, email: true, sms: false, push: true },
        urgent_updates: { inApp: true, email: true, sms: true, push: true }
      }
    },

    club: {
      ...basePreferences,
      
      // Club management
      club_management: {
        member_applications: { inApp: true, email: true, sms: false, push: true },
        club_events: { inApp: true, email: true, sms: false, push: true },
        facility_bookings: { inApp: true, email: false, sms: false, push: true },
        membership_renewals: { inApp: true, email: true, sms: false, push: false }
      },
      
      // Tournament participation
      tournaments: {
        registration_open: { inApp: true, email: true, sms: false, push: true },
        tournament_invites: { inApp: true, email: true, sms: false, push: true },
        results_posted: { inApp: true, email: false, sms: false, push: true }
      },
      
      // State committee communications
      messages: {
        state_announcements: { inApp: true, email: true, sms: false, push: true },
        committee_updates: { inApp: true, email: true, sms: false, push: true }
      }
    },

    partner: {
      ...basePreferences,
      
      // Partner business notifications
      business: {
        court_bookings: { inApp: true, email: true, sms: false, push: true },
        revenue_reports: { inApp: true, email: true, sms: false, push: false },
        customer_reviews: { inApp: true, email: false, sms: false, push: true },
        facility_maintenance: { inApp: true, email: true, sms: false, push: true }
      },
      
      // Partnership communications
      partnership: {
        partnership_updates: { inApp: true, email: true, sms: false, push: true },
        promotional_opportunities: { inApp: true, email: true, sms: false, push: false },
        contract_renewals: { inApp: true, email: true, sms: false, push: true }
      }
    },

    coach: {
      ...basePreferences,
      
      // Coach-specific notifications
      coaching: {
        certification_renewal: { inApp: true, email: true, sms: true, push: true },
        training_opportunities: { inApp: true, email: true, sms: false, push: true },
        referee_assignments: { inApp: true, email: true, sms: false, push: true },
        player_connections: { inApp: true, email: false, sms: false, push: true }
      },
      
      // Tournament participation
      tournaments: {
        coaching_opportunities: { inApp: true, email: true, sms: false, push: true },
        tournament_results: { inApp: true, email: false, sms: false, push: true }
      },
      
      // Messages
      messages: {
        player_messages: { inApp: true, email: false, sms: false, push: true },
        federation_updates: { inApp: true, email: true, sms: false, push: true }
      }
    },

    player: {
      ...basePreferences,
      
      // Tournament notifications
      tournaments: {
        registration_open: { inApp: true, email: true, sms: false, push: true },
        registration_confirmed: { inApp: true, email: true, sms: false, push: true },
        bracket_released: { inApp: true, email: true, sms: false, push: true },
        match_scheduled: { inApp: true, email: true, sms: true, push: true },
        match_reminder: { inApp: true, email: false, sms: true, push: true },
        results_posted: { inApp: true, email: false, sms: false, push: true },
        tournament_winner: { inApp: true, email: true, sms: true, push: true }
      },
      
      // Court booking notifications
      bookings: {
        booking_confirmed: { inApp: true, email: true, sms: false, push: true },
        booking_reminder_day: { inApp: true, email: false, sms: false, push: true },
        booking_reminder_hour: { inApp: true, email: false, sms: true, push: true },
        booking_cancelled: { inApp: true, email: true, sms: true, push: true },
        court_unavailable: { inApp: true, email: true, sms: true, push: true }
      },
      
      // Player matching notifications (premium feature)
      player_finder: {
        match_found: { inApp: true, email: true, sms: false, push: true },
        match_request: { inApp: true, email: false, sms: false, push: true },
        match_accepted: { inApp: true, email: false, sms: false, push: true },
        match_declined: { inApp: true, email: false, sms: false, push: false },
        location_suggestions: { inApp: true, email: false, sms: false, push: true }
      },
      
      // Messaging notifications
      messages: {
        direct_message: { inApp: true, email: false, sms: false, push: true },
        group_message: { inApp: true, email: false, sms: false, push: true },
        mention: { inApp: true, email: false, sms: false, push: true },
        match_invitations: { inApp: true, email: false, sms: false, push: true }
      },
      
      // Club and coaching
      clubs: {
        membership_approved: { inApp: true, email: true, sms: false, push: true },
        club_events: { inApp: true, email: true, sms: false, push: true },
        membership_renewal: { inApp: true, email: true, sms: false, push: true }
      },
      
      // Ranking and achievements
      achievements: {
        ranking_updates: { inApp: true, email: false, sms: false, push: true },
        nrtp_level_change: { inApp: true, email: true, sms: false, push: true },
        achievement_unlocked: { inApp: true, email: false, sms: false, push: true }
      }
    }
  };

  return roleSpecificPreferences[role] || roleSpecificPreferences.player;
}