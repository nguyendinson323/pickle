import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_privacy_settings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'players',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    show_location: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    show_real_name: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    show_age: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    show_phone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    show_email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    show_skill_level: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    show_ranking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    allow_finder_requests: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    allow_direct_messages: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    allow_tournament_invites: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    allow_club_invites: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    max_distance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25
    },
    online_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'online'
    },
    profile_visibility: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'public'
    },
    location_precision: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'approximate'
    },
    auto_decline_finder_requests: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    block_list: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    preferred_contact_method: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'app'
    },
    notification_preferences: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        newFinderRequest: true,
        finderRequestAccepted: true,
        finderRequestDeclined: true,
        newMessage: true,
        tournamentReminder: true,
        clubUpdate: true
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
  await queryInterface.addIndex('player_privacy_settings', ['player_id']);
  await queryInterface.addIndex('player_privacy_settings', ['allow_finder_requests']);
  await queryInterface.addIndex('player_privacy_settings', ['profile_visibility']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_privacy_settings');
}