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

  async updateMicrosite(micrositeId: number, updates: UpdateMicrositeRequest) {
    const microsite = await this.getMicrosite(micrositeId);
    return await microsite.update(updates);
  }

  async deleteMicrosite(micrositeId: number) {
    const microsite = await this.getMicrosite(micrositeId);
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
}

export default new MicrositeService();