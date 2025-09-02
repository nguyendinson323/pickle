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

class MicrositeBuilderService {
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
      if (!subscription) {
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
        components: page.components || [],
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

  async updateMicrosite(micrositeId: number, ownerId: number, updateData: UpdateMicrositeRequest) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    // Handle slug change
    if (updateData.slug && updateData.slug !== microsite.slug) {
      const existingSlug = await Microsite.findOne({
        where: { slug: updateData.slug, id: { [Op.ne]: micrositeId } }
      });
      if (existingSlug) {
        throw new Error('Slug already exists');
      }
    }

    // Handle subdomain change
    if (updateData.subdomain && updateData.subdomain !== microsite.subdomain) {
      const existingSubdomain = await Microsite.findOne({
        where: { subdomain: updateData.subdomain, id: { [Op.ne]: micrositeId } }
      });
      if (existingSubdomain) {
        throw new Error('Subdomain already exists');
      }
    }

    await microsite.update(updateData);
    return microsite;
  }

  async getMicrosite(micrositeId: number, ownerId: number) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    return microsite;
  }

  async getUserMicrosites(ownerId: number) {
    return await Microsite.findAll({
      where: { ownerId },
      order: [['createdAt', 'DESC']]
    });
  }

  async addPage(micrositeId: number, ownerId: number, pageData: AddPageRequest) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    // Check if page slug exists
    const existingPage = microsite.pages.find(page => page.slug === pageData.slug);
    if (existingPage) {
      throw new Error('Page slug already exists');
    }

    const newPage = {
      id: this.generateId(),
      name: pageData.name,
      slug: pageData.slug,
      title: pageData.title || pageData.name,
      metaDescription: pageData.metaDescription || '',
      components: pageData.components || [],
      isPublished: false,
      sortOrder: microsite.pages.length
    };

    const updatedPages = [...microsite.pages, newPage];
    await microsite.update({ pages: updatedPages });

    return newPage;
  }

  async updatePage(micrositeId: number, ownerId: number, pageId: string, pageData: UpdatePageRequest) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    const pageIndex = microsite.pages.findIndex(page => page.id === pageId);
    if (pageIndex === -1) {
      throw new Error('Page not found');
    }

    // Check slug uniqueness if changed
    if (pageData.slug && pageData.slug !== microsite.pages[pageIndex].slug) {
      const existingPage = microsite.pages.find(page => page.slug === pageData.slug && page.id !== pageId);
      if (existingPage) {
        throw new Error('Page slug already exists');
      }
    }

    const updatedPages = [...microsite.pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      ...pageData
    };

    await microsite.update({ pages: updatedPages });
    return updatedPages[pageIndex];
  }

  async deletePage(micrositeId: number, ownerId: number, pageId: string) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    const updatedPages = microsite.pages.filter(page => page.id !== pageId);
    await microsite.update({ pages: updatedPages });

    return { success: true };
  }

  async publishMicrosite(micrositeId: number, ownerId: number) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    // Validate required content
    const validation = await this.validateMicrosite(microsite);
    if (!validation.isValid) {
      throw new Error(`Cannot publish: ${validation.errors.join(', ')}`);
    }

    await microsite.update({
      status: 'published',
      isPublic: true,
      publishedAt: new Date()
    });

    // Generate sitemap
    await this.generateSitemap(microsite);

    // Send notification
    await NotificationService.createNotification(ownerId, {
      type: 'system',
      category: 'success',
      title: 'Micrositio Publicado',
      message: `Tu micrositio "${microsite.name}" está ahora en línea!`,
      actionUrl: microsite.getPublicUrl(),
      channels: { inApp: true, email: true, sms: false, push: true }
    });

    return microsite;
  }

  async unpublishMicrosite(micrositeId: number, ownerId: number) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    await microsite.update({
      status: 'draft',
      isPublic: false
    });

    return microsite;
  }

  async getPublicMicrosite(identifier: string) {
    // identifier can be slug or subdomain
    const microsite = await Microsite.findOne({
      where: {
        [Op.or]: [
          { slug: identifier },
          { subdomain: identifier }
        ],
        status: 'published',
        isPublic: true
      }
    });

    if (!microsite) {
      throw new Error('Microsite not found');
    }

    // Track page view
    await this.trackPageView(microsite.id, 'home');

    return microsite;
  }

  async uploadMedia(micrositeId: number, ownerId: number, file: any): Promise<MediaLibrary> {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('File type not allowed');
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large (max 10MB)');
    }

    // Upload to storage
    const uploadResult = await this.uploadToStorage(file);

    // Create media record
    const media = await MediaLibrary.create({
      micrositeId,
      userId: ownerId,
      filename: uploadResult.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      dimensions: uploadResult.dimensions,
      storageProvider: 'local',
      storageKey: uploadResult.key,
      url: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      alt: file.originalname.split('.')[0],
      category: this.getCategoryFromMimeType(file.mimetype),
      tags: [],
      usageCount: 0
    });

    return media;
  }

  async getMediaLibrary(micrositeId: number, ownerId: number) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    return await MediaLibrary.findAll({
      where: { micrositeId },
      order: [['createdAt', 'DESC']]
    });
  }

  async getAnalytics(micrositeId: number, ownerId: number, dateRange: { startDate: Date; endDate: Date }) {
    const microsite = await Microsite.findOne({
      where: { id: micrositeId, ownerId }
    });

    if (!microsite) {
      throw new Error('Microsite not found or access denied');
    }

    const analytics = await MicrositeAnalytics.findAll({
      where: {
        micrositeId,
        date: {
          [Op.between]: [dateRange.startDate, dateRange.endDate]
        }
      },
      order: [['date', 'ASC']]
    });

    // Aggregate data
    const aggregated = analytics.reduce((acc, day) => {
      acc.totalPageViews += day.pageViews;
      acc.totalUniqueVisitors += day.uniqueVisitors;
      acc.totalSessions += day.sessions;
      acc.totalFormSubmissions += day.formSubmissions;
      
      // Merge traffic sources
      day.trafficSources.forEach(source => {
        const existing = acc.trafficSources.find((s: any) => s.source === source.source);
        if (existing) {
          existing.sessions += source.sessions;
        } else {
          acc.trafficSources.push({ ...source });
        }
      });

      return acc;
    }, {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      totalSessions: 0,
      totalFormSubmissions: 0,
      trafficSources: [] as any[],
      dailyData: analytics
    });

    // Calculate percentages for traffic sources
    aggregated.trafficSources.forEach((source: any) => {
      source.percentage = aggregated.totalSessions > 0 
        ? (source.sessions / aggregated.totalSessions) * 100 
        : 0;
    });

    return aggregated;
  }

  async getTemplates(category?: string) {
    const where: any = { isActive: true };
    if (category) {
      where[Op.or] = [
        { category },
        { category: 'general' }
      ];
    }

    return await MicrositeTemplate.findAll({
      where,
      order: [['isPremium', 'ASC'], ['name', 'ASC']]
    });
  }

  private async validateMicrosite(microsite: Microsite): Promise<{ isValid: boolean; errors: string[] }> {
    const errors = [];

    // Check if at least one page is published
    const publishedPages = microsite.pages.filter(page => page.isPublished);
    if (publishedPages.length === 0) {
      errors.push('At least one page must be published');
    }

    // Check if home page exists and is published
    const homePage = microsite.pages.find(page => page.slug === '/' || page.slug === 'home' || page.slug === '');
    if (!homePage || !homePage.isPublished) {
      errors.push('Home page must be published');
    }

    // Check if contact information is provided
    if (!microsite.contactInfo.email && !microsite.contactInfo.phone) {
      errors.push('Contact email or phone must be provided');
    }

    // Check SEO information
    if (!microsite.seo.title || !microsite.seo.description) {
      errors.push('SEO title and description must be provided');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async generateSitemap(microsite: Microsite): Promise<void> {
    const baseUrl = microsite.getPublicUrl();

    const urls = microsite.pages
      .filter(page => page.isPublished)
      .map(page => ({
        url: `${baseUrl}${page.slug}`,
        lastmod: microsite.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: page.slug === '/' || page.slug === '' ? '1.0' : '0.8'
      }));

    // Generate XML sitemap
    const sitemap = this.generateSitemapXML(urls);
    
    // Save sitemap to storage
    await this.saveSitemap(microsite.id, sitemap);
  }

  private generateSitemapXML(urls: any[]): string {
    const urlsXml = urls.map(url => `
      <url>
        <loc>${url.url}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
      </url>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlsXml}
    </urlset>`;
  }

  private async trackPageView(micrositeId: number, pageSlug: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await MicrositeAnalytics.findOne({
      where: { micrositeId, date: today }
    });

    if (!analytics) {
      analytics = await MicrositeAnalytics.create({
        micrositeId,
        date: today,
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
    }

    // Update page views
    await analytics.increment('pageViews');
    
    // Update page-specific metrics
    const pageMetrics = [...analytics.pageMetrics];
    const pageMetricIndex = pageMetrics.findIndex(pm => pm.slug === pageSlug);
    
    if (pageMetricIndex >= 0) {
      pageMetrics[pageMetricIndex].views++;
    } else {
      pageMetrics.push({
        pageId: this.generateId(),
        slug: pageSlug,
        views: 1,
        uniqueViews: 1,
        avgTimeOnPage: 0,
        bounceRate: 0
      });
    }

    await analytics.update({ pageMetrics });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getCategoryFromMimeType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  private async uploadToStorage(file: any): Promise<any> {
    // Simple local storage implementation
    // In production, this would upload to AWS S3, Cloudinary, etc.
    const filename = `${Date.now()}-${file.originalname}`;
    const key = `microsites/${filename}`;
    const url = `/uploads/${filename}`;
    
    return {
      filename,
      key,
      url,
      thumbnailUrl: file.mimetype.startsWith('image/') ? `/uploads/thumbs/${filename}` : undefined,
      dimensions: file.mimetype.startsWith('image/') ? { width: 1920, height: 1080 } : undefined
    };
  }

  private async saveSitemap(micrositeId: number, sitemap: string): Promise<void> {
    // Save sitemap to storage and/or database
    console.log(`Saving sitemap for microsite ${micrositeId}`);
  }

  private async checkUserSubscription(userId: number): Promise<any> {
    // Check user's subscription for premium features
    const subscription = await Subscription.findOne({
      where: { userId, status: 'active' }
    });

    return subscription;
  }
}

export default new MicrositeBuilderService();