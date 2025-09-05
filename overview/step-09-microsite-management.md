# Step 9: Microsite Management System

## Overview
This step implements a comprehensive microsite management system that allows clubs, partners, and state committees to create and manage their own public websites within the admin platform. Each organization gets a customizable microsite with their own subdomain, content management capabilities, and integration with booking/tournament systems.
Don't use any mockup data for frontend.
Do use only database data from backend.
Before rendering a page, all required data for the page should be prepared from backend through API endpoint to store on Redux.
For each page, you must accurately determine whether the functionalities of all dynamic elements, including buttons, are correctly integrated with the backend and accurately reflected in Redux to ensure real-time updates.
There are already data seeded to test in database .
You need to test with only this database seeded data from backend.
Don't use any mockup, simulation or random data for frontend.

## Objectives
- Create customizable microsites for clubs, partners, and state committees
- Build drag-and-drop content management system
- Implement custom subdomain system (e.g., club-name.pickleballfed.mx)
- Add court booking integration for club/partner microsites
- Build tournament registration integration
- Create SEO optimization tools
- Implement theme customization and branding
- Add content moderation for admin oversight

## Microsite Features by Organization Type

### Club Microsites
- **Public Information**: Club details, location, contact info
- **Court Display**: Available courts with photos and amenities
- **Court Booking**: Direct reservation system integration
- **Tournament Section**: Club tournaments and registration
- **Member Showcase**: Featured players and achievements
- **News/Events**: Club announcements and calendar
- **Photo Gallery**: Club photos and event images

### Partner Microsites (Hotels, Businesses)
- **Business Information**: Company details, services, amenities
- **Court Facilities**: Available courts and pricing
- **Booking Integration**: Direct court reservation system
- **Tournament Hosting**: Partner-organized tournaments
- **Packages/Offers**: Special deals and packages
- **Contact/Location**: Contact information and directions
- **Reviews**: Customer testimonials and ratings

### State Committee Microsites
- **Regional Information**: State pickleball information and governance
- **Affiliated Organizations**: List of clubs and partners in state
- **State Tournaments**: State-level tournaments and championships
- **Player Statistics**: State player counts and rankings
- **News/Announcements**: Official state communications
- **Resources**: Rules, documents, and educational materials

## Backend Development Tasks

### 1. Microsite Core System
**Files to Create:**
- `src/controllers/micrositeController.ts` - Microsite CRUD operations
- `src/services/micrositeService.ts` - Microsite business logic
- `src/services/contentService.ts` - Content management
- `src/services/themeService.ts` - Theme and customization
- `src/middleware/subdomainHandler.ts` - Subdomain routing

**Microsite Methods:**
```typescript
// Microsite Management
createMicrosite(ownerId: number, ownerType: string, micrositeData: MicrositeData): Promise<Microsite>
updateMicrosite(micrositeId: number, updates: Partial<MicrositeData>): Promise<Microsite>
deleteMicrosite(micrositeId: number): Promise<void>
getMicrosite(subdomain: string): Promise<Microsite>
getMicrositesByOwner(ownerId: number, ownerType: string): Promise<Microsite[]>

// Content Management
createPage(micrositeId: number, pageData: PageData): Promise<MicrositePage>
updatePage(pageId: number, updates: Partial<PageData>): Promise<MicrositePage>
deletePage(pageId: number): Promise<void>
publishPage(pageId: number): Promise<void>
unpublishPage(pageId: number): Promise<void>
```

### 2. Content Management System
**Files to Create:**
- `src/services/cmsService.ts` - Content management system
- `src/services/mediaService.ts` - Media file management

**CMS Methods:**
```typescript
// Content Blocks
createContentBlock(pageId: number, blockData: ContentBlockData): Promise<ContentBlock>
updateContentBlock(blockId: number, updates: Partial<ContentBlockData>): Promise<ContentBlock>
reorderContentBlocks(pageId: number, blockOrder: number[]): Promise<void>
deleteContentBlock(blockId: number): Promise<void>

// Media Management
uploadMicrositeMedia(micrositeId: number, file: Express.Multer.File): Promise<MediaFile>
deleteMicrositeMedia(mediaId: number): Promise<void>
getMicrositeMedia(micrositeId: number): Promise<MediaFile[]>
optimizeImages(mediaFiles: MediaFile[]): Promise<void>
```

