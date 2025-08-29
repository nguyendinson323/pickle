import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('microsite_themes', [
    {
      name: 'Tema Deportivo Clásico',
      slug: 'deportivo-clasico',
      description: 'Tema básico para sitios deportivos',
      version: '1.0',
      category: 'sport',
      type: 'free',
      price: 0.00,
      currency: 'MXN',
      primary_color: '#007bff',
      secondary_color: '#6c757d', 
      accent_color: '#17a2b8',
      background_color: '#ffffff',
      text_color: '#212529',
      font_family: 'Arial, sans-serif',
      mobile_optimized: true,
      tablet_optimized: true,
      desktop_optimized: true,
      rtl_support: false,
      seo_optimized: true,
      license: 'MIT',
      average_rating: 0.00,
      total_ratings: 0,
      downloads: 0,
      active_installations: 0,
      is_active: true,
      is_featured: false,
      is_default: true,
      requires_approval: false,
      approved: true,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('microsite_themes', {}, {});
}