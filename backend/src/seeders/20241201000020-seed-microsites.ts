module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const microsites = [
      // Club microsites
      {
        owner_id: 9, // club001
        owner_type: 'club',
        subdomain: 'roma-norte',
        custom_domain: 'clubromanorte.mx',
        title: 'Club Pickleball Roma Norte',
        description: 'El club de pickleball más moderno de Ciudad de México. Instalaciones de primer nivel en el corazón de Roma Norte.',
        theme_id: 1, // Modern theme
        logo_url: '/uploads/microsites/roma-norte/logo.png',
        favicon_url: '/uploads/microsites/roma-norte/favicon.ico',
        hero_image_url: '/uploads/microsites/roma-norte/hero.jpg',
        colors: JSON.stringify({
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#1f2937'
        }),
        fonts: JSON.stringify({
          heading: 'Inter',
          body: 'Inter',
          accent: 'Poppins'
        }),
        layout_settings: JSON.stringify({
          header_style: 'modern',
          footer_style: 'minimal',
          sidebar_enabled: false,
          animations_enabled: true
        }),
        contact_info: JSON.stringify({
          phone: '+52 55 1234 5678',
          email: 'info@clubromanorte.mx',
          address: 'Av. Álvaro Obregón 123, Roma Norte, CDMX',
          hours: 'Lun-Dom 6:00-22:00',
          social: {
            facebook: 'https://facebook.com/clubromanorte',
            instagram: 'https://instagram.com/clubromanorte',
            twitter: 'https://twitter.com/clubromanorte'
          }
        }),
        features_enabled: JSON.stringify([
          'court_booking',
          'class_registration',
          'event_calendar',
          'membership_signup',
          'photo_gallery',
          'testimonials',
          'contact_form',
          'blog'
        ]),
        seo_settings: JSON.stringify({
          meta_title: 'Club Pickleball Roma Norte - Instalaciones Premium CDMX',
          meta_description: 'Club de pickleball con instalaciones de lujo en Roma Norte. Clases, torneos, alquiler de canchas y membresías disponibles.',
          keywords: ['pickleball', 'roma norte', 'club deportivo', 'cdmx', 'clases', 'torneos'],
          og_image: '/uploads/microsites/roma-norte/og-image.jpg'
        }),
        analytics_settings: JSON.stringify({
          google_analytics: 'G-XXXXXXXXXX',
          facebook_pixel: '123456789012345',
          tracking_enabled: true
        }),
        custom_css: `.hero-section { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); }
                     .cta-button { box-shadow: 0 4px 14px 0 rgba(37,99,235,0.39); }`,
        custom_js: `// Custom analytics tracking
                   gtag('config', 'G-XXXXXXXXXX', {
                     custom_map: {'custom_parameter': 'court_booking'}
                   });`,
        is_published: true,
        is_active: true,
        last_published_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        ssl_enabled: true,
        maintenance_mode: false,
        created_at: now,
        updated_at: now
      },
      {
        owner_id: 10, // club002
        owner_type: 'club',
        subdomain: 'polanco-elite',
        custom_domain: 'polancoelite.mx',
        title: 'Centro Deportivo Polanco Elite',
        description: 'Experiencia premium de pickleball en Polanco. Instalaciones de lujo, servicios exclusivos y ambiente sophisticated.',
        theme_id: 2, // Elegant theme
        logo_url: '/uploads/microsites/polanco-elite/logo.png',
        favicon_url: '/uploads/microsites/polanco-elite/favicon.ico',
        hero_image_url: '/uploads/microsites/polanco-elite/hero.jpg',
        colors: JSON.stringify({
          primary: '#1f2937',
          secondary: '#374151',
          accent: '#d97706',
          background: '#f9fafb',
          text: '#111827'
        }),
        fonts: JSON.stringify({
          heading: 'Playfair Display',
          body: 'Source Sans Pro',
          accent: 'Montserrat'
        }),
        layout_settings: JSON.stringify({
          header_style: 'elegant',
          footer_style: 'extended',
          sidebar_enabled: true,
          animations_enabled: true
        }),
        contact_info: JSON.stringify({
          phone: '+52 55 9876 5432',
          email: 'concierge@polancoelite.mx',
          address: 'Av. Presidente Masaryk 456, Polanco, CDMX',
          hours: 'Lun-Vie 5:30-23:30, Sab-Dom 6:00-22:00',
          social: {
            facebook: 'https://facebook.com/polancoelite',
            instagram: 'https://instagram.com/polancoelite',
            linkedin: 'https://linkedin.com/company/polancoelite'
          }
        }),
        features_enabled: JSON.stringify([
          'court_booking',
          'private_lessons',
          'vip_services',
          'event_calendar',
          'exclusive_membership',
          'concierge_services',
          'photo_gallery',
          'member_portal'
        ]),
        seo_settings: JSON.stringify({
          meta_title: 'Polanco Elite - Club Premium de Pickleball',
          meta_description: 'Club exclusivo de pickleball en Polanco con instalaciones de lujo, servicios VIP y experiencia premium.',
          keywords: ['pickleball premium', 'polanco', 'club exclusivo', 'lujo', 'vip'],
          og_image: '/uploads/microsites/polanco-elite/og-image.jpg'
        }),
        analytics_settings: JSON.stringify({
          google_analytics: 'G-YYYYYYYYYY',
          linkedin_insights: 'partner-id-12345',
          tracking_enabled: true
        }),
        custom_css: `.premium-section { background: linear-gradient(to right, #1f2937, #374151); }
                     .vip-badge { background: linear-gradient(45deg, #d97706, #f59e0b); }`,
        custom_js: `// Premium member tracking
                   function trackPremiumInteraction(action) {
                     gtag('event', action, { event_category: 'premium_member' });
                   }`,
        is_published: true,
        is_active: true,
        last_published_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        ssl_enabled: true,
        maintenance_mode: false,
        created_at: now,
        updated_at: now
      },
      // Partner microsite
      {
        owner_id: 7, // partner001
        owner_type: 'partner',
        subdomain: 'academia-condesa',
        custom_domain: 'pickleballcondesa.mx',
        title: 'Academia de Pickleball Condesa',
        description: 'Academia especializada en formación técnica de pickleball. Programas para todos los niveles con metodología profesional.',
        theme_id: 3, // Sport theme
        logo_url: '/uploads/microsites/academia-condesa/logo.png',
        favicon_url: '/uploads/microsites/academia-condesa/favicon.ico',
        hero_image_url: '/uploads/microsites/academia-condesa/hero.jpg',
        colors: JSON.stringify({
          primary: '#059669',
          secondary: '#047857',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#064e3b'
        }),
        fonts: JSON.stringify({
          heading: 'Roboto Slab',
          body: 'Open Sans',
          accent: 'Oswald'
        }),
        layout_settings: JSON.stringify({
          header_style: 'sport',
          footer_style: 'standard',
          sidebar_enabled: false,
          animations_enabled: false
        }),
        contact_info: JSON.stringify({
          phone: '+52 55 5555 1234',
          email: 'info@pickleballcondesa.mx',
          address: 'Calle Amsterdam 789, Condesa, CDMX',
          hours: 'Lun-Vie 7:00-21:00, Sab-Dom 8:00-18:00',
          social: {
            instagram: 'https://instagram.com/academiacondesa',
            youtube: 'https://youtube.com/academiacondesa',
            whatsapp: 'https://wa.me/525555551234'
          }
        }),
        features_enabled: JSON.stringify([
          'class_schedule',
          'coach_profiles',
          'training_programs',
          'progress_tracking',
          'video_library',
          'testimonials',
          'contact_form',
          'enrollment'
        ]),
        seo_settings: JSON.stringify({
          meta_title: 'Academia Pickleball Condesa - Clases y Entrenamiento',
          meta_description: 'Academia profesional de pickleball en Condesa. Clases grupales e individuales, programas técnicos para todos los niveles.',
          keywords: ['academia pickleball', 'clases', 'condesa', 'entrenamiento', 'coaching'],
          og_image: '/uploads/microsites/academia-condesa/og-image.jpg'
        }),
        analytics_settings: JSON.stringify({
          google_analytics: 'G-ZZZZZZZZZ',
          tracking_enabled: true
        }),
        custom_css: `.training-section { border-left: 4px solid #059669; }
                     .coach-card { box-shadow: 0 2px 8px rgba(5,150,105,0.1); }`,
        custom_js: `// Training program tracking
                   function trackProgramEnrollment(program) {
                     gtag('event', 'program_enrollment', { program_name: program });
                   }`,
        is_published: true,
        is_active: true,
        last_published_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        ssl_enabled: true,
        maintenance_mode: false,
        created_at: now,
        updated_at: now
      },
      // Coach microsite
      {
        owner_id: 5, // coach001
        owner_type: 'coach',
        subdomain: 'coach-carlos',
        custom_domain: null,
        title: 'Carlos Méndez - Entrenador Certificado',
        description: 'Entrenador profesional de pickleball con más de 8 años de experiencia. Especialista en desarrollo técnico y preparación competitiva.',
        theme_id: 4, // Professional theme
        logo_url: '/uploads/microsites/coach-carlos/logo.png',
        favicon_url: '/uploads/microsites/coach-carlos/favicon.ico',
        hero_image_url: '/uploads/microsites/coach-carlos/hero.jpg',
        colors: JSON.stringify({
          primary: '#7c3aed',
          secondary: '#6d28d9',
          accent: '#fbbf24',
          background: '#ffffff',
          text: '#1f2937'
        }),
        fonts: JSON.stringify({
          heading: 'Merriweather',
          body: 'Lato',
          accent: 'Roboto'
        }),
        layout_settings: JSON.stringify({
          header_style: 'professional',
          footer_style: 'minimal',
          sidebar_enabled: false,
          animations_enabled: true
        }),
        contact_info: JSON.stringify({
          phone: '+52 55 1111 2222',
          email: 'carlos@entrenamientopickleball.mx',
          location: 'Ciudad de México',
          availability: 'Lun-Vie 8:00-20:00, Sab 9:00-15:00',
          social: {
            instagram: 'https://instagram.com/coach_carlos_pb',
            linkedin: 'https://linkedin.com/in/carlos-mendez-coach'
          }
        }),
        features_enabled: JSON.stringify([
          'coach_bio',
          'services_offered',
          'testimonials',
          'schedule_booking',
          'certification_display',
          'training_philosophy',
          'contact_form'
        ]),
        seo_settings: JSON.stringify({
          meta_title: 'Carlos Méndez - Entrenador Profesional de Pickleball',
          meta_description: 'Entrenador certificado de pickleball en CDMX. Clases personalizadas, preparación competitiva y desarrollo técnico.',
          keywords: ['entrenador pickleball', 'coach profesional', 'cdmx', 'clases privadas'],
          og_image: '/uploads/microsites/coach-carlos/og-image.jpg'
        }),
        analytics_settings: JSON.stringify({
          google_analytics: 'G-AAAAAAAA',
          tracking_enabled: true
        }),
        custom_css: `.certification-badge { background: linear-gradient(135deg, #7c3aed, #6d28d9); }
                     .testimonial-card { border-top: 3px solid #fbbf24; }`,
        custom_js: `// Booking interaction tracking
                   document.querySelectorAll('.booking-btn').forEach(btn => {
                     btn.addEventListener('click', () => {
                       gtag('event', 'booking_initiated', { coach: 'carlos_mendez' });
                     });
                   });`,
        is_published: true,
        is_active: true,
        last_published_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        ssl_enabled: true,
        maintenance_mode: false,
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