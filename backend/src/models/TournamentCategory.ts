import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'open';
export type GenderRequirement = 'men' | 'women' | 'mixed' | 'open';
export type PlayFormat = 'singles' | 'doubles' | 'mixed_doubles';

interface TournamentCategoryAttributes {
  id: number;
  tournamentId: number;
  name: string;
  description: string;
  minAge?: number;
  maxAge?: number;
  skillLevel?: SkillLevel;
  genderRequirement: GenderRequirement;
  playFormat: PlayFormat;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  minRankingPoints?: number;
  maxRankingPoints?: number;
  prizeDistribution?: any;
  specialRules?: string;
  isActive: boolean;
  registrationDeadline?: string;
}

interface TournamentCategoryCreationAttributes extends Optional<TournamentCategoryAttributes, 'id'> {}

class TournamentCategory extends Model<TournamentCategoryAttributes, TournamentCategoryCreationAttributes> implements TournamentCategoryAttributes {
  public id!: number;
  public tournamentId!: number;
  public name!: string;
  public description!: string;
  public minAge?: number;
  public maxAge?: number;
  public skillLevel?: SkillLevel;
  public genderRequirement!: GenderRequirement;
  public playFormat!: PlayFormat;
  public entryFee!: number;
  public maxParticipants!: number;
  public currentParticipants!: number;
  public minRankingPoints?: number;
  public maxRankingPoints?: number;
  public prizeDistribution?: any;
  public specialRules?: string;
  public isActive!: boolean;
  public registrationDeadline?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TournamentCategory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tournaments', key: 'id' },
    field: 'tournament_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  minAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'min_age'
  },
  maxAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'max_age'
  },
  skillLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'open'),
    allowNull: true,
    field: 'skill_level'
  },
  genderRequirement: {
    type: DataTypes.ENUM('men', 'women', 'mixed', 'open'),
    allowNull: false,
    field: 'gender_requirement'
  },
  playFormat: {
    type: DataTypes.ENUM('singles', 'doubles', 'mixed_doubles'),
    allowNull: false,
    field: 'play_format'
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
  prizeDistribution: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'prize_distribution'
  },
  specialRules: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'special_rules'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  registrationDeadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'registration_deadline'
  },
}, {
  sequelize,
  modelName: 'TournamentCategory',
  tableName: 'tournament_categories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['tournament_id']
    },
    {
      fields: ['play_format']
    },
    {
      fields: ['gender_requirement']
    },
    {
      fields: ['skill_level']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default TournamentCategory;