import { Op } from 'sequelize';
import ContentBlock from '../models/ContentBlock';
import MicrositePage from '../models/MicrositePage';
import Microsite from '../models/Microsite';

export class ContentBlockService {
  async createBlock(pageId: number, userId: number, data: any) {
    try {
      // Verify user owns the page through microsite
      const page = await MicrositePage.findOne({
        where: { id: pageId },
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

      // Get next sort order
      const maxSortOrder = await ContentBlock.max('sortOrder', {
        where: { pageId }
      }) as number;

      const block = await ContentBlock.create({
        ...data,
        pageId,
        sortOrder: data.sortOrder || (maxSortOrder || 0) + 1
      });

      return block;
    } catch (error) {
      throw error;
    }
  }

  async getBlockById(id: number, userId?: number) {
    try {
      const includeOptions: any = [];

      if (userId) {
        includeOptions.push({
          model: MicrositePage,
          as: 'page',
          include: [
            {
              model: Microsite,
              as: 'microsite',
              where: { userId },
              attributes: ['id', 'userId']
            }
          ]
        });
      }

      const block = await ContentBlock.findByPk(id, {
        include: includeOptions.length > 0 ? includeOptions : undefined
      });

      if (!block) {
        throw new Error('Content block not found');
      }

      return block;
    } catch (error) {
      throw error;
    }
  }

  async getPageBlocks(pageId: number, userId?: number, visibleOnly: boolean = false) {
    try {
      // If userId is provided, verify ownership
      if (userId) {
        const page = await MicrositePage.findOne({
          where: { id: pageId },
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
      }

      const whereClause: any = { pageId };

      if (visibleOnly) {
        whereClause.isVisible = true;
      }

      const blocks = await ContentBlock.findAll({
        where: whereClause,
        order: [['sort_order', 'ASC']]
      });

      return blocks;
    } catch (error) {
      throw error;
    }
  }

  async updateBlock(id: number, userId: number, data: any) {
    try {
      const block = await ContentBlock.findOne({
        where: { id },
        include: [
          {
            model: MicrositePage,
            as: 'page',
            include: [
              {
                model: Microsite,
                as: 'microsite',
                where: { userId }
              }
            ]
          }
        ]
      });

      if (!block) {
        throw new Error('Content block not found or unauthorized');
      }

      await block.update(data);

      return block;
    } catch (error) {
      throw error;
    }
  }

  async deleteBlock(id: number, userId: number) {
    try {
      const block = await ContentBlock.findOne({
        where: { id },
        include: [
          {
            model: MicrositePage,
            as: 'page',
            include: [
              {
                model: Microsite,
                as: 'microsite',
                where: { userId }
              }
            ]
          }
        ]
      });

      if (!block) {
        throw new Error('Content block not found or unauthorized');
      }

      await block.destroy();

      return { success: true, message: 'Content block deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async duplicateBlock(id: number, userId: number) {
    try {
      const originalBlock = await this.getBlockById(id, userId);

      if (!originalBlock) {
        throw new Error('Content block not found or unauthorized');
      }

      // Get next sort order
      const maxSortOrder = await ContentBlock.max('sortOrder', {
        where: { pageId: originalBlock.pageId }
      }) as number;

      const duplicateData = {
        ...originalBlock.toJSON(),
        id: undefined,
        sortOrder: (maxSortOrder || 0) + 1,
        createdAt: undefined,
        updatedAt: undefined
      };

      const newBlock = await ContentBlock.create(duplicateData);

      return newBlock;
    } catch (error) {
      throw error;
    }
  }

  async reorderBlocks(pageId: number, userId: number, blockOrders: Array<{id: number, sortOrder: number}>) {
    try {
      // Verify user owns the page
      const page = await MicrositePage.findOne({
        where: { id: pageId },
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

      // Update sort orders
      for (const { id, sortOrder } of blockOrders) {
        await ContentBlock.update(
          { sortOrder },
          { where: { id, pageId } }
        );
      }

      return await this.getPageBlocks(pageId, userId);
    } catch (error) {
      throw error;
    }
  }

  async toggleBlockVisibility(id: number, userId: number) {
    try {
      const block = await ContentBlock.findOne({
        where: { id },
        include: [
          {
            model: MicrositePage,
            as: 'page',
            include: [
              {
                model: Microsite,
                as: 'microsite',
                where: { userId }
              }
            ]
          }
        ]
      });

      if (!block) {
        throw new Error('Content block not found or unauthorized');
      }

      await block.update({
        isVisible: !block.isVisible
      });

      return block;
    } catch (error) {
      throw error;
    }
  }

  async createTextBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'text',
      content: {
        text: content.text || '',
        textAlign: content.textAlign || 'left',
        fontSize: content.fontSize || 'medium',
        color: content.color || '#000000'
      },
      settings: content.settings || {}
    });
  }

  async createImageBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'image',
      content: {
        imageUrl: content.imageUrl,
        alt: content.alt || '',
        caption: content.caption || '',
        alignment: content.alignment || 'center',
        size: content.size || 'medium'
      },
      settings: content.settings || {}
    });
  }

  async createGalleryBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'gallery',
      content: {
        images: content.images || [],
        layout: content.layout || 'grid',
        columns: content.columns || 3,
        showCaptions: content.showCaptions || false
      },
      settings: content.settings || {}
    });
  }

  async createVideoBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'video',
      content: {
        videoUrl: content.videoUrl,
        videoType: content.videoType || 'youtube',
        thumbnail: content.thumbnail || '',
        autoplay: content.autoplay || false,
        controls: content.controls !== false
      },
      settings: content.settings || {}
    });
  }

  async createContactBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'contact',
      content: {
        title: content.title || 'Contact Us',
        email: content.email || '',
        phone: content.phone || '',
        address: content.address || '',
        showForm: content.showForm || true,
        formFields: content.formFields || ['name', 'email', 'message']
      },
      settings: content.settings || {}
    });
  }

  async createMapBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'map',
      content: {
        latitude: content.latitude || 0,
        longitude: content.longitude || 0,
        zoom: content.zoom || 15,
        markerTitle: content.markerTitle || '',
        address: content.address || '',
        showControls: content.showControls !== false
      },
      settings: content.settings || {}
    });
  }

  async createCourtListBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'court_list',
      content: {
        title: content.title || 'Our Courts',
        showAvailability: content.showAvailability || true,
        showPricing: content.showPricing || true,
        showBookingButton: content.showBookingButton || true,
        layout: content.layout || 'grid'
      },
      settings: content.settings || {}
    });
  }

  async createTournamentListBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'tournament_list',
      content: {
        title: content.title || 'Tournaments',
        showUpcoming: content.showUpcoming !== false,
        showPast: content.showPast || false,
        showRegistrationButton: content.showRegistrationButton || true,
        limit: content.limit || 10
      },
      settings: content.settings || {}
    });
  }

  async createCalendarBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'calendar',
      content: {
        title: content.title || 'Calendar',
        showEvents: content.showEvents || 'all',
        view: content.view || 'month',
        showFilters: content.showFilters || true
      },
      settings: content.settings || {}
    });
  }

  async createCustomHtmlBlock(pageId: number, userId: number, content: any) {
    return await this.createBlock(pageId, userId, {
      type: 'custom_html',
      content: {
        html: content.html || '',
        css: content.css || ''
      },
      settings: content.settings || {}
    });
  }
}