module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('media_library', [
    {
      microsite_id: 1, // Club Pickleball CDMX microsite
      user_id: 9, // club001 - Club Pickleball CDMX
      filename: 'club-hero-background.jpg',
      original_name: 'Complejo_Deportivo_Roma_Norte_Aerial.jpg',
      mime_type: 'image/jpeg',
      size: 2845612, // ~2.8MB
      dimensions: {
        width: 1920,
        height: 1080
      },
      storage_provider: 'local',
      storage_key: 'clubs/club001/images/club-hero-background.jpg',
      url: '/media/clubs/club001/images/club-hero-background.jpg',
      thumbnail_url: '/media/clubs/club001/images/thumbs/club-hero-background-thumb.jpg',
      alt: 'Vista aérea del Complejo Deportivo Roma Norte con 4 canchas de pickleball profesionales',
      caption: 'Imagen principal del hero section mostrando las instalaciones completas del club',
      tags: ['club', 'instalaciones', 'canchas', 'aerial', 'hero'],
      folder: 'hero-images',
      category: 'image',
      usage_count: 45,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX microsite
      user_id: 9, // club001
      filename: 'courts-detail-shot.jpg',
      original_name: 'Canchas_Profesionales_Detalle.jpg',
      mime_type: 'image/jpeg',
      size: 1956734,
      dimensions: {
        width: 1024,
        height: 768
      },
      storage_provider: 'local',
      storage_key: 'clubs/club001/images/courts-detail-shot.jpg',
      url: '/media/clubs/club001/images/courts-detail-shot.jpg',
      thumbnail_url: '/media/clubs/club001/images/thumbs/courts-detail-shot-thumb.jpg',
      alt: 'Detalle de cancha profesional con superficie certificada y líneas perfectas',
      caption: 'Imagen de alta calidad mostrando el detalle de las canchas profesionales del club',
      tags: ['cancha', 'superficie', 'profesional', 'detalle', 'calidad'],
      folder: 'facilities',
      category: 'image',
      usage_count: 28,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia microsite
      user_id: 6, // coach002 - Ana Patricia Ruiz Vega
      filename: 'ana-patricia-profile-professional.jpg',
      original_name: 'Ana_Patricia_Professional_Headshot.jpg',
      mime_type: 'image/jpeg',
      size: 1234567,
      dimensions: {
        width: 800,
        height: 800
      },
      storage_provider: 'local',
      storage_key: 'coaches/coach002/images/ana-patricia-profile-professional.jpg',
      url: '/media/coaches/coach002/images/ana-patricia-profile-professional.jpg',
      thumbnail_url: '/media/coaches/coach002/images/thumbs/ana-patricia-profile-thumb.jpg',
      alt: 'Ana Patricia Ruiz Vega - Entrenadora Master de Pickleball, Campeona Nacional',
      caption: 'Foto profesional de Ana Patricia para su perfil de entrenadora master',
      tags: ['coach', 'profile', 'professional', 'champion', 'master'],
      folder: 'profile-photos',
      category: 'image',
      usage_count: 67,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia microsite
      user_id: 6, // coach002
      filename: 'training-session-action.mp4',
      original_name: 'Entrenamiento_Tecnico_Avanzado.mp4',
      mime_type: 'video/mp4',
      size: 89765432, // ~89MB
      dimensions: {
        width: 1920,
        height: 1080,
        duration: 90
      },
      storage_provider: 'local',
      storage_key: 'coaches/coach002/videos/training-session-action.mp4',
      url: '/media/coaches/coach002/videos/training-session-action.mp4',
      thumbnail_url: '/media/coaches/coach002/videos/thumbs/training-session-thumb.jpg',
      alt: 'Video de sesión de entrenamiento técnico avanzado con Ana Patricia',
      caption: 'Video promocional mostrando técnicas avanzadas de entrenamiento del Método ANA',
      tags: ['training', 'technique', 'advanced', 'coaching', 'method'],
      folder: 'training-videos',
      category: 'video',
      usage_count: 23,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 3, // Wilson México partner microsite
      user_id: 7, // partner001 - Wilson Sports México
      filename: 'wilson-pro-staff-collection.jpg',
      original_name: 'Wilson_Pro_Staff_Paddles_Collection_2024.jpg',
      mime_type: 'image/jpeg',
      size: 3456789,
      dimensions: {
        width: 1600,
        height: 900
      },
      storage_provider: 'local',
      storage_key: 'partners/partner001/products/wilson-pro-staff-collection.jpg',
      url: '/media/partners/partner001/products/wilson-pro-staff-collection.jpg',
      thumbnail_url: '/media/partners/partner001/products/thumbs/wilson-pro-staff-collection-thumb.jpg',
      alt: 'Colección Wilson Pro Staff 2024 - Paletas profesionales de pickleball',
      caption: 'Imagen de catálogo mostrando la colección completa Wilson Pro Staff para pickleball',
      tags: ['wilson', 'pro-staff', 'paddles', 'collection', 'professional'],
      folder: 'product-catalog',
      category: 'image',
      usage_count: 156,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX microsite (system asset)
      user_id: 1, // admin001 - System assets
      filename: 'federation-logo-official.svg',
      original_name: 'Logo_Federacion_Mexicana_Pickleball_Oficial.svg',
      mime_type: 'image/svg+xml',
      size: 45678,
      dimensions: {
        width: 512,
        height: 512
      },
      storage_provider: 'local',
      storage_key: 'system/branding/federation-logo-official.svg',
      url: '/media/system/branding/federation-logo-official.svg',
      thumbnail_url: null, // SVG files don't need thumbnails
      alt: 'Logo oficial de la Federación Mexicana de Pickleball',
      caption: 'Logo vectorial oficial de la federación para uso en documentos y sitios web',
      tags: ['logo', 'official', 'federation', 'branding', 'vector'],
      folder: 'branding',
      category: 'image',
      usage_count: 234,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX microsite
      user_id: 2, // player001 - Carlos Méndez Rivera
      filename: 'tournament-victory-celebration.jpg',
      original_name: 'Carlos_Celebracion_Victoria_Torneo.jpg',
      mime_type: 'image/jpeg',
      size: 1876543,
      dimensions: {
        width: 1200,
        height: 800
      },
      storage_provider: 'local',
      storage_key: 'players/player001/gallery/tournament-victory-celebration.jpg',
      url: '/media/players/player001/gallery/tournament-victory-celebration.jpg',
      thumbnail_url: '/media/players/player001/gallery/thumbs/tournament-victory-celebration-thumb.jpg',
      alt: 'Carlos Méndez celebrando victoria en Torneo Nacional de Primavera CDMX 2024',
      caption: 'Momento de celebración después de ganar partido importante en torneo nacional',
      tags: ['tournament', 'victory', 'celebration', 'player', 'personal'],
      folder: 'personal-gallery',
      category: 'image',
      usage_count: 8,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX microsite
      user_id: 9, // club001
      filename: 'club-membership-brochure.pdf',
      original_name: 'Brochure_Membresias_Club_Pickleball_CDMX.pdf',
      mime_type: 'application/pdf',
      size: 5678901,
      dimensions: {
        pages: 12,
        width: 8.5,
        height: 11
      },
      storage_provider: 'local',
      storage_key: 'clubs/club001/documents/club-membership-brochure.pdf',
      url: '/media/clubs/club001/documents/club-membership-brochure.pdf',
      thumbnail_url: '/media/clubs/club001/documents/thumbs/club-membership-brochure-thumb.jpg',
      alt: 'Brochure informativo de membresías del Club Pickleball CDMX',
      caption: 'Documento PDF con información detallada de planes de membresía y beneficios',
      tags: ['brochure', 'membership', 'marketing', 'information', 'pdf'],
      folder: 'marketing-materials',
      category: 'document',
      usage_count: 89,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 2, // Coach Ana Patricia microsite
      user_id: 5, // coach001 - Luis Hernández Morales
      filename: 'coaching-certification-master.pdf',
      original_name: 'Certificacion_Master_Luis_Hernandez_2024.pdf',
      mime_type: 'application/pdf',
      size: 2345678,
      dimensions: {
        pages: 2,
        width: 8.5,
        height: 11
      },
      storage_provider: 'local',
      storage_key: 'coaches/coach001/credentials/coaching-certification-master.pdf',
      url: '/media/coaches/coach001/credentials/coaching-certification-master.pdf',
      thumbnail_url: '/media/coaches/coach001/credentials/thumbs/coaching-certification-thumb.jpg',
      alt: 'Certificación Master de Entrenamiento - Luis Hernández Morales',
      caption: 'Documento oficial de certificación master en entrenamiento de pickleball',
      tags: ['certification', 'master', 'coaching', 'credentials', 'official'],
      folder: 'credentials',
      category: 'document',
      usage_count: 3,
      last_used_at: now,
      created_at: now,
      updated_at: now
    },
    {
      microsite_id: 1, // Club Pickleball CDMX microsite (system data)
      user_id: 1, // admin001 - System backup
      filename: 'tournament-results-database-export.xlsx',
      original_name: 'Resultados_Torneos_2024_Completo.xlsx',
      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 12345678,
      dimensions: {
        rows: 5000,
        columns: 25,
        sheets: 12
      },
      storage_provider: 'local',
      storage_key: 'system/exports/tournament-results-database-export.xlsx',
      url: '/media/system/exports/tournament-results-database-export.xlsx',
      thumbnail_url: null, // Spreadsheets don't need thumbnails
      alt: 'Exportación completa de resultados de torneos 2024',
      caption: 'Base de datos completa con todos los resultados de torneos del año 2024',
      tags: ['database', 'export', 'tournament', 'results', '2024'],
      folder: 'data-exports',
      category: 'document',
      usage_count: 1,
      last_used_at: now,
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('media_library', {}, {});
  }
};