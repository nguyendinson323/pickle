import { MicrositeService } from './micrositeService';
import { PageService } from './pageService';
import { ThemeService } from './themeService';
import { Request, Response } from 'express';
import { SubdomainRequest } from '../middleware/subdomain';

const micrositeService = new MicrositeService();
const pageService = new PageService();
const themeService = new ThemeService();

export class MicrositeRenderer {
  async renderMicrositeHomePage(req: SubdomainRequest, res: Response) {
    try {
      if (!req.microsite) {
        return res.status(404).json({ error: 'Microsite not found' });
      }

      const microsite = req.microsite;

      // Get the home page
      const homePage = await pageService.getPageBySlug(microsite.id, '', true);
      
      if (!homePage) {
        return res.status(404).json({ error: 'Home page not found' });
      }

      // Get theme CSS
      let themeCSS = '';
      if (microsite.themeId) {
        themeCSS = await themeService.generateCss(microsite.themeId, {
          customCss: microsite.customCss
        });
      }

      const pageData = {
        microsite: {
          id: microsite.id,
          name: microsite.name,
          title: microsite.title,
          description: microsite.description,
          logoUrl: microsite.logoUrl,
          headerImageUrl: microsite.headerImageUrl,
          contactEmail: microsite.contactEmail,
          contactPhone: microsite.contactPhone,
          address: microsite.address,
          socialMedia: microsite.socialMedia,
          seoTitle: microsite.seoTitle || microsite.title,
          seoDescription: microsite.seoDescription || microsite.description,
          seoKeywords: microsite.seoKeywords,
          ogImage: microsite.ogImage,
          faviconUrl: microsite.faviconUrl
        },
        page: {
          id: homePage.id,
          title: homePage.title,
          content: homePage.content,
          metaTitle: homePage.metaTitle || microsite.seoTitle || microsite.title,
          metaDescription: homePage.metaDescription || microsite.seoDescription || microsite.description,
          contentBlocks: homePage.contentBlocks || []
        },
        theme: microsite.theme,
        themeCSS,
        customJS: microsite.customJs
      };

      // Return JSON for API calls or render HTML for browser requests
      if (req.headers.accept?.includes('application/json')) {
        res.json({ success: true, data: pageData });
      } else {
        res.send(this.generateHTML(pageData));
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async renderMicrositePage(req: SubdomainRequest, res: Response) {
    try {
      if (!req.microsite) {
        return res.status(404).json({ error: 'Microsite not found' });
      }

      const { slug } = req.params;
      const microsite = req.microsite;

      // Get the page by slug
      const page = await pageService.getPageBySlug(microsite.id, slug, true);
      
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Get theme CSS
      let themeCSS = '';
      if (microsite.themeId) {
        themeCSS = await themeService.generateCss(microsite.themeId, {
          customCss: microsite.customCss
        });
      }

      const pageData = {
        microsite: {
          id: microsite.id,
          name: microsite.name,
          title: microsite.title,
          description: microsite.description,
          logoUrl: microsite.logoUrl,
          headerImageUrl: microsite.headerImageUrl,
          contactEmail: microsite.contactEmail,
          contactPhone: microsite.contactPhone,
          address: microsite.address,
          socialMedia: microsite.socialMedia,
          seoTitle: microsite.seoTitle || microsite.title,
          seoDescription: microsite.seoDescription || microsite.description,
          seoKeywords: microsite.seoKeywords,
          ogImage: microsite.ogImage,
          faviconUrl: microsite.faviconUrl
        },
        page: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          content: page.content,
          metaTitle: page.metaTitle || microsite.seoTitle || microsite.title,
          metaDescription: page.metaDescription || microsite.seoDescription || microsite.description,
          contentBlocks: page.contentBlocks || []
        },
        theme: microsite.theme,
        themeCSS,
        customJS: microsite.customJs
      };

      // Return JSON for API calls or render HTML for browser requests
      if (req.headers.accept?.includes('application/json')) {
        res.json({ success: true, data: pageData });
      } else {
        res.send(this.generateHTML(pageData));
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMicrositeNavigation(req: SubdomainRequest, res: Response) {
    try {
      if (!req.microsite) {
        return res.status(404).json({ error: 'Microsite not found' });
      }

      const pages = await pageService.getMicrositePages(req.microsite.id, undefined, true);

      const navigation = pages.map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        isHomePage: page.isHomePage,
        sortOrder: page.sortOrder
      }));

      res.json({ success: true, data: navigation });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMicrositeThemeCSS(req: SubdomainRequest, res: Response) {
    try {
      if (!req.microsite) {
        return res.status(404).send('/* Microsite not found */');
      }

      const microsite = req.microsite;
      let css = '';

      if (microsite.themeId) {
        css = await themeService.generateCss(microsite.themeId, {
          customCss: microsite.customCss
        });
      } else {
        // Use default styles
        const defaultTheme = await themeService.getDefaultTheme();
        css = await themeService.generateCss(defaultTheme.id, {
          customCss: microsite.customCss
        });
      }

      res.setHeader('Content-Type', 'text/css');
      res.send(css);
    } catch (error: any) {
      res.status(500).send(`/* Error generating CSS: ${error.message} */`);
    }
  }

  private generateHTML(data: any): string {
    const { microsite, page, themeCSS, customJS } = data;

    // Generate content blocks HTML
    const contentHTML = this.renderContentBlocks(page.contentBlocks);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.metaTitle}</title>
    <meta name="description" content="${page.metaDescription || ''}">
    <meta name="keywords" content="${microsite.seoKeywords || ''}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${page.metaTitle}">
    <meta property="og:description" content="${page.metaDescription || ''}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}">
    ${microsite.ogImage ? `<meta property="og:image" content="${microsite.ogImage}">` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.metaTitle}">
    <meta name="twitter:description" content="${page.metaDescription || ''}">
    ${microsite.ogImage ? `<meta name="twitter:image" content="${microsite.ogImage}">` : ''}
    
    <!-- Favicon -->
    ${microsite.faviconUrl ? `<link rel="icon" href="${microsite.faviconUrl}">` : ''}
    
    <!-- Styles -->
    <style>${themeCSS}</style>
    
    <!-- Additional CSS -->
    <style>
        .microsite-header {
            background: var(--primary-color);
            color: white;
            padding: 20px 0;
        }
        
        .microsite-nav {
            background: var(--background-color);
            border-bottom: 1px solid var(--border-color);
            padding: 10px 0;
        }
        
        .microsite-nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
        }
        
        .microsite-nav li {
            margin-right: 20px;
        }
        
        .microsite-nav a {
            color: var(--text-color);
            text-decoration: none;
            padding: 8px 12px;
            border-radius: var(--border-radius);
            transition: background-color 0.3s;
        }
        
        .microsite-nav a:hover {
            background-color: var(--primary-color);
            color: white;
        }
        
        .microsite-content {
            min-height: 60vh;
        }
        
        .content-block {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="microsite-header">
        <div class="container">
            ${microsite.logoUrl ? `<img src="${microsite.logoUrl}" alt="${microsite.name}" style="height: 50px;">` : ''}
            <h1>${microsite.title}</h1>
            ${microsite.description ? `<p>${microsite.description}</p>` : ''}
        </div>
    </header>

    <!-- Navigation -->
    <nav class="microsite-nav">
        <div class="container">
            <ul id="navigation">
                <!-- Navigation will be loaded by JavaScript -->
            </ul>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="microsite-content">
        <div class="container">
            ${page.isHomePage ? '' : `<h2>${page.title}</h2>`}
            ${contentHTML}
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <div>
                    <p>&copy; ${new Date().getFullYear()} ${microsite.name}. All rights reserved.</p>
                    ${microsite.contactEmail || microsite.contactPhone || microsite.address ? `
                    <div style="margin-top: 10px;">
                        ${microsite.contactEmail ? `<p>Email: ${microsite.contactEmail}</p>` : ''}
                        ${microsite.contactPhone ? `<p>Phone: ${microsite.contactPhone}</p>` : ''}
                        ${microsite.address ? `<p>Address: ${microsite.address}</p>` : ''}
                    </div>
                    ` : ''}
                </div>
                ${microsite.socialMedia ? this.renderSocialMedia(microsite.socialMedia) : ''}
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // Load navigation
        fetch('/navigation')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const nav = document.getElementById('navigation');
                    data.data.forEach(page => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = page.isHomePage ? '/' : '/' + page.slug;
                        a.textContent = page.title;
                        li.appendChild(a);
                        nav.appendChild(li);
                    });
                }
            })
            .catch(error => console.error('Error loading navigation:', error));
    </script>
    
