module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('notification_templates', [
      // Tournament Templates
      {
        id: 'tournament_started',
        name: 'Tournament Started',
        type: 'tournament',
        category: 'info',
        title: 'Tournament Started - {{tournamentName}}',
        email_template: `
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
          <a href="{{actionUrl}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Tournament</a>
        `,
        sms_template: '🎾 {{tournamentName}} has started! Good luck in your matches. Level: {{tournamentLevel}}. View details: {{actionUrl}}',
        push_template: '{{tournamentName}} has started! Good luck in your matches.',
        created_at: now,
        updated_at: now
      },
      {
        id: 'tournament_registration_confirmed',
        name: 'Tournament Registration Confirmed',
        type: 'tournament',
        category: 'success',
        title: 'Registration Confirmed - {{tournamentName}}',
        email_template: `
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
            <li>Registration Fee: $` + '{{registrationFee}}' + ` MXN</li>
          </ul>
          <p>We'll send you more details as the tournament date approaches.</p>
          <a href="{{actionUrl}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Registration</a>
        `,
        sms_template: '✅ Registration confirmed for {{tournamentName}}! Category: {{categoryName}}. Start: {{startDate}}. Details: {{actionUrl}}',
        push_template: 'Registration confirmed for {{tournamentName}}! You\'re all set for {{categoryName}} category.',
        created_at: now,
        updated_at: now
      },
      {
        id: 'match_scheduled',
        name: 'Match Scheduled',
        type: 'tournament',
        category: 'info',
        title: 'Match Scheduled - {{tournamentName}}',
        email_template: `
          <h2>📅 Match Scheduled!</h2>
          <p>Your match has been scheduled for {{tournamentName}}:</p>
          <p><strong>Match Details:</strong></p>
          <ul>
            <li>Opponent: {{opponent}}</li>
            <li>Date: {{scheduledDate}}</li>
            <li>Time: {{scheduledTime}}</li>
            <li>Venue: {{venue}}</li>
            <li>Round: {{round}}</li>
            <li>Court: {{courtAssignment}}</li>
          </ul>
          <p>Please arrive 15 minutes early for warm-up.</p>
          <a href="{{actionUrl}}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Match Details</a>
        `,
        sms_template: '📅 Match vs {{opponent}} on {{scheduledDate}} at {{scheduledTime}}. Court: {{courtAssignment}}. {{actionUrl}}',
        push_template: 'Match scheduled vs {{opponent}} on {{scheduledDate}} at {{scheduledTime}}',
        created_at: now,
        updated_at: now
      },
      
      // Court Booking Templates
      {
        id: 'court_booking_confirmation',
        name: 'Court Booking Confirmation',
        type: 'booking',
        category: 'info',
        title: 'Court Booking Confirmed - {{facilityName}}',
        email_template: `
          <h2>🏟️ Court Booking Confirmed!</h2>
          <p>Your court booking has been confirmed:</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Court: {{courtName}}</li>
            <li>Facility: {{facilityName}}</li>
            <li>Date: {{bookingDate}}</li>
            <li>Time: {{startTime}} - {{endTime}}</li>
            <li>Total Amount: $` + '{{totalAmount}}' + ` MXN</li>
            <li>Access Code: {{accessCode}}</li>
          </ul>
          <p>Please arrive on time and bring your access code.</p>
          <a href="{{actionUrl}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Booking</a>
        `,
        sms_template: '🏟️ Court confirmed! {{courtName}} on {{bookingDate}} {{startTime}}-{{endTime}}. Access: {{accessCode}}. {{actionUrl}}',
        push_template: 'Court booking confirmed! {{courtName}} on {{bookingDate}} at {{startTime}}',
        created_at: now,
        updated_at: now
      },
      {
        id: 'court_booking_reminder_day',
        name: 'Court Booking Day Reminder',
        type: 'booking',
        category: 'reminder',
        title: 'Tomorrow\'s Court Booking - {{facilityName}}',
        email_template: `
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
          <a href="{{actionUrl}}" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Booking</a>
        `,
        sms_template: '⏰ Court booking tomorrow! {{courtName}} at {{startTime}}. Access: {{accessCode}}. Don\'t forget your equipment!',
        push_template: 'Court booking reminder: {{courtName}} tomorrow at {{startTime}}',
        created_at: now,
        updated_at: now
      },
      
      // General System Templates
      {
        id: 'welcome_message',
        name: 'Welcome Message',
        type: 'system',
        category: 'info',
        title: 'Welcome to {{platformName}}!',
        email_template: `
          <h2>🎾 Welcome to {{platformName}}!</h2>
          <p>Hello {{userName}},</p>
          <p>Welcome to the premier pickleball platform in Mexico! We're excited to have you join our community.</p>
          <p><strong>What you can do now:</strong></p>
          <ul>
            <li>Complete your profile</li>
            <li>Find courts near you</li>
            <li>Connect with other players</li>
            <li>Register for tournaments</li>
            <li>Book court time</li>
          </ul>
          <p>Get started by exploring the platform!</p>
          <a href="{{actionUrl}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
        `,
        sms_template: '🎾 Welcome to {{platformName}}, {{userName}}! Start exploring courts, players, and tournaments. {{actionUrl}}',
        push_template: 'Welcome to {{platformName}}! Start exploring courts, players, and tournaments.',
        created_at: now,
        updated_at: now
      },

      // Federation-specific templates
      {
        id: 'state_committee_announcement',
        name: 'State Committee Announcement',
        type: 'system',
        category: 'info',
        title: 'Announcement from {{stateName}} State Committee',
        email_template: `
          <h2>📢 {{stateName}} State Committee</h2>
          <p>Dear Federation Member,</p>
          <p><strong>{{senderName}}</strong> from the {{stateName}} State Committee has shared an important announcement:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3>{{subject}}</h3>
            <p>{{announcementText}}</p>
          </div>
          <p>For questions, please contact the {{stateName}} State Committee directly.</p>
          <a href="{{actionUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read Full Announcement</a>
        `,
        sms_template: '📢 {{stateName}} State Committee: {{subject}} - {{announcementText}} Details: {{actionUrl}}',
        push_template: '{{stateName}} State Committee: {{subject}}',
        created_at: now,
        updated_at: now
      },
      
      {
        id: 'club_membership_approved',
        name: 'Club Membership Approved',
        type: 'system',
        category: 'success',
        title: 'Welcome to {{clubName}}!',
        email_template: `
          <h2>🎉 Membership Approved!</h2>
          <p>Dear {{memberName}},</p>
          <p>Congratulations! Your membership with <strong>{{clubName}}</strong> has been approved.</p>
          <p><strong>Club Details:</strong></p>
          <ul>
            <li>Club: {{clubName}}</li>
            <li>Location: {{clubLocation}}</li>
            <li>Contact: {{clubContact}}</li>
            <li>Membership Level: {{membershipLevel}}</li>
            <li>Benefits: Access to all club facilities and events</li>
          </ul>
          <p>You can now access all club facilities and participate in club events!</p>
          <a href="{{actionUrl}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Club Profile</a>
        `,
        sms_template: '🎉 Welcome to {{clubName}}! Your membership is approved. Level: {{membershipLevel}}. {{actionUrl}}',
        push_template: 'Welcome to {{clubName}}! Your membership has been approved.',
        created_at: now,
        updated_at: now
      },

      {
        id: 'coach_certification_reminder',
        name: 'Coach Certification Reminder',
        type: 'system',
        category: 'warning',
        title: 'Certification Renewal Due - {{certificationType}}',
        email_template: `
          <h2>⚠️ Certification Renewal Notice</h2>
          <p>Dear Coach {{coachName}},</p>
          <p>Your <strong>{{certificationType}}</strong> certification is set to expire on <strong>{{expiryDate}}</strong>.</p>
          <p>To maintain your coaching status and continue offering services, please complete your renewal before the expiry date.</p>
          <p><strong>Renewal Requirements:</strong></p>
          <ul>
            <li>Complete continuing education hours</li>
            <li>Submit renewal application</li>
            <li>Pay renewal fee</li>
            <li>Update certification documents</li>
          </ul>
          <p>Don't let your certification expire - renew now!</p>
          <a href="{{actionUrl}}" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Certification</a>
        `,
        sms_template: '⚠️ Coach {{coachName}}, your {{certificationType}} expires {{expiryDate}}. Renew now: {{actionUrl}}',
        push_template: 'Certification expires {{expiryDate}}. Renew your {{certificationType}} now!',
        created_at: now,
        updated_at: now
      },

      {
        id: 'player_finder_match_found',
        name: 'Player Match Found',
        type: 'match',
        category: 'info',
        title: 'Player Match Found!',
        email_template: `
          <h2>🎾 Player Match Found!</h2>
          <p>Great news! We found a player match for you.</p>
          <p><strong>Player Details:</strong></p>
          <ul>
            <li>Name: {{partnerName}}</li>
            <li>NRTP Level: {{partnerLevel}}</li>
            <li>Location: {{location}}</li>
            <li>Distance: {{distance}} km away</li>
            <li>Available: {{availableTime}}</li>
            <li>Preferred Playing Style: {{playingStyle}}</li>
          </ul>
          <p>This is a premium feature benefit. Connect now to arrange your match!</p>
          <a href="{{actionUrl}}" style="background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Match Request</a>
        `,
        sms_template: '🎾 Match found! {{partnerName}} ({{partnerLevel}}) at {{location}} - {{distance}}km away. Available: {{availableTime}}. {{actionUrl}}',
        push_template: 'Match found! {{partnerName}} wants to play at {{location}}',
        created_at: now,
        updated_at: now
      },

      {
        id: 'payment_successful',
        name: 'Payment Successful',
        type: 'payment',
        category: 'success',
        title: 'Payment Confirmed - $' + '{{amount}}' + ' MXN',
        email_template: `
          <h2>💳 Payment Confirmed!</h2>
          <p>Dear {{customerName}},</p>
          <p>Your payment has been successfully processed.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Amount: $` + '{{amount}}' + ` MXN</li>
            <li>Service: {{service}}</li>
            <li>Transaction ID: {{transactionId}}</li>
            <li>Date: {{paymentDate}}</li>
            <li>Payment Method: {{paymentMethod}}</li>
            <li>Status: Completed</li>
          </ul>
          <p>Thank you for your payment! A receipt has been generated for your records.</p>
          <a href="{{actionUrl}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Receipt</a>
        `,
        sms_template: '💳 Payment confirmed! $' + '{{amount}}' + ' MXN for {{service}}. Transaction: {{transactionId}}. Receipt: {{actionUrl}}',
        push_template: 'Payment successful! $' + '{{amount}}' + ' MXN for {{service}}',
        created_at: now,
        updated_at: now
      },

      {
        id: 'membership_renewal_reminder',
        name: 'Membership Renewal Reminder',
        type: 'system',
        category: 'warning',
        title: 'Membership Renewal Due',
        email_template: `
          <h2>⏰ Membership Renewal Reminder</h2>
          <p>Dear {{memberName}},</p>
          <p>Your {{membershipType}} membership is set to expire on <strong>{{expiryDate}}</strong>.</p>
          <p>To continue enjoying all platform benefits, please renew your membership before the expiry date.</p>
          <p><strong>Membership Benefits:</strong></p>
          <ul>
            <li>Tournament registration priority</li>
            <li>Court booking discounts</li>
            <li>Player finder access (Premium feature)</li>
            <li>Exclusive club events access</li>
            <li>Digital credential updates</li>
          </ul>
          <p>Renew now to avoid service interruption!</p>
          <a href="{{actionUrl}}" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Membership</a>
        `,
        sms_template: '⏰ {{membershipType}} membership expires {{expiryDate}}. Renew now to keep benefits: {{actionUrl}}',
        push_template: 'Membership expires {{expiryDate}}. Renew now!',
        created_at: now,
        updated_at: now
      },

      {
        id: 'tournament_winner',
        name: 'Tournament Winner',
        type: 'tournament',
        category: 'success',
        title: 'Congratulations! You Won {{categoryName}}',
        email_template: `
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
          <a href="{{actionUrl}}" style="background: #eab308; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Results & Certificate</a>
        `,
        sms_template: '🏆 CHAMPION! You won {{categoryName}} in {{tournamentName}}! Prize: {{prize}}. View certificate: {{actionUrl}}',
        push_template: 'CHAMPION! You won {{categoryName}} in {{tournamentName}}! 🏆',
        created_at: now,
        updated_at: now
      },

      {
        id: 'court_booking_cancelled',
        name: 'Court Booking Cancelled',
        type: 'booking',
        category: 'warning',
        title: 'Booking Cancelled - {{facilityName}}',
        email_template: `
          <h2>❌ Court Booking Cancelled</h2>
          <p>Your court booking has been cancelled.</p>
          <p><strong>Cancelled Booking Details:</strong></p>
          <ul>
            <li>Court: {{courtName}}</li>
            <li>Facility: {{facilityName}}</li>
            <li>Date: {{bookingDate}}</li>
            <li>Time: {{startTime}} - {{endTime}}</li>
            <li>Reason: {{reason}}</li>
            <li>Refund Amount: $` + '{{refundAmount}}' + ` MXN</li>
          </ul>
          <p>Your refund will be processed within 3-5 business days.</p>
          <a href="{{actionUrl}}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Cancellation Details</a>
        `,
        sms_template: '❌ Court booking cancelled: {{courtName}} on {{bookingDate}}. Refund: $' + '{{refundAmount}}' + ' MXN. Details: {{actionUrl}}',
        push_template: 'Court booking cancelled. Refund of $' + '{{refundAmount}}' + ' MXN being processed.',
        created_at: now,
        updated_at: now
      },

      {
        id: 'system_announcement',
        name: 'System Announcement',
        type: 'system',
        category: 'info',
        title: 'Important Announcement - {{subject}}',
        email_template: `
          <h2>📢 System Announcement</h2>
          <p>Dear Federation Member,</p>
          <p>The Mexican Pickleball Federation has an important announcement:</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
            <h3>{{subject}}</h3>
            <p>{{announcementText}}</p>
          </div>
          <p>For more information, please visit our website or contact admin support.</p>
          <a href="{{actionUrl}}" style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read More</a>
        `,
        sms_template: '📢 Federation Announcement: {{subject}} - {{announcementText}} More info: {{actionUrl}}',
        push_template: 'Federation Announcement: {{subject}}',
        created_at: now,
        updated_at: now
      },
      {
        id: 'password_reset',
        name: 'Password Reset',
        type: 'security',
        category: 'warning',
        title: 'Password Reset Request',
        email_template: `
          <h2>🔒 Password Reset Request</h2>
          <p>Hello {{userName}},</p>
          <p>We received a request to reset your password. If you made this request, click the link below:</p>
          <a href="{{resetUrl}}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        `,
        sms_template: '🔒 Password reset requested for {{platformName}}. Use code: {{resetCode}}. Expires in 1 hour.',
        push_template: 'Password reset requested. Check your email for instructions.',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_templates', {}, {});
  }
};