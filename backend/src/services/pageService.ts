import { Op } from 'sequelize';
import MicrositePage from '../models/MicrositePage';
import ContentBlock from '../models/ContentBlock';
import Microsite from '../models/Microsite';

export class PageService {
  async createPage(micrositeId: number, userId: number, data: any) {
    try {
      // Verify user owns the microsite
      const microsite = await Microsite.findOne({
        where: { id: micrositeId, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      // Check if slug is unique within the microsite
      if (data.slug) {
        const existingPage = await MicrositePage.findOne({
          where: {
            micrositeId,
            slug: data.slug
          }
        });

        if (existingPage) {
          throw new Error('Page slug must be unique within the microsite');
        }
      }

      // If this is set to be the home page, unset other home pages
      if (data.isHomePage) {
        await MicrositePage.update(
          { isHomePage: false },
          { where: { micrositeId, isHomePage: true } }
        );
        data.slug = ''; // Home page always has empty slug
      }

      // Get next sort order
      const maxSortOrder = await MicrositePage.max('sortOrder', {
        where: { micrositeId }
      }) as number;

      const page = await MicrositePage.create({
        ...data,
        micrositeId,
        sortOrder: data.sortOrder || (maxSortOrder || 0) + 1
      });

      return await this.getPageById(page.id, userId);
    } catch (error) {
      throw error;
    }
  }

  async getPageById(id: number, userId?: number) {
    try {
      const includeOptions: any = [
        {
          model: ContentBlock,
          as: 'contentBlocks',
          order: [['sort_order', 'ASC']]
        }
      ];

      const whereOptions: any = { id };

      // If userId is provided, check ownership
      if (userId) {
        includeOptions.push({
          model: Microsite,
          as: 'microsite',
          where: { userId },
          attributes: ['id', 'name', 'subdomain', 'userId']
        });
      }

      const page = await MicrositePage.findOne({
        where: whereOptions,
        include: includeOptions
      });

      if (!page) {
        throw new Error('Page not found');
      }

      return page;
    } catch (error) {
      throw error;
    }
  }

  async getPageBySlug(micrositeId: number, slug: string, publishedOnly: boolean = true) {
    try {
      const whereClause: any = {
        micrositeId,
        slug
      };

      if (publishedOnly) {
        whereClause.isPublished = true;
      }

      const page = await MicrositePage.findOne({
        where: whereClause,
        include: [
          {
            model: ContentBlock,
            as: 'contentBlocks',
            where: publishedOnly ? { isVisible: true } : {},
            required: false,
            order: [['sort_order', 'ASC']]
          }
        ]
      });

      return page;
    } catch (error) {
      throw error;
    }
  }

  async getMicrositePages(micrositeId: number, userId?: number, publishedOnly: boolean = false) {
    try {
      const whereClause: any = { micrositeId };

      if (publishedOnly) {
        whereClause.isPublished = true;
      }

      // If userId is provided, verify ownership
      if (userId) {
        const microsite = await Microsite.findOne({
          where: { id: micrositeId, userId }
        });

        if (!microsite) {
          throw new Error('Microsite not found or unauthorized');
        }
      }

      const pages = await MicrositePage.findAll({
        where: whereClause,
        include: [
          {
            model: ContentBlock,
            as: 'contentBlocks',
            where: publishedOnly ? { isVisible: true } : {},
            required: false,
            attributes: ['id', 'type', 'sortOrder']
          }
        ],
        order: [
          ['is_home_page', 'DESC'],
          ['sort_order', 'ASC']
        ]
      });

      return pages;
    } catch (error) {
      throw error;
    }
  }

  async updatePage(id: number, userId: number, data: any) {
    try {
      const page = await MicrositePage.findOne({
        where: { id },
        include: [
          {
            model: Microsite,
            as: 'microsite',
            where: { userId }
          }
        ]
      });

      if (!page) {
        throw new Error('Page not found or unauthorized');
      }

      // Check slug uniqueness if being updated
      if (data.slug && data.slug !== page.slug) {
        const existingPage = await MicrositePage.findOne({
          where: {
            micrositeId: page.micrositeId,
            slug: data.slug,
            id: { [Op.ne]: id }
          }
        });

        if (existingPage) {
          throw new Error('Page slug must be unique within the microsite');
        }
      }

      // Handle home page logic
      if (data.isHomePage && !page.isHomePage) {
        await MicrositePage.update(
          { isHomePage: false },
          { where: { micrositeId: page.micrositeId, isHomePage: true } }
        );
        data.slug = ''; // Home page always has empty slug
      }

      await page.update(data);

      return await this.getPageById(id, userId);
    } catch (error) {
      throw error;
    }
  }

  async publishPage(id: number, userId: number) {
    try {
      const page = await MicrositePage.findOne({
        where: { id },
        include: [
          {
            model: Microsite,
            as: 'microsite',
            where: { userId }
          }
        ]
      });

      if (!page) {
        throw new Error('Page not found or unauthorized');
      }

      await page.update({
        isPublished: true,
        publishedAt: new Date()
      });

      return await this.getPageById(id, userId);
    } catch (error) {
      throw error;
    }
  }

  async unpublishPage(id: number, userId: number) {
    try {
      const page = await MicrositePage.findOne({
        where: { id },
        include: [
          {
            model: Microsite,
            as: 'microsite',
            where: { userId }
          }
        ]
      });

      if (!page) {
        throw new Error('Page not found or unauthorized');
      }

      // Don't allow unpublishing home page if it's the only published page
      if (page.isHomePage) {
        const otherPublishedPages = await MicrositePage.count({
          where: {
            micrositeId: page.micrositeId,
            isPublished: true,
            id: { [Op.ne]: id }
          }
        });

        if (otherPublishedPages === 0) {
          throw new Error('Cannot unpublish the home page when it\'s the only published page');
        }
      }

      await page.update({
        isPublished: false
      });

      return await this.getPageById(id, userId);
    } catch (error) {
      throw error;
    }
  }

  async deletePage(id: number, userId: number) {
    try {
      const page = await MicrositePage.findOne({
        where: { id },
        include: [
          {
            model: Microsite,
            as: 'microsite',
            where: { userId }
          }
        ]
      });

      if (!page) {
        throw new Error('Page not found or unauthorized');
      }

      // Don't allow deleting home page if it's the only page
      if (page.isHomePage) {
        const otherPages = await MicrositePage.count({
          where: {
            micrositeId: page.micrositeId,
            id: { [Op.ne]: id }
          }
        });

        if (otherPages === 0) {
          throw new Error('Cannot delete the last page of a microsite');
        }
      }

      await page.destroy();

      return { success: true, message: 'Page deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async duplicatePage(id: number, userId: number) {
    try {
      const originalPage = await this.getPageById(id, userId);

      if (!originalPage) {
        throw new Error('Page not found or unauthorized');
      }

      // Generate unique slug
      let newSlug = `${originalPage.slug}-copy`;
      let counter = 1;

      while (true) {
        const existingPage = await MicrositePage.findOne({
          where: {
            micrositeId: originalPage.micrositeId,
            slug: newSlug
          }
        });

        if (!existingPage) break;

        counter++;
        newSlug = `${originalPage.slug}-copy-${counter}`;
      }

      // Create duplicate page
      const duplicateData = {
        ...originalPage.toJSON(),
        id: undefined,
        title: `${originalPage.title} (Copy)`,
        slug: newSlug,
        isHomePage: false,
        isPublished: false,
        publishedAt: null,
        createdAt: undefined,
        updatedAt: undefined
      };

      const newPage = await MicrositePage.create(duplicateData);

      // Duplicate content blocks
      const contentBlocks = (originalPage as any).contentBlocks || [];
      for (const block of contentBlocks) {
        const blockData = {
          ...block.toJSON(),
          id: undefined,
          pageId: newPage.id,
          createdAt: undefined,
          updatedAt: undefined
        };

        await ContentBlock.create(blockData);
      }

      return await this.getPageById(newPage.id, userId);
    } catch (error) {
      throw error;
    }
  }

  async reorderPages(micrositeId: number, userId: number, pageOrders: Array<{id: number, sortOrder: number}>) {
    try {
      // Verify user owns the microsite
      const microsite = await Microsite.findOne({
        where: { id: micrositeId, userId }
      });

      if (!microsite) {
        throw new Error('Microsite not found or unauthorized');
      }

      // Update sort orders
      for (const { id, sortOrder } of pageOrders) {
        await MicrositePage.update(
          { sortOrder },
          { where: { id, micrositeId } }
        );
      }

      return await this.getMicrositePages(micrositeId, userId);
    } catch (error) {
      throw error;
    }
  }
}