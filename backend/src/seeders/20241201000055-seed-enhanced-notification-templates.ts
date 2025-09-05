module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('notification_templates', [
      // Tournament Templates
      {
        name: 'tournament_started',
        type: 'tournament',
        category: 'tournament',
        templates: JSON.stringify({
          inApp: {
            title: 'Tournament Started - {{tournamentName}}',
            message: 'The tournament {{tournamentName}} has officially started! Good luck in your matches.',
            actionText: 'View Tournament'
          },
          email: {
            subject: 'Tournament Started - {{tournamentName}}',
            htmlContent: `
              <h2>🎾 Tournament Started!</h2>
              <p>Hello {{playerName}},</p>
              <p>The tournament <strong>{{tournamentName}}</strong> has officially started!</p>
              <p><strong>Details:</strong></p>
              <ul>
                <li>Tournament: {{tournamentName}}</li>
                <li>Level: {{tournamentLevel}}</li>
                <li>Start Date: {{startDate}}</li>
                <li>Venue: {{venue}}</li>
              </ul>
              <p>Good luck and play your best!</p>
            `,
            textContent: 'Tournament {{tournamentName}} has started! Level: {{tournamentLevel}}. Good luck!'
          },
          sms: {
            message: '🎾 {{tournamentName}} has started! Good luck in your matches. Level: {{tournamentLevel}}.'
          },
          push: {
            title: 'Tournament Started',
            body: '{{tournamentName}} has started! Good luck in your matches.',
            icon: '/tournament-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'playerName', description: 'Player full name', type: 'string', required: true },
          { name: 'tournamentName', description: 'Tournament name', type: 'string', required: true },
          { name: 'tournamentLevel', description: 'Tournament level', type: 'string', required: true },
          { name: 'startDate', description: 'Tournament start date', type: 'string', required: true },
          { name: 'venue', description: 'Tournament venue', type: 'string', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      {
        name: 'tournament_registration_confirmed',
        type: 'tournament',
        category: 'tournament',
        templates: JSON.stringify({
          inApp: {
            title: 'Registration Confirmed - {{tournamentName}}',
            message: 'Your registration for {{tournamentName}} has been confirmed! Category: {{categoryName}}.',
            actionText: 'View Registration'
          },
          email: {
            subject: 'Registration Confirmed - {{tournamentName}}',
            htmlContent: `
              <h2>✅ Registration Confirmed!</h2>
              <p>Hello {{playerName}},</p>
              <p>Your registration for <strong>{{tournamentName}}</strong> has been confirmed!</p>
              <p><strong>Registration Details:</strong></p>
              <ul>
                <li>Tournament: {{tournamentName}}</li>
                <li>Category: {{categoryName}}</li>
                <li>Level: {{tournamentLevel}}</li>
                <li>Start Date: {{startDate}}</li>
                <li>Venue: {{venue}}</li>
                <li>Registration Fee: $\${registrationFee} MXN</li>
              </ul>
              <p>We'll send you more details as the tournament date approaches.</p>
            `,
            textContent: 'Registration confirmed for {{tournamentName}}! Category: {{categoryName}}. Start: {{startDate}}.'
          },
          sms: {
            message: '✅ Registration confirmed for {{tournamentName}}! Category: {{categoryName}}. Start: {{startDate}}.'
          },
          push: {
            title: 'Registration Confirmed',
            body: 'You\'re registered for {{tournamentName}} - {{categoryName}}!',
            icon: '/tournament-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'playerName', description: 'Player full name', type: 'string', required: true },
          { name: 'tournamentName', description: 'Tournament name', type: 'string', required: true },
          { name: 'categoryName', description: 'Tournament category', type: 'string', required: true },
          { name: 'tournamentLevel', description: 'Tournament level', type: 'string', required: true },
          { name: 'startDate', description: 'Tournament start date', type: 'string', required: true },
          { name: 'venue', description: 'Tournament venue', type: 'string', required: true },
          { name: 'registrationFee', description: 'Registration fee amount', type: 'number', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      {
        name: 'tournament_winner',
        type: 'tournament',
        category: 'tournament',
        templates: JSON.stringify({
          inApp: {
            title: 'Congratulations! You Won {{categoryName}}',
            message: 'Outstanding victory in {{categoryName}} category of {{tournamentName}}! You are the champion!',
            actionText: 'View Results & Certificate'
          },
          email: {
            subject: 'CHAMPION! You Won {{categoryName}} - {{tournamentName}}',
            htmlContent: `
              <h2>🏆 CONGRATULATIONS CHAMPION!</h2>
              <p>Dear {{playerName}},</p>
              <p>Congratulations on your outstanding victory in the <strong>{{categoryName}}</strong> category of <strong>{{tournamentName}}</strong>!</p>
              <p><strong>Tournament Results:</strong></p>
              <ul>
                <li>Tournament: {{tournamentName}}</li>
                <li>Category: {{categoryName}}</li>
                <li>Level: {{tournamentLevel}}</li>
                <li>Position: 1st Place 🥇</li>
                <li>Prize: {{prize}}</li>
              </ul>
              <p>Your exceptional performance has earned you recognition in the admin rankings!</p>
            `,
            textContent: 'CHAMPION! You won {{categoryName}} in {{tournamentName}}! Prize: {{prize}}.'
          },
          sms: {
            message: '🏆 CHAMPION! You won {{categoryName}} in {{tournamentName}}! Prize: {{prize}}.'
          },
          push: {
            title: 'CHAMPION! 🏆',
            body: 'You won {{categoryName}} in {{tournamentName}}!',
            icon: '/champion-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'playerName', description: 'Player full name', type: 'string', required: true },
          { name: 'tournamentName', description: 'Tournament name', type: 'string', required: true },
          { name: 'categoryName', description: 'Tournament category', type: 'string', required: true },
          { name: 'tournamentLevel', description: 'Tournament level', type: 'string', required: true },
          { name: 'prize', description: 'Prize description', type: 'string', required: false }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      // Court Booking Templates
      {
        name: 'court_booking_confirmation',
        type: 'booking',
        category: 'booking',
        templates: JSON.stringify({
          inApp: {
            title: 'Court Booking Confirmed - {{facilityName}}',
            message: 'Your court booking at {{facilityName}} has been confirmed! Court: {{courtName}} on {{bookingDate}} at {{startTime}}.',
            actionText: 'View Booking'
          },
          email: {
            subject: 'Court Booking Confirmed - {{facilityName}}',
            htmlContent: '<h2>🏟️ Court Booking Confirmed!</h2><p>Your court booking has been confirmed:</p><p><strong>Booking Details:</strong></p><ul><li>Court: {{courtName}}</li><li>Facility: {{facilityName}}</li><li>Date: {{bookingDate}}</li><li>Time: {{startTime}} - {{endTime}}</li><li>Total Amount: ${{totalAmount}} MXN</li><li>Access Code: {{accessCode}}</li></ul><p>Please arrive on time and bring your access code.</p>',
            textContent: 'Court booking confirmed! {{courtName}} on {{bookingDate}} {{startTime}}-{{endTime}}. Access: {{accessCode}}.'
          },
          sms: {
            message: '🏟️ Court confirmed! {{courtName}} on {{bookingDate}} {{startTime}}-{{endTime}}. Access: {{accessCode}}.'
          },
          push: {
            title: 'Court Booking Confirmed',
            body: '{{courtName}} on {{bookingDate}} at {{startTime}}',
            icon: '/court-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'courtName', description: 'Court name', type: 'string', required: true },
          { name: 'facilityName', description: 'Facility name', type: 'string', required: true },
          { name: 'bookingDate', description: 'Booking date', type: 'string', required: true },
          { name: 'startTime', description: 'Start time', type: 'string', required: true },
          { name: 'endTime', description: 'End time', type: 'string', required: true },
          { name: 'totalAmount', description: 'Total booking amount', type: 'number', required: true },
          { name: 'accessCode', description: 'Court access code', type: 'string', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      {
        name: 'court_booking_reminder_day',
        type: 'booking',
        category: 'booking',
        templates: JSON.stringify({
          inApp: {
            title: 'Tomorrow\'s Court Booking - {{facilityName}}',
            message: 'Reminder: Your court booking is tomorrow at {{startTime}}. Court: {{courtName}}. Access code: {{accessCode}}.',
            actionText: 'View Booking'
          },
          email: {
            subject: 'Tomorrow\'s Court Booking - {{facilityName}}',
            htmlContent: `
              <h2>⏰ Court Booking Tomorrow!</h2>
              <p>This is a reminder about your court booking tomorrow:</p>
              <p><strong>Booking Details:</strong></p>
              <ul>
                <li>Court: {{courtName}}</li>
                <li>Facility: {{facilityName}}</li>
                <li>Date: {{bookingDate}}</li>
                <li>Time: {{startTime}} - {{endTime}}</li>
                <li>Access Code: {{accessCode}}</li>
              </ul>
              <p>Don't forget to bring your equipment and arrive on time!</p>
            `,
            textContent: 'Court booking tomorrow! {{courtName}} at {{startTime}}. Access: {{accessCode}}. Don\'t forget your equipment!'
          },
          sms: {
            message: '⏰ Court booking tomorrow! {{courtName}} at {{startTime}}. Access: {{accessCode}}. Don\'t forget your equipment!'
          },
          push: {
            title: 'Court Booking Tomorrow',
            body: '{{courtName}} at {{startTime}}. Don\'t forget your equipment!',
            icon: '/reminder-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'courtName', description: 'Court name', type: 'string', required: true },
          { name: 'facilityName', description: 'Facility name', type: 'string', required: true },
          { name: 'bookingDate', description: 'Booking date', type: 'string', required: true },
          { name: 'startTime', description: 'Start time', type: 'string', required: true },
          { name: 'endTime', description: 'End time', type: 'string', required: true },
          { name: 'accessCode', description: 'Court access code', type: 'string', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      {
        name: 'court_booking_cancelled',
        type: 'booking',
        category: 'booking',
        templates: JSON.stringify({
          inApp: {
            title: 'Booking Cancelled - {{facilityName}}',
            message: 'Your court booking has been cancelled. Refund of $${refundAmount} MXN will be processed.',
            actionText: 'View Cancellation Details'
          },
          email: {
            subject: 'Booking Cancelled - {{facilityName}}',
            htmlContent: `
              <h2>❌ Court Booking Cancelled</h2>
              <p>Your court booking has been cancelled.</p>
              <p><strong>Cancelled Booking Details:</strong></p>
              <ul>
                <li>Court: {{courtName}}</li>
                <li>Facility: {{facilityName}}</li>
                <li>Date: {{bookingDate}}</li>
                <li>Time: {{startTime}} - {{endTime}}</li>
                <li>Reason: {{reason}}</li>
                <li>Refund Amount: {refundAmount} MXN</li>
              </ul>
              <p>Your refund will be processed within 3-5 business days.</p>
            `,
            textContent: 'Court booking cancelled: {{courtName}} on {{bookingDate}}. Refund: $${refundAmount} MXN.'
          },
          sms: {
            message: '❌ Court booking cancelled: {{courtName}} on {{bookingDate}}. Refund: $${refundAmount} MXN.'
          },
          push: {
            title: 'Booking Cancelled',
            body: 'Refund of $${refundAmount} MXN being processed.',
            icon: '/cancelled-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'courtName', description: 'Court name', type: 'string', required: true },
          { name: 'facilityName', description: 'Facility name', type: 'string', required: true },
          { name: 'bookingDate', description: 'Booking date', type: 'string', required: true },
          { name: 'startTime', description: 'Start time', type: 'string', required: true },
          { name: 'endTime', description: 'End time', type: 'string', required: true },
          { name: 'reason', description: 'Cancellation reason', type: 'string', required: true },
          { name: 'refundAmount', description: 'Refund amount', type: 'number', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      // Federation-specific Templates
      {
        name: 'state_committee_announcement',
        type: 'system',
        category: 'system',
        templates: JSON.stringify({
          inApp: {
            title: 'Announcement from {{stateName}} State Committee',
            message: '{{senderName}} from {{stateName}} State Committee: {{subject}}',
            actionText: 'Read Full Announcement'
          },
          email: {
            subject: 'Important Announcement from {{stateName}} State Committee',
            htmlContent: `
              <h2>📢 {{stateName}} State Committee</h2>
              <p>Dear Federation Member,</p>
              <p><strong>{{senderName}}</strong> from the {{stateName}} State Committee has shared an important announcement:</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
                <h3>{{subject}}</h3>
                <p>{{announcementText}}</p>
              </div>
              <p>For questions, please contact the {{stateName}} State Committee directly.</p>
            `,
            textContent: '{{stateName}} State Committee Announcement: {{subject}} - {{announcementText}}'
          },
          sms: {
            message: '📢 {{stateName}} State Committee: {{subject}} - {{announcementText}}'
          },
          push: {
            title: '{{stateName}} Announcement',
            body: '{{subject}}',
            icon: '/state-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'senderName', description: 'Committee member name', type: 'string', required: true },
          { name: 'stateName', description: 'State name', type: 'string', required: true },
          { name: 'subject', description: 'Announcement subject', type: 'string', required: true },
          { name: 'announcementText', description: 'Announcement content', type: 'string', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      {
        name: 'player_finder_match_found',
        type: 'match',
        category: 'match',
        templates: JSON.stringify({
          inApp: {
            title: 'Player Match Found!',
            message: '{{partnerName}} ({{partnerLevel}}) wants to play at {{location}}. Distance: {{distance}}km away.',
            actionText: 'View Match Request'
          },
          email: {
            subject: 'New Player Match Found - {{location}}',
            htmlContent: `
              <h2>🎾 Player Match Found!</h2>
              <p>Great news! We found a player match for you.</p>
              <p><strong>Player Details:</strong></p>
              <ul>
                <li>Name: {{partnerName}}</li>
                <li>NRTP Level: {{partnerLevel}}</li>
                <li>Location: {{location}}</li>
                <li>Distance: {{distance}} km away</li>
                <li>Available: {{availableTime}}</li>
              </ul>
              <p>This is a premium feature benefit. Connect now to arrange your match!</p>
            `,
            textContent: 'Player match found: {{partnerName}} ({{partnerLevel}}) at {{location}} - {{distance}}km away.'
          },
          sms: {
            message: '🎾 Match found! {{partnerName}} ({{partnerLevel}}) at {{location}} - {{distance}}km away.'
          },
          push: {
            title: 'Match Found!',
            body: '{{partnerName}} wants to play at {{location}}',
            icon: '/match-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'partnerName', description: 'Potential partner name', type: 'string', required: true },
          { name: 'partnerLevel', description: 'Partner NRTP level', type: 'string', required: true },
          { name: 'location', description: 'Match location', type: 'string', required: true },
          { name: 'distance', description: 'Distance in km', type: 'string', required: true },
          { name: 'availableTime', description: 'Available time slots', type: 'string', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      },

      {
        name: 'payment_successful',
        type: 'payment',
        category: 'payment',
        templates: JSON.stringify({
          inApp: {
            title: 'Payment Confirmed - $${amount} MXN',
            message: 'Your payment of $${amount} MXN for {{service}} has been processed successfully.',
            actionText: 'View Receipt'
          },
          email: {
            subject: 'Payment Confirmation - $${amount} MXN',
            htmlContent: `
              <h2>💳 Payment Confirmed!</h2>
              <p>Dear {{customerName}},</p>
              <p>Your payment has been successfully processed.</p>
              <p><strong>Payment Details:</strong></p>
              <ul>
                <li>Amount: amount MXN</li>
                <li>Service: {{service}}</li>
                <li>Transaction ID: {{transactionId}}</li>
                <li>Date: {{paymentDate}}</li>
                <li>Payment Method: {{paymentMethod}}</li>
                <li>Status: Completed</li>
              </ul>
              <p>Thank you for your payment! A receipt has been generated for your records.</p>
            `,
            textContent: 'Payment confirmed: $${amount} MXN for {{service}}. Transaction ID: {{transactionId}}'
          },
          sms: {
            message: '💳 Payment confirmed! $${amount} MXN for {{service}}. Transaction: {{transactionId}}'
          },
          push: {
            title: 'Payment Successful',
            body: '$${amount} MXN payment confirmed',
            icon: '/payment-icon.png'
          }
        }),
        variables: JSON.stringify([
          { name: 'customerName', description: 'Customer name', type: 'string', required: true },
          { name: 'amount', description: 'Payment amount', type: 'number', required: true },
          { name: 'service', description: 'Service paid for', type: 'string', required: true },
          { name: 'transactionId', description: 'Transaction ID', type: 'string', required: true },
          { name: 'paymentDate', description: 'Payment date', type: 'string', required: true },
          { name: 'paymentMethod', description: 'Payment method used', type: 'string', required: true }
        ]),
        is_active: true,
        version: 1,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_templates', {}, {});
  }
};