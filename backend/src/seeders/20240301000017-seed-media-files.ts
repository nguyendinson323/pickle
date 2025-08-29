import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('media_files', [
    {
      user_id: 1, // admin
      original_name: 'logo-federacion.png',
      file_name: 'logo-federacion-001.png',
      file_path: '/uploads/images/logos/',
      file_url: 'https://cdn.federacionpickleball.mx/logos/logo-federacion-001.png',
      mime_type: 'image/png',
      file_size: 125680,
      alt: 'Logo oficial de la Federación',
      title: 'Logo FMP',
      description: 'Logotipo oficial',
      is_public: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('media_files', {}, {});
}