import { NotificationQueue, User, Player } from '../models';
import privacyService from './privacyService';

interface NotificationData {
  type: 'email' | 'sms' | 'push';
  template: string;
  recipient: string;
  subject?: string;
  data: Record<string, any>;
  priority?: number;
  scheduledAt?: Date;
}

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

interface SMSTemplate {
  content: string;
}

interface NotificationTemplates {
  email: Record<string, EmailTemplate>;
  sms: Record<string, SMSTemplate>;
}

class EnhancedNotificationService {
  private readonly SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  private readonly TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  private readonly TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  private readonly TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
  private readonly FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@pickleball.mx';

  private templates: NotificationTemplates = {
    email: {
      'finder_request_new': {
        subject: '¡Nueva solicitud de jugador encontrada!',
        htmlContent: `
          <h2>¡Hola {{playerName}}!</h2>
          <p>Se ha encontrado una nueva solicitud de juego que podría interesarte:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>{{requestTitle}}</h3>
            <p><strong>Descripción:</strong> {{requestDescription}}</p>
            <p><strong>Nivel:</strong> {{skillLevel}}</p>
            <p><strong>Ubicación:</strong> {{location}}</p>
            <p><strong>Distancia:</strong> {{distance}} km</p>
            <p><strong>Puntuación de compatibilidad:</strong> {{matchScore}}%</p>
          </div>
          <p><a href="{{appUrl}}/player-finder/matches" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Ver Solicitud</a></p>
          <p>¡No dejes pasar esta oportunidad de jugar!</p>
        `,
        textContent: `
          ¡Hola {{playerName}}!
          
          Se ha encontrado una nueva solicitud de juego que podría interesarte:
          
          {{requestTitle}}
          Descripción: {{requestDescription}}
          Nivel: {{skillLevel}}
          Ubicación: {{location}}
          Distancia: {{distance}} km
          Puntuación de compatibilidad: {{matchScore}}%
          
          Visita {{appUrl}}/player-finder/matches para ver la solicitud.
          
          ¡No dejes pasar esta oportunidad de jugar!
        `
      },
      'finder_request_accepted': {
        subject: '¡Tu solicitud de jugador fue aceptada!',
        htmlContent: `
          <h2>¡Excelentes noticias, {{playerName}}!</h2>
          <p>{{accepterName}} ha aceptado tu solicitud de juego:</p>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>{{requestTitle}}</h3>
            <p><strong>Mensaje:</strong> {{message}}</p>
            <p><strong>Contacto:</strong> {{accepterContact}}</p>
          </div>
          <p><a href="{{appUrl}}/messages" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Enviar Mensaje</a></p>
          <p>¡Que tengas un excelente partido!</p>
        `,
        textContent: `
          ¡Excelentes noticias, {{playerName}}!
          
          {{accepterName}} ha aceptado tu solicitud de juego:
          
          {{requestTitle}}
          Mensaje: {{message}}
          Contacto: {{accepterContact}}
          
          Visita {{appUrl}}/messages para enviar un mensaje.
          
          ¡Que tengas un excelente partido!
        `
      },
      'new_message': {
        subject: 'Nuevo mensaje de {{senderName}}',
        htmlContent: `
          <h2>¡Tienes un nuevo mensaje!</h2>
          <p><strong>De:</strong> {{senderName}}</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
            <p>{{messageContent}}</p>
          </div>
          <p><a href="{{appUrl}}/messages/{{conversationId}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Responder</a></p>
        `,
        textContent: `
          ¡Tienes un nuevo mensaje!
          
          De: {{senderName}}
          Mensaje: {{messageContent}}
          
          Visita {{appUrl}}/messages/{{conversationId}} para responder.
        `
      },
      'tournament_reminder': {
        subject: 'Recordatorio: {{tournamentName}} mañana',
        htmlContent: `
          <h2>¡Tu torneo es mañana!</h2>
          <p>Hola {{playerName}}, este es un recordatorio de que tienes un torneo mañana:</p>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>{{tournamentName}}</h3>
            <p><strong>Fecha:</strong> {{date}}</p>
            <p><strong>Hora:</strong> {{time}}</p>
            <p><strong>Ubicación:</strong> {{location}}</p>
            <p><strong>Categoría:</strong> {{category}}</p>
          </div>
          <p><a href="{{appUrl}}/tournaments/{{tournamentId}}" style="background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Ver Detalles</a></p>
          <p>¡Buena suerte en tu torneo!</p>
        `,
        textContent: `
          ¡Tu torneo es mañana!
          
          Hola {{playerName}}, este es un recordatorio de que tienes un torneo mañana:
          
          {{tournamentName}}
          Fecha: {{date}}
          Hora: {{time}}
          Ubicación: {{location}}
          Categoría: {{category}}
          
          Visita {{appUrl}}/tournaments/{{tournamentId}} para ver los detalles.
          
          ¡Buena suerte en tu torneo!
        `
      }
    },
    sms: {
      'finder_request_new': {
        content: '¡Nuevo match de jugador! {{playerName}} busca jugar {{skillLevel}} a {{distance}}km. Compatibilidad: {{matchScore}}%. Ver: {{appUrl}}/matches'
      },
      'finder_request_accepted': {
        content: '¡{{accepterName}} aceptó tu solicitud de juego! Mensaje: {{message}}. Contactar: {{appUrl}}/messages'
      },
      'new_message': {
        content: 'Nuevo mensaje de {{senderName}}: {{messagePreview}}. Responder: {{appUrl}}/messages'
      },
      'tournament_reminder': {
        content: 'Recordatorio: {{tournamentName}} mañana {{time}} en {{location}}. ¡Buena suerte!'
      }
    }
  };

