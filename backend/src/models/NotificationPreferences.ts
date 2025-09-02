import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NotificationPreferencesAttributes {
  id: number;
  userId: number;
  
  // Global settings
  globalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  
  // Channel preferences
  preferences: {
    // Tournament notifications
    tournaments: {
      registration_open: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      registration_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      bracket_released: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_scheduled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      results_posted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Court booking notifications
    bookings: {
      booking_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_cancelled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_unavailable: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Player matching notifications
    matches: {
      match_request: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_accepted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_declined: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_suggestion: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // Messaging notifications
    messages: {
      direct_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      group_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      mention: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    
    // System notifications
    system: {
      account_security: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      payment_updates: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      maintenance_alerts: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
  };
}

interface NotificationPreferencesCreationAttributes extends Optional<NotificationPreferencesAttributes, 'id'> {}

class NotificationPreferences extends Model<NotificationPreferencesAttributes, NotificationPreferencesCreationAttributes> implements NotificationPreferencesAttributes {
  public id!: number;
  public userId!: number;
  
  public globalEnabled!: boolean;
  public quietHoursEnabled!: boolean;
  public quietHoursStart!: string;
  public quietHoursEnd!: string;
  
  public preferences!: {
    tournaments: {
      registration_open: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      registration_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      bracket_released: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_scheduled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      results_posted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    bookings: {
      booking_confirmed: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_reminder: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      booking_cancelled: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_unavailable: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    matches: {
      match_request: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_accepted: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      match_declined: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      court_suggestion: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    messages: {
      direct_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      group_message: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      mention: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
    system: {
      account_security: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      payment_updates: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
      maintenance_alerts: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    };
  };
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public user?: any;
}

// Default notification preferences
const DEFAULT_PREFERENCES = {
  tournaments: {
    registration_open: { inApp: true, email: true, sms: false, push: true },
    registration_confirmed: { inApp: true, email: true, sms: true, push: true },
    bracket_released: { inApp: true, email: true, sms: false, push: true },
    match_scheduled: { inApp: true, email: true, sms: true, push: true },
    match_reminder: { inApp: true, email: false, sms: true, push: true },
    results_posted: { inApp: true, email: false, sms: false, push: true }
  },
  bookings: {
    booking_confirmed: { inApp: true, email: true, sms: true, push: true },
    booking_reminder: { inApp: true, email: false, sms: true, push: true },
    booking_cancelled: { inApp: true, email: true, sms: true, push: true },
    court_unavailable: { inApp: true, email: true, sms: true, push: true }
  },
  matches: {
    match_request: { inApp: true, email: false, sms: false, push: true },
    match_accepted: { inApp: true, email: false, sms: false, push: true },
    match_declined: { inApp: true, email: false, sms: false, push: false },
    court_suggestion: { inApp: true, email: false, sms: false, push: true }
  },
  messages: {
    direct_message: { inApp: true, email: false, sms: false, push: true },
    group_message: { inApp: true, email: false, sms: false, push: true },
    mention: { inApp: true, email: false, sms: false, push: true }
  },
  system: {
    account_security: { inApp: true, email: true, sms: true, push: true },
    payment_updates: { inApp: true, email: true, sms: false, push: true },
    maintenance_alerts: { inApp: true, email: true, sms: false, push: true }
  }
};

NotificationPreferences.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'user_id'
  },
  globalEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'global_enabled'
  },
  quietHoursEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'quiet_hours_enabled'
  },
  quietHoursStart: {
    type: DataTypes.STRING(5),
    allowNull: false,
    defaultValue: '22:00',
    field: 'quiet_hours_start',
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      notEmpty: true
    }
  },
  quietHoursEnd: {
    type: DataTypes.STRING(5),
    allowNull: false,
    defaultValue: '08:00',
    field: 'quiet_hours_end',
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      notEmpty: true
    }
  },
  preferences: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: DEFAULT_PREFERENCES,
    validate: {
      isValidPreferences(value: any) {
        if (!value || typeof value !== 'object') {
          throw new Error('Preferences must be an object');
        }
        
        const requiredCategories = ['tournaments', 'bookings', 'matches', 'messages', 'system'];
        for (const category of requiredCategories) {
          if (!value[category] || typeof value[category] !== 'object') {
            throw new Error(`Category ${category} is required and must be an object`);
          }
        }

        // Validate channel structure
        const validateChannels = (channels: any, path: string) => {
          const requiredChannels = ['inApp', 'email', 'sms', 'push'];
          for (const channel of requiredChannels) {
            if (typeof channels[channel] !== 'boolean') {
              throw new Error(`${path}.${channel} must be a boolean`);
            }
          }
        };

        // Validate tournaments
        const tournamentEvents = ['registration_open', 'registration_confirmed', 'bracket_released', 
                                 'match_scheduled', 'match_reminder', 'results_posted'];
        for (const event of tournamentEvents) {
          if (!value.tournaments[event]) {
            throw new Error(`Tournament event ${event} is required`);
          }
          validateChannels(value.tournaments[event], `tournaments.${event}`);
        }

        // Validate bookings
        const bookingEvents = ['booking_confirmed', 'booking_reminder', 'booking_cancelled', 'court_unavailable'];
        for (const event of bookingEvents) {
          if (!value.bookings[event]) {
            throw new Error(`Booking event ${event} is required`);
          }
          validateChannels(value.bookings[event], `bookings.${event}`);
        }

        // Validate matches
        const matchEvents = ['match_request', 'match_accepted', 'match_declined', 'court_suggestion'];
        for (const event of matchEvents) {
          if (!value.matches[event]) {
            throw new Error(`Match event ${event} is required`);
          }
          validateChannels(value.matches[event], `matches.${event}`);
        }

        // Validate messages
        const messageEvents = ['direct_message', 'group_message', 'mention'];
        for (const event of messageEvents) {
          if (!value.messages[event]) {
            throw new Error(`Message event ${event} is required`);
          }
          validateChannels(value.messages[event], `messages.${event}`);
        }

        // Validate system
        const systemEvents = ['account_security', 'payment_updates', 'maintenance_alerts'];
        for (const event of systemEvents) {
          if (!value.system[event]) {
            throw new Error(`System event ${event} is required`);
          }
          validateChannels(value.system[event], `system.${event}`);
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'NotificationPreferences',
  tableName: 'notification_preferences',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['global_enabled']
    },
    {
      fields: ['quiet_hours_enabled']
    }
  ]
});

export default NotificationPreferences;