### 3. Theme and Customization System
**Files to Create:**
- `src/services/themeService.ts` - Theme management
- `src/utils/cssGenerator.ts` - Dynamic CSS generation
- `src/templates/micrositeTemplates.ts` - Microsite templates

**Theme Methods:**
```typescript
// Theme Management
getAvailableThemes(): Promise<Theme[]>
applyTheme(micrositeId: number, themeId: number): Promise<void>
createCustomTheme(micrositeId: number, themeData: ThemeData): Promise<Theme>
updateThemeSettings(micrositeId: number, settings: ThemeSettings): Promise<void>
generateCustomCSS(themeSettings: ThemeSettings): string
```

### 4. Integration Services
**Files to Create:**
- `src/services/integrationService.ts` - External system integration
- `src/services/bookingIntegrationService.ts` - Court booking integration
- `src/services/tournamentIntegrationService.ts` - Tournament integration

**Integration Methods:**
```typescript
// System Integrations
integrateCourtBooking(micrositeId: number): Promise<void>
integrateTournamentRegistration(micrositeId: number): Promise<void>
syncMicrositeData(micrositeId: number): Promise<void>
updateIntegratedContent(micrositeId: number, dataType: string): Promise<void>
```

### 5. SEO and Analytics
**Files to Create:**
- `src/services/seoService.ts` - SEO optimization
- `src/services/analyticsService.ts` - Microsite analytics

**SEO Methods:**
```typescript
// SEO Management
generateSitemap(micrositeId: number): Promise<string>
updateMetaTags(pageId: number, metaData: MetaData): Promise<void>
analyzePageSEO(pageId: number): Promise<SEOAnalysis>
generateStructuredData(micrositeId: number): Promise<string>
```

### 6. API Endpoints
```
Microsite Management:
POST /api/microsites - Create microsite
GET /api/microsites/:subdomain - Get microsite by subdomain  
PUT /api/microsites/:id - Update microsite
DELETE /api/microsites/:id - Delete microsite
GET /api/microsites/owner/:id - Get microsites by owner

Content Management:
POST /api/microsites/:id/pages - Create page
GET /api/microsites/:id/pages - Get pages
PUT /api/pages/:id - Update page
DELETE /api/pages/:id - Delete page
POST /api/pages/:id/publish - Publish page

Content Blocks:
POST /api/pages/:id/blocks - Create content block
PUT /api/blocks/:id - Update content block
DELETE /api/blocks/:id - Delete content block
POST /api/blocks/reorder - Reorder blocks

Media Management:
POST /api/microsites/:id/media - Upload media
GET /api/microsites/:id/media - Get media files
DELETE /api/media/:id - Delete media file

Theme Management:
GET /api/themes - Get available themes
POST /api/microsites/:id/theme - Apply theme
PUT /api/microsites/:id/theme-settings - Update theme settings

Public Routes (Subdomain):
GET /:subdomain/* - Serve microsite content
GET /:subdomain/courts - Court listings (clubs/partners)
GET /:subdomain/tournaments - Tournament listings
GET /:subdomain/book/:courtId - Court booking page
```

## Frontend Development Tasks

### 1. Microsite Builder Components
**Files to Create:**
- `src/components/microsites/MicrositeBuilder.tsx` - Main builder interface
- `src/components/microsites/PageEditor.tsx` - Page editing interface
- `src/components/microsites/ContentBlockEditor.tsx` - Block-level editing
- `src/components/microsites/DragDropBuilder.tsx` - Drag-and-drop interface
- `src/components/microsites/PreviewMode.tsx` - Preview functionality

### 2. Content Block Components
**Files to Create:**
- `src/components/blocks/TextBlock.tsx` - Text content blocks
- `src/components/blocks/ImageBlock.tsx` - Image blocks
- `src/components/blocks/GalleryBlock.tsx` - Image galleries
- `src/components/blocks/VideoBlock.tsx` - Video embeds
- `src/components/blocks/ContactBlock.tsx` - Contact information
- `src/components/blocks/MapBlock.tsx` - Location maps
- `src/components/blocks/CourtListBlock.tsx` - Court listings
- `src/components/blocks/TournamentBlock.tsx` - Tournament information
- `src/components/blocks/CalendarBlock.tsx` - Event calendar

### 3. Theme Customization Components
**Files to Create:**
- `src/components/themes/ThemeSelector.tsx` - Theme selection
- `src/components/themes/ColorPicker.tsx` - Color customization
- `src/components/themes/FontSelector.tsx` - Typography options
- `src/components/themes/LayoutOptions.tsx` - Layout configurations
- `src/components/themes/LogoBranding.tsx` - Logo and branding

