const { Microsite, MicrositePage, ContentBlock, MediaFile, User } = require('../../src/models');

class MicrositeSeeder {
  async run() {
    console.log('Seeding microsites...');

    // Get some users to assign as owners
    const users = await User.findAll({ limit: 5 });
    
    if (!users.length) {
      console.log('No users found. Please run user seeder first.');
      return;
    }

    const microsites = [
      {
        title: 'Club de Pickleball Norte',
        description: 'El mejor club de pickleball del norte de la ciudad con canchas profesionales y entrenamientos diarios.',
        subdomain: 'club-norte',
        ownerId: users[0].id,
        ownerType: 'club',
        status: 'published',
        logo: 'https://picsum.photos/200/200?random=1',
        favicon: 'https://picsum.photos/32/32?random=1',
        phone: '+52 55 1234 5678',
        email: 'contacto@clubnorte.com',
        address: 'Av. Principal 123, Col. Centro, México, CDMX 12345',
        socialMedia: {
          facebook: 'https://facebook.com/clubnorte',
          instagram: 'https://instagram.com/clubnorte',
          twitter: 'https://twitter.com/clubnorte',
          website: 'https://clubnorte.com'
        },
        seoSettings: {
          metaTitle: 'Club de Pickleball Norte - El mejor club de la ciudad',
          metaDescription: 'Únete al Club de Pickleball Norte. Canchas profesionales, entrenamientos diarios y un ambiente familiar.',
          metaKeywords: 'pickleball, club, deportes, canchas, norte, méxico',
          ogTitle: 'Club de Pickleball Norte',
          ogDescription: 'El mejor club de pickleball con instalaciones de primera clase',
          ogImage: 'https://picsum.photos/1200/630?random=1'
        },
        theme: {
          template: 'sport',
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          accentColor: '#F59E0B',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          headingFont: 'Inter',
          bodyFont: 'Inter',
          borderRadius: 'medium',
          spacing: 'medium',
          headerStyle: 'default',
          navigationStyle: 'horizontal',
          footerStyle: 'detailed'
        },
        analytics: {
          googleAnalyticsId: 'G-XXXXXXXXXX'
        }
      },
      {
        title: 'Academia Premium Pickleball',
        description: 'Academia de alto rendimiento con instructores certificados y programas personalizados para todos los niveles.',
        subdomain: 'academia-premium',
        ownerId: users[1].id,
        ownerType: 'academy',
        status: 'published',
        logo: 'https://picsum.photos/200/200?random=2',
        phone: '+52 55 9876 5432',
        email: 'info@academiapremium.com',
        address: 'Calle Deportes 456, Col. Deportiva, México, CDMX 67890',
        socialMedia: {
          facebook: 'https://facebook.com/academiapremium',
          instagram: 'https://instagram.com/academiapremium',
          youtube: 'https://youtube.com/academiapremium'
        },
        theme: {
          template: 'elegant',
          primaryColor: '#8B5CF6',
          secondaryColor: '#EC4899',
          accentColor: '#F97316',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          headingFont: 'Montserrat',
          bodyFont: 'Open Sans'
        }
      },
      {
        title: 'Torneo Nacional 2024',
        description: 'El torneo más importante del año con premios en efectivo y clasificación nacional.',
        subdomain: 'torneo-nacional-2024',
        ownerId: users[2].id,
        ownerType: 'tournament',
        status: 'published',
        logo: 'https://picsum.photos/200/200?random=3',
        email: 'organizacion@torneonacional.com',
        theme: {
          template: 'vibrant',
          primaryColor: '#EF4444',
          secondaryColor: '#F97316',
          accentColor: '#8B5CF6'
        }
      }
    ];

    for (const micrositeData of microsites) {
      const microsite = await Microsite.create(micrositeData);
      
      // Create pages for each microsite
      await this.createPagesForMicrosite(microsite);
    }

    console.log('✅ Microsites seeded successfully');
  }

  async createPagesForMicrosite(microsite) {
    const pages = [
      {
        title: 'Inicio',
        slug: '',
        description: 'Página principal del sitio',
        isHomePage: true,
        isPublished: true,
        sortOrder: 1,
        template: 'landing',
        micrositeId: microsite.id,
        seoSettings: {
          metaTitle: `${microsite.title} - Inicio`,
          metaDescription: microsite.description
        }
      },
      {
        title: 'Acerca de Nosotros',
        slug: 'acerca-de',
        description: 'Conoce más sobre nuestra historia y misión',
        isHomePage: false,
        isPublished: true,
        sortOrder: 2,
        template: 'about',
        micrositeId: microsite.id
      },
      {
        title: 'Nuestras Canchas',
        slug: 'canchas',
        description: 'Información sobre nuestras instalaciones',
        isHomePage: false,
        isPublished: true,
        sortOrder: 3,
        template: 'default',
        micrositeId: microsite.id
      },
      {
        title: 'Contacto',
        slug: 'contacto',
        description: 'Ponte en contacto con nosotros',
        isHomePage: false,
        isPublished: true,
        sortOrder: 4,
        template: 'contact',
        micrositeId: microsite.id
      }
    ];

    for (const pageData of pages) {
      const page = await MicrositePage.create(pageData);
      
      // Create content blocks for each page
      await this.createContentBlocksForPage(page, microsite);
    }
  }

