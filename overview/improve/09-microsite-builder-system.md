# 09. Microsite Builder System - Complete Implementation Guide

## Problem Analysis
The current project lacks a microsite builder system that would allow clubs and state committees to create custom websites to showcase their facilities, programs, and community presence within the Mexican Pickleball Federation platform.

## Core Requirements
1. **Drag-and-Drop Builder**: Visual website builder with pre-designed components
2. **Template Library**: Professional templates for clubs and state committees
3. **Custom Branding**: Logo uploads, color schemes, and custom domains
4. **Content Management**: Easy text/image editing with media library
5. **Event Integration**: Automatic tournament and event listings
6. **Contact Forms**: Lead generation and member inquiry forms
7. **SEO Optimization**: Meta tags, sitemaps, and search engine optimization
8. **Mobile Responsiveness**: Automatic mobile-friendly design
9. **Analytics Dashboard**: Traffic and engagement metrics
10. **Domain Management**: Custom domain connection and SSL certificates

## Step-by-Step Implementation Plan

### Phase 1: Database Schema Design

#### 1.1 Create Microsite Model (`backend/src/models/Microsite.ts`)
```typescript
interface Microsite extends Model {
  id: string;
  ownerId: string; // Club or state committee user ID
  ownerType: 'club' | 'state_committee';
  
  // Basic Info
  name: string;
  slug: string; // URL slug (e.g., 'jalisco-pickleball')
  description: string;
  
  // Branding
  logo?: string;
  favicon?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  // Domain Settings
  customDomain?: string;
  subdomain: string; // e.g., 'jalisco' for jalisco.pickleballmx.com
  sslEnabled: boolean;
  
  // Template
  templateId: string;
  templateVersion: string;
  
  // Content Structure
  pages: {
    id: string;
    name: string;
    slug: string;
    title: string;
    metaDescription: string;
    components: MicrositeComponent[];
    isPublished: boolean;
    sortOrder: number;
  }[];
  
  // Navigation
  navigation: {
    type: 'header' | 'footer';
    items: {
      label: string;
      url: string;
      pageId?: string;
      isExternal: boolean;
      openInNewTab: boolean;
    }[];
  }[];
  
  // SEO Settings
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterCard?: string;
    customMeta?: { name: string; content: string }[];
  };
  
  // Analytics
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  publishedAt?: Date;
  
  // Features
  features: {
    contactForm: boolean;
    eventCalendar: boolean;
    memberDirectory: boolean;
    photoGallery: boolean;
    newsUpdates: boolean;
    socialMedia: boolean;
  };
  
  // Contact Info
  contactInfo: {
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      coordinates?: { lat: number; lng: number };
    };
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

interface MicrositeComponent {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'contact_form' | 'event_list' | 'member_showcase' | 'stats' | 'testimonials' | 'map';
  position: number;
  settings: Record<string, any>;
  content: Record<string, any>;
  styling: {
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    shadow?: boolean;
  };
}

Microsite.belongsTo(User, { as: 'owner' });
Microsite.belongsTo(MicrositeTemplate, { as: 'template' });
Microsite.hasMany(MicrositeAnalytics, { as: 'analytics' });
```

#### 1.2 Create Microsite Template Model (`backend/src/models/MicrositeTemplate.ts`)
```typescript
interface MicrositeTemplate extends Model {
  id: string;
  name: string;
  description: string;
  category: 'club' | 'state_committee' | 'general';
  
  // Preview
  thumbnailUrl: string;
  previewUrl: string;
  
  // Template Structure
  structure: {
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    
    // Default pages
    pages: {
      name: string;
      slug: string;
      title: string;
      components: MicrositeComponent[];
    }[];
    
    // Available components for this template
    availableComponents: {
      type: string;
      name: string;
      description: string;
      icon: string;
      defaultSettings: Record<string, any>;
      defaultContent: Record<string, any>;
    }[];
  };
  
  // Features
  features: string[]; // List of features this template supports
  
  // Pricing
  isPremium: boolean;
  requiredPlan?: string; // Subscription plan required
  
  // Status
  isActive: boolean;
  version: string;
  
  createdAt: Date;
  updatedAt: Date;
}

MicrositeTemplate.hasMany(Microsite);
```

