module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('microsite_templates', [
    {
      name: 'Club Deportivo Premium',
      category: 'club',
      description: 'Template premium para clubes deportivos con funcionalidades avanzadas de reservas y membresías',
      structure: JSON.stringify({
        layout: {
          header: {
            logo_position: 'left',
            navigation_style: 'horizontal',
            contact_info: true,
            social_links: true
          },
          hero: {
            type: 'full_width_image',
            overlay: 'dark_gradient',
            cta_buttons: 2,
            animation: 'fade_in'
          },
          sections: [
            'hero',
            'features_grid',
            'services',
            'testimonials',
            'contact'
          ],
          footer: {
            columns: 4,
            newsletter_signup: true,
            social_links: true,
            contact_info: true
          }
        },
        color_scheme: {
          primary: '#ff6b35',
          secondary: '#004e89',
          accent: '#1a659e',
          background: '#ffffff',
          text: '#333333'
        },
        typography: {
          heading_font: 'Montserrat',
          body_font: 'Open Sans',
          heading_sizes: {
            h1: '3rem',
            h2: '2.5rem',
            h3: '2rem'
          }
        },
        availableComponents: [
          'online_reservations',
          'membership_management',
          'tournament_calendar',
          'coach_profiles',
          'payment_integration',
          'mobile_responsive'
        ]
      }),
      thumbnail_url: '/templates/club-premium-thumb.jpg',
      preview_url: '/templates/club-premium-preview.jpg',
      features: JSON.stringify([
        'online_reservations',
        'membership_management',
        'tournament_calendar',
        'coach_profiles',
        'payment_integration',
        'mobile_responsive'
      ]),
      is_premium: true,
      required_plan: 'premium',
      is_active: true,
      version: '1.0.0',
      created_at: now,
      updated_at: now
    },
    {
      name: 'Entrenador Personal',
      category: 'general',
      description: 'Template especializado para entrenadores personales con portfolio y sistema de citas',
      structure: JSON.stringify({
        layout: {
          header: {
            logo_position: 'center',
            navigation_style: 'minimal',
            contact_info: false,
            social_links: true
          },
          hero: {
            type: 'split_content',
            image_position: 'right',
            overlay: 'none',
            cta_buttons: 1,
            animation: 'slide_in'
          },
          sections: [
            'hero',
            'about_coach',
            'credentials',
            'programs',
            'testimonials',
            'booking_form'
          ],
          footer: {
            columns: 2,
            newsletter_signup: false,
            social_links: true,
            contact_info: true
          }
        },
        color_scheme: {
          primary: '#2c5aa0',
          secondary: '#8bc34a',
          accent: '#ffc107',
          background: '#f8f9fa',
          text: '#212529'
        },
        typography: {
          heading_font: 'Poppins',
          body_font: 'Roboto',
          heading_sizes: {
            h1: '2.8rem',
            h2: '2.2rem',
            h3: '1.8rem'
          }
        },
        availableComponents: [
          'coach_profile',
          'program_showcase',
          'booking_calendar',
          'testimonials_carousel',
          'achievement_display',
          'contact_form'
        ]
      }),
      thumbnail_url: '/templates/coach-personal-thumb.jpg',
      preview_url: '/templates/coach-personal-preview.jpg',
      features: JSON.stringify([
        'coach_profile',
        'program_showcase',
        'booking_calendar',
        'testimonials_carousel',
        'achievement_display',
        'contact_form'
      ]),
      is_premium: true,
      required_plan: 'pro',
      is_active: true,
      version: '1.0.0',
      created_at: now,
      updated_at: now
    },
    {
      name: 'Tienda Deportiva',
      category: 'general',
      description: 'Template completo para tiendas deportivas con catálogo de productos y e-commerce',
      structure: JSON.stringify({
        layout: {
          header: {
            logo_position: 'left',
            navigation_style: 'mega_menu',
            contact_info: true,
            social_links: true,
            search_bar: true,
            shopping_cart: true
          },
          hero: {
            type: 'carousel',
            slides: 3,
            overlay: 'minimal',
            cta_buttons: 1,
            animation: 'auto_rotate'
          },
          sections: [
            'hero_carousel',
            'featured_products',
            'product_categories',
            'special_offers',
            'brand_showcase',
            'newsletter'
          ],
          footer: {
            columns: 4,
            newsletter_signup: true,
            social_links: true,
            contact_info: true,
            legal_links: true
          }
        },
        color_scheme: {
          primary: '#e74c3c',
          secondary: '#34495e',
          accent: '#f39c12',
          background: '#ffffff',
          text: '#2c3e50'
        },
        typography: {
          heading_font: 'Oswald',
          body_font: 'Lato',
          heading_sizes: {
            h1: '3.2rem',
            h2: '2.6rem',
            h3: '2.1rem'
          }
        },
        availableComponents: [
          'product_catalog',
          'shopping_cart',
          'payment_integration',
          'inventory_management',
          'customer_reviews',
          'wishlist',
          'search_filters',
          'multi_currency'
        ]
      }),
      thumbnail_url: '/templates/sports-store-thumb.jpg',
      preview_url: '/templates/sports-store-preview.jpg',
      features: JSON.stringify([
        'product_catalog',
        'shopping_cart',
        'payment_integration',
        'inventory_management',
        'customer_reviews',
        'wishlist',
        'search_filters',
        'multi_currency'
      ]),
      is_premium: true,
      required_plan: 'enterprise',
      is_active: true,
      version: '1.0.0',
      created_at: now,
      updated_at: now
    },
    {
      name: 'Básico Club',
      category: 'club',
      description: 'Template básico y económico para clubes deportivos pequeños',
      structure: JSON.stringify({
        layout: {
          header: {
            logo_position: 'left',
            navigation_style: 'simple',
            contact_info: true,
            social_links: false
          },
          hero: {
            type: 'image_text',
            overlay: 'light',
            cta_buttons: 1,
            animation: 'none'
          },
          sections: [
            'hero',
            'about',
            'services',
            'contact'
          ],
          footer: {
            columns: 2,
            newsletter_signup: false,
            social_links: false,
            contact_info: true
          }
        },
        color_scheme: {
          primary: '#007bff',
          secondary: '#6c757d',
          accent: '#28a745',
          background: '#ffffff',
          text: '#495057'
        },
        typography: {
          heading_font: 'Arial',
          body_font: 'Arial',
          heading_sizes: {
            h1: '2.5rem',
            h2: '2rem',
            h3: '1.5rem'
          }
        },
        availableComponents: [
          'basic_info_display',
          'contact_form',
          'image_gallery',
          'mobile_responsive'
        ]
      }),
      thumbnail_url: '/templates/basic-club-thumb.jpg',
      preview_url: '/templates/basic-club-preview.jpg',
      features: JSON.stringify([
        'basic_info_display',
        'contact_form',
        'image_gallery',
        'mobile_responsive'
      ]),
      is_premium: false,
      required_plan: null,
      is_active: true,
      version: '1.0.0',
      created_at: now,
      updated_at: now
    },
    {
      name: 'Federación Deportiva',
      category: 'state_committee',
      description: 'Template institucional para federaciones deportivas con funcionalidades oficiales',
      structure: JSON.stringify({
        layout: {
          header: {
            logo_position: 'left',
            navigation_style: 'institutional',
            contact_info: true,
            social_links: true,
            language_selector: true
          },
          hero: {
            type: 'institutional_banner',
            overlay: 'official',
            cta_buttons: 2,
            animation: 'professional'
          },
          sections: [
            'hero',
            'federation_info',
            'news_events',
            'rankings',
            'tournaments',
            'affiliates',
            'documents'
          ],
          footer: {
            columns: 4,
            newsletter_signup: true,
            social_links: true,
            contact_info: true,
            legal_info: true
          }
        },
        color_scheme: {
          primary: '#003366',
          secondary: '#cc0000',
          accent: '#ffd700',
          background: '#ffffff',
          text: '#333333'
        },
        typography: {
          heading_font: 'Georgia',
          body_font: 'Times New Roman',
          heading_sizes: {
            h1: '3rem',
            h2: '2.4rem',
            h3: '2rem'
          }
        },
        availableComponents: [
          'official_news',
          'tournament_management',
          'rankings_display',
          'affiliate_directory',
          'document_library',
          'event_calendar',
          'member_portal',
          'multilingual_support'
        ]
      }),
      thumbnail_url: '/templates/admin-thumb.jpg',
      preview_url: '/templates/admin-preview.jpg',
      features: JSON.stringify([
        'official_news',
        'tournament_management',
        'rankings_display',
        'affiliate_directory',
        'document_library',
        'event_calendar',
        'member_portal',
        'multilingual_support'
      ]),
      is_premium: true,
      required_plan: 'enterprise',
      is_active: true,
      version: '1.0.0',
      created_at: now,
      updated_at: now
    }
  ]);
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('microsite_templates', {}, {});
  }
};