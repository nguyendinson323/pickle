module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Get sample users for different roles
    const users = await queryInterface.sequelize.query(`
      SELECT id, role, username, email 
      FROM users 
      WHERE role IN ('admin', 'state', 'club', 'partner', 'coach', 'player') 
      ORDER BY role, created_at 
      LIMIT 30
    `, { type: Sequelize.QueryTypes.SELECT });

    const notifications = [];

    // Helper function to add notification
    const addNotification = (userId: string, type: string, category: string, title: string, message: string, actionUrl: string, metadata: any = {}, createdAt = now, isRead = false) => {
      notifications.push({
        user_id: userId,
        type,
        category,
        title,
        message,
        action_url: actionUrl,
        related_entity_type: metadata?.entityType || null,
        related_entity_id: metadata?.entityId || null,
        metadata: JSON.stringify(metadata || {}),
        is_read: isRead,
        read_at: isRead ? createdAt : null,
        channels: JSON.stringify({
          inApp: true,
          email: true,
          sms: false,
          push: true
        }),
        delivery_status: JSON.stringify({
          inApp: { delivered: true, deliveredAt: createdAt },
          email: { delivered: true, deliveredAt: createdAt },
          sms: { delivered: false },
          push: { delivered: true, deliveredAt: createdAt }
        }),
        scheduled_for: null,
        is_scheduled: false,
        expires_at: null,
        created_at: createdAt,
        updated_at: createdAt
      });
    };

    // Generate notifications for each user based on their role
    users.forEach(user => {
      switch (user.role) {
        case 'admin':
          // Federation admin notifications
          addNotification(
            user.id,
            'system',
            'warning',
            'High User Registration Volume',
            '150 new user registrations in the last 24 hours. Review queue requires attention.',
            '/admin/users?status=pending',
            { entityType: 'user_registrations', priority: 'high' },
            yesterday
          );
          
          addNotification(
            user.id,
            'system',
            'info',
            'Monthly Platform Report Ready',
            'November 2024 platform analytics and financial report is ready for review.',
            '/admin/reports/monthly/2024-11',
            { entityType: 'report', reportType: 'monthly' },
            lastWeek
          );
          
          addNotification(
            user.id,
            'system',
            'success',
            'Payment Gateway Update Successful',
            'Stripe payment gateway has been successfully updated. All transactions are processing normally.',
            '/admin/payments/gateway-status',
            { entityType: 'payment_system', status: 'updated' },
            yesterday,
            true
          );
          break;

        case 'state':
          // State committee notifications
          addNotification(
            user.id,
            'system',
            'info',
            'New Club Application - Jalisco',
            'Club Deportivo Tapatío has submitted an application for admin membership.',
            '/state/clubs/applications/new',
            { entityType: 'club_application', stateName: 'Jalisco' },
            yesterday
          );
          
          addNotification(
            user.id,
            'tournament',
            'info',
            'State Championship Registration Opens',
            'Registration for the Jalisco State Pickleball Championship opens December 15th.',
            '/tournaments/state-championship-jalisco-2024',
            { entityType: 'tournament', tournamentName: 'Jalisco State Championship' },
            lastWeek,
            true
          );
          break;

        case 'club':
          // Club notifications
          addNotification(
            user.id,
            'system',
            'success',
            'Membership Application Approved',
            'Your club membership with the Mexican Pickleball Federation has been approved!',
            '/club/membership-status',
            { entityType: 'membership', status: 'approved' },
            yesterday
          );
          
          addNotification(
            user.id,
            'system',
            'info',
            'Monthly Membership Report Due',
            'Please submit your November membership report by December 5th.',
            '/club/reports/monthly',
            { entityType: 'report', dueDate: '2024-12-05' },
            lastWeek
          );
          break;

        case 'partner':
          // Partner notifications
          addNotification(
            user.id,
            'booking',
            'info',
            'Court Booking Revenue Update',
            'Your facilities generated $12,450 MXN in bookings this week (+23% vs last week).',
            '/partner/revenue/weekly',
            { entityType: 'revenue', amount: 12450, growth: 23 },
            yesterday
          );
          
          addNotification(
            user.id,
            'system',
            'info',
            'New Partnership Opportunity',
            'Tournament sponsorship opportunity available for upcoming regional championships.',
            '/partner/opportunities/tournaments',
            { entityType: 'opportunity', type: 'sponsorship' },
            lastWeek,
            true
          );
          break;

        case 'coach':
          // Coach notifications
          addNotification(
            user.id,
            'system',
            'warning',
            'Certification Renewal Due Soon',
            'Your Level 2 Coaching Certification expires on January 15, 2025. Renew now to avoid interruption.',
            '/coach/certification/renewal',
            { entityType: 'certification', expiryDate: '2025-01-15', level: 'Level 2' },
            yesterday
          );
          
          addNotification(
            user.id,
            'match',
            'info',
            'New Coaching Request',
            'Maria González (NRTP 3.0) is looking for coaching sessions in your area.',
            '/coach/requests/new',
            { entityType: 'coaching_request', playerName: 'Maria González', level: '3.0' },
            lastWeek
          );
          break;

        case 'player':
          // Player notifications (more diverse for players)
          addNotification(
            user.id,
            'tournament',
            'success',
            'Tournament Registration Confirmed',
            'Your registration for "Copa Guadalajara 2024" has been confirmed! Category: Mixed Doubles 3.5.',
            '/tournaments/copa-guadalajara-2024/registration',
            { entityType: 'tournament', tournamentName: 'Copa Guadalajara 2024', category: 'Mixed Doubles 3.5' },
            yesterday
          );
          
          addNotification(
            user.id,
            'booking',
            'info',
            'Court Booking Tomorrow',
            'Reminder: Court 3 at Centro Deportivo booked for tomorrow at 7:00 PM. Access code: C7G9.',
            '/bookings/12345',
            { entityType: 'booking', courtName: 'Court 3', facility: 'Centro Deportivo', accessCode: 'C7G9' },
            yesterday
          );
          
          addNotification(
            user.id,
            'match',
            'info',
            'Player Match Found!',
            'Carlos Ruiz (NRTP 3.5) wants to play at Polanco Courts. Distance: 2.3km from you.',
            '/player-finder/match/67890',
            { entityType: 'player_match', partnerName: 'Carlos Ruiz', level: '3.5', distance: '2.3km' },
            lastWeek,
            true
          );
          
          addNotification(
            user.id,
            'system',
            'success',
            'NRTP Level Increased!',
            'Congratulations! Your NRTP level has been upgraded from 3.0 to 3.5 based on recent tournament performance.',
            '/profile/achievements',
            { entityType: 'achievement', oldLevel: '3.0', newLevel: '3.5' },
            lastWeek,
            true
          );
          
          addNotification(
            user.id,
            'payment',
            'success',
            'Payment Confirmed',
            'Your payment of $450 MXN for "Copa Guadalajara 2024" registration has been processed.',
            '/payments/receipt/tx_abc123',
            { entityType: 'payment', amount: 450, service: 'Tournament Registration', transactionId: 'tx_abc123' },
            yesterday,
            true
          );
          break;
      }
    });

    // Add some system-wide notifications for all users
    const systemNotifications = [
      {
        type: 'system',
        category: 'info',
        title: 'Platform Maintenance Scheduled',
        message: 'Scheduled maintenance on December 8th, 2024 from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.',
        actionUrl: '/maintenance-notice',
        metadata: { maintenanceDate: '2024-12-08', duration: '2 hours' }
      },
      {
        type: 'system',
        category: 'success',
        title: 'New Features Released',
        message: 'New player finder improvements and enhanced tournament bracket system are now available!',
        actionUrl: '/features/new',
        metadata: { features: ['player_finder', 'tournament_brackets'] }
      }
    ];

    // Add system notifications for a subset of users
    users.slice(0, 10).forEach(user => {
      systemNotifications.forEach(notification => {
        addNotification(
          user.id,
          notification.type,
          notification.category,
          notification.title,
          notification.message,
          notification.actionUrl,
          notification.metadata,
          lastWeek,
          Math.random() > 0.5 // Random read status
        );
      });
    });

    console.log(`Seeding ${notifications.length} sample notifications...`);
    
    // Insert in batches to avoid query size limits
    const batchSize = 50;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      await queryInterface.bulkInsert('notifications', batch);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', {}, {});
  }
};

