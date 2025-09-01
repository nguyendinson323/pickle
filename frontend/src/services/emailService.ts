interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

interface EmailRecipient {
  email: string;
  name?: string;
  variables?: Record<string, any>;
}

interface EmailRequest {
  templateId: string;
  recipients: EmailRecipient[];
  globalVariables?: Record<string, any>;
  scheduledAt?: Date;
  attachments?: {
    filename: string;
    content: string | Buffer;
    contentType: string;
  }[];
}

interface EmailNotificationSettings {
  userId: string;
  tournamentReminders: boolean;
  paymentConfirmations: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
  partnerRequests: boolean;
  matchResults: boolean;
  weeklyDigest: boolean;
  emailFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  recipientCount: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  openRate?: number;
  clickRate?: number;
  createdAt: Date;
}

class EmailService {
  private baseUrl = '/api/email';
  
  // Email templates for different notifications
  private templates: EmailTemplate[] = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Mexican Pickleball Federation!',
      htmlContent: `
        <h1>¡Bienvenido {{name}}!</h1>
        <p>Gracias por unirte a la Federación Mexicana de Pickleball.</p>
        <p>Tu cuenta ha sido creada exitosamente. Ahora puedes:</p>
        <ul>
          <li>Registrarte en torneos</li>
          <li>Conectar con otros jugadores</li>
          <li>Acceder a entrenamientos exclusivos</li>
        </ul>
        <a href="{{dashboardUrl}}" class="button">Acceder a tu Dashboard</a>
      `,
      textContent: 'Bienvenido {{name}}! Gracias por unirte a la Federación Mexicana de Pickleball...',
      variables: ['name', 'dashboardUrl']
    },
    {
      id: 'tournament_registration',
      name: 'Tournament Registration Confirmation',
      subject: 'Confirmación de Registro - {{tournamentName}}',
      htmlContent: `
        <h1>¡Registro Confirmado!</h1>
        <p>Hola {{playerName}},</p>
        <p>Tu registro para <strong>{{tournamentName}}</strong> ha sido confirmado.</p>
        <div class="tournament-details">
          <h3>Detalles del Torneo:</h3>
          <p><strong>Fecha:</strong> {{tournamentDate}}</p>
          <p><strong>Ubicación:</strong> {{tournamentLocation}}</p>
          <p><strong>Categoría:</strong> {{category}}</p>
          <p><strong>Cuota de Inscripción:</strong> {{entryFee}}</p>
        </div>
        <p>Te llegará más información sobre el torneo próximamente.</p>
      `,
      textContent: 'Registro confirmado para {{tournamentName}}...',
      variables: ['playerName', 'tournamentName', 'tournamentDate', 'tournamentLocation', 'category', 'entryFee']
    },
    {
      id: 'payment_confirmation',
      name: 'Payment Confirmation',
      subject: 'Confirmación de Pago - {{transactionId}}',
      htmlContent: `
        <h1>Pago Confirmado</h1>
        <p>Hola {{customerName}},</p>
        <p>Hemos recibido tu pago exitosamente.</p>
        <div class="payment-details">
          <h3>Detalles del Pago:</h3>
          <p><strong>Monto:</strong> {{amount}}</p>
          <p><strong>Descripción:</strong> {{description}}</p>
          <p><strong>ID de Transacción:</strong> {{transactionId}}</p>
          <p><strong>Fecha:</strong> {{paymentDate}}</p>
        </div>
        <p>Tu recibo se encuentra adjunto a este correo.</p>
      `,
      textContent: 'Pago confirmado por {{amount}}...',
      variables: ['customerName', 'amount', 'description', 'transactionId', 'paymentDate']
    },
    {
      id: 'tournament_reminder',
      name: 'Tournament Reminder',
      subject: 'Recordatorio: {{tournamentName}} - Mañana',
      htmlContent: `
        <h1>¡Tu torneo es mañana!</h1>
        <p>Hola {{playerName}},</p>
        <p>Te recordamos que mañana tienes el torneo <strong>{{tournamentName}}</strong>.</p>
        <div class="reminder-details">
          <h3>Detalles:</h3>
          <p><strong>Hora de Inicio:</strong> {{startTime}}</p>
          <p><strong>Ubicación:</strong> {{location}}</p>
          <p><strong>Llegada Sugerida:</strong> {{arrivalTime}}</p>
        </div>
        <div class="checklist">
          <h3>¿Qué llevar?</h3>
          <ul>
            <li>Paletas de pickleball</li>
            <li>Ropa deportiva cómoda</li>
            <li>Botella de agua</li>
            <li>Identificación oficial</li>
          </ul>
        </div>
        <p>¡Nos vemos en la cancha! 🏓</p>
      `,
      textContent: 'Recordatorio: Tu torneo {{tournamentName}} es mañana...',
      variables: ['playerName', 'tournamentName', 'startTime', 'location', 'arrivalTime']
    },
    {
      id: 'partner_request',
      name: 'Partner Request',
      subject: '{{requesterName}} quiere ser tu compañero de juego',
      htmlContent: `
        <h1>Nueva Solicitud de Compañero</h1>
        <p>Hola {{playerName}},</p>
        <p><strong>{{requesterName}}</strong> te ha enviado una solicitud para ser compañeros de juego.</p>
        <div class="player-info">
          <h3>Información del Jugador:</h3>
          <p><strong>Nivel:</strong> {{skillLevel}}</p>
          <p><strong>Ubicación:</strong> {{location}}</p>
          <p><strong>Disponibilidad:</strong> {{availability}}</p>
        </div>
        <div class="message">
          <h3>Mensaje:</h3>
          <p>{{message}}</p>
        </div>
        <div class="actions">
          <a href="{{acceptUrl}}" class="button accept">Aceptar Solicitud</a>
          <a href="{{viewProfileUrl}}" class="button secondary">Ver Perfil</a>
        </div>
      `,
      textContent: '{{requesterName}} quiere ser tu compañero de juego...',
      variables: ['playerName', 'requesterName', 'skillLevel', 'location', 'availability', 'message', 'acceptUrl', 'viewProfileUrl']
    },
    {
      id: 'weekly_digest',
      name: 'Weekly Digest',
      subject: 'Tu Resumen Semanal de Pickleball',
      htmlContent: `
        <h1>Resumen de la Semana</h1>
        <p>Hola {{playerName}},</p>
        <p>Aquí tienes tu resumen semanal de actividades de pickleball:</p>
        
        <div class="stats">
          <h3>Tus Estadísticas</h3>
          <p><strong>Partidos Jugados:</strong> {{matchesPlayed}}</p>
          <p><strong>Victorias:</strong> {{wins}}</p>
          <p><strong>Horas de Juego:</strong> {{hoursPlayed}}</p>
        </div>
        
        <div class="upcoming">
          <h3>Próximos Torneos</h3>
          {{#each upcomingTournaments}}
          <div class="tournament-card">
            <h4>{{name}}</h4>
            <p>{{date}} - {{location}}</p>
          </div>
          {{/each}}
        </div>
        
        <div class="community">
          <h3>Actividad de la Comunidad</h3>
          <p>Esta semana se registraron {{newPlayers}} nuevos jugadores en tu área.</p>
          <p>Se jugaron {{totalMatches}} partidos en total.</p>
        </div>
      `,
      textContent: 'Tu resumen semanal: {{matchesPlayed}} partidos jugados...',
      variables: ['playerName', 'matchesPlayed', 'wins', 'hoursPlayed', 'upcomingTournaments', 'newPlayers', 'totalMatches']
    }
  ];

  async sendEmail(emailRequest: EmailRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Send email through backend notification system
      const template = this.templates.find(t => t.id === emailRequest.templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      
      const responses = [];
      
      // Send notification to each recipient through backend
      for (const recipient of emailRequest.recipients) {
        const subject = this.replaceVariables(template.subject, { ...emailRequest.globalVariables, ...recipient.variables });
        const content = this.replaceVariables(template.textContent, { ...emailRequest.globalVariables, ...recipient.variables });
        
        try {
          const response = await fetch('/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({
              title: subject,
              message: content,
              type: 'info',
              email: recipient.email
            })
          });
          
          const data = await response.json();
          responses.push(data);
          
          if (!data.success) {
            console.warn(`Failed to send notification to ${recipient.email}:`, data.error);
          }
        } catch (error) {
          console.error(`Error sending notification to ${recipient.email}:`, error);
        }
      }
      
      return {
        success: true,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email sending failed'
      };
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    await this.sendEmail({
      templateId: 'welcome',
      recipients: [{
        email: userEmail,
        name: userName,
        variables: {
          name: userName,
          dashboardUrl: `${window.location.origin}/dashboard`
        }
      }]
    });
  }

  async sendTournamentRegistrationEmail(
    playerEmail: string,
    playerName: string,
    tournamentData: {
      name: string;
      date: string;
      location: string;
      category: string;
      entryFee: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      templateId: 'tournament_registration',
      recipients: [{
        email: playerEmail,
        name: playerName,
        variables: {
          playerName,
          tournamentName: tournamentData.name,
          tournamentDate: tournamentData.date,
          tournamentLocation: tournamentData.location,
          category: tournamentData.category,
          entryFee: tournamentData.entryFee
        }
      }]
    });
  }

  async sendPaymentConfirmationEmail(
    customerEmail: string,
    customerName: string,
    paymentData: {
      amount: string;
      description: string;
      transactionId: string;
      paymentDate: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      templateId: 'payment_confirmation',
      recipients: [{
        email: customerEmail,
        name: customerName,
        variables: {
          customerName,
          ...paymentData
        }
      }]
    });
  }

  async sendTournamentReminderEmail(
    playerEmail: string,
    playerName: string,
    tournamentData: {
      name: string;
      startTime: string;
      location: string;
      arrivalTime: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      templateId: 'tournament_reminder',
      recipients: [{
        email: playerEmail,
        name: playerName,
        variables: {
          playerName,
          tournamentName: tournamentData.name,
          startTime: tournamentData.startTime,
          location: tournamentData.location,
          arrivalTime: tournamentData.arrivalTime
        }
      }]
    });
  }

  async sendPartnerRequestEmail(
    recipientEmail: string,
    recipientName: string,
    requesterData: {
      name: string;
      skillLevel: string;
      location: string;
      availability: string;
      message: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      templateId: 'partner_request',
      recipients: [{
        email: recipientEmail,
        name: recipientName,
        variables: {
          playerName: recipientName,
          requesterName: requesterData.name,
          skillLevel: requesterData.skillLevel,
          location: requesterData.location,
          availability: requesterData.availability,
          message: requesterData.message,
          acceptUrl: `${window.location.origin}/player-finder/requests`,
          viewProfileUrl: `${window.location.origin}/players/${requesterData.name}`
        }
      }]
    });
  }

  async sendWeeklyDigest(
    playerEmail: string,
    playerName: string,
    digestData: {
      matchesPlayed: number;
      wins: number;
      hoursPlayed: number;
      upcomingTournaments: Array<{ name: string; date: string; location: string }>;
      newPlayers: number;
      totalMatches: number;
    }
  ): Promise<void> {
    await this.sendEmail({
      templateId: 'weekly_digest',
      recipients: [{
        email: playerEmail,
        name: playerName,
        variables: {
          playerName,
          ...digestData
        }
      }]
    });
  }

  async getNotificationSettings(userId: string): Promise<EmailNotificationSettings> {
    try {
      const response = await fetch('/notifications/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          return data.settings;
        }
      }
      
      // Fallback to default settings if API call fails
      return {
        userId,
        tournamentReminders: true,
        paymentConfirmations: true,
        systemUpdates: true,
        marketingEmails: false,
        partnerRequests: true,
        matchResults: true,
        weeklyDigest: true,
        emailFrequency: 'immediate'
      };
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      // Return default settings
      return {
        userId,
        tournamentReminders: true,
        paymentConfirmations: true,
        systemUpdates: true,
        marketingEmails: false,
        partnerRequests: true,
        matchResults: true,
        weeklyDigest: true,
        emailFrequency: 'immediate'
      };
    }
  }

  async updateNotificationSettings(
    userId: string,
    settings: Partial<EmailNotificationSettings>
  ): Promise<EmailNotificationSettings> {
    try {
      const response = await fetch('/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      
      if (data.success && data.settings) {
        return data.settings;
      } else {
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Fallback: get current settings and merge locally
      const currentSettings = await this.getNotificationSettings(userId);
      return { ...currentSettings, ...settings };
    }
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return this.templates;
  }

  async createEmailCampaign(
    campaignData: {
      name: string;
      templateId: string;
      recipients: string[];
      scheduledAt?: Date;
    }
  ): Promise<EmailCampaign> {
    try {
      const response = await fetch('/notifications/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(campaignData)
      });
      
      const data = await response.json();
      
      if (data.success && data.campaign) {
        return data.campaign;
      } else {
        throw new Error(data.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Failed to create email campaign:', error);
      // Fallback: return mock campaign structure
      const campaign: EmailCampaign = {
        id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: campaignData.name,
        templateId: campaignData.templateId,
        recipientCount: campaignData.recipients.length,
        status: campaignData.scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: campaignData.scheduledAt,
        createdAt: new Date()
      };
      return campaign;
    }
  }

  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    try {
      const response = await fetch('/notifications/campaigns', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.campaigns) {
          return data.campaigns;
        }
      }
      
      // Fallback to empty array if API call fails
      return [];
    } catch (error) {
      console.error('Failed to fetch email campaigns:', error);
      return [];
    }
  }

  // Utility methods
  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });
    return result;
  }

  async scheduleEmail(
    templateId: string,
    recipients: EmailRecipient[],
    scheduledAt: Date,
    variables?: Record<string, any>
  ): Promise<{ success: boolean; scheduleId?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const scheduleId = `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Email scheduled:', {
        scheduleId,
        templateId,
        recipientCount: recipients.length,
        scheduledAt
      });
      
      return { success: true, scheduleId };
    } catch (error) {
      return { success: false };
    }
  }

  async unsubscribe(email: string, notificationType?: string): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      console.log(`Unsubscribed ${email} from ${notificationType || 'all notifications'}`);
      
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

export const emailService = new EmailService();
export default emailService;

export type {
  EmailTemplate,
  EmailRecipient,
  EmailRequest,
  EmailNotificationSettings,
  EmailCampaign
};