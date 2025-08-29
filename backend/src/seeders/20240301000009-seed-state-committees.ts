import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('state_committees', [
    {
      user_id: 2, // player001 (representing state committee)
      name: 'Comité CDMX de Pickleball',
      rfc: 'CCP240101ABC',
      president_name: 'Ana Patricia Ruiz',
      president_title: 'Presidenta',
      institutional_email: 'cdmx@federacionpickleball.mx',
      phone: '+52 55 3030 4040',
      state_id: 7, // Ciudad de México
      affiliate_type: 'Comité Estatal',
      website: 'https://cdmx.federacionpickleball.mx',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('state_committees', {}, {});
}