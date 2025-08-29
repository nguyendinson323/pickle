import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('payments', [
    {
      user_id: 2,
      membership_plan_id: 1,
      payment_type: 'membership',
      status: 'completed',
      amount: 800.00,
      currency: 'mxn',
      stripe_payment_intent_id: 'pi_test_001',
      payment_method: 'card',
      subtotal: 695.65,
      tax_amount: 104.35,
      total_amount: 800.00,
      description: 'Membresía Jugador Básico - Anual',
      metadata: JSON.stringify({}),
      paid_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 3,
      membership_plan_id: 2,
      payment_type: 'membership',
      status: 'completed',
      amount: 1200.00,
      currency: 'mxn',
      stripe_payment_intent_id: 'pi_test_002',
      payment_method: 'card',
      subtotal: 1043.48,
      tax_amount: 156.52,
      total_amount: 1200.00,
      description: 'Membresía Jugador Pro - Anual',
      metadata: JSON.stringify({}),
      paid_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('payments', {}, {});
}