  async queueNotification(
    userId: number,
    notificationData: NotificationData
  ): Promise<NotificationQueue> {
    // Check user's notification preferences
    const player = await Player.findOne({
      where: { userId },
      include: [{ model: User, as: 'user' }]
    });

    if (!player) {
      throw new Error('Player not found');
    }

    // Check if this type of notification is enabled
    const notificationKey = this.getNotificationKey(notificationData.template);
    const isEnabled = await privacyService.getNotificationPreference(player.id, notificationKey);
    
    if (!isEnabled) {
      console.log(`Notification ${notificationData.template} disabled for user ${userId}`);
      return Promise.resolve({} as NotificationQueue);
    }

    // Get user's preferred contact method
    const privacySettings = await privacyService.getOrCreatePrivacySettings(player.id);
    
    // Override type based on user preference if not specified
    if (notificationData.type === 'email' && privacySettings.preferredContactMethod === 'sms') {
      notificationData.type = 'sms';
      notificationData.recipient = player.mobilePhone || (player as any).user?.email || '';
    } else if (notificationData.type === 'sms' && privacySettings.preferredContactMethod === 'email') {
      notificationData.type = 'email';
      notificationData.recipient = (player as any).user?.email || '';
    }

    // Generate content from template
    const content = notificationData.type === 'push' 
      ? this.generateContent(notificationData.template, 'email', notificationData.data) // Use email template for push notifications
      : this.generateContent(notificationData.template, notificationData.type, notificationData.data);
    const subject = notificationData.type === 'email' ? this.generateSubject(notificationData.template, notificationData.data) : undefined;

    return await NotificationQueue.create({
      userId,
      type: notificationData.type,
      template: notificationData.template,
      recipient: notificationData.recipient,
      subject: subject || notificationData.subject,
      content,
      data: notificationData.data,
      priority: notificationData.priority || 3,
      scheduledAt: notificationData.scheduledAt || new Date(),
      status: 'pending'
    });
  }

  private getNotificationKey(template: string): string {
    const mapping: Record<string, string> = {
      'finder_request_new': 'newFinderRequest',
      'finder_request_accepted': 'finderRequestAccepted',
      'new_message': 'newMessage',
      'tournament_reminder': 'tournamentReminder'
    };

    return mapping[template] || template;
  }

  private generateContent(template: string, type: 'email' | 'sms', data: Record<string, any>): string {
    const templateData = this.templates[type][template];
    if (!templateData) {
      throw new Error(`Template ${template} not found for ${type}`);
    }

    if (type === 'email') {
      const emailTemplate = templateData as EmailTemplate;
      return this.replaceVariables(emailTemplate.htmlContent, data);
    } else {
      const smsTemplate = templateData as SMSTemplate;
      return this.replaceVariables(smsTemplate.content, data);
    }
  }

  private generateSubject(template: string, data: Record<string, any>): string {
    const templateData = this.templates.email[template];
    if (!templateData) {
      throw new Error(`Email template ${template} not found`);
    }

    return this.replaceVariables(templateData.subject, data);
  }

  private replaceVariables(content: string, data: Record<string, any>): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  async processNotificationQueue(): Promise<void> {
    const { Op } = require('sequelize');
    
    const notifications = await NotificationQueue.findAll({
      where: {
        status: 'pending',
        scheduledAt: { [Op.lte]: new Date() }
      },
      order: [['priority', 'ASC'], ['createdAt', 'ASC']],
      limit: 50
    });

    for (const notification of notifications) {
      try {
        await this.sendNotification(notification);
        
        notification.status = 'sent';
        notification.sentAt = new Date();
        await notification.save();
        
        console.log(`Notification ${notification.id} sent successfully`);
      } catch (error) {
        console.error(`Failed to send notification ${notification.id}:`, error);
        
        notification.retryCount += 1;
        notification.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (notification.retryCount >= notification.maxRetries) {
          notification.status = 'failed';
          notification.failedAt = new Date();
        } else {
          // Schedule retry with exponential backoff
          const retryDelay = Math.pow(2, notification.retryCount) * 60 * 1000; // minutes
          notification.scheduledAt = new Date(Date.now() + retryDelay);
        }
        
        await notification.save();
      }
    }
  }