### 4. Media Management Components
**Files to Create:**
- `src/components/media/MediaLibrary.tsx` - Media file browser
- `src/components/media/ImageUploader.tsx` - Image upload interface
- `src/components/media/ImageEditor.tsx` - Basic image editing
- `src/components/media/VideoUploader.tsx` - Video upload handling
- `src/components/media/MediaSelector.tsx` - Media selection modal

### 5. Public Microsite Components
**Files to Create:**
- `src/components/public/MicrositeHeader.tsx` - Public site header
- `src/components/public/MicrositeNavigation.tsx` - Public navigation
- `src/components/public/MicrositeFooter.tsx` - Public site footer
- `src/components/public/CourtBookingWidget.tsx` - Booking integration
- `src/components/public/TournamentWidget.tsx` - Tournament integration
- `src/components/public/ContactWidget.tsx` - Contact forms

### 6. Pages
**Files to Create:**
- `src/pages/microsites/MicrositeManagePage.tsx` - Microsite management
- `src/pages/microsites/BuilderPage.tsx` - Microsite builder interface
- `src/pages/microsites/SettingsPage.tsx` - Microsite settings
- `src/pages/microsites/AnalyticsPage.tsx` - Microsite analytics
- `src/pages/public/MicrositePage.tsx` - Public microsite renderer

### 7. Redux State Management
**Files to Create:**
- `src/store/micrositesSlice.ts` - Microsite state
- `src/store/builderSlice.ts` - Builder interface state
- `src/store/mediaSlice.ts` - Media management state

## Type Definitions

### Backend Types
```typescript
// types/microsite.ts
export interface Microsite {
  id: number;
  ownerType: 'club' | 'partner' | 'state';
  ownerId: number;
  subdomain: string;
  title: string;
  description: string;
  logoUrl?: string;
  bannerImages: string[];
  themeId: number;
  themeSettings: ThemeSettings;
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  isActive: boolean;
  customCSS?: string;
  analyticsCode?: string;
  seoSettings: SEOSettings;
  pages: MicrositePage[];
}

export interface MicrositePage {
  id: number;
  micrositeId: number;
  title: string;
  slug: string;
  content: ContentBlock[];
  isPublished: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  customCSS?: string;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: any;
  settings: BlockSettings;
  sortOrder: number;
}

export interface Theme {
  id: number;
  name: string;
  description: string;
  previewImage: string;
  cssTemplate: string;
  settings: ThemeConfigOptions;
  isDefault: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  layout: LayoutType;
  customVariables: Record<string, string>;
}
```

### Frontend Types
```typescript
// types/microsite.ts
export interface MicrositeState {
  microsites: Microsite[];
  selectedMicrosite: Microsite | null;
  isLoading: boolean;
  error: string | null;
}

export interface BuilderState {
  activePage: MicrositePage | null;
  selectedBlock: ContentBlock | null;
  isDragging: boolean;
  previewMode: boolean;
  unsavedChanges: boolean;
  builderHistory: BuilderAction[];
  historyIndex: number;
}

export interface MediaState {
  mediaFiles: MediaFile[];
  selectedFiles: MediaFile[];
  uploadProgress: UploadProgress[];
  isUploading: boolean;
}
```

## Content Block System

### Available Block Types
```typescript
enum BlockType {
  TEXT = 'text',
  IMAGE = 'image',
  GALLERY = 'gallery',
  VIDEO = 'video',
  CONTACT = 'contact',
  MAP = 'map',
  COURT_LIST = 'court_list',
  TOURNAMENT_LIST = 'tournament_list',
  CALENDAR = 'calendar',
  TESTIMONIALS = 'testimonials',
  HERO_BANNER = 'hero_banner',
  CALL_TO_ACTION = 'call_to_action',
  SOCIAL_FEED = 'social_feed',
  CUSTOM_HTML = 'custom_html'
}

// Example block configurations
const BLOCK_CONFIGS = {
  text: {
    icon: 'Type',
    title: 'Text Block',
    description: 'Add formatted text content',
    settings: ['content', 'alignment', 'typography', 'spacing']
  },
  court_list: {
    icon: 'Calendar',
    title: 'Court Listings',
    description: 'Display available courts with booking',
    settings: ['layout', 'filters', 'booking_enabled', 'show_pricing']
  },
  tournament_list: {
    icon: 'Trophy',
    title: 'Tournaments',
    description: 'Show tournaments and registration',
    settings: ['tournament_types', 'registration_enabled', 'display_format']
  }
};
```

