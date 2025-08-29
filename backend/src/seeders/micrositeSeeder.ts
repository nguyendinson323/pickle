import { User, Club, Partner, StateCommittee, State } from '../models';
import Microsite from '../models/Microsite';
import MicrositePage from '../models/MicrositePage';
import ContentBlock from '../models/ContentBlock';
import Theme from '../models/Theme';
import { ThemeService } from '../services/themeService';

const themeService = new ThemeService();

export const seedMicrositeData = async () => {
  try {
    console.log('🌱 Starting microsite seeding...');

    // Create default themes
    console.log('Creating themes...');
    
    const defaultTheme = await Theme.create({
      name: 'Default',
      description: 'Clean and professional default theme',
      isDefault: true,
      isActive: true,
      colorScheme: {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        accentColor: '#28a745',
        backgroundColor: '#ffffff',
        textColor: '#212529',
        textSecondary: '#6c757d',
        borderColor: '#dee2e6',
        successColor: '#28a745',
        warningColor: '#ffc107',
        errorColor: '#dc3545'
      },
      typography: {
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '16px',
        fontWeightNormal: '400',
        fontWeightBold: '700',
        lineHeight: '1.5',
        headingFontFamily: 'inherit'
      },
      layout: {
        maxWidth: '1200px',
        sectionPadding: '60px 0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      },
      settings: {}
    });

    const sportsTheme = await Theme.create({
      name: 'Sports',
      description: 'Dynamic theme for sports organizations',
      isDefault: false,
      isActive: true,
      colorScheme: {
        primaryColor: '#ff6b35',
        secondaryColor: '#004e92',
        accentColor: '#ffd23f',
        backgroundColor: '#ffffff',
        textColor: '#2d3748',
        textSecondary: '#718096',
        borderColor: '#e2e8f0',
        successColor: '#38a169',
        warningColor: '#ed8936',
        errorColor: '#e53e3e'
      },
      typography: {
        fontFamily: '"Roboto", Arial, sans-serif',
        fontSize: '16px',
        fontWeightNormal: '400',
        fontWeightBold: '700',
        lineHeight: '1.6',
        headingFontFamily: '"Roboto Condensed", Arial, sans-serif'
      },
      layout: {
        maxWidth: '1200px',
        sectionPadding: '80px 0',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      },
      settings: {
        category: 'sports'
      }
    });

    const minimalTheme = await Theme.create({
      name: 'Minimal',
      description: 'Clean and minimal design',
      isDefault: false,
      isActive: true,
      colorScheme: {
        primaryColor: '#2d3748',
        secondaryColor: '#718096',
        accentColor: '#3182ce',
        backgroundColor: '#ffffff',
        textColor: '#1a202c',
        textSecondary: '#4a5568',
        borderColor: '#e2e8f0',
        successColor: '#38a169',
        warningColor: '#d69e2e',
        errorColor: '#e53e3e'
      },
      typography: {
        fontFamily: '"Inter", -apple-system, sans-serif',
        fontSize: '15px',
        fontWeightNormal: '400',
        fontWeightBold: '600',
        lineHeight: '1.5',
        headingFontFamily: 'inherit'
      },
      layout: {
        maxWidth: '1100px',
        sectionPadding: '50px 0',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      },
      settings: {
        category: 'minimal'
      }
    });

    console.log('✅ Themes created');

    // Get sample users for different roles
    const clubUser = await User.findOne({ 
      where: { role: 'club' },
      include: [{ model: Club, as: 'clubProfile' }]
    });

    const partnerUser = await User.findOne({ 
      where: { role: 'partner' },
      include: [{ model: Partner, as: 'partnerProfile' }]
    });

    const stateUser = await User.findOne({ 
      where: { role: 'state' },
      include: [{ model: StateCommittee, as: 'stateCommitteeProfile' }]
    });

    // Create sample microsites
    if (clubUser && clubUser.clubProfile) {
      console.log('Creating club microsite...');
      
      const clubMicrosite = await Microsite.create({
        userId: clubUser.id,
        name: 'Ciudad Deportiva Pickleball Club',
        subdomain: 'ciudad-deportiva',
        title: 'Ciudad Deportiva Pickleball Club',
        description: 'Premier pickleball club in Mexico City with professional courts and coaching services.',
        ownerType: 'club',
        ownerId: clubUser.clubProfile.id,
        status: 'published',
        themeId: sportsTheme.id,
        seoTitle: 'Ciudad Deportiva Pickleball Club - Professional Courts & Coaching',
        seoDescription: 'Join Mexico City\'s premier pickleball club. Professional courts, expert coaching, and vibrant community. Book your court today!',
        seoKeywords: 'pickleball, club, Mexico City, courts, coaching, tournaments',
        contactEmail: 'info@ciudaddeportiva.mx',
        contactPhone: '+52 55 1234 5678',
        address: 'Av. Reforma 123, Ciudad de México, CDMX',
        socialMedia: {
          facebook: 'https://facebook.com/ciudaddeportiva',
          instagram: 'https://instagram.com/ciudaddeportiva',
          twitter: 'https://twitter.com/ciudaddeportiva'
        },
        settings: {
          showBookingIntegration: true,
          showTournamentList: true,
          allowRegistrations: true
        },
        publishedAt: new Date()
      });

      // Create pages for club microsite
      const clubHomePage = await MicrositePage.create({
        micrositeId: clubMicrosite.id,
        title: 'Home',
        slug: '',
        isHomePage: true,
        isPublished: true,
        sortOrder: 0,
        template: 'default',
        metaTitle: 'Ciudad Deportiva Pickleball Club - Home',
        metaDescription: 'Welcome to Mexico City\'s premier pickleball destination',
        settings: {},
        publishedAt: new Date()
      });

      // Create content blocks for home page
      await ContentBlock.create({
        pageId: clubHomePage.id,
        type: 'text',
        content: {
          text: '<h1>Welcome to Ciudad Deportiva Pickleball Club</h1><p class="lead">Experience the best pickleball facilities in Mexico City. Our club features professional-grade courts, expert coaching, and a vibrant community of players at all levels.</p>',
          textAlign: 'center'
        },
        sortOrder: 0,
        isVisible: true,
        settings: {}
      });

      await ContentBlock.create({
        pageId: clubHomePage.id,
        type: 'image',
        content: {
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200',
          alt: 'Professional pickleball courts',
          caption: 'Our state-of-the-art courts',
          alignment: 'center',
          size: 'large'
        },
        sortOrder: 1,
        isVisible: true,
        settings: {}
      });

      await ContentBlock.create({
        pageId: clubHomePage.id,
        type: 'court_list',
        content: {
          title: 'Our Courts',
          showAvailability: true,
          showPricing: true,
          showBookingButton: true,
          layout: 'grid'
        },
        sortOrder: 2,
        isVisible: true,
        settings: {}
      });

      // Create About page
      const clubAboutPage = await MicrositePage.create({
        micrositeId: clubMicrosite.id,
        title: 'About Us',
        slug: 'about',
        isHomePage: false,
        isPublished: true,
        sortOrder: 1,
        template: 'default',
        metaTitle: 'About Ciudad Deportiva Pickleball Club',
        metaDescription: 'Learn about our history, mission, and commitment to pickleball excellence',
        settings: {},
        publishedAt: new Date()
      });

      await ContentBlock.create({
        pageId: clubAboutPage.id,
        type: 'text',
        content: {
          text: '<h2>Our Story</h2><p>Founded in 2018, Ciudad Deportiva Pickleball Club has grown to become Mexico City\'s premier destination for pickleball enthusiasts. We pride ourselves on providing world-class facilities and fostering a welcoming community for players of all skill levels.</p><h3>Our Mission</h3><p>To promote the growth of pickleball in Mexico through exceptional facilities, quality instruction, and community building.</p>',
          textAlign: 'left'
        },
        sortOrder: 0,
        isVisible: true,
        settings: {}
      });

      // Create Programs page
      const clubProgramsPage = await MicrositePage.create({
        micrositeId: clubMicrosite.id,
        title: 'Programs & Lessons',
        slug: 'programs',
        isHomePage: false,
        isPublished: true,
        sortOrder: 2,
        template: 'default',
        metaTitle: 'Pickleball Programs & Lessons',
        metaDescription: 'Professional pickleball coaching and programs for all skill levels',
        settings: {},
        publishedAt: new Date()
      });

      await ContentBlock.create({
        pageId: clubProgramsPage.id,
        type: 'text',
        content: {
          text: '<h2>Coaching Programs</h2><p>Our certified instructors offer comprehensive programs designed to improve your game, regardless of your current skill level.</p>',
          textAlign: 'center'
        },
        sortOrder: 0,
        isVisible: true,
        settings: {}
      });

      console.log('✅ Club microsite created');
    }

    // Create partner microsite
    if (partnerUser && partnerUser.partnerProfile) {
      console.log('Creating partner microsite...');
      
      const partnerMicrosite = await Microsite.create({
        userId: partnerUser.id,
        name: 'SportEquip Pro Mexico',
        subdomain: 'sportequip-pro',
        title: 'SportEquip Pro Mexico',
        description: 'Premium pickleball equipment and accessories. Official partner of the Mexican Pickleball Federation.',
        ownerType: 'partner',
        ownerId: partnerUser.partnerProfile.id,
        status: 'published',
        themeId: defaultTheme.id,
        seoTitle: 'SportEquip Pro Mexico - Premium Pickleball Equipment',
        seoDescription: 'Shop premium pickleball equipment and accessories. Official Mexican Pickleball Federation partner with top brands and expert service.',
        seoKeywords: 'pickleball, equipment, paddles, balls, accessories, Mexico',
        contactEmail: 'ventas@sportequippro.mx',
        contactPhone: '+52 55 8765 4321',
        address: 'Calle Deporte 456, Guadalajara, JAL',
        socialMedia: {
          facebook: 'https://facebook.com/sportequippro',
          instagram: 'https://instagram.com/sportequippro'
        },
        settings: {
          showProductCatalog: true,
          allowOnlineOrders: true,
          showPartnerBadge: true
        },
        publishedAt: new Date()
      });

      // Create home page for partner
      const partnerHomePage = await MicrositePage.create({
        micrositeId: partnerMicrosite.id,
        title: 'Home',
        slug: '',
        isHomePage: true,
        isPublished: true,
        sortOrder: 0,
        template: 'default',
        metaTitle: 'SportEquip Pro Mexico - Home',
        metaDescription: 'Your trusted partner for premium pickleball equipment',
        settings: {},
        publishedAt: new Date()
      });

      await ContentBlock.create({
        pageId: partnerHomePage.id,
        type: 'text',
        content: {
          text: '<h1>SportEquip Pro Mexico</h1><p class="lead">Your trusted partner for premium pickleball equipment. We are proud to be an official partner of the Mexican Pickleball Federation, providing top-quality gear to players nationwide.</p>',
          textAlign: 'center'
        },
        sortOrder: 0,
        isVisible: true,
        settings: {}
      });

      await ContentBlock.create({
        pageId: partnerHomePage.id,
        type: 'contact',
        content: {
          title: 'Get in Touch',
          email: 'ventas@sportequippro.mx',
          phone: '+52 55 8765 4321',
          address: 'Calle Deporte 456, Guadalajara, JAL',
          showForm: true,
          formFields: ['name', 'email', 'phone', 'message']
        },
        sortOrder: 1,
        isVisible: true,
        settings: {}
      });

      console.log('✅ Partner microsite created');
    }

    // Create state committee microsite
    if (stateUser && stateUser.stateCommitteeProfile) {
      console.log('Creating state committee microsite...');
      
      const stateMicrosite = await Microsite.create({
        userId: stateUser.id,
        name: 'Comité Estatal de Pickleball CDMX',
        subdomain: 'cdmx-pickleball',
        title: 'Comité Estatal de Pickleball CDMX',
        description: 'Official state committee for pickleball development in Mexico City. Tournaments, rankings, and player development.',
        ownerType: 'state',
        ownerId: stateUser.stateCommitteeProfile.id,
        status: 'published',
        themeId: minimalTheme.id,
        seoTitle: 'Comité Estatal de Pickleball CDMX - Official State Committee',
        seoDescription: 'Official Mexico City pickleball committee. Official tournaments, player rankings, and development programs.',
        seoKeywords: 'pickleball, Mexico City, CDMX, tournaments, rankings, committee, official',
        contactEmail: 'contacto@pickleballcdmx.mx',
        contactPhone: '+52 55 2468 1357',
        address: 'Oficinas Deportivas CDMX, Ciudad de México',
        socialMedia: {
          facebook: 'https://facebook.com/pickleballcdmx',
          twitter: 'https://twitter.com/pickleballcdmx'
        },
        settings: {
          showTournamentCalendar: true,
          showRankings: true,
          showOfficialAnnouncements: true
        },
        publishedAt: new Date()
      });

      // Create home page for state committee
      const stateHomePage = await MicrositePage.create({
        micrositeId: stateMicrosite.id,
        title: 'Inicio',
        slug: '',
        isHomePage: true,
        isPublished: true,
        sortOrder: 0,
        template: 'default',
        metaTitle: 'Comité Estatal de Pickleball CDMX',
        metaDescription: 'Comité oficial de pickleball de la Ciudad de México',
        settings: {},
        publishedAt: new Date()
      });

      await ContentBlock.create({
        pageId: stateHomePage.id,
        type: 'text',
        content: {
          text: '<h1>Comité Estatal de Pickleball CDMX</h1><p class="lead">Bienvenidos al sitio oficial del Comité Estatal de Pickleball de la Ciudad de México. Aquí encontrarás información sobre torneos oficiales, rankings, y programas de desarrollo del pickleball en nuestra entidad.</p>',
          textAlign: 'center'
        },
        sortOrder: 0,
        isVisible: true,
        settings: {}
      });

      await ContentBlock.create({
        pageId: stateHomePage.id,
        type: 'tournament_list',
        content: {
          title: 'Próximos Torneos Oficiales',
          showUpcoming: true,
          showPast: false,
          showRegistrationButton: true,
          limit: 5
        },
        sortOrder: 1,
        isVisible: true,
        settings: {}
      });

      await ContentBlock.create({
        pageId: stateHomePage.id,
        type: 'calendar',
        content: {
          title: 'Calendario de Eventos',
          showEvents: 'official',
          view: 'month',
          showFilters: true
        },
        sortOrder: 2,
        isVisible: true,
        settings: {}
      });

      // Create tournaments page
      const stateTournamentsPage = await MicrositePage.create({
        micrositeId: stateMicrosite.id,
        title: 'Torneos',
        slug: 'torneos',
        isHomePage: false,
        isPublished: true,
        sortOrder: 1,
        template: 'default',
        metaTitle: 'Torneos Oficiales de Pickleball CDMX',
        metaDescription: 'Torneos oficiales de pickleball en la Ciudad de México',
        settings: {},
        publishedAt: new Date()
      });

      await ContentBlock.create({
        pageId: stateTournamentsPage.id,
        type: 'text',
        content: {
          text: '<h2>Torneos Oficiales</h2><p>El Comité Estatal de Pickleball CDMX organiza torneos oficiales durante todo el año. Estos eventos forman parte del ranking estatal y nacional.</p>',
          textAlign: 'left'
        },
        sortOrder: 0,
        isVisible: true,
        settings: {}
      });

      console.log('✅ State committee microsite created');
    }

    console.log('🎉 Microsite seeding completed successfully!');
    console.log('\nCreated:');
    console.log('- 3 themes (Default, Sports, Minimal)');
    console.log('- 3 sample microsites with pages and content');
    console.log('- Multiple content blocks demonstrating different types');
    console.log('\nTest subdomains:');
    console.log('- ciudad-deportiva.localhost:3000 (Club)');
    console.log('- sportequip-pro.localhost:3000 (Partner)');
    console.log('- cdmx-pickleball.localhost:3000 (State Committee)');

  } catch (error) {
    console.error('❌ Error seeding microsite data:', error);
    throw error;
  }
};

export default seedMicrositeData;