import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { RankingType, RankingCategory } from './Ranking';

interface RankingHistoryAttributes {
  id: number;
  playerId: number;
  rankingType: RankingType;
  category: RankingCategory;
  oldPosition: number;
  newPosition: number;
  oldPoints: number;
  newPoints: number;
  pointsChange: number;
  positionChange: number;
  changeReason: string;
  tournamentId?: number;
  changeDate: Date;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RankingHistoryCreationAttributes extends Optional<RankingHistoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class RankingHistory extends Model<RankingHistoryAttributes, RankingHistoryCreationAttributes> implements RankingHistoryAttributes {
  public id!: number;
  public playerId!: number;
  public rankingType!: RankingType;
  public category!: RankingCategory;
  public oldPosition!: number;
  public newPosition!: number;
  public oldPoints!: number;
  public newPoints!: number;
  public pointsChange!: number;
  public positionChange!: number;
  public changeReason!: string;
  public tournamentId?: number;
  public changeDate!: Date;
  public stateId?: number;
  public ageGroup?: string;
  public gender?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RankingHistory.init({
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
  oldPosition: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'old_position'
  },
  newPosition: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'new_position'
  },
  oldPoints: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'old_points'
  },
  newPoints: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'new_points'
  },
  pointsChange: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'points_change'
  },
  positionChange: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'position_change'
  },
  changeReason: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'change_reason'
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tournaments',
      key: 'id'
    },
    field: 'tournament_id'
  },
  changeDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'change_date'
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
  modelName: 'RankingHistory',
  tableName: 'ranking_history',
  timestamps: true,
  indexes: [
    {
      fields: ['player_id']
    },
    {
      fields: ['ranking_type', 'category']
    },
    {
      fields: ['change_date']
    },
    {
      fields: ['tournament_id']
    },
    {
      fields: ['state_id']
    }
  ]
});

export default RankingHistory;