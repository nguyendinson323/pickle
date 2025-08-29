import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum RankingCategory {
  NATIONAL = 'national',
  STATE = 'state',
  AGE_GROUP = 'age_group',
  GENDER = 'gender',
  TOURNAMENT_LEVEL = 'tournament_level'
}

export enum RankingType {
  OVERALL = 'overall',
  SINGLES = 'singles',
  DOUBLES = 'doubles',
  MIXED_DOUBLES = 'mixed_doubles'
}

interface RankingAttributes {
  id: number;
  playerId: number;
  rankingType: RankingType;
  category: RankingCategory;
  position: number;
  points: number;
  previousPosition: number;
  previousPoints: number;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  tournamentsPlayed: number;
  lastTournamentDate?: Date;
  activityBonus: number;
  decayFactor: number;
  lastCalculated: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RankingCreationAttributes extends Optional<RankingAttributes, 'id' | 'previousPosition' | 'previousPoints' | 'activityBonus' | 'decayFactor' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Ranking extends Model<RankingAttributes, RankingCreationAttributes> implements RankingAttributes {
  public id!: number;
  public playerId!: number;
  public rankingType!: RankingType;
  public category!: RankingCategory;
  public position!: number;
  public points!: number;
  public previousPosition!: number;
  public previousPoints!: number;
  public stateId?: number;
  public ageGroup?: string;
  public gender?: string;
  public tournamentsPlayed!: number;
  public lastTournamentDate?: Date;
  public activityBonus!: number;
  public decayFactor!: number;
  public lastCalculated!: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ranking.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'players',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'player_id'
  },
  rankingType: {
    type: DataTypes.ENUM(...Object.values(RankingType)),
    allowNull: false,
    field: 'ranking_type'
  },
  category: {
    type: DataTypes.ENUM(...Object.values(RankingCategory)),
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  points: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  previousPosition: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'previous_position'
  },
  previousPoints: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'previous_points'
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'states',
      key: 'id'
    },
    field: 'state_id'
  },
  ageGroup: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'age_group'
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  tournamentsPlayed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'tournaments_played'
  },
  lastTournamentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_tournament_date'
  },
  activityBonus: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'activity_bonus'
  },
  decayFactor: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 1.0,
    field: 'decay_factor',
    validate: {
      min: 0,
      max: 1
    }
  },
  lastCalculated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'last_calculated'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
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
  modelName: 'Ranking',
  tableName: 'rankings',
  timestamps: true,
  indexes: [
    {
      fields: ['player_id']
    },
    {
      fields: ['ranking_type', 'category']
    },
    {
      fields: ['category', 'position']
    },
    {
      fields: ['state_id']
    },
    {
      fields: ['age_group']
    },
    {
      fields: ['gender']
    },
    {
      fields: ['points']
    },
    {
      fields: ['is_active']
    },
    {
      unique: true,
      fields: ['player_id', 'ranking_type', 'category', 'state_id', 'age_group', 'gender']
    }
  ]
});

export default Ranking;