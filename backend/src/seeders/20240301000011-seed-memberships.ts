import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('memberships', [
    {
      user_id: 5, // player001
      membership_plan_id: 1, // Jugador Básico
      status: 'active',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
      is_auto_renew: true,
      stripe_subscription_id: 'sub_basic_001',
      renewal_reminder_sent: false,
      expiration_reminder_sent: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 6, // player002
      membership_plan_id: 2, // Jugador Premium
      status: 'active',
      start_date: new Date('2024-01-15'),
      end_date: new Date('2025-01-15'),
      is_auto_renew: true,
      stripe_subscription_id: 'sub_premium_001',
      renewal_reminder_sent: false,
      expiration_reminder_sent: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('memberships', {}, {});
}