#### 1.3 Create Microsite Analytics Model (`backend/src/models/MicrositeAnalytics.ts`)
```typescript
interface MicrositeAnalytics extends Model {
  id: string;
  micrositeId: string;
  
  // Date tracking
  date: Date; // Daily aggregated data
  
  // Traffic metrics
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number; // in seconds
  
  // Page-specific metrics
  pageMetrics: {
    pageId: string;
    slug: string;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }[];
  
  // Traffic sources
  trafficSources: {
    source: string; // 'direct', 'search', 'social', 'referral'
    sessions: number;
    percentage: number;
  }[];
  
  // Device/browser info
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  
  browserStats: {
    browser: string;
    sessions: number;
  }[];
  
  // Geographic data
  countryStats: {
    country: string;
    sessions: number;
  }[];
  
  // Engagement metrics
  formSubmissions: number;
  downloadClicks: number;
  socialClicks: number;
  externalLinkClicks: number;
  
  createdAt: Date;
  updatedAt: Date;
}

MicrositeAnalytics.belongsTo(Microsite);
```

#### 1.4 Create Media Library Model (`backend/src/models/MediaLibrary.ts`)
```typescript
interface MediaLibrary extends Model {
  id: string;
  micrositeId: string;
  userId: string;
  
  // File info
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // in bytes
  dimensions?: {
    width: number;
    height: number;
  };
  
  // Storage
  storageProvider: 'local' | 'aws_s3' | 'cloudinary';
  storageKey: string;
  url: string;
  thumbnailUrl?: string;
  
  // Metadata
  alt: string;
  caption?: string;
  tags: string[];
  
  // Organization
  folder?: string;
  category: 'image' | 'video' | 'document' | 'audio';
  
  // Usage tracking
  usageCount: number;
  lastUsedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

MediaLibrary.belongsTo(Microsite);
MediaLibrary.belongsTo(User, { as: 'uploader' });
```

### Phase 2: Microsite Services

