import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('reservations', [
    {
      court_id: 1,
      user_id: 2,
      reservation_date: new Date('2024-03-20'),
      start_time: '18:00:00',
      end_time: '19:30:00',
      duration: 90,
      base_rate: 300.00,
      peak_rate_multiplier: 1.0,
      weekend_rate_multiplier: 1.0,
      subtotal: 450.00,
      tax_amount: 72.00,
      total_amount: 522.00,
      payment_id: null,
      status: 'confirmed',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      court_id: 1,
      user_id: 3,
      reservation_date: new Date('2024-03-21'),
      start_time: '16:00:00',
      end_time: '17:30:00',
      duration: 90,
      base_rate: 250.00,
      peak_rate_multiplier: 1.0,
      weekend_rate_multiplier: 1.2,
      subtotal: 375.00,
      tax_amount: 60.00,
      total_amount: 435.00,
      payment_id: null,
      status: 'confirmed',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('reservations', {}, {});
}