import { Op } from 'sequelize';
import Microsite from '../models/Microsite';
import MicrositeTemplate from '../models/MicrositeTemplate';
import MicrositeAnalytics from '../models/MicrositeAnalytics';
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

interface AddPageRequest {
  name: string;
  slug: string;
  title?: string;
  metaDescription?: string;
  components?: any[];
}

interface UpdatePageRequest {
  name?: string;
  slug?: string;
  title?: string;
  metaDescription?: string;
  components?: any[];
  isPublished?: boolean;
}

class MicrositeService {
  async createMicrosite(ownerId: number, micrositeData: CreateMicrositeRequest) {
    const { templateId, name, slug, subdomain } = micrositeData;
    
    // Verify owner permissions
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      throw new Error('User not found');
    }

    if (!['club', 'state_committee', 'federation'].includes(owner.role)) {
      throw new Error('Insufficient permissions to create microsite');
    }

    // Check if slug is available
    const existingSlug = await Microsite.findOne({ where: { slug } });
    if (existingSlug) {
      throw new Error('Slug already exists');
    }

    // Check if subdomain is available
    const existingSubdomain = await Microsite.findOne({ where: { subdomain } });
    if (existingSubdomain) {
      throw new Error('Subdomain already exists');
    }

    // Get template
    const template = await MicrositeTemplate.findByPk(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Check if user has access to premium template
    if (template.isPremium) {
      const subscription = await this.checkUserSubscription(ownerId);
      if (!subscription || !subscription.customBranding) {
        throw new Error('Premium subscription required for this template');
      }
    }

    // Create microsite with template defaults
    const microsite = await Microsite.create({
      ownerId,
      ownerType: owner.role === 'club' ? 'club' : 'state_committee',
      name,
      slug,
      subdomain,
      description: micrositeData.description || '',
      templateId,
      templateVersion: template.version,
      colorScheme: template.structure.colorScheme,
      pages: template.structure.pages.map((page, index) => ({
        id: this.generateId(),
        ...page,
        isPublished: index === 0, // Publish home page by default
        sortOrder: index
      })),
      navigation: [
        {
          type: 'header',
          items: [
            { label: 'Inicio', url: '/', pageId: null, isExternal: false, openInNewTab: false },
            { label: 'Nosotros', url: '/about', pageId: null, isExternal: false, openInNewTab: false },
            { label: 'Contacto', url: '/contact', pageId: null, isExternal: false, openInNewTab: false }
          ]
        }
      ],
      seo: {
        title: name,
        description: micrositeData.description || `Sitio oficial de ${name}`,
        keywords: ['pickleball', 'club', 'deportes', 'comunidad'],
        ogImage: template.thumbnailUrl
      },
      status: 'draft',
      isPublic: false,
      features: {
        contactForm: true,
        eventCalendar: true,
        memberDirectory: false,
        photoGallery: true,
        newsUpdates: true,
        socialMedia: true
      },
      contactInfo: {
        email: owner.email
      },
      sslEnabled: true
    });

    // Create default analytics record
    await MicrositeAnalytics.create({
      micrositeId: microsite.id,
      date: new Date(),
      pageViews: 0,
      uniqueVisitors: 0,
      sessions: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      pageMetrics: [],
      trafficSources: [],
      deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
      browserStats: [],
      countryStats: [],
      formSubmissions: 0,
      downloadClicks: 0,
      socialClicks: 0,
      externalLinkClicks: 0
    });

    return microsite;
  }

