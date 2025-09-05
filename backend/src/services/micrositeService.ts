import { Op } from 'sequelize';
import Microsite from '../models/Microsite';
import MicrositeTemplate from '../models/MicrositeTemplate';
import MicrositeAnalytics from '../models/MicrositeAnalytics';
import MicrositePage from '../models/MicrositePage';
import MediaLibrary from '../models/MediaLibrary';
import User from '../models/User';
import Subscription from '../models/Subscription';
import NotificationService from './notificationService';

interface CreateMicrositeRequest {
  templateId: number;
  name: string;
  slug: string;
  subdomain: string;
  description?: string;
}

interface UpdateMicrositeRequest {
  name?: string;
  slug?: string;
  subdomain?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  colorScheme?: any;
  customDomain?: string;
  seo?: any;
  features?: any;
  contactInfo?: any;
}

class MicrositeService {
  async createMicrosite(ownerId: number, micrositeData: CreateMicrositeRequest) {
    const { templateId, name, slug, subdomain } = micrositeData;
    
    // Verify owner permissions
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      throw new Error('User not found');
    }

    if (!['club', 'state_committee', 'admin'].includes(owner.role)) {
      throw new Error('Insufficient permissions to create microsite');
    }

    // Check if subdomain is available
    const existingSubdomain = await Microsite.findOne({ where: { subdomain } });
    if (existingSubdomain) {
      throw new Error('Subdomain already exists');
    }

    // Get template (optional)
    let template = null;
    if (templateId) {
      template = await MicrositeTemplate.findByPk(templateId);
    }

    // Create microsite with minimal required fields
    const microsite = await Microsite.create({
      userId: ownerId,
      ownerId,
      ownerType: owner.role === 'club' ? 'club' : (owner.role === 'partner' ? 'partner' : 'state'),
      name,
      title: name,
      subdomain,
      description: micrositeData.description || '',
      status: 'draft',
      settings: template ? template.structure : {}
    });