  async createContentBlocksForPage(page, microsite) {
    let blocks = [];

    if (page.isHomePage) {
      // Home page blocks
      blocks = [
        {
          type: 'text',
          content: {
            text: `<h1>Bienvenido a ${microsite.title}</h1><p>${microsite.description}</p><p>Únete a nuestra comunidad de apasionados del pickleball y disfruta de las mejores instalaciones de la ciudad.</p>`,
            textAlign: 'center',
            fontSize: 'large'
          },
          settings: {
            backgroundColor: '#F8FAFC',
            padding: 'large'
          },
          sortOrder: 1,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'image',
          content: {
            imageUrl: 'https://picsum.photos/1200/600?random=10',
            alt: `Instalaciones de ${microsite.title}`,
            caption: 'Nuestras modernas instalaciones',
            alignment: 'center',
            size: 'large'
          },
          sortOrder: 2,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'gallery',
          content: {
            title: 'Galería de Fotos',
            images: [
              {
                url: 'https://picsum.photos/400/300?random=11',
                alt: 'Cancha 1',
                caption: 'Cancha principal'
              },
              {
                url: 'https://picsum.photos/400/300?random=12',
                alt: 'Cancha 2',
                caption: 'Cancha secundaria'
              },
              {
                url: 'https://picsum.photos/400/300?random=13',
                alt: 'Vestidores',
                caption: 'Vestidores equipados'
              },
              {
                url: 'https://picsum.photos/400/300?random=14',
                alt: 'Cafetería',
                caption: 'Área de descanso'
              }
            ],
            columns: 2,
            showCaptions: true
          },
          sortOrder: 3,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'contact',
          content: {
            title: 'Información de Contacto',
            email: microsite.email,
            phone: microsite.phone,
            address: microsite.address,
            showForm: true,
            formFields: ['name', 'email', 'phone', 'message']
          },
          sortOrder: 4,
          isVisible: true,
          pageId: page.id
        }
      ];
    } else if (page.slug === 'acerca-de') {
      // About page blocks
      blocks = [
        {
          type: 'text',
          content: {
            text: `<h1>Acerca de ${microsite.title}</h1><h2>Nuestra Historia</h2><p>Fundado en 2020, ${microsite.title} nació de la pasión por el pickleball y el deseo de crear un espacio donde jugadores de todos los niveles pudieran disfrutar de este maravilloso deporte.</p><h2>Nuestra Misión</h2><p>Promover el pickleball en México, ofreciendo instalaciones de clase mundial y programas de entrenamiento para desarrollar el talento local.</p><h2>Nuestros Valores</h2><ul><li><strong>Excelencia:</strong> Buscamos la calidad en todo lo que hacemos</li><li><strong>Inclusión:</strong> Todos son bienvenidos sin importar su nivel</li><li><strong>Comunidad:</strong> Fomentamos las relaciones y el compañerismo</li><li><strong>Diversión:</strong> El deporte debe ser divertido y emocionante</li></ul>`,
            textAlign: 'left',
            fontSize: 'medium'
          },
          sortOrder: 1,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'image',
          content: {
            imageUrl: 'https://picsum.photos/800/500?random=20',
            alt: 'Equipo directivo',
            caption: 'Nuestro equipo directivo y de instructores',
            alignment: 'center'
          },
          sortOrder: 2,
          isVisible: true,
          pageId: page.id
        }
      ];
    } else if (page.slug === 'canchas') {
      // Courts page blocks
      blocks = [
        {
          type: 'text',
          content: {
            text: '<h1>Nuestras Canchas</h1><p>Contamos con instalaciones de primera clase diseñadas para brindar la mejor experiencia de juego.</p>',
            textAlign: 'center'
          },
          sortOrder: 1,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'court_list',
          content: {
            title: 'Canchas Disponibles',
            showAvailability: true,
            showPricing: true,
            showBookingButton: true,
            layout: 'grid'
          },
          sortOrder: 2,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'map',
          content: {
            latitude: 19.432608,
            longitude: -99.133209,
            address: microsite.address,
            zoom: 15
          },
          sortOrder: 3,
          isVisible: true,
          pageId: page.id
        }
      ];
    } else if (page.slug === 'contacto') {
      // Contact page blocks
      blocks = [
        {
          type: 'text',
          content: {
            text: '<h1>Contacto</h1><p>¿Tienes alguna pregunta o quieres conocer más sobre nuestros servicios? ¡Contáctanos!</p>',
            textAlign: 'center'
          },
          sortOrder: 1,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'contact',
          content: {
            title: 'Información de Contacto',
            email: microsite.email,
            phone: microsite.phone,
            address: microsite.address,
            showForm: true,
            formFields: ['name', 'email', 'phone', 'subject', 'message']
          },
          sortOrder: 2,
          isVisible: true,
          pageId: page.id
        },
        {
          type: 'calendar',
          content: {
            title: 'Horarios de Atención',
            view: 'weekly',
            showEvents: 'business_hours',
            showFilters: false
          },
          sortOrder: 3,
          isVisible: true,
          pageId: page.id
        }
      ];
    }

    // Create the blocks
    for (const blockData of blocks) {
      await ContentBlock.create(blockData);
    }
  }
}

module.exports = new MicrositeSeeder();