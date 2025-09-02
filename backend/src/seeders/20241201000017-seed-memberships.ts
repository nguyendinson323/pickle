module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('memberships', [
      {
        user_id: 2, // player001
        membership_plan_id: 1, // Básico
        status: 'active',
        start_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000), // ~1 year
        is_auto_renew: true,
        stripe_subscription_id: 'sub_1234567890abcdef',
        last_payment_id: null,
        renewal_reminder_sent: false,
        expiration_reminder_sent: false,
        cancelled_at: null,
        cancel_reason: null,
        created_at: now,
        updated_at: now
      },
      {
        user_id: 3, // player002
        membership_plan_id: 2, // Premium
        status: 'active',
        start_date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 305 * 24 * 60 * 60 * 1000), // ~1 year
        is_auto_renew: true,
        stripe_subscription_id: 'sub_abcdef1234567890',
        last_payment_id: null,
        renewal_reminder_sent: false,
        expiration_reminder_sent: false,
        cancelled_at: null,
        cancel_reason: null,
        created_at: now,
        updated_at: now
      },
      {
        user_id: 4, // player003
        membership_plan_id: 1, // Básico
        status: 'active',
        start_date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 350 * 24 * 60 * 60 * 1000), // ~1 year
        is_auto_renew: false,
        stripe_subscription_id: null,
        last_payment_id: null,
        renewal_reminder_sent: false,
        expiration_reminder_sent: false,
        cancelled_at: null,
        cancel_reason: null,
        created_at: now,
        updated_at: now
      },
      {
        user_id: 5, // coach001
        membership_plan_id: 3, // Profesional
        status: 'active',
        start_date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 275 * 24 * 60 * 60 * 1000), // ~1 year
        is_auto_renew: true,
        stripe_subscription_id: 'sub_coach001_pro_plan',
        last_payment_id: null,
        renewal_reminder_sent: false,
        expiration_reminder_sent: false,
        cancelled_at: null,
        cancel_reason: null,
        created_at: now,
        updated_at: now
      },
      {
        user_id: 9, // club001
        membership_plan_id: 3, // Profesional (for clubs)
        status: 'active',
        start_date: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        end_date: new Date(now.getTime() + 245 * 24 * 60 * 60 * 1000), // ~1 year
        is_auto_renew: true,
        stripe_subscription_id: 'sub_club001_pro_plan',
        last_payment_id: null,
        renewal_reminder_sent: false,
        expiration_reminder_sent: false,
        cancelled_at: null,
        cancel_reason: null,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('memberships', {}, {});
  }
};