import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PointCalculationAttributes {
  id: number;
  tournamentId: number;
  playerId: number;
  matchId?: number;
  basePoints: number;
  placementMultiplier: number;
  levelMultiplier: number;
  opponentBonus: number;
  activityBonus: number;
  participationBonus: number;
  totalPoints: number;
  finalPlacement: number;
  totalPlayers: number;
  matchesWon: number;
  matchesLost: number;
  averageOpponentRating: number;
  calculationDetails: Record<string, any>;
  calculatedAt: Date;
}

interface PointCalculationCreationAttributes extends Optional<PointCalculationAttributes, 'id'> {}

class PointCalculation extends Model<PointCalculationAttributes, PointCalculationCreationAttributes> implements PointCalculationAttributes {
  public id!: number;
  public tournamentId!: number;
  public playerId!: number;
  public matchId?: number;
  public basePoints!: number;
  public placementMultiplier!: number;
  public levelMultiplier!: number;
  public opponentBonus!: number;
  public activityBonus!: number;
  public participationBonus!: number;
  public totalPoints!: number;
  public finalPlacement!: number;
  public totalPlayers!: number;
  public matchesWon!: number;
  public matchesLost!: number;
  public averageOpponentRating!: number;
  public calculationDetails!: Record<string, any>;
  public calculatedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PointCalculation.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tournaments',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'tournament_id'
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
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tournament_matches',
      key: 'id'
    },
    field: 'match_id'
  },
  basePoints: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    field: 'base_points'
  },
  placementMultiplier: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    field: 'placement_multiplier'
  },
  levelMultiplier: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'level_multiplier'
  },
  opponentBonus: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'opponent_bonus'
  },
  activityBonus: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'activity_bonus'
  },
  participationBonus: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 1.0,
    field: 'participation_bonus'
  },
  totalPoints: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_points'
  },
  finalPlacement: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'final_placement'
  },
  totalPlayers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_players'
  },
  matchesWon: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'matches_won'
  },
  matchesLost: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'matches_lost'
  },
  averageOpponentRating: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'average_opponent_rating'
  },
  calculationDetails: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    field: 'calculation_details'
  },
  calculatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'calculated_at'
  }
}, {
  sequelize,
  modelName: 'PointCalculation',
  tableName: 'point_calculations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['tournament_id']
    },
    {
      fields: ['player_id']
    },
    {
      fields: ['match_id']
    },
    {
      fields: ['calculated_at']
    },
    {
      unique: true,
      fields: ['tournament_id', 'player_id']
    }
  ]
});

export default PointCalculation;