  async getMicrositeById(id: number) {
    try {
      const microsite = await Microsite.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: Theme,
            as: 'theme'
          },
          {
            model: MicrositePage,
            as: 'pages',
            include: [{
              model: ContentBlock,
              as: 'contentBlocks',
              order: [['sort_order', 'ASC']]
            }]
          }
        ]
      });

      if (!microsite) {
        throw new Error('Microsite not found');
      }

      return microsite;
    } catch (error) {
      throw error;
    }
  }

  async getMicrositeBySubdomain(subdomain: string) {
    try {
      const microsite = await Microsite.findOne({
        where: { 
          subdomain,
          status: 'published'
        },
        include: [
          {
            model: Theme,
            as: 'theme'
          },
          {
            model: MicrositePage,
            as: 'pages',
            where: { isPublished: true },
            required: false,
            include: [{
              model: ContentBlock,
              as: 'contentBlocks',
              where: { isVisible: true },
              required: false,
              order: [['sort_order', 'ASC']]
            }]
          }
        ]
      });

      return microsite;
    } catch (error) {
      throw error;
    }
  }

  async getUserMicrosites(userId: number, ownerType?: string) {
    try {
      const whereClause: any = { userId };
      
      if (ownerType) {
        whereClause.ownerType = ownerType;
      }

      const microsites = await Microsite.findAll({
        where: whereClause,
        include: [
          {
            model: Theme,
            as: 'theme'
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return microsites;
    } catch (error) {
      throw error;
    }
  }

  async updateMicrosite(id: number, userId: number, data: any) {
    try {
      const microsite = await Microsite.findOne({
        where: { id, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      // If subdomain is being changed, check availability
      if (data.subdomain && data.subdomain !== microsite.subdomain) {
        const existingMicrosite = await Microsite.findOne({
          where: { 
            subdomain: data.subdomain,
            id: { [Op.ne]: id }
          }
        });

        if (existingMicrosite) {
          throw new Error('Subdomain is already taken');
        }
      }

      await microsite.update(data);

      return await this.getMicrositeById(id);
    } catch (error) {
      throw error;
    }
  }

  async publishMicrosite(id: number, userId: number) {
    try {
      const microsite = await Microsite.findOne({
        where: { id, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      // Validate that microsite has at least one published page
      const publishedPages = await MicrositePage.count({
        where: {
          micrositeId: id,
          isPublished: true
        }
      });

      if (publishedPages === 0) {
        throw new Error('Cannot publish microsite without at least one published page');
      }

      await microsite.update({
        status: 'published',
        publishedAt: new Date()
      });

      return await this.getMicrositeById(id);
    } catch (error) {
      throw error;
    }
  }

  async unpublishMicrosite(id: number, userId: number) {
    try {
      const microsite = await Microsite.findOne({
        where: { id, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      await microsite.update({
        status: 'draft'
      });

      return await this.getMicrositeById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteMicrosite(id: number, userId: number) {
    try {
      const microsite = await Microsite.findOne({
        where: { id, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      await microsite.destroy();

      return { success: true, message: 'Microsite deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async duplicateMicrosite(id: number, userId: number, newSubdomain: string) {
    try {
      const originalMicrosite = await this.getMicrositeById(id);

      if (!originalMicrosite || originalMicrosite.userId !== userId) {
        throw new Error('Microsite not found or unauthorized');
      }

      // Check if new subdomain is available
      const existingMicrosite = await Microsite.findOne({
        where: { subdomain: newSubdomain }
      });

      if (existingMicrosite) {
        throw new Error('Subdomain is already taken');
      }

      // Create duplicate microsite
      const duplicateData = {
        ...originalMicrosite.toJSON(),
        id: undefined,
        subdomain: newSubdomain,
        name: `${originalMicrosite.name} (Copy)`,
        status: 'draft' as const,
        publishedAt: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };

      const newMicrosite = await Microsite.create(duplicateData);

      // Duplicate pages and content blocks
      const originalPages = (originalMicrosite as any).pages || [];
      for (const page of originalPages) {
        const pageData = {
          ...page.toJSON(),
          id: undefined,
          micrositeId: newMicrosite.id,
          isPublished: false,
          publishedAt: null,
          createdAt: undefined,
          updatedAt: undefined
        };

        const newPage = await MicrositePage.create(pageData);

        // Duplicate content blocks
        const pageBlocks = (page as any).contentBlocks || [];
        for (const block of pageBlocks) {
          const blockData = {
            ...block.toJSON(),
            id: undefined,
            pageId: newPage.id,
            createdAt: undefined,
            updatedAt: undefined
          };

          await ContentBlock.create(blockData);
        }
      }

      return await this.getMicrositeById(newMicrosite.id);
    } catch (error) {
      throw error;
    }
  }

  async getPublicMicrosites(limit: number = 10, offset: number = 0) {
    try {
      const { count, rows } = await Microsite.findAndCountAll({
        where: {
          status: 'published'
        },
        include: [
          {
            model: Theme,
            as: 'theme'
          }
        ],
        order: [['published_at', 'DESC']],
        limit,
        offset
      });

      return {
        microsites: rows,
        total: count,
        limit,
        offset
      };
    } catch (error) {
      throw error;
    }
  }

  private async validateOwner(ownerType: string, ownerId: number) {
    let owner;

    switch (ownerType) {
      case 'club':
        owner = await Club.findByPk(ownerId);
        break;
      case 'partner':
        owner = await Partner.findByPk(ownerId);
        break;
      case 'state':
        owner = await StateCommittee.findByPk(ownerId);
        break;
      default:
        throw new Error('Invalid owner type');
    }

    if (!owner) {
      throw new Error('Owner not found');
    }

    return owner;
  }

  private async createDefaultHomePage(micrositeId: number) {
    try {
      const homePage = await MicrositePage.create({
        micrositeId,
        title: 'Home',
        slug: '',
        isHomePage: true,
        isPublished: true,
        sortOrder: 0,
        template: 'default',
        settings: {},
        publishedAt: new Date()
      });

      // Create default welcome content block
      await ContentBlock.create({
        pageId: homePage.id,
        type: 'text',
        content: {
          text: '<h1>Welcome</h1><p>This is your new microsite. Start customizing it to make it your own!</p>',
          textAlign: 'center'
        },
        sortOrder: 0,
        isVisible: true,
        settings: {}
      });

      return homePage;
    } catch (error) {
      throw error;
    }
  }

  async searchMicrosites(query: string, filters: any = {}) {
    try {
      const whereClause: any = {
        status: 'published',
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { seoKeywords: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (filters.ownerType) {
        whereClause.ownerType = filters.ownerType;
      }

      const microsites = await Microsite.findAll({
        where: whereClause,
        include: [
          {
            model: Theme,
            as: 'theme'
          }
        ],
        order: [['published_at', 'DESC']],
        limit: filters.limit || 20
      });

      return microsites;
    } catch (error) {
      throw error;
    }
  }
}

export { MicrositeService };
export default new MicrositeService();