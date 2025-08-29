import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('microsites', [
    {
      user_id: 1,
      name: 'Federación Nacional',
      subdomain: 'nacional',
      title: 'Federación Nacional de Pickleball',
      description: 'Sitio oficial de la Federación Mexicana de Pickleball',
      owner_type: 'partner',
      owner_id: 1,
      status: 'published',
      theme_id: 1,
      contact_email: 'contacto@federacionpickleball.mx',
      contact_phone: '+52 55 5555 0000',
      seo_title: 'Federación Mexicana de Pickleball - Oficial',
      seo_description: 'Sitio oficial de la Federación Mexicana de Pickleball',
      seo_keywords: 'pickleball, mexico, federacion, torneos',
      social_media: JSON.stringify({
        facebook: 'https://facebook.com/federacionpickleball',
        instagram: 'https://instagram.com/federacionpickleball'
      }),
      analytics: JSON.stringify({}),
      settings: JSON.stringify({}),
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 9,
      name: 'Club Deportivo Pickleball',
      subdomain: 'club-deportivo',
      title: 'Club Deportivo de Pickleball México',
      description: 'Club de pickleball para jugadores de todos los niveles',
      owner_type: 'club',
      owner_id: 1,
      status: 'published',
      theme_id: 1,
      contact_email: 'info@clubpickleball.mx',
      contact_phone: '+52 55 1234 5678',
      seo_title: 'Club Deportivo Pickleball - México',
      seo_description: 'Club de pickleball para jugadores de todos los niveles',
      seo_keywords: 'club, pickleball, deporte, mexico',
      social_media: JSON.stringify({
        facebook: 'https://facebook.com/clubpickleball'
      }),
      analytics: JSON.stringify({}),
      settings: JSON.stringify({}),
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('microsites', {}, {});
}