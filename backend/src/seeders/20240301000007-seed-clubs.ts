import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('clubs', [
    {
      user_id: 9, // club001
      name: 'Club Pickleball CDMX',
      manager_name: 'Roberto García Vega',
      manager_role: 'Director General',
      contact_email: 'info@pickleballcdmx.mx',
      phone: '+52 55 1234 5678',
      state_id: 7, // Ciudad de México
      club_type: 'Deportivo',
      website: 'https://www.pickleballcdmx.mx',
      has_courts: true,
      plan_type: 'premium',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 10, // club002
      name: 'Club Pickleball Jalisco',
      manager_name: 'Elena Morales Silva',
      manager_role: 'Directora Ejecutiva',
      contact_email: 'contacto@pickleballjalisco.mx',
      phone: '+52 33 9876 5432',
      state_id: 15, // Jalisco
      club_type: 'Deportivo',
      website: 'https://www.pickleballjalisco.mx',
      has_courts: true,
      plan_type: 'basic',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('clubs', {}, {});
}