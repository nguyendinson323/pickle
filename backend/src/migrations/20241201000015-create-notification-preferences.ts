import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('notification_preferences', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    global_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    quiet_hours_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    quiet_hours_start: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '22:00'
    },
    quiet_hours_end: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '08:00'
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
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
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  });

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('notification_preferences', ['user_id']);
  await queryInterface.addIndex('notification_preferences', ['global_enabled']);
  await queryInterface.addIndex('notification_preferences', ['quiet_hours_enabled']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('notification_preferences');
}