### Drag-and-Drop Builder Interface
```typescript
const DragDropBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);

  const handleDrop = (item: DragItem, dropIndex: number) => {
    if (item.type === 'NEW_BLOCK') {
      // Create new block from sidebar
      const newBlock: ContentBlock = {
        id: generateId(),
        type: item.blockType,
        content: getDefaultContent(item.blockType),
        settings: getDefaultSettings(item.blockType),
        sortOrder: dropIndex
      };
      insertBlock(newBlock, dropIndex);
    } else {
      // Reorder existing block
      reorderBlock(item.id, dropIndex);
    }
  };

  return (
    <div className="builder-interface">
      <BlockSidebar onDragStart={handleDragStart} />
      <DropZone onDrop={handleDrop}>
        {blocks.map((block, index) => (
          <DraggableBlock
            key={block.id}
            block={block}
            index={index}
            isSelected={selectedBlock?.id === block.id}
            onSelect={() => setSelectedBlock(block)}
          />
        ))}
      </DropZone>
      <SettingsPanel 
        block={selectedBlock} 
        onUpdate={handleBlockUpdate} 
      />
    </div>
  );
};
```

## Theme System

### Pre-built Themes
```javascript
const AVAILABLE_THEMES = {
  modern: {
    name: 'Modern',
    description: 'Clean and contemporary design',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    fontFamily: 'Inter, sans-serif',
    layout: 'grid',
    features: ['responsive', 'animations', 'dark_mode']
  },
  classic: {
    name: 'Classic',
    description: 'Traditional and professional',
    primaryColor: '#dc2626',
    secondaryColor: '#374151',
    fontFamily: 'Georgia, serif',
    layout: 'traditional',
    features: ['responsive', 'print_friendly']
  },
  sport: {
    name: 'Sport',
    description: 'Dynamic and energetic design',
    primaryColor: '#059669',
    secondaryColor: '#f59e0b',
    fontFamily: 'Roboto, sans-serif',
    layout: 'magazine',
    features: ['responsive', 'animations', 'video_headers']
  }
};
```

### Custom CSS Generation
```typescript
const generateCustomCSS = (settings: ThemeSettings): string => {
  return `
    :root {
      --primary-color: ${settings.primaryColor};
      --secondary-color: ${settings.secondaryColor};
      --background-color: ${settings.backgroundColor};
      --text-color: ${settings.textColor};
      --font-family: ${settings.fontFamily};
      --font-size: ${settings.fontSize};
    }
    
    .microsite-header {
      background-color: var(--primary-color);
      color: white;
      font-family: var(--font-family);
    }
    
    .content-block {
      color: var(--text-color);
      font-size: var(--font-size);
      margin-bottom: 2rem;
    }
    
    .btn-primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    
    .btn-secondary {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
    }
    
    ${settings.customVariables ? generateCustomVariables(settings.customVariables) : ''}
  `;
};
```

## Subdomain System

### Subdomain Routing Configuration
```typescript
// Express middleware for subdomain handling
const subdomainHandler = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.get('host');
  const subdomain = extractSubdomain(host);
  
  if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
    try {
      // Find microsite by subdomain
      const microsite = await Microsite.findOne({
        where: { subdomain, isActive: true },
        include: [{ model: MicrositePage, where: { isPublished: true } }]
      });
      
      if (microsite) {
        // Serve microsite content
        req.microsite = microsite;
        return serveMicrositeContent(req, res);
      } else {
        // Subdomain not found
        return res.status(404).render('microsite-not-found');
      }
    } catch (error) {
      return res.status(500).json({ error: 'Microsite loading failed' });
    }
  }
  
  next();
};

const serveMicrositeContent = (req: Request, res: Response) => {
  const { microsite } = req;
  const path = req.path;
  
  // Handle different routes
  if (path === '/' || path === '/home') {
    return renderMicrositePage(res, microsite, 'home');
  } else if (path === '/courts' && microsite.ownerType !== 'state') {
    return renderCourtsPage(res, microsite);
  } else if (path === '/tournaments') {
    return renderTournamentsPage(res, microsite);
  } else {
    // Try to find page by slug
    const page = microsite.pages.find(p => p.slug === path.substring(1));
    if (page) {
      return renderMicrositePage(res, microsite, page.slug);
    } else {
      return res.status(404).render('page-not-found');
    }
  }
};
```

