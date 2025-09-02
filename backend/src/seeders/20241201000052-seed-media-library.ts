module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('media_library', [
    {
      user_id: 9, // club001 - Club Pickleball CDMX
      file_name: 'club-hero-background.jpg',
      original_name: 'Complejo_Deportivo_Roma_Norte_Aerial.jpg',
      file_path: '/media/clubs/club001/images/club-hero-background.jpg',
      file_size: 2845612, // ~2.8MB
      mime_type: 'image/jpeg',
      file_category: 'image',
      file_subcategory: 'hero_image',
      alt_text: 'Vista aérea del Complejo Deportivo Roma Norte con 4 canchas de pickleball profesionales',
      description: 'Imagen principal del hero section mostrando las instalaciones completas del club',
      tags: JSON.stringify(['club', 'instalaciones', 'canchas', 'aerial', 'hero']),
      is_public: true,
      is_optimized: true,
      optimization_data: JSON.stringify({
        original_size: 4567890,
        compressed_size: 2845612,
        compression_ratio: 37.7,
        formats_generated: ['webp', 'avif'],
        responsive_sizes: ['320w', '768w', '1024w', '1920w']
      }),
      usage_count: 45,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 9, // club001
      file_name: 'courts-detail-shot.jpg',
      original_name: 'Canchas_Profesionales_Detalle.jpg',
      file_path: '/media/clubs/club001/images/courts-detail-shot.jpg',
      file_size: 1956734,
      mime_type: 'image/jpeg',
      file_category: 'image',
      file_subcategory: 'facility_showcase',
      alt_text: 'Detalle de cancha profesional con superficie certificada y líneas perfectas',
      description: 'Imagen de alta calidad mostrando el detalle de las canchas profesionales del club',
      tags: JSON.stringify(['cancha', 'superficie', 'profesional', 'detalle', 'calidad']),
      is_public: true,
      is_optimized: true,
      optimization_data: JSON.stringify({
        original_size: 3245678,
        compressed_size: 1956734,
        compression_ratio: 39.7,
        formats_generated: ['webp', 'avif'],
        responsive_sizes: ['320w', '768w', '1024w']
      }),
      usage_count: 28,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 6, // coach002 - Ana Patricia Ruiz Vega
      file_name: 'ana-patricia-profile-professional.jpg',
      original_name: 'Ana_Patricia_Professional_Headshot.jpg',
      file_path: '/media/coaches/coach002/images/ana-patricia-profile-professional.jpg',
      file_size: 1234567,
      mime_type: 'image/jpeg',
      file_category: 'image',
      file_subcategory: 'profile_photo',
      alt_text: 'Ana Patricia Ruiz Vega - Entrenadora Master de Pickleball, Campeona Nacional',
      description: 'Foto profesional de Ana Patricia para su perfil de entrenadora master',
      tags: JSON.stringify(['coach', 'profile', 'professional', 'champion', 'master']),
      is_public: true,
      is_optimized: true,
      optimization_data: JSON.stringify({
        original_size: 2987654,
        compressed_size: 1234567,
        compression_ratio: 58.7,
        formats_generated: ['webp', 'avif'],
        responsive_sizes: ['150w', '300w', '600w']
      }),
      usage_count: 67,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 6, // coach002
      file_name: 'training-session-action.mp4',
      original_name: 'Entrenamiento_Tecnico_Avanzado.mp4',
      file_path: '/media/coaches/coach002/videos/training-session-action.mp4',
      file_size: 89765432, // ~89MB
      mime_type: 'video/mp4',
      file_category: 'video',
      file_subcategory: 'training_content',
      alt_text: 'Video de sesión de entrenamiento técnico avanzado con Ana Patricia',
      description: 'Video promocional mostrando técnicas avanzadas de entrenamiento del Método ANA',
      tags: JSON.stringify(['training', 'technique', 'advanced', 'coaching', 'method']),
      is_public: true,
      is_optimized: true,
      optimization_data: JSON.stringify({
        original_size: 156789012,
        compressed_size: 89765432,
        compression_ratio: 42.8,
        formats_generated: ['mp4', 'webm'],
        resolutions: ['720p', '1080p'],
        duration_seconds: 90
      }),
      usage_count: 23,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 7, // partner001 - Wilson Sports México
      file_name: 'wilson-pro-staff-collection.jpg',
      original_name: 'Wilson_Pro_Staff_Paddles_Collection_2024.jpg',
      file_path: '/media/partners/partner001/products/wilson-pro-staff-collection.jpg',
      file_size: 3456789,
      mime_type: 'image/jpeg',
      file_category: 'image',
      file_subcategory: 'product_catalog',
      alt_text: 'Colección Wilson Pro Staff 2024 - Paletas profesionales de pickleball',
      description: 'Imagen de catálogo mostrando la colección completa Wilson Pro Staff para pickleball',
      tags: JSON.stringify(['wilson', 'pro-staff', 'paddles', 'collection', 'professional']),
      is_public: true,
      is_optimized: true,
      optimization_data: JSON.stringify({
        original_size: 6789012,
        compressed_size: 3456789,
        compression_ratio: 49.1,
        formats_generated: ['webp', 'avif'],
        responsive_sizes: ['320w', '768w', '1024w', '1920w']
      }),
      usage_count: 156,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 1, // admin001 - System assets
      file_name: 'federation-logo-official.svg',
      original_name: 'Logo_Federacion_Mexicana_Pickleball_Oficial.svg',
      file_path: '/media/system/branding/federation-logo-official.svg',
      file_size: 45678,
      mime_type: 'image/svg+xml',
      file_category: 'image',
      file_subcategory: 'branding',
      alt_text: 'Logo oficial de la Federación Mexicana de Pickleball',
      description: 'Logo vectorial oficial de la federación para uso en documentos y sitios web',
      tags: JSON.stringify(['logo', 'official', 'federation', 'branding', 'vector']),
      is_public: true,
      is_optimized: false, // SVG files don't need optimization
      optimization_data: null,
      usage_count: 234,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 2, // player001 - Carlos Méndez Rivera
      file_name: 'tournament-victory-celebration.jpg',
      original_name: 'Carlos_Celebracion_Victoria_Torneo.jpg',
      file_path: '/media/players/player001/gallery/tournament-victory-celebration.jpg',
      file_size: 1876543,
      mime_type: 'image/jpeg',
      file_category: 'image',
      file_subcategory: 'personal_gallery',
      alt_text: 'Carlos Méndez celebrando victoria en Torneo Nacional de Primavera CDMX 2024',
      description: 'Momento de celebración después de ganar partido importante en torneo nacional',
      tags: JSON.stringify(['tournament', 'victory', 'celebration', 'player', 'personal']),
      is_public: false, // Personal gallery - private
      is_optimized: true,
      optimization_data: JSON.stringify({
        original_size: 3456789,
        compressed_size: 1876543,
        compression_ratio: 45.7,
        formats_generated: ['webp'],
        responsive_sizes: ['320w', '768w']
      }),
      usage_count: 8,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 9, // club001
      file_name: 'club-membership-brochure.pdf',
      original_name: 'Brochure_Membresias_Club_Pickleball_CDMX.pdf',
      file_path: '/media/clubs/club001/documents/club-membership-brochure.pdf',
      file_size: 5678901,
      mime_type: 'application/pdf',
      file_category: 'document',
      file_subcategory: 'marketing_material',
      alt_text: 'Brochure informativo de membresías del Club Pickleball CDMX',
      description: 'Documento PDF con información detallada de planes de membresía y beneficios',
      tags: JSON.stringify(['brochure', 'membership', 'marketing', 'information', 'pdf']),
      is_public: true,
      is_optimized: true,
      optimization_data: JSON.stringify({
        original_size: 8901234,
        compressed_size: 5678901,
        compression_ratio: 36.2,
        pages: 12,
        file_version: '1.4'
      }),
      usage_count: 89,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 5, // coach001 - Luis Hernández Morales
      file_name: 'coaching-certification-master.pdf',
      original_name: 'Certificacion_Master_Luis_Hernandez_2024.pdf',
      file_path: '/media/coaches/coach001/credentials/coaching-certification-master.pdf',
      file_size: 2345678,
      mime_type: 'application/pdf',
      file_category: 'document',
      file_subcategory: 'credentials',
      alt_text: 'Certificación Master de Entrenamiento - Luis Hernández Morales',
      description: 'Documento oficial de certificación master en entrenamiento de pickleball',
      tags: JSON.stringify(['certification', 'master', 'coaching', 'credentials', 'official']),
      is_public: false, // Credentials are private
      is_optimized: false,
      optimization_data: null,
      usage_count: 3,
      last_used: now,
      created_at: now,
      updated_at: now
    },
    {
      user_id: 1, // admin001 - System backup
      file_name: 'tournament-results-database-export.xlsx',
      original_name: 'Resultados_Torneos_2024_Completo.xlsx',
      file_path: '/media/system/exports/tournament-results-database-export.xlsx',
      file_size: 12345678,
      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      file_category: 'document',
      file_subcategory: 'data_export',
      alt_text: 'Exportación completa de resultados de torneos 2024',
      description: 'Base de datos completa con todos los resultados de torneos del año 2024',
      tags: JSON.stringify(['database', 'export', 'tournament', 'results', '2024']),
      is_public: false, // System data - private
      is_optimized: false,
      optimization_data: null,
      usage_count: 1,
      last_used: now,
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('media_library', {}, {});
  }
};