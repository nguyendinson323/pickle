module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const platformStats = [];
    
    // Create 30 days of platform statistics
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseUsers = 1200 + (29 - i) * 15;
      const newUsers = Math.floor(Math.random() * 25) + 8;
      const activeUsers = Math.floor(baseUsers * 0.35);
      
      platformStats.push({
        date: date.toISOString().split('T')[0],
        total_users: baseUsers + newUsers,
        new_users: newUsers,
        active_users: activeUsers,
        users_by_role: {
          player: Math.floor(baseUsers * 0.65),
          coach: Math.floor(baseUsers * 0.18),
          club: Math.floor(baseUsers * 0.08),
          partner: Math.floor(baseUsers * 0.05),
          state_committee: Math.floor(baseUsers * 0.03),
          federation: Math.floor(baseUsers * 0.01)
        },
        total_sessions: Math.floor(Math.random() * 800) + 400,
        avg_session_duration: Math.floor(Math.random() * 1800) + 900, // 15-45 minutes
        page_views: Math.floor(Math.random() * 5000) + 2000,
        total_tournaments: 180 + Math.floor(i / 2),
        new_tournaments: Math.floor(Math.random() * 8) + 2,
        active_tournaments: Math.floor(Math.random() * 15) + 8,
        completed_tournaments: 160 + Math.floor(i / 2),
        total_registrations: Math.floor(Math.random() * 150) + 50,
        total_bookings: Math.floor(Math.random() * 80) + 30,
        new_bookings: Math.floor(Math.random() * 20) + 5,
        completed_bookings: Math.floor(Math.random() * 60) + 20,
        cancelled_bookings: Math.floor(Math.random() * 10) + 2,
        total_revenue: Math.floor(Math.random() * 5000000) + 2000000, // in cents
        total_matches: Math.floor(Math.random() * 200) + 100,
        new_matches: Math.floor(Math.random() * 30) + 10,
        successful_matches: Math.floor(Math.random() * 180) + 80,
        messages_exchanged: Math.floor(Math.random() * 500) + 200,
        notifications_sent: Math.floor(Math.random() * 300) + 100,
        active_subscriptions: Math.floor(Math.random() * 100) + 50,
        new_subscriptions: Math.floor(Math.random() * 15) + 3,
        cancelled_subscriptions: Math.floor(Math.random() * 5) + 1,
        subscription_revenue: Math.floor(Math.random() * 1500000) + 800000, // in cents
        system_uptime: parseFloat((Math.random() * 2 + 98.5).toFixed(2)),
        average_response_time: Math.floor(Math.random() * 150) + 120,
        error_rate: parseFloat((Math.random() * 0.8).toFixed(3)),
        created_at: now,
        updated_at: now
      });
    }

    await queryInterface.bulkInsert('platform_statistics', platformStats);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('platform_statistics', {});
  }
};