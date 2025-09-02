import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type TournamentType = 'championship' | 'league' | 'open' | 'friendly';
export type TournamentLevel = 'national' | 'state' | 'municipal' | 'local';
export type TournamentStatus = 'draft' | 'open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled';

interface TournamentAttributes {
  id: number;
  name: string;
  description: string;
  organizerType: 'federation' | 'state' | 'club' | 'partner';
  organizerId: number;
  tournamentType: TournamentType;
  level: TournamentLevel;
  stateId?: number;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  status: TournamentStatus;
  prizePool: number;
  rulesDocument?: string;
  images: string[];
  requiresRanking: boolean;
  minRankingPoints?: number;
  maxRankingPoints?: number;
  allowLateRegistration: boolean;
  enableWaitingList: boolean;
  registrationMessage?: string;
  sponsorLogos?: string[];
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  socialMediaLinks?: any;
  specialInstructions?: string;
  weatherContingency?: string;
  transportationInfo?: string;
  accommodationInfo?: string;
}

interface TournamentCreationAttributes extends Optional<TournamentAttributes, 'id'> {}

class Tournament extends Model<TournamentAttributes, TournamentCreationAttributes> implements TournamentAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public organizerType!: 'federation' | 'state' | 'club' | 'partner';
  public organizerId!: number;
  public tournamentType!: TournamentType;
  public level!: TournamentLevel;
  public stateId?: number;
  public venueName!: string;
  public venueAddress!: string;
  public venueCity!: string;
  public venueState!: string;
  public startDate!: string;
  public endDate!: string;
  public registrationStart!: string;
  public registrationEnd!: string;
  public entryFee!: number;
  public maxParticipants!: number;
  public currentParticipants!: number;
  public status!: TournamentStatus;
  public prizePool!: number;
  public rulesDocument?: string;
  public images!: string[];
  public requiresRanking!: boolean;
  public minRankingPoints?: number;
  public maxRankingPoints?: number;
  public allowLateRegistration!: boolean;
  public enableWaitingList!: boolean;
  public registrationMessage?: string;
  public sponsorLogos?: string[];
  public contactEmail!: string;
  public contactPhone?: string;
  public websiteUrl?: string;
  public socialMediaLinks?: any;
  public specialInstructions?: string;
  public weatherContingency?: string;
  public transportationInfo?: string;
  public accommodationInfo?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tournament.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  organizerType: {
    type: DataTypes.ENUM('federation', 'state', 'club', 'partner'),
    allowNull: false
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'organizer_id'
  },
  tournamentType: {
    type: DataTypes.ENUM('championship', 'league', 'open', 'friendly'),
    allowNull: false,
    field: 'tournament_type'
  },
  level: {
    type: DataTypes.ENUM('national', 'state', 'municipal', 'local'),
    allowNull: false
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'state_id'
  },
  venueName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'venue_name'
  },
  venueAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'venue_address'
  },
  venueCity: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'venue_city'
  },
  venueState: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'venue_state'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date'
  },
  registrationStart: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'registration_start'
  },
  registrationEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'registration_end'
  },
  entryFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'entry_fee'
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'max_participants'
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'current_participants'
  },
  status: {
    type: DataTypes.ENUM('draft', 'open', 'registration_closed', 'in_progress', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  prizePool: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'prize_pool'
  },
  rulesDocument: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rules_document'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  requiresRanking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'requires_ranking'
  },
  minRankingPoints: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'min_ranking_points'
  },
  maxRankingPoints: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'max_ranking_points'
  },
  allowLateRegistration: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'allow_late_registration'
  },
  enableWaitingList: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'enable_waiting_list'
  },
  registrationMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'registration_message'
  },
  sponsorLogos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    field: 'sponsor_logos'
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contact_email'
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'contact_phone'
  },
  websiteUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'website_url'
  },
  socialMediaLinks: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'social_media_links'
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'special_instructions'
  },
  weatherContingency: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'weather_contingency'
  },
  transportationInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'transportation_info'
  },
  accommodationInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'accommodation_info'
  },
}, {
  sequelize,
  modelName: 'Tournament',
  tableName: 'tournaments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['organizer_type', 'organizer_id']
    },
    {
      fields: ['level']
    },
    {
      fields: ['state_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['start_date']
    },
    {
      fields: ['tournament_type']
    },
    {
      fields: ['registration_start', 'registration_end']
    }
  ]
});

export default Tournament;