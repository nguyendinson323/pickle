import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('conversations', [
    {
      name: 'Práctica de dobles',
      type: 'private',
      participant_ids: JSON.stringify([2, 3]), // player001 and player002
      creator_id: 2, // player001
      is_archived: false,
      metadata: JSON.stringify({}),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('conversations', {}, {});
}