    return microsite;
  }

  async getMicrosite(micrositeId: number) {
    const microsite = await Microsite.findByPk(micrositeId);
    if (!microsite) {
      throw new Error('Microsite not found');
    }
    return microsite;
  }

  async getMicrositeById(micrositeId: number) {
    return this.getMicrosite(micrositeId);
  }

  async getUserMicrosites(userId: number, ownerType?: string) {
    const where: any = { userId };
    if (ownerType) {
      where.ownerType = ownerType;
    }
    
    return await Microsite.findAll({ 
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  async updateMicrosite(micrositeId: number, userId: number, updates: UpdateMicrositeRequest) {
    const microsite = await this.getMicrosite(micrositeId);
    
    // Check permission
    if (microsite.userId !== userId) {
      throw new Error('Unauthorized to update this microsite');
    }
    
    return await microsite.update(updates);
  }

  async publishMicrosite(micrositeId: number, userId: number) {
    const microsite = await this.getMicrosite(micrositeId);
    
    if (microsite.userId !== userId) {
      throw new Error('Unauthorized to publish this microsite');
    }
    
    return await microsite.update({ 
      status: 'published',
      publishedAt: new Date()
    });
  }

  async unpublishMicrosite(micrositeId: number, userId: number) {
    const microsite = await this.getMicrosite(micrositeId);
    
    if (microsite.userId !== userId) {
      throw new Error('Unauthorized to unpublish this microsite');
    }
    
    return await microsite.update({ status: 'draft' });
  }

  async duplicateMicrosite(micrositeId: number, userId: number, newSubdomain: string) {
    const microsite = await this.getMicrosite(micrositeId);
    
    if (microsite.userId !== userId) {
      throw new Error('Unauthorized to duplicate this microsite');
    }

    // Check if new subdomain is available
    const existingSubdomain = await Microsite.findOne({ where: { subdomain: newSubdomain } });
    if (existingSubdomain) {
      throw new Error('Subdomain already exists');
    }

    const duplicatedData = {
      userId: microsite.userId,
      ownerId: microsite.ownerId,
      ownerType: microsite.ownerType,
      name: `${microsite.name} - Copia`,
      title: microsite.title,
      subdomain: newSubdomain,
      description: microsite.description,
      status: 'draft' as const,
      settings: microsite.settings
    };

    return await Microsite.create(duplicatedData);
  }

  async deleteMicrosite(micrositeId: number, userId: number) {
    const microsite = await this.getMicrosite(micrositeId);
    
    // Check permission
    if (microsite.userId !== userId) {
      throw new Error('Unauthorized to delete this microsite');
    }
    
    return await microsite.destroy();
  }

  async getMicrositesByOwner(ownerId: number) {
    return await Microsite.findAll({ 
      where: { ownerId },
      order: [['createdAt', 'DESC']]
    });
  }

  async getMicrositeBySubdomain(subdomain: string) {
    return await Microsite.findOne({ where: { subdomain } });
  }

  async createDefaultPages(micrositeId: number) {
    // Create default pages for a microsite including Learn More page
    const defaultPages = [
      {
        micrositeId,
        title: 'Inicio',
        slug: '',
        content: {
          sections: [
            {
              type: 'hero',
              title: 'Bienvenido a la Federación Mexicana de Pickleball',
              subtitle: 'Únete a la comunidad de pickleball más grande de México',
              backgroundImage: '/images/hero-pickleball.jpg',
              ctaText: 'Conoce Más',
              ctaLink: '/learn-more'
            }
          ]
        },
        metaTitle: 'Federación Mexicana de Pickleball',
        metaDescription: 'La federación oficial de pickleball en México. Únete a nuestra comunidad.',
        isHomePage: true,
        isPublished: true,
        sortOrder: 0,
        template: 'homepage',
        settings: {}
      },
      {
        micrositeId,
        title: 'Conoce Más',
        slug: 'learn-more',
        content: {
          sections: [
            {
              type: 'header',
              title: 'Conoce Más Sobre el Pickleball',
              subtitle: 'Descubre todo lo que necesitas saber sobre este emocionante deporte'
            },
            {
              type: 'content',
              title: '¿Qué es el Pickleball?',
              content: `
                <div class="learn-more-section">
                  <h3>El deporte que está revolucionando México</h3>
                  <p>El pickleball es un deporte de raqueta que combina elementos del tenis, bádminton y ping-pong. Se juega en una cancha más pequeña que el tenis, con una red más baja y pelotas de plástico perforadas.</p>
                  
                  <h3>¿Por qué es tan popular?</h3>
                  <ul>
                    <li><strong>Fácil de aprender:</strong> Las reglas son simples y se puede comenzar a jugar en pocos minutos</li>
                    <li><strong>Para todas las edades:</strong> Desde niños hasta adultos mayores pueden disfrutarlo</li>
                    <li><strong>Menor impacto:</strong> Es más suave para las articulaciones que otros deportes de raqueta</li>
                    <li><strong>Muy social:</strong> Se juega principalmente en dobles, fomentando la interacción</li>
                  </ul>

                  <h3>Beneficios del Pickleball</h3>
                  <div class="benefits-grid">
                    <div class="benefit-item">
                      <h4>🏃‍♂️ Ejercicio Completo</h4>
                      <p>Mejora la resistencia cardiovascular, fuerza y coordinación</p>
                    </div>
                    <div class="benefit-item">
                      <h4>🧠 Agilidad Mental</h4>
                      <p>Desarrolla los reflejos y la toma rápida de decisiones</p>
                    </div>
                    <div class="benefit-item">
                      <h4>👥 Comunidad</h4>
                      <p>Conoce personas y forma parte de una comunidad activa</p>
                    </div>
                    <div class="benefit-item">
                      <h4>⚡ Diversión</h4>
                      <p>Es adictivo y emocionante desde el primer juego</p>
                    </div>
                  </div>

                  <h3>Cómo Empezar</h3>
                  <ol>
                    <li><strong>Encuentra una cancha:</strong> Busca canchas cerca de ti en nuestra plataforma</li>
                    <li><strong>Consigue equipo básico:</strong> Pala, pelotas y ropa deportiva cómoda</li>
                    <li><strong>Toma una clase:</strong> Conecta con instructores certificados</li>
                    <li><strong>Únete a torneos:</strong> Participa en eventos locales y nacionales</li>
                  </ol>
                </div>
              `
            },
            {
              type: 'cta',
              title: '¿Listo para comenzar?',
              subtitle: 'Únete a la comunidad de pickleball más grande de México',
              buttons: [
                {
                  text: 'Registrarse Gratis',
                  link: '/register',
                  style: 'primary'
                },
                {
                  text: 'Encontrar Canchas',
                  link: '/courts',
                  style: 'secondary'
                }
              ]
            }
          ]
        },
        metaTitle: 'Conoce Más - Federación Mexicana de Pickleball',
        metaDescription: 'Descubre todo sobre el pickleball: reglas, beneficios y cómo empezar a jugar este emocionante deporte.',
        isHomePage: false,
        isPublished: true,
        sortOrder: 1,
        template: 'content-page',
        settings: {
          showInNavigation: true,
          enableComments: false,
          enableSharing: true
        }
      },
      {
        micrositeId,
        title: 'Contacto',
        slug: 'contact',
        content: {
          sections: [
            {
              type: 'header',
              title: 'Contáctanos',
              subtitle: 'Estamos aquí para ayudarte'
            },
            {
              type: 'contact-form',
              title: 'Envíanos un mensaje',
              fields: [
                { name: 'name', label: 'Nombre', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'subject', label: 'Asunto', type: 'text', required: true },
                { name: 'message', label: 'Mensaje', type: 'textarea', required: true }
              ]
            },
            {
              type: 'contact-info',
              title: 'Información de Contacto',
              email: 'info@federacionpickleball.mx',
              phone: '+52 55 1234 5678',
              address: 'Ciudad de México, México',
              socialMedia: {
                facebook: 'https://facebook.com/federacionpickleballmx',
                instagram: 'https://instagram.com/federacionpickleballmx',
                twitter: 'https://twitter.com/federacionpickleballmx'
              }
            }
          ]
        },
        metaTitle: 'Contacto - Federación Mexicana de Pickleball',
        metaDescription: 'Ponte en contacto con la Federación Mexicana de Pickleball. Estamos aquí para ayudarte.',
        isHomePage: false,
        isPublished: true,
        sortOrder: 2,
        template: 'contact-page',
        settings: {
          showInNavigation: true,
          enableComments: false
        }
      }
    ];

    return await MicrositePage.bulkCreate(defaultPages);
  }

  async getPageBySlug(micrositeId: number, slug: string) {
    return await MicrositePage.findOne({
      where: { 
        micrositeId,
        slug,
        isPublished: true
      }
    });
  }

  async getMicrositeWithPages(subdomain: string) {
    const microsite = await Microsite.findOne({ 
      where: { subdomain, status: 'published' },
      include: [
        {
          model: MicrositePage,
          where: { isPublished: true },
          required: false,
          as: 'pages'
        }
      ]
    });
    
    return microsite;
  }

  async createPage(micrositeId: number, pageData: any) {
    // Verify microsite exists and user has permission
    const microsite = await this.getMicrosite(micrositeId);
    if (!microsite) {
      throw new Error('Microsite not found');
    }

    return await MicrositePage.create({
      micrositeId,
      ...pageData
    });
  }

  async updatePage(pageId: number, updates: any) {
    const page = await MicrositePage.findByPk(pageId);
    if (!page) {
      throw new Error('Page not found');
    }
    
    return await page.update(updates);
  }

  async getPagesByMicrosite(micrositeId: number) {
    return await MicrositePage.findAll({
      where: { micrositeId },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
    });
  }
}

export default new MicrositeService();