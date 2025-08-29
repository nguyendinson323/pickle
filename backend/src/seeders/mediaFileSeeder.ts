import MediaFile from '../models/MediaFile';
import ModerationLog from '../models/ModerationLog';
import Microsite from '../models/Microsite';

export const seedMediaAndModeration = async (users: any[]): Promise<any> => {
  console.log('📁 Seeding media files and moderation logs...');
  
  const adminUser = users.find(u => u.role === 'federation');
  const clubUsers = users.filter(u => u.role === 'club');
  const partnerUsers = users.filter(u => u.role === 'partner');
  const stateUsers = users.filter(u => u.role === 'state');
  
  // Get microsites
  const microsites = await Microsite.findAll({ limit: 3 });
  
  // Create media files with proper data types
  const mediaFiles = await MediaFile.bulkCreate([
    // Club logo
    {
      micrositeId: microsites[0]?.id,
      userId: clubUsers[0]?.id || users[0].id,
      fileType: 'image',
      fileName: 'club-logo.png',
      fileUrl: 'https://cloudinary.com/federacion/logos/club-logo.png',
      fileSize: 125000,
      mimeType: 'image/png',
      dimensions: {
        width: 500,
        height: 500
      },
      thumbnailUrl: 'https://cloudinary.com/federacion/logos/thumb_club-logo.png',
      altText: 'Logo del Club Pickleball Ciudad de México',
      caption: 'Logo oficial del club',
      tags: ['logo', 'club', 'branding'],
      isPublic: true,
      usageLocations: [
        { type: 'microsite_header', pageId: 1 },
        { type: 'microsite_footer', pageId: 1 }
      ],
      metadata: {
        cloudinaryId: 'federacion/logos/club-logo',
        format: 'png',
        resourceType: 'image'
      }
    },
    // Tournament banner
    {
      micrositeId: microsites[0]?.id,
      userId: clubUsers[0]?.id || users[0].id,
      fileType: 'image',
      fileName: 'torneo-primavera-banner.jpg',
      fileUrl: 'https://cloudinary.com/federacion/banners/torneo-primavera.jpg',
      fileSize: 850000,
      mimeType: 'image/jpeg',
      dimensions: {
        width: 1920,
        height: 600
      },
      thumbnailUrl: 'https://cloudinary.com/federacion/banners/thumb_torneo-primavera.jpg',
      altText: 'Banner Torneo Primavera 2024',
      caption: 'Torneo Primavera 2024 - Inscripciones Abiertas',
      tags: ['tournament', 'banner', 'spring2024'],
      isPublic: true,
      usageLocations: [
        { type: 'homepage_hero', pageId: 1 }
      ],
      metadata: {
        cloudinaryId: 'federacion/banners/torneo-primavera',
        format: 'jpg',
        resourceType: 'image',
        optimized: true
      }
    },
    // Court photos
    {
      micrositeId: microsites[0]?.id,
      userId: clubUsers[0]?.id || users[0].id,
      fileType: 'image',
      fileName: 'cancha-principal-dia.jpg',
      fileUrl: 'https://cloudinary.com/federacion/courts/cancha-principal-dia.jpg',
      fileSize: 1200000,
      mimeType: 'image/jpeg',
      dimensions: {
        width: 2048,
        height: 1536
      },
      thumbnailUrl: 'https://cloudinary.com/federacion/courts/thumb_cancha-principal-dia.jpg',
      altText: 'Cancha principal durante el día',
      caption: 'Vista de nuestra cancha principal con iluminación natural',
      tags: ['court', 'facility', 'daytime'],
      isPublic: true,
      usageLocations: [
        { type: 'court_gallery', courtId: 1 }
      ],
      metadata: {
        cloudinaryId: 'federacion/courts/cancha-principal-dia',
        format: 'jpg',
        resourceType: 'image',
        exif: {
          camera: 'Canon EOS R5',
          lens: '24-70mm f/2.8',
          iso: 200,
          aperture: 'f/5.6',
          shutterSpeed: '1/500'
        }
      }
    },
    // Video content
    {
      micrositeId: microsites[1]?.id,
      userId: partnerUsers[0]?.id || users[0].id,
      fileType: 'video',
      fileName: 'tutorial-servicio.mp4',
      fileUrl: 'https://cloudinary.com/federacion/videos/tutorial-servicio.mp4',
      fileSize: 25000000,
      mimeType: 'video/mp4',
      dimensions: {
        width: 1920,
        height: 1080,
        duration: 180
      },
      thumbnailUrl: 'https://cloudinary.com/federacion/videos/thumb_tutorial-servicio.jpg',
      altText: 'Tutorial de servicio en pickleball',
      caption: 'Aprende la técnica correcta del servicio',
      tags: ['tutorial', 'video', 'training', 'service'],
      isPublic: true,
      usageLocations: [
        { type: 'training_section', pageId: 3 }
      ],
      metadata: {
        cloudinaryId: 'federacion/videos/tutorial-servicio',
        format: 'mp4',
        resourceType: 'video',
        duration: 180,
        bitrate: '5000k',
        codec: 'h264',
        fps: 30
      }
    },
    // PDF document
    {
      micrositeId: null,
      userId: adminUser?.id || users[0].id,
      fileType: 'document',
      fileName: 'reglamento-oficial-2024.pdf',
      fileUrl: 'https://cloudinary.com/federacion/documents/reglamento-oficial-2024.pdf',
      fileSize: 3500000,
      mimeType: 'application/pdf',
      dimensions: null,
      thumbnailUrl: 'https://cloudinary.com/federacion/documents/thumb_reglamento.jpg',
      altText: 'Reglamento Oficial de Pickleball 2024',
      caption: 'Reglamento oficial de la Federación Mexicana de Pickleball',
      tags: ['rules', 'official', 'document', '2024'],
      isPublic: true,
      usageLocations: [
        { type: 'downloads_section', url: '/documentos/reglamento' }
      ],
      metadata: {
        cloudinaryId: 'federacion/documents/reglamento-oficial-2024',
        format: 'pdf',
        resourceType: 'raw',
        pages: 45,
        version: '2024.1'
      }
    },
    // State committee logo
    {
      micrositeId: microsites[2]?.id || microsites[0]?.id,
      userId: stateUsers[0]?.id || users[0].id,
      fileType: 'image',
      fileName: 'logo-comite-cdmx.svg',
      fileUrl: 'https://cloudinary.com/federacion/logos/comite-cdmx.svg',
      fileSize: 45000,
      mimeType: 'image/svg+xml',
      dimensions: {
        width: 300,
        height: 300
      },
      thumbnailUrl: 'https://cloudinary.com/federacion/logos/thumb_comite-cdmx.png',
      altText: 'Logo Comité Estatal CDMX',
      caption: 'Comité Estatal de Pickleball Ciudad de México',
      tags: ['logo', 'state', 'cdmx', 'vector'],
      isPublic: true,
      usageLocations: [
        { type: 'microsite_header', pageId: 5 }
      ],
      metadata: {
        cloudinaryId: 'federacion/logos/comite-cdmx',
        format: 'svg',
        resourceType: 'image',
        vectorFormat: true
      }
    },
    // Private/Restricted file
    {
      micrositeId: null,
      userId: adminUser?.id || users[0].id,
      fileType: 'document',
      fileName: 'acta-reunion-confidencial.pdf',
      fileUrl: 'https://cloudinary.com/federacion/private/acta-reunion.pdf',
      fileSize: 1200000,
      mimeType: 'application/pdf',
      dimensions: null,
      thumbnailUrl: null,
      altText: 'Acta de reunión',
      caption: null,
      tags: ['confidential', 'meeting', 'internal'],
      isPublic: false,
      usageLocations: [],
      metadata: {
        cloudinaryId: 'federacion/private/acta-reunion',
        format: 'pdf',
        resourceType: 'raw',
        accessLevel: 'restricted',
        allowedRoles: ['federation', 'state']
      }
    },
    // Deleted file example
    {
      micrositeId: microsites[0]?.id,
      userId: clubUsers[0]?.id || users[0].id,
      fileType: 'image',
      fileName: 'old-banner.jpg',
      fileUrl: 'https://cloudinary.com/federacion/deleted/old-banner.jpg',
      fileSize: 650000,
      mimeType: 'image/jpeg',
      dimensions: {
        width: 1920,
        height: 600
      },
      thumbnailUrl: null,
      altText: 'Banner antiguo',
      caption: 'Banner del torneo pasado',
      tags: ['deleted', 'archive'],
      isPublic: false,
      usageLocations: [],
      deletedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      metadata: {
        cloudinaryId: 'federacion/deleted/old-banner',
        format: 'jpg',
        resourceType: 'image',
        deletedReason: 'outdated_content'
      }
    }
  ], { returning: true });

  // Create moderation logs
  const moderationLogs = await ModerationLog.bulkCreate([
    {
      micrositeId: microsites[0]?.id,
      moderatorId: adminUser?.id || users[0].id,
      action: 'content_approved',
      targetType: 'page',
      targetId: 1,
      reason: 'Contenido revisado y aprobado para publicación',
      previousState: {
        status: 'pending_review',
        content: 'Draft content'
      },
      newState: {
        status: 'published',
        content: 'Approved content'
      },
      metadata: {
        reviewDuration: 300,
        checklistCompleted: true
      }
    },
    {
      micrositeId: microsites[0]?.id,
      moderatorId: adminUser?.id || users[0].id,
      action: 'content_rejected',
      targetType: 'content_block',
      targetId: 5,
      reason: 'Contenido inapropiado - lenguaje ofensivo detectado',
      previousState: {
        status: 'submitted',
        content: 'Inappropriate content example'
      },
      newState: {
        status: 'rejected',
        content: null
      },
      metadata: {
        violationType: 'offensive_language',
        severity: 'medium'
      }
    },
    {
      micrositeId: microsites[1]?.id || microsites[0]?.id,
      moderatorId: adminUser?.id || users[0].id,
      action: 'content_edited',
      targetType: 'page',
      targetId: 3,
      reason: 'Corrección de información incorrecta sobre horarios',
      previousState: {
        content: 'Horario: 8:00 AM - 6:00 PM',
        lastModified: new Date(Date.now() - 48 * 60 * 60 * 1000)
      },
      newState: {
        content: 'Horario: 6:00 AM - 10:00 PM',
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      metadata: {
        editType: 'factual_correction',
        notifiedOwner: true
      }
    },
    {
      micrositeId: microsites[2]?.id || microsites[0]?.id,
      moderatorId: adminUser?.id || users[0].id,
      action: 'microsite_suspended',
      targetType: 'microsite',
      targetId: microsites[2]?.id || microsites[0]?.id,
      reason: 'Violación repetida de políticas de contenido',
      previousState: {
        status: 'active',
        warnings: 2
      },
      newState: {
        status: 'suspended',
        suspendedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      metadata: {
        violations: ['spam', 'misleading_information'],
        suspensionDuration: 30,
        appealable: true
      }
    },
    {
      micrositeId: microsites[0]?.id,
      moderatorId: adminUser?.id || users[0].id,
      action: 'media_removed',
      targetType: 'media_file',
      targetId: 8,
      reason: 'Imagen con derechos de autor sin permiso',
      previousState: {
        fileId: 8,
        fileName: 'copyrighted-image.jpg',
        status: 'published'
      },
      newState: {
        fileId: 8,
        fileName: 'copyrighted-image.jpg',
        status: 'removed'
      },
      metadata: {
        copyrightClaim: true,
        claimant: 'Original Photographer Inc.',
        removalType: 'immediate'
      }
    },
    {
      micrositeId: microsites[0]?.id,
      moderatorId: adminUser?.id || users[0].id,
      action: 'microsite_restored',
      targetType: 'microsite',
      targetId: microsites[0]?.id,
      reason: 'Apelación exitosa - contenido corregido',
      previousState: {
        status: 'suspended',
        suspendedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      newState: {
        status: 'active',
        restoredAt: new Date()
      },
      metadata: {
        appealId: 'APP-2024-001',
        conditionsAccepted: true,
        probationPeriod: 90
      }
    }
  ], { returning: true });

  console.log(`✅ Seeded ${mediaFiles.length} media files and ${moderationLogs.length} moderation logs`);
  return { mediaFiles, moderationLogs };
};

export default seedMediaAndModeration;