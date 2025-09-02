module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const payments = [
      // Subscription payments
      {
        user_id: 3, // player001
        subscription_id: 1,
        stripe_payment_intent_id: 'pi_subscription_player001_001',
        stripe_charge_id: 'ch_subscription_player001_001',
        amount: 19900,
        currency: 'MXN',
        type: 'subscription',
        related_entity_type: 'subscription',
        related_entity_id: 1,
        status: 'succeeded',
        payment_method: JSON.stringify({
          type: 'card',
          card: { brand: 'visa', last4: '4242', expMonth: 12, expYear: 2025 }
        }),
        platform_fee: 995,
        stripe_fee: 897,
        net_amount: 18008,
        description: 'Suscripción mensual - Plan Básico',
        metadata: JSON.stringify({
          plan_name: 'Básico',
          billing_cycle: 'monthly',
          subscription_id: 1
        }),
        webhook_processed: true,
        webhook_data: JSON.stringify({
          event_type: 'payment_intent.succeeded',
          processed_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        }),
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: 4, // player002
        subscription_id: 2,
        stripe_payment_intent_id: 'pi_subscription_player002_001',
        stripe_charge_id: 'ch_subscription_player002_001',
        amount: 49900,
        currency: 'MXN',
        type: 'subscription',
        related_entity_type: 'subscription',
        related_entity_id: 2,
        status: 'succeeded',
        payment_method: JSON.stringify({
          type: 'card',
          card: { brand: 'mastercard', last4: '5555', expMonth: 8, expYear: 2026 }
        }),
        platform_fee: 2495,
        stripe_fee: 2245,
        net_amount: 45160,
        description: 'Suscripción mensual - Plan Pro',
        metadata: JSON.stringify({
          plan_name: 'Pro',
          billing_cycle: 'monthly',
          subscription_id: 2,
          promotional_code: 'EARLY_ADOPTER',
          discount_applied: 5000
        }),
        webhook_processed: true,
        webhook_data: JSON.stringify({
          event_type: 'payment_intent.succeeded',
          processed_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
        }),
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
      },

      // Tournament entry payments
      {
        user_id: 3,
        stripe_payment_intent_id: 'pi_tournament_registration_001',
        stripe_charge_id: 'ch_tournament_registration_001',
        amount: 50000,
        currency: 'MXN',
        type: 'tournament_entry',
        related_entity_type: 'tournament',
        related_entity_id: 1,
        status: 'succeeded',
        payment_method: JSON.stringify({
          type: 'card',
          card: { brand: 'visa', last4: '4242', expMonth: 12, expYear: 2025 }
        }),
        platform_fee: 2500,
        stripe_fee: 2250,
        net_amount: 45250,
        description: 'Registro - Torneo de Verano Ciudad de México 2024',
        metadata: JSON.stringify({
          tournament_id: 1,
          tournament_name: 'Torneo de Verano Ciudad de México 2024',
          category: 'intermediate',
          early_bird: true
        }),
        webhook_processed: true,
        webhook_data: JSON.stringify({
          event_type: 'payment_intent.succeeded',
          processed_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
        }),
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: 5,
        stripe_payment_intent_id: 'pi_tournament_registration_002',
        stripe_charge_id: 'ch_tournament_registration_002',
        amount: 75000,
        currency: 'MXN',
        type: 'tournament_entry',
        related_entity_type: 'tournament',
        related_entity_id: 2,
        status: 'succeeded',
        payment_method: JSON.stringify({
          type: 'card',
          card: { brand: 'amex', last4: '1005', expMonth: 6, expYear: 2027 }
        }),
        platform_fee: 3750,
        stripe_fee: 3375,
        net_amount: 67875,
        description: 'Registro - Campeonato Estatal CDMX 2024',
        metadata: JSON.stringify({
          tournament_id: 2,
          tournament_name: 'Campeonato Estatal CDMX 2024',
          category: 'advanced',
          coach_certification: true
        }),
        webhook_processed: true,
        webhook_data: JSON.stringify({
          event_type: 'payment_intent.succeeded',
          processed_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
        }),
        created_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
      },

      // ... (court booking, one-time, refunded, pending, failed payments follow same fixed pattern)
    ];

    await queryInterface.bulkInsert('payments', payments);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', {});
  }
};
