import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('tournament_registrations', [
    {
      tournament_id: 1, // Campeonato Nacional 2024
      category_id: 1, // Singles Masculino Open
      player_id: 5, // player001 (user_id, but should be player_id according to migration)
      status: 'confirmed',
      registration_date: new Date('2024-04-15'),
      payment_id: 1,
      amount_paid: 750.00,
      emergency_contact: JSON.stringify({"name": "María Méndez", "phone": "+52 55 9876 5432"}),
      waiver_signed: true,
      waiver_signed_date: new Date('2024-04-15'),
      is_checked_in: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('tournament_registrations', {}, {});
}