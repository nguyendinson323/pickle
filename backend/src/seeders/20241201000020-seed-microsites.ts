module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const microsites = [
      // Club microsites
      {
        user_id: 7, // club001
        name: 'Club Pickleball Roma Norte',
        subdomain: 'roma-norte',
        title: 'Club Pickleball Roma Norte',
        description: 'El club de pickleball más moderno de Ciudad de México. Instalaciones de primer nivel en el corazón de Roma Norte.',
        owner_type: 'club',
        owner_id: 7, // club001
        status: 'published',
        theme_id: 1,
        custom_css: `.hero-section { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); }`,
        seo_title: 'Club Pickleball Roma Norte - Instalaciones Premium CDMX',
        seo_description: 'Club de pickleball con instalaciones de lujo en Roma Norte. Clases, torneos, alquiler de canchas y membresías disponibles.',
        seo_keywords: 'pickleball, roma norte, club deportivo, cdmx, clases, torneos',
        og_image: '/uploads/microsites/roma-norte/og-image.jpg',
        favicon_url: '/uploads/microsites/roma-norte/favicon.ico',
        logo_url: '/uploads/microsites/roma-norte/logo.png',
        header_image_url: '/uploads/microsites/roma-norte/hero.jpg',
        contact_email: 'info@clubromanorte.mx',
        contact_phone: '+52 55 1234 5678',
        address: 'Av. Álvaro Obregón 123, Roma Norte, CDMX',
        social_media: JSON.stringify({
          facebook: 'https://facebook.com/clubromanorte',
          instagram: 'https://instagram.com/clubromanorte',
          twitter: 'https://twitter.com/clubromanorte'
        }),
        analytics: JSON.stringify({
          google_analytics: 'G-XXXXXXXXXX',
          facebook_pixel: '123456789012345',
          tracking_enabled: true
        }),
        settings: JSON.stringify({
          colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
          },
          layout: {
            header_style: 'modern',
            footer_style: 'minimal'
          },
          features_enabled: [
            'court_booking',
            'class_registration',
            'event_calendar',
            'membership_signup',
            'photo_gallery',
            'contact_form'
          ]
        }),
        published_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 8, // club002
        name: 'Centro Deportivo Polanco Elite',
        subdomain: 'polanco-elite',
        title: 'Centro Deportivo Polanco Elite',
        description: 'Experiencia premium de pickleball en Polanco. Instalaciones de lujo, servicios exclusivos y ambiente sophisticated.',
        owner_type: 'club',
        owner_id: 8, // club002
        status: 'published',
        theme_id: 2,
        custom_css: `.elite-section { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); }`,
        seo_title: 'Centro Deportivo Polanco Elite - Pickleball Premium',
        seo_description: 'Instalaciones premium de pickleball en Polanco. Experiencia de lujo con servicios exclusivos.',
        seo_keywords: 'pickleball, polanco, elite, premium, cdmx, lujo',
        og_image: '/uploads/microsites/polanco-elite/og-image.jpg',
        favicon_url: '/uploads/microsites/polanco-elite/favicon.ico',
        logo_url: '/uploads/microsites/polanco-elite/logo.png',
        header_image_url: '/uploads/microsites/polanco-elite/hero.jpg',
        contact_email: 'info@polancoelite.mx',
        contact_phone: '+52 55 9876 5432',
        address: 'Av. Presidente Masaryk 456, Polanco, CDMX',
        social_media: JSON.stringify({
          facebook: 'https://facebook.com/polancoelite',
          instagram: 'https://instagram.com/polancoelite'
        }),
        analytics: JSON.stringify({
          google_analytics: 'G-YYYYYYYYYY',
          tracking_enabled: true
        }),
        settings: JSON.stringify({
          colors: {
            primary: '#1f2937',
            secondary: '#374151',
            accent: '#d97706',
            background: '#f9fafb',
            text: '#111827'
          },
          layout: {
            header_style: 'elegant',
            footer_style: 'corporate'
          },
          features_enabled: [
            'court_booking',
            'membership_signup',
            'event_calendar',
            'photo_gallery'
          ]
        }),
        published_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 6, // partner001
        name: 'Academia de Pickleball Condesa',
        subdomain: 'academia-condesa',
        title: 'Academia de Pickleball Condesa',
        description: 'Academia especializada en formación técnica de pickleball. Programas para todos los niveles con metodología profesional.',
        owner_type: 'partner',
        owner_id: 6, // partner001
        status: 'published',
        theme_id: 1,
        seo_title: 'Academia de Pickleball Condesa - Entrenamiento Profesional',
        seo_description: 'Academia de pickleball con programas especializados. Entrenamiento profesional para todos los niveles.',
        seo_keywords: 'academia pickleball, condesa, entrenamiento, clases, cdmx',
        contact_email: 'info@pickleballcondesa.mx',
        contact_phone: '+52 55 5555 1234',
        address: 'Calle Amsterdam 789, Condesa, CDMX',
        social_media: JSON.stringify({
          facebook: 'https://facebook.com/pickleballcondesa',
          instagram: 'https://instagram.com/pickleballcondesa'
        }),
        settings: JSON.stringify({
          colors: {
            primary: '#059669',
            secondary: '#047857',
            accent: '#f59e0b'
          },
          features_enabled: [
            'class_registration',
            'contact_form',
            'testimonials'
          ]
        }),
        published_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('microsites', microsites);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('microsites', {});
  }
};