  private async sendNotification(notification: NotificationQueue): Promise<void> {
    switch (notification.type) {
      case 'email':
        await this.sendEmail(notification);
        break;
      case 'sms':
        await this.sendSMS(notification);
        break;
      case 'push':
        await this.sendPushNotification(notification);
        break;
      default:
        throw new Error(`Unsupported notification type: ${notification.type}`);
    }
  }

  private async sendEmail(notification: NotificationQueue): Promise<void> {
    if (!this.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    const emailData = {
      personalizations: [
        {
          to: [{ email: notification.recipient }],
          subject: notification.subject
        }
      ],
      from: { email: this.FROM_EMAIL, name: 'Pickleball México' },
      content: [
        {
          type: 'text/html',
          value: notification.content
        }
      ]
    };

    // TODO: Replace with actual SendGrid API call
    console.log('Email would be sent via SendGrid:', emailData);
  }

  private async sendSMS(notification: NotificationQueue): Promise<void> {
    if (!this.TWILIO_ACCOUNT_SID || !this.TWILIO_AUTH_TOKEN || !this.TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio credentials not configured');
    }

    
    const messageData = {
      To: notification.recipient,
      From: this.TWILIO_PHONE_NUMBER,
      Body: notification.content
    };

    // TODO: Replace with actual Twilio API call
    console.log('SMS would be sent via Twilio:', messageData);
  }

  private async sendPushNotification(notification: NotificationQueue): Promise<void> {
    // Implement push notification logic here
    // This would typically use a service like Firebase Cloud Messaging
    console.log('Push notification not implemented yet:', notification);
  }

  // Convenience methods for common notifications
  async notifyNewFinderMatch(
    playerId: number,
    matchData: {
      requestTitle: string;
      requestDescription: string;
      skillLevel: string;
      location: string;
      distance: number;
      matchScore: number;
      playerName: string;
      requesterName: string;
    }
  ): Promise<void> {
    const player = await Player.findByPk(playerId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!player) return;

    await this.queueNotification(player.userId, {
      type: 'email',
      template: 'finder_request_new',
      recipient: (player as any).user?.email || '',
      data: {
        ...matchData,
        appUrl: process.env.FRONTEND_URL || 'https://pickleball.mx'
      },
      priority: 2
    });
  }

  async notifyFinderRequestAccepted(
    requesterId: number,
    acceptData: {
      accepterName: string;
      accepterContact: string;
      requestTitle: string;
      message: string;
      playerName: string;
    }
  ): Promise<void> {
    const player = await Player.findOne({
      where: { id: requesterId },
      include: [{ model: User, as: 'user' }]
    });

    if (!player) return;

    await this.queueNotification(player.userId, {
      type: 'email',
      template: 'finder_request_accepted',
      recipient: (player as any).user?.email || '',
      data: {
        ...acceptData,
        appUrl: process.env.FRONTEND_URL || 'https://pickleball.mx'
      },
      priority: 1
    });
  }

  async notifyNewMessage(
    recipientUserId: number,
    messageData: {
      senderName: string;
      messageContent: string;
      messagePreview: string;
      conversationId: number;
    }
  ): Promise<void> {
    const user = await User.findByPk(recipientUserId);
    if (!user) return;

    await this.queueNotification(recipientUserId, {
      type: 'email',
      template: 'new_message',
      recipient: user.email,
      data: {
        ...messageData,
        appUrl: process.env.FRONTEND_URL || 'https://pickleball.mx'
      },
      priority: 3
    });
  }

  async notifyTournamentReminder(
    playerId: number,
    tournamentData: {
      playerName: string;
      tournamentName: string;
      date: string;
      time: string;
      location: string;
      category: string;
      tournamentId: number;
    }
  ): Promise<void> {
    const player = await Player.findByPk(playerId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!player) return;

    await this.queueNotification(player.userId, {
      type: 'email',
      template: 'tournament_reminder',
      recipient: (player as any).user?.email || '',
      data: {
        ...tournamentData,
        appUrl: process.env.FRONTEND_URL || 'https://pickleball.mx'
      },
      priority: 2,
      scheduledAt: new Date() // Send immediately
    });
  }

  async getNotificationStats(): Promise<{
    pending: number;
    sent: number;
    failed: number;
    retrying: number;
  }> {
    const { Op } = require('sequelize');
    
    const [pending, sent, failed, retrying] = await Promise.all([
      NotificationQueue.count({ where: { status: 'pending' } }),
      NotificationQueue.count({ where: { status: 'sent' } }),
      NotificationQueue.count({ where: { status: 'failed' } }),
      NotificationQueue.count({ 
        where: { 
          status: 'pending',
          retryCount: { [Op.gt]: 0 }
        } 
      })
    ]);

    return { pending, sent, failed, retrying };
  }
}

export default new EnhancedNotificationService();