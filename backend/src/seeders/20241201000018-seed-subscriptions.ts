module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const subscriptions = [
      // Player subscriptions
      {
        user_id: 2, // player001
        plan_id: 1, // Básico
        stripe_subscription_id: 'sub_player001_basic',
        stripe_customer_id: 'cus_player001',
        status: 'active',
        current_period_start: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
        trial_end: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        amount: 19900, // $199.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'website',
          promotional_code: null,
          referral_user: null
        }),
        next_billing_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        last_payment_date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 3, // player002
        plan_id: 2, // Pro
        stripe_subscription_id: 'sub_player002_pro',
        stripe_customer_id: 'cus_player002',
        status: 'active',
        current_period_start: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
        trial_end: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        amount: 49900, // $499.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'mobile_app',
          promotional_code: 'EARLY_ADOPTER',
          referral_user: 2,
          discount_applied: 5000
        }),
        next_billing_date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        last_payment_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 3, // player002 (previous canceled subscription)
        plan_id: 1, // Básico
        stripe_subscription_id: 'sub_player002_basic_canceled',
        stripe_customer_id: 'cus_player002',
        status: 'canceled',
        current_period_start: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: true,
        canceled_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        trial_start: new Date(now.getTime() - 52 * 24 * 60 * 60 * 1000),
        trial_end: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        amount: 19900, // $199.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'website',
          promotional_code: null,
          referral_user: null,
          cancellation_reason: 'cost_too_high'
        }),
        next_billing_date: null,
        last_payment_date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 52 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
      },
      // Coach subscriptions
      {
        user_id: 4, // coach001
        plan_id: 2, // Pro
        stripe_subscription_id: 'sub_coach001_pro',
        stripe_customer_id: 'cus_coach001',
        status: 'active',
        current_period_start: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
        trial_end: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        amount: 49900, // $499.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'referral',
          promotional_code: 'COACH_SPECIAL',
          referral_user: 1,
          coach_certification: 'verified'
        }),
        next_billing_date: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        last_payment_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 5, // coach002
        plan_id: 2, // Pro
        stripe_subscription_id: 'sub_coach002_pro',
        stripe_customer_id: 'cus_coach002',
        status: 'trialing',
        current_period_start: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 27 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        trial_end: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
        amount: 49900, // $499.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'tournament_registration',
          promotional_code: null,
          referral_user: 4,
          coach_certification: 'pending'
        }),
        next_billing_date: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
        last_payment_date: null, // Still in trial
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      // Partner subscription
      {
        user_id: 6, // partner001
        plan_id: 2, // Pro
        stripe_subscription_id: 'sub_partner001_pro',
        stripe_customer_id: 'cus_partner001',
        status: 'active',
        current_period_start: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: null,
        trial_end: null,
        amount: 49900, // $499.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'business_partnership',
          promotional_code: 'PARTNER_LAUNCH',
          referral_user: null,
          business_verified: true
        }),
        next_billing_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        last_payment_date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      // Club subscriptions
      {
        user_id: 7, // club001
        plan_id: 3, // Club
        stripe_subscription_id: 'sub_club001_club',
        stripe_customer_id: 'cus_club001',
        status: 'active',
        current_period_start: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000),
        trial_end: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        amount: 99900, // $999.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'sales_team',
          promotional_code: 'CLUB_FOUNDING',
          referral_user: null,
          facility_count: 1,
          court_count: 4
        }),
        next_billing_date: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        last_payment_date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        user_id: 8, // club002
        plan_id: 3, // Club
        stripe_subscription_id: 'sub_club002_club',
        stripe_customer_id: 'cus_club002',
        status: 'active',
        current_period_start: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: new Date(now.getTime() - 38 * 24 * 60 * 60 * 1000),
        trial_end: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        amount: 99900, // $999.00 MXN in cents
        currency: 'MXN',
        interval: 'month',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'referral',
          promotional_code: null,
          referral_user: 7,
          facility_count: 1,
          court_count: 6
        }),
        next_billing_date: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
        last_payment_date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 38 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      // State committee subscription
      {
        user_id: 9, // state_committee001
        plan_id: 4, // Federación
        stripe_subscription_id: 'sub_committee001_federation',
        stripe_customer_id: 'cus_committee001',
        status: 'active',
        current_period_start: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000), // Annual subscription
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: null,
        trial_end: null,
        amount: 599900, // $5999.00 MXN in cents
        currency: 'MXN',
        interval: 'year',
        interval_count: 1,
        metadata: JSON.stringify({
          signup_source: 'federation_assignment',
          promotional_code: null,
          referral_user: 1,
          jurisdiction: 'Ciudad de México',
          official_designation: true
        }),
        next_billing_date: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000),
        last_payment_date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('subscriptions', subscriptions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subscriptions', {});
  }
};