import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('messages', [
    {
      sender_id: 5, // player001
      receiver_id: 6, // player002
      subject: '¿Práctica de dobles mañana?',
      content: 'Hola! ¿Te interesa practicar dobles mañana en la tarde?',
      is_read: false,
      is_urgent: false,
      message_type: 'personal',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('messages', {}, {});
}