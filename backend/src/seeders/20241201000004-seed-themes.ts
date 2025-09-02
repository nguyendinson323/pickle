module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('microsite_themes', [
      {
        name: 'Tema Deportivo Clásico',
        slug: 'deportivo-clasico',
        description: 'Tema básico para sitios deportivos con colores modernos y diseño limpio',
        version: '1.0',
        category: 'sport',
        type: 'free',
        price: 0.00,
        currency: 'MXN',
        preview_image: '/themes/deportivo-clasico/preview.jpg',
        screenshots: JSON.stringify([
          '/themes/deportivo-clasico/screenshot1.jpg',
          '/themes/deportivo-clasico/screenshot2.jpg'
        ]),
        demo_url: 'https://demo.pickleball.mx/deportivo-clasico',
        color_scheme: JSON.stringify({
          primary: '#007bff',
          secondary: '#6c757d',
          accent: '#17a2b8',
          background: '#ffffff',
          text: '#212529'
        }),
        primary_color: '#007bff',
        secondary_color: '#6c757d',
        accent_color: '#17a2b8',
        background_color: '#ffffff',
        text_color: '#212529',
        font_family: 'Arial, sans-serif',
        font_sizes: JSON.stringify({
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem'
        }),
        layout_settings: JSON.stringify({
          containerWidth: '1200px',
          sidebarPosition: 'right',
          headerHeight: '80px'
        }),
        header_settings: JSON.stringify({
          sticky: true,
          transparent: false,
          height: '80px'
        }),
        footer_settings: JSON.stringify({
          columns: 4,
          showSocial: true,
          showNewsletter: true
        }),
        mobile_optimized: true,
        tablet_optimized: true,
        desktop_optimized: true,
        rtl_support: false,
        seo_optimized: true,
        performance_score: 95,
        author: 'Federación Mexicana de Pickleball',
        license: 'MIT',
        average_rating: 4.5,
        total_ratings: 150,
        downloads: 1250,
        active_installations: 350,
        is_active: true,
        is_featured: false,
        is_default: true,
        requires_approval: false,
        approved: true,
        approved_at: now,
        status: 'active',
        published_at: now,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Tema Profesional Premium',
        slug: 'profesional-premium',
        description: 'Tema profesional con características avanzadas para clubs y academias',
        version: '2.0',
        category: 'professional',
        type: 'premium',
        price: 999.00,
        currency: 'MXN',
        preview_image: '/themes/profesional-premium/preview.jpg',
        screenshots: JSON.stringify([
          '/themes/profesional-premium/screenshot1.jpg',
          '/themes/profesional-premium/screenshot2.jpg',
          '/themes/profesional-premium/screenshot3.jpg'
        ]),
        demo_url: 'https://demo.pickleball.mx/profesional-premium',
        color_scheme: JSON.stringify({
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#e74c3c',
          background: '#ecf0f1',
          text: '#2c3e50'
        }),
        primary_color: '#2c3e50',
        secondary_color: '#34495e',
        accent_color: '#e74c3c',
        background_color: '#ecf0f1',
        text_color: '#2c3e50',
        font_family: 'Roboto, sans-serif',
        font_sizes: JSON.stringify({
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem'
        }),
        layout_settings: JSON.stringify({
          containerWidth: '1400px',
          sidebarPosition: 'left',
          headerHeight: '100px',
          hasHero: true
        }),
        header_settings: JSON.stringify({
          sticky: true,
          transparent: true,
          height: '100px',
          megaMenu: true
        }),
        footer_settings: JSON.stringify({
          columns: 5,
          showSocial: true,
          showNewsletter: true,
          showMap: true
        }),
        supported_features: JSON.stringify([
          'events_calendar',
          'booking_system',
          'member_portal',
          'payment_gateway',
          'analytics_dashboard'
        ]),
        mobile_optimized: true,
        tablet_optimized: true,
        desktop_optimized: true,
        rtl_support: true,
        seo_optimized: true,
        performance_score: 98,
        author: 'Federación Mexicana de Pickleball',
        license: 'Commercial',
        average_rating: 4.8,
        total_ratings: 89,
        downloads: 456,
        active_installations: 234,
        is_active: true,
        is_featured: true,
        is_default: false,
        requires_approval: false,
        approved: true,
        approved_at: now,
        status: 'active',
        published_at: now,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('microsite_themes', null, {});
  }
};