import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('partners', [
    {
      user_id: 7, // partner001
      business_name: 'Wilson Sports México',
      rfc: 'WSM950101ABC',
      contact_person_name: 'Carlos López García',
      contact_person_title: 'Director Regional',
      email: 'mexico@wilson.com',
      phone: '+52 55 1111 2222',
      partner_type: 'equipment',
      website: 'https://www.wilson.com.mx',
      plan_type: 'premium',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 8, // partner002
      business_name: 'Deportes Martí',
      rfc: 'DMA850215XYZ',
      contact_person_name: 'María Elena Ruiz',
      contact_person_title: 'Gerente Corporativo',
      email: 'corporativo@deportesmarti.com',
      phone: '+52 55 3333 4444',
      partner_type: 'retail',
      website: 'https://www.deportesmarti.com',
      plan_type: 'premium',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('partners', {}, {});
}