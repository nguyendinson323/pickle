import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('court_schedules', [
    {
      court_id: 1, // Cancha Central
      date: new Date('2024-03-20'),
      start_time: '18:00:00',
      end_time: '19:30:00',
      is_blocked: false,
      notes: 'Horario disponible para reserva',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('court_schedules', {}, {});
}