    ${customJS ? `<script>${customJS}</script>` : ''}
</body>
</html>`;
  }

  private renderContentBlocks(blocks: any[]): string {
    return blocks.map(block => {
      switch (block.type) {
        case 'text':
          return `<div class="content-block text-block">
            <div style="text-align: ${block.content.textAlign || 'left'}; 
                        font-size: ${block.content.fontSize || 'medium'}; 
                        color: ${block.content.color || 'inherit'};">
              ${block.content.text || ''}
            </div>
          </div>`;

        case 'image':
          return `<div class="content-block image-block">
            <div style="text-align: ${block.content.alignment || 'center'};">
              <img src="${block.content.imageUrl}" 
                   alt="${block.content.alt || ''}" 
                   style="max-width: 100%; height: auto;">
              ${block.content.caption ? `<p style="margin-top: 10px; font-style: italic;">${block.content.caption}</p>` : ''}
            </div>
          </div>`;

        case 'gallery':
          const images = block.content.images || [];
          return `<div class="content-block gallery-block">
            <div style="display: grid; grid-template-columns: repeat(${block.content.columns || 3}, 1fr); gap: 15px;">
              ${images.map((img: any) => `
                <div>
                  <img src="${img.url}" alt="${img.alt || ''}" style="width: 100%; height: auto;">
                  ${block.content.showCaptions && img.caption ? `<p style="margin-top: 5px; font-size: 0.9em;">${img.caption}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>`;

        case 'video':
          if (block.content.videoType === 'youtube') {
            const videoId = this.extractYouTubeId(block.content.videoUrl);
            return `<div class="content-block video-block">
              <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allowfullscreen
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
              </div>
            </div>`;
          }
          return `<div class="content-block video-block">
            <video controls style="width: 100%; max-width: 800px;">
              <source src="${block.content.videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>`;

        case 'contact':
          return `<div class="content-block contact-block">
            <h3>${block.content.title || 'Contact Us'}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
              <div>
                ${block.content.email ? `<p><strong>Email:</strong> ${block.content.email}</p>` : ''}
                ${block.content.phone ? `<p><strong>Phone:</strong> ${block.content.phone}</p>` : ''}
                ${block.content.address ? `<p><strong>Address:</strong> ${block.content.address}</p>` : ''}
              </div>
              ${block.content.showForm ? `
              <div>
                <form onsubmit="submitContactForm(event)">
                  <div class="form-group">
                    <input type="text" name="name" placeholder="Your Name" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <input type="email" name="email" placeholder="Your Email" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <textarea name="message" placeholder="Your Message" class="form-control" rows="5" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
              </div>
              ` : ''}
            </div>
          </div>`;

        case 'custom_html':
          return `<div class="content-block custom-html-block">
            ${block.content.html || ''}
            ${block.content.css ? `<style>${block.content.css}</style>` : ''}
          </div>`;

        default:
          return `<div class="content-block">
            <p>Content block type "${block.type}" not supported in public view.</p>
          </div>`;
      }
    }).join('');
  }

  private renderSocialMedia(socialMedia: any): string {
    const links = [];
    
    if (socialMedia.facebook) {
      links.push(`<a href="${socialMedia.facebook}" target="_blank" style="margin-right: 15px;">Facebook</a>`);
    }
    if (socialMedia.twitter) {
      links.push(`<a href="${socialMedia.twitter}" target="_blank" style="margin-right: 15px;">Twitter</a>`);
    }
    if (socialMedia.instagram) {
      links.push(`<a href="${socialMedia.instagram}" target="_blank" style="margin-right: 15px;">Instagram</a>`);
    }
    if (socialMedia.linkedin) {
      links.push(`<a href="${socialMedia.linkedin}" target="_blank" style="margin-right: 15px;">LinkedIn</a>`);
    }

    return links.length > 0 ? `<div>${links.join('')}</div>` : '';
  }

  private extractYouTubeId(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  }
}