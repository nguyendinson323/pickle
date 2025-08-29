import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlayerPrivacySettingAttributes {
  id: number;
  playerId: number;
  showLocation: boolean;
  showRealName: boolean;
  showAge: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showSkillLevel: boolean;
  showRanking: boolean;
  allowFinderRequests: boolean;
  allowDirectMessages: boolean;
  allowTournamentInvites: boolean;
  allowClubInvites: boolean;
  maxDistance: number; // maximum distance they're willing to travel
  onlineStatus: string; // online, away, busy, offline
  profileVisibility: string; // public, friends_only, private
  locationPrecision: string; // exact, approximate, city_only
  autoDeclineFinderRequests: boolean;
  blockList: number[]; // array of player IDs to block
  preferredContactMethod: string; // app, email, sms
  notificationPreferences: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

interface PlayerPrivacySettingCreationAttributes extends Optional<PlayerPrivacySettingAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PlayerPrivacySetting extends Model<PlayerPrivacySettingAttributes, PlayerPrivacySettingCreationAttributes> implements PlayerPrivacySettingAttributes {
  public id!: number;
  public playerId!: number;
  public showLocation!: boolean;
  public showRealName!: boolean;
  public showAge!: boolean;
  public showPhone!: boolean;
  public showEmail!: boolean;
  public showSkillLevel!: boolean;
  public showRanking!: boolean;
  public allowFinderRequests!: boolean;
  public allowDirectMessages!: boolean;
  public allowTournamentInvites!: boolean;
  public allowClubInvites!: boolean;
  public maxDistance!: number;
  public onlineStatus!: string;
  public profileVisibility!: string;
  public locationPrecision!: string;
  public autoDeclineFinderRequests!: boolean;
  public blockList!: number[];
  public preferredContactMethod!: string;
  public notificationPreferences!: Record<string, boolean>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlayerPrivacySetting.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'players',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'player_id'
  },
  showLocation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'show_location'
  },
  showRealName: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'show_real_name'
  },
  showAge: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'show_age'
  },
  showPhone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'show_phone'
  },
  showEmail: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'show_email'
  },
  showSkillLevel: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'show_skill_level'
  },
  showRanking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'show_ranking'
  },
  allowFinderRequests: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'allow_finder_requests'
  },
  allowDirectMessages: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'allow_direct_messages'
  },
  allowTournamentInvites: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'allow_tournament_invites'
  },
  allowClubInvites: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'allow_club_invites'
  },
  maxDistance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25,
    field: 'max_distance',
    validate: {
      min: 1,
      max: 200
    }
  },
  onlineStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'online',
    field: 'online_status',
    validate: {
      isIn: [['online', 'away', 'busy', 'offline']]
    }
  },
  profileVisibility: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'public',
    field: 'profile_visibility',
    validate: {
      isIn: [['public', 'friends_only', 'private']]
    }
  },
  locationPrecision: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'approximate',
    field: 'location_precision',
    validate: {
      isIn: [['exact', 'approximate', 'city_only']]
    }
  },
  autoDeclineFinderRequests: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'auto_decline_finder_requests'
  },
  blockList: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    field: 'block_list'
  },
  preferredContactMethod: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'app',
    field: 'preferred_contact_method',
    validate: {
      isIn: [['app', 'email', 'sms']]
    }
  },
  notificationPreferences: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      newFinderRequest: true,
      finderRequestAccepted: true,
      finderRequestDeclined: true,
      newMessage: true,
      tournamentReminder: true,
      clubUpdate: true
    },
    field: 'notification_preferences'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'PlayerPrivacySetting',
  tableName: 'player_privacy_settings',
  timestamps: true,
  indexes: [
    {
      fields: ['player_id']
    },
    {
      fields: ['allow_finder_requests']
    },
    {
      fields: ['profile_visibility']
    }
  ]
});

export default PlayerPrivacySetting;