#### 2.1 Microsite Service (`backend/src/services/micrositeService.ts`)
```typescript
class MicrositeService {
  async createMicrosite(ownerId: string, micrositeData: CreateMicrositeRequest) {
    const { templateId, name, slug, subdomain } = micrositeData;
    
    // Verify owner permissions
    const owner = await User.findByPk(ownerId);
    if (!['club', 'state_committee', 'admin'].includes(owner.role)) {
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
            { label: 'Home', url: '/', pageId: null, isExternal: false, openInNewTab: false },
            { label: 'About', url: '/about', pageId: null, isExternal: false, openInNewTab: false },
            { label: 'Contact', url: '/contact', pageId: null, isExternal: false, openInNewTab: false }
          ]
        }
      ],
      seo: {
        title: name,
        description: micrositeData.description || `Official website of ${name}`,
        keywords: ['pickleball', 'club', 'sports', 'community'],
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

  async updateMicrosite(micrositeId: string, ownerId: string, updateData: UpdateMicrositeRequest) {
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

  async addPage(micrositeId: string, ownerId: string, pageData: AddPageRequest) {
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

  async updatePage(micrositeId: string, ownerId: string, pageId: string, pageData: UpdatePageRequest) {
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

  async publishMicrosite(micrositeId: string, ownerId: string) {
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
    await notificationService.createNotification(ownerId, {
      type: 'system',
      category: 'success',
      title: 'Microsite Published',
      message: `Your microsite "${microsite.name}" is now live!`,
      actionUrl: `https://${microsite.subdomain}.pickleballmx.com`,
      channels: { inApp: true, email: true, sms: false, push: true }
    });

    return microsite;
  }

  async getPublicMicrosite(identifier: string): Promise<any> {
    // identifier can be slug or subdomain
    const microsite = await Microsite.findOne({
      where: {
        [Op.or]: [
          { slug: identifier },
          { subdomain: identifier }
        ],
        status: 'published',
        isPublic: true
      },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username', 'email'] }
      ]
    });

    if (!microsite) {
      throw new Error('Microsite not found');
    }

    // Track page view
    await this.trackPageView(microsite.id, 'home');

    return microsite;
  }

  async uploadMedia(micrositeId: string, ownerId: string, file: any): Promise<MediaLibrary> {
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
      storageProvider: 'aws_s3',
      storageKey: uploadResult.key,
      url: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
      alt: file.originalname.split('.')[0],
      category: this.getCategoryFromMimeType(file.mimetype),
      usageCount: 0
    });

    return media;
  }

  async getAnalytics(micrositeId: string, ownerId: string, dateRange: { startDate: Date; endDate: Date }) {
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
        const existing = acc.trafficSources.find(s => s.source === source.source);
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
      trafficSources: [],
      dailyData: analytics
    });

    // Calculate percentages for traffic sources
    aggregated.trafficSources.forEach(source => {
      source.percentage = (source.sessions / aggregated.totalSessions) * 100;
    });

    return aggregated;
  }

  private async validateMicrosite(microsite: Microsite): Promise<{ isValid: boolean; errors: string[] }> {
    const errors = [];

    // Check if at least one page is published
    const publishedPages = microsite.pages.filter(page => page.isPublished);
    if (publishedPages.length === 0) {
      errors.push('At least one page must be published');
    }

    // Check if home page exists and is published
    const homePage = microsite.pages.find(page => page.slug === '/' || page.slug === 'home');
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
    const baseUrl = microsite.customDomain 
      ? `https://${microsite.customDomain}`
      : `https://${microsite.subdomain}.pickleballmx.com`;

    const urls = microsite.pages
      .filter(page => page.isPublished)
      .map(page => ({
        url: `${baseUrl}${page.slug}`,
        lastmod: microsite.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: page.slug === '/' ? '1.0' : '0.8'
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

  private async trackPageView(micrositeId: string, pageSlug: string): Promise<void> {
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
    // Implement storage upload logic (AWS S3, Cloudinary, etc.)
    // Return upload result with URL, key, dimensions, etc.
    return {
      filename: `${Date.now()}-${file.originalname}`,
      key: `microsites/${Date.now()}-${file.originalname}`,
      url: `https://storage.example.com/${Date.now()}-${file.originalname}`,
      thumbnailUrl: `https://storage.example.com/thumbs/${Date.now()}-${file.originalname}`,
      dimensions: file.mimetype.startsWith('image/') ? { width: 1920, height: 1080 } : undefined
    };
  }

  private async saveSitemap(micrositeId: string, sitemap: string): Promise<void> {
    // Save sitemap to storage and/or database
    console.log(`Saving sitemap for microsite ${micrositeId}`);
  }

  private async checkUserSubscription(userId: string): Promise<any> {
    // Check user's subscription for premium features
    const subscription = await Subscription.findOne({
      where: { userId, status: 'active' },
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });

    return subscription?.plan;
  }
}

export default new MicrositeService();
```

### Phase 3: Frontend Microsite Builder

#### 3.1 Microsite Builder Interface (`frontend/src/components/microsites/MicrositeBuilder.tsx`)
```typescript
interface MicrositeBuilderProps {
  micrositeId: string;
}

const MicrositeBuilder: React.FC<MicrositeBuilderProps> = ({ micrositeId }) => {
  const [microsite, setMicrosite] = useState<Microsite | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMicrosite();
  }, [micrositeId]);

  const loadMicrosite = async () => {
    try {
      const response = await api.get(`/microsites/${micrositeId}`);
      setMicrosite(response.data.data);
      if (response.data.data.pages.length > 0) {
        setCurrentPage(response.data.data.pages[0].id);
      }
    } catch (error) {
      console.error('Error loading microsite:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPage = () => {
    return microsite?.pages.find(page => page.id === currentPage);
  };

  const updatePageComponent = async (componentId: string, updates: Partial<MicrositeComponent>) => {
    const page = getCurrentPage();
    if (!page || !microsite) return;

    const updatedComponents = page.components.map(comp =>
      comp.id === componentId ? { ...comp, ...updates } : comp
    );

    try {
      await api.put(`/microsites/${micrositeId}/pages/${currentPage}`, {
        components: updatedComponents
      });

      // Update local state
      const updatedPages = microsite.pages.map(p =>
        p.id === currentPage ? { ...p, components: updatedComponents } : p
      );

      setMicrosite({ ...microsite, pages: updatedPages });
    } catch (error) {
      console.error('Error updating component:', error);
    }
  };

  const addComponent = async (componentType: string, position: number) => {
    const page = getCurrentPage();
    if (!page || !microsite) return;

    const newComponent: MicrositeComponent = {
      id: generateId(),
      type: componentType,
      position,
      settings: getDefaultSettings(componentType),
      content: getDefaultContent(componentType),
      styling: {}
    };

    const updatedComponents = [...page.components];
    updatedComponents.splice(position, 0, newComponent);

    // Reorder positions
    updatedComponents.forEach((comp, index) => {
      comp.position = index;
    });

    try {
      await api.put(`/microsites/${micrositeId}/pages/${currentPage}`, {
        components: updatedComponents
      });

      // Update local state
      const updatedPages = microsite.pages.map(p =>
        p.id === currentPage ? { ...p, components: updatedComponents } : p
      );

      setMicrosite({ ...microsite, pages: updatedPages });
      setSelectedComponent(newComponent.id);
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const deleteComponent = async (componentId: string) => {
    const page = getCurrentPage();
    if (!page || !microsite) return;

    const updatedComponents = page.components
      .filter(comp => comp.id !== componentId)
      .map((comp, index) => ({ ...comp, position: index }));

    try {
      await api.put(`/microsites/${micrositeId}/pages/${currentPage}`, {
        components: updatedComponents
      });

      const updatedPages = microsite.pages.map(p =>
        p.id === currentPage ? { ...p, components: updatedComponents } : p
      );

      setMicrosite({ ...microsite, pages: updatedPages });
      setSelectedComponent(null);
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  const reorderComponents = async (sourceIndex: number, destinationIndex: number) => {
    const page = getCurrentPage();
    if (!page || !microsite) return;

    const updatedComponents = [...page.components];
    const [removed] = updatedComponents.splice(sourceIndex, 1);
    updatedComponents.splice(destinationIndex, 0, removed);

    // Update positions
    updatedComponents.forEach((comp, index) => {
      comp.position = index;
    });

    try {
      await api.put(`/microsites/${micrositeId}/pages/${currentPage}`, {
        components: updatedComponents
      });

      const updatedPages = microsite.pages.map(p =>
        p.id === currentPage ? { ...p, components: updatedComponents } : p
      );

      setMicrosite({ ...microsite, pages: updatedPages });
    } catch (error) {
      console.error('Error reordering components:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const page = getCurrentPage();

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">{microsite?.name}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1 text-sm rounded ${
                  previewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setShowComponentLibrary(!showComponentLibrary)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Page selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Page
            </label>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {microsite?.pages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Page Components
          </h3>
          <div className="space-y-2">
            {page?.components.map((component, index) => (
              <ComponentListItem
                key={component.id}
                component={component}
                isSelected={selectedComponent === component.id}
                onSelect={() => setSelectedComponent(component.id)}
                onDelete={() => deleteComponent(component.id)}
                onMoveUp={index > 0 ? () => reorderComponents(index, index - 1) : undefined}
                onMoveDown={index < page.components.length - 1 ? () => reorderComponents(index, index + 1) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedComponent && (
          <ComponentPropertiesPanel
            component={page?.components.find(c => c.id === selectedComponent)!}
            onUpdate={(updates) => updatePageComponent(selectedComponent, updates)}
          />
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {page?.name} ({page?.components.length || 0} components)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(`/microsites/${microsite?.slug}/preview`, '_blank')}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              External Preview
            </button>
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="max-w-6xl mx-auto bg-white shadow-lg min-h-full">
            <DragDropCanvas
              components={page?.components || []}
              selectedComponent={selectedComponent}
              previewMode={previewMode}
              colorScheme={microsite?.colorScheme}
              onComponentSelect={setSelectedComponent}
              onComponentUpdate={updatePageComponent}
              onAddComponent={addComponent}
              onReorderComponents={reorderComponents}
            />
          </div>
        </div>
      </div>

      {/* Component Library Modal */}
      {showComponentLibrary && (
        <ComponentLibrary
          onClose={() => setShowComponentLibrary(false)}
          onAddComponent={(type) => {
            addComponent(type, page?.components.length || 0);
            setShowComponentLibrary(false);
          }}
        />
      )}
    </div>
  );
};

const ComponentListItem: React.FC<{
  component: MicrositeComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}> = ({ component, isSelected, onSelect, onDelete, onMoveUp, onMoveDown }) => {
  const getComponentIcon = (type: string) => {
    const icons: Record<string, string> = {
      hero: '🎯',
      text: '📝',
      image: '🖼️',
      gallery: '🖼️',
      contact_form: '📧',
      event_list: '📅',
      member_showcase: '👥',
      stats: '📊',
      testimonials: '💬',
      map: '🗺️'
    };
    return icons[type] || '🧩';
  };

  const getComponentName = (type: string) => {
    const names: Record<string, string> = {
      hero: 'Hero Section',
      text: 'Text Block',
      image: 'Image',
      gallery: 'Image Gallery',
      contact_form: 'Contact Form',
      event_list: 'Event List',
      member_showcase: 'Member Showcase',
      stats: 'Statistics',
      testimonials: 'Testimonials',
      map: 'Map'
    };
    return names[type] || type;
  };

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getComponentIcon(component.type)}</span>
          <span className="text-sm font-medium">{getComponentName(component.type)}</span>
        </div>
        <div className="flex items-center space-x-1">
          {onMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              ↓
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-400 hover:text-red-600 text-xs"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### 3.2 Component Properties Panel (`frontend/src/components/microsites/ComponentPropertiesPanel.tsx`)
```typescript
const ComponentPropertiesPanel: React.FC<{
  component: MicrositeComponent;
  onUpdate: (updates: Partial<MicrositeComponent>) => void;
}> = ({ component, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');

  const updateContent = (key: string, value: any) => {
    onUpdate({
      content: { ...component.content, [key]: value }
    });
  };

  const updateSettings = (key: string, value: any) => {
    onUpdate({
      settings: { ...component.settings, [key]: value }
    });
  };

  const updateStyling = (key: string, value: any) => {
    onUpdate({
      styling: { ...component.styling, [key]: value }
    });
  };

  const renderContentEditor = () => {
    switch (component.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input
                type="text"
                value={component.content.headline || ''}
                onChange={(e) => updateContent('headline', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter headline..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={component.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter subtitle..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input type="file" accept="image/*" className="hidden" />
                <button className="text-blue-600 hover:text-blue-800">
                  Upload Image
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Call-to-Action Button</label>
              <input
                type="text"
                value={component.content.ctaText || ''}
                onChange={(e) => updateContent('ctaText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Button text..."
              />
              <input
                type="text"
                value={component.content.ctaLink || ''}
                onChange={(e) => updateContent('ctaLink', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Button link..."
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Heading</label>
              <input
                type="text"
                value={component.content.heading || ''}
                onChange={(e) => updateContent('heading', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter heading..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={component.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-32"
                placeholder="Enter your text content..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Alignment</label>
              <select
                value={component.settings.textAlign || 'left'}
                onChange={(e) => updateSettings('textAlign', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        );

      case 'contact_form':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Form Title</label>
              <input
                type="text"
                value={component.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Contact Us"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={component.content.description || ''}
                onChange={(e) => updateContent('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-24"
                placeholder="Form description..."
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={component.settings.includePhone || false}
                  onChange={(e) => updateSettings('includePhone', e.target.checked)}
                />
                <span className="text-sm">Include phone field</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={component.settings.includeSubject || false}
                  onChange={(e) => updateSettings('includeSubject', e.target.checked)}
                />
                <span className="text-sm">Include subject field</span>
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>No content options available for this component</p>
          </div>
        );
    }
  };

  const renderStyleEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Margin</label>
        <select
          value={component.styling.margin || 'default'}
          onChange={(e) => updateStyling('margin', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="none">None</option>
          <option value="small">Small</option>
          <option value="default">Default</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <select
          value={component.styling.padding || 'default'}
          onChange={(e) => updateStyling('padding', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="none">None</option>
          <option value="small">Small</option>
          <option value="default">Default</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={component.styling.backgroundColor || '#ffffff'}
          onChange={(e) => updateStyling('backgroundColor', e.target.value)}
          className="w-full p-1 border border-gray-300 rounded h-10"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          type="color"
          value={component.styling.textColor || '#000000'}
          onChange={(e) => updateStyling('textColor', e.target.value)}
          className="w-full p-1 border border-gray-300 rounded h-10"
        />
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={component.styling.shadow || false}
            onChange={(e) => updateStyling('shadow', e.target.checked)}
          />
          <span className="text-sm">Add shadow</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Border Radius</label>
        <select
          value={component.styling.borderRadius || 'none'}
          onChange={(e) => updateStyling('borderRadius', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="none">None</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="full">Full</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Component Properties
        </h3>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === 'content'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === 'style'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Style
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'content' ? renderContentEditor() : renderStyleEditor()}
      </div>
    </div>
  );
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const getDefaultSettings = (componentType: string): Record<string, any> => {
  const defaults: Record<string, Record<string, any>> = {
    hero: { height: 'medium', overlay: true, overlayOpacity: 0.5 },
    text: { textAlign: 'left', fontSize: 'medium' },
    image: { alignment: 'center', size: 'medium' },
    contact_form: { includePhone: false, includeSubject: true },
    gallery: { columns: 3, showCaptions: true },
    event_list: { limit: 10, showPastEvents: false },
    member_showcase: { showRole: true, columns: 4 },
    stats: { columns: 3, animateOnScroll: true },
    testimonials: { autoRotate: false, showAuthor: true },
    map: { zoom: 15, showMarker: true }
  };

  return defaults[componentType] || {};
};

const getDefaultContent = (componentType: string): Record<string, any> => {
  const defaults: Record<string, Record<string, any>> = {
    hero: {
      headline: 'Welcome to Our Club',
      subtitle: 'Join the best pickleball community in your area',
      ctaText: 'Learn More',
      ctaLink: '#about'
    },
    text: {
      heading: 'About Us',
      text: 'Enter your content here...'
    },
    contact_form: {
      title: 'Contact Us',
      description: 'Get in touch with us for more information'
    },
    gallery: {
      title: 'Photo Gallery',
      images: []
    },
    event_list: {
      title: 'Upcoming Events'
    },
    member_showcase: {
      title: 'Meet Our Team'
    },
    stats: {
      title: 'Our Numbers',
      stats: [
        { value: '500+', label: 'Members' },
        { value: '50+', label: 'Events' },
        { value: '10', label: 'Courts' }
      ]
    },
    testimonials: {
      title: 'What Our Members Say',
      testimonials: []
    }
  };

  return defaults[componentType] || {};
};
```

### Phase 4: Testing & Quality Assurance

#### 4.1 Microsite System Tests
```typescript
// backend/tests/microsites.test.ts
describe('Microsite System', () => {
  describe('Microsite Creation', () => {
    it('should create microsite from template', async () => {
      const micrositeData = {
        templateId: 'template-id',
        name: 'Test Club',
        slug: 'test-club',
        subdomain: 'test-club',
        description: 'A test club website'
      };

      const response = await request(app)
        .post('/api/microsites')
        .set('Authorization', `Bearer ${clubToken}`)
        .send(micrositeData)
        .expect(201);

      expect(response.body.data.name).toBe('Test Club');
      expect(response.body.data.slug).toBe('test-club');
    });

    it('should prevent duplicate slugs', async () => {
      const micrositeData = {
        templateId: 'template-id',
        name: 'Test Club 2',
        slug: 'test-club', // Same as above
        subdomain: 'test-club-2'
      };

      await request(app)
        .post('/api/microsites')
        .set('Authorization', `Bearer ${clubToken}`)
        .send(micrositeData)
        .expect(400);
    });
  });

  describe('Page Management', () => {
    it('should add page to microsite', async () => {
      const pageData = {
        name: 'About Us',
        slug: 'about',
        title: 'About Our Club'
      };

      const response = await request(app)
        .post(`/api/microsites/${micrositeId}/pages`)
        .set('Authorization', `Bearer ${clubToken}`)
        .send(pageData)
        .expect(201);

      expect(response.body.data.name).toBe('About Us');
    });

    it('should update page components', async () => {
      const updateData = {
        components: [
          {
            id: 'comp-1',
            type: 'text',
            position: 0,
            content: { heading: 'Updated Heading' }
          }
        ]
      };

      await request(app)
        .put(`/api/microsites/${micrositeId}/pages/${pageId}`)
        .set('Authorization', `Bearer ${clubToken}`)
        .send(updateData)
        .expect(200);
    });
  });

  describe('Publishing', () => {
    it('should publish microsite after validation', async () => {
      const response = await request(app)
        .post(`/api/microsites/${micrositeId}/publish`)
        .set('Authorization', `Bearer ${clubToken}`)
        .expect(200);

      expect(response.body.data.status).toBe('published');
    });
  });
});
```

## Implementation Priority
1. **CRITICAL**: Database schema and models (Phase 1)
2. **CRITICAL**: Microsite service layer (Phase 2)
3. **HIGH**: Frontend builder interface (Phase 3)
4. **HIGH**: Component library and templates
5. **MEDIUM**: Analytics and reporting features
6. **MEDIUM**: SEO and domain management
7. **LOW**: Comprehensive testing (Phase 4)

## Expected Results
After implementation:
- Complete drag-and-drop microsite builder
- Professional templates for clubs and state committees
- Custom branding and domain management
- Mobile-responsive design generation
- SEO optimization and analytics tracking
- Media library and content management
- Integration with admin events and tournaments
- SSL certificates and custom domain support

## Files to Create/Modify
- `backend/src/models/Microsite.ts`
- `backend/src/models/MicrositeTemplate.ts`
- `backend/src/models/MicrositeAnalytics.ts`
- `backend/src/models/MediaLibrary.ts`
- `backend/src/services/micrositeService.ts`
- `backend/src/controllers/micrositeController.ts`
- `backend/src/routes/micrositeRoutes.ts`
- `frontend/src/components/microsites/MicrositeBuilder.tsx`
- `frontend/src/components/microsites/ComponentPropertiesPanel.tsx`
- `frontend/src/components/microsites/DragDropCanvas.tsx`
- `frontend/src/components/microsites/ComponentLibrary.tsx`
- `frontend/src/pages/MicrositeBuilderPage.tsx`
- `frontend/src/store/micrositeSlice.ts`