### SSL Certificate Management
```typescript
// Automatic SSL certificate generation for subdomains
export class SSLManager {
  async generateCertificate(subdomain: string): Promise<void> {
    try {
      // Use Let's Encrypt or similar service
      const certificate = await acme.generateCertificate({
        domain: `${subdomain}.pickleballfed.mx`,
        email: 'admin@pickleballfed.mx'
      });
      
      // Store certificate
      await SSLCertificate.create({
        subdomain,
        certificate: certificate.cert,
        privateKey: certificate.key,
        expiresAt: certificate.expiresAt
      });
      
    } catch (error) {
      console.error('SSL generation failed:', error);
    }
  }
  
  async renewCertificates(): Promise<void> {
    const expiringCerts = await SSLCertificate.findAll({
      where: {
        expiresAt: {
          [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }
    });
    
    for (const cert of expiringCerts) {
      await this.generateCertificate(cert.subdomain);
    }
  }
}
```

## Content Moderation System

### Automated Content Moderation
```typescript
export class ContentModerationService {
  async moderateContent(content: string, micrositeId: number): Promise<ModerationResult> {
    const result: ModerationResult = {
      approved: true,
      flags: [],
      suggestedChanges: []
    };
    
    // Check for inappropriate content
    const inappropriateCheck = await this.checkInappropriateContent(content);
    if (!inappropriateCheck.passed) {
      result.approved = false;
      result.flags.push('inappropriate_content');
    }
    
    // Check for compliance with admin rules
    const complianceCheck = await this.checkFederationCompliance(content);
    if (!complianceCheck.passed) {
      result.flags.push('federation_compliance');
      result.suggestedChanges = complianceCheck.suggestions;
    }
    
    // Check for copyright issues
    const copyrightCheck = await this.checkCopyright(content);
    if (!copyrightCheck.passed) {
      result.flags.push('potential_copyright');
    }
    
    return result;
  }
  
  async flagForReview(micrositeId: number, reason: string): Promise<void> {
    await ModerationFlag.create({
      micrositeId,
      reason,
      status: 'pending',
      flaggedAt: new Date()
    });
    
    // Notify admin team
    await this.notifyModerationTeam(micrositeId, reason);
  }
}
```

## Testing Requirements

### Backend Testing
```bash
# Test microsite creation
curl -X POST http://localhost:5000/api/microsites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ownerType":"club","ownerId":1,"subdomain":"test-club"}'

# Test page creation
curl -X POST http://localhost:5000/api/microsites/1/pages \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"About Us","slug":"about","content":[]}'

# Test public microsite access
curl -H "Host: test-club.pickleballfed.mx" http://localhost:5000/

# Test content block creation
curl -X POST http://localhost:5000/api/pages/1/blocks \
  -H "Authorization: Bearer <token>" \
  -d '{"type":"text","content":"Welcome to our club"}'
```

### Frontend Testing
- Test microsite builder interface
- Verify drag-and-drop functionality
- Test theme customization
- Verify media upload and management
- Test public microsite rendering
- Verify responsive design
- Test subdomain routing

### Integration Testing
- Complete microsite creation to public display
- Court booking integration on club microsites
- Tournament registration integration
- SEO meta tag generation
- Content moderation workflow

## Success Criteria
✅ Microsite builder interface functions correctly
✅ Drag-and-drop content editing works smoothly
✅ Subdomain routing serves correct content
✅ Theme customization applies properly
✅ Media management uploads and displays files
✅ Public microsites render correctly
✅ Court booking integration works on club sites
✅ Tournament integration displays properly
✅ Content moderation prevents inappropriate content
✅ SEO optimization generates proper meta tags
✅ Mobile responsive design works
✅ SSL certificates generate automatically

## Commands to Test
```bash
# Test microsite system
npm run test:microsites

# Generate sample microsites
npm run seed:microsites

# Test subdomain routing
npm run test:subdomains

# Test content blocks
npm run test:content-blocks

# Start with microsite data
docker-compose up -d
npm run seed:microsites:full
```

## Next Steps
After completing this step, you should have:
- Complete microsite management system
- Drag-and-drop content builder
- Subdomain system with SSL support
- Theme customization capabilities
- Content moderation system
- Integration with booking and tournament systems

The final step will focus on the comprehensive admin dashboard and system administration tools.