import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('notifications', [
    {
      user_id: 5, // player001
      title: 'Bienvenido a la Federación',
      message: 'Tu membresía ha sido activada exitosamente. ¡Bienvenido!',
      type: 'info',
      is_read: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('notifications', {}, {});
}