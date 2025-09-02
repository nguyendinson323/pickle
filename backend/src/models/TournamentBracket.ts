import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type BracketType = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss' | 'pool_play';
export type SeedingMethod = 'ranking' | 'random' | 'manual' | 'regional';

interface TournamentBracketAttributes {
  id: number;
  tournamentId: number;
  categoryId: number;
  name: string;
  bracketType: BracketType;
  seedingMethod: SeedingMethod;
  totalRounds: number;
  currentRound: number;
  isComplete: boolean;
  winnerPlayerId?: number;
  runnerUpPlayerId?: number;
  thirdPlacePlayerId?: number;
  fourthPlacePlayerId?: number;
  bracketData: any;
  seedingData?: any;
  settings: any;
  generatedDate: Date;
  finalizedDate?: Date;
}

interface TournamentBracketCreationAttributes extends Optional<TournamentBracketAttributes, 'id'> {}

class TournamentBracket extends Model<TournamentBracketAttributes, TournamentBracketCreationAttributes> implements TournamentBracketAttributes {
  public id!: number;
  public tournamentId!: number;
  public categoryId!: number;
  public name!: string;
  public bracketType!: BracketType;
  public seedingMethod!: SeedingMethod;
  public totalRounds!: number;
  public currentRound!: number;
  public isComplete!: boolean;
  public winnerPlayerId?: number;
  public runnerUpPlayerId?: number;
  public thirdPlacePlayerId?: number;
  public fourthPlacePlayerId?: number;
  public bracketData!: any;
  public seedingData?: any;
  public settings!: any;
  public generatedDate!: Date;
  public finalizedDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TournamentBracket.init({
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
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tournament_categories', key: 'id' },
    field: 'category_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bracketType: {
    type: DataTypes.ENUM('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'pool_play'),
    allowNull: false,
    field: 'bracket_type'
  },
  seedingMethod: {
    type: DataTypes.ENUM('ranking', 'random', 'manual', 'regional'),
    allowNull: false,
    field: 'seeding_method'
  },
  totalRounds: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_rounds'
  },
  currentRound: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'current_round'
  },
  isComplete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_complete'
  },
  winnerPlayerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'winner_player_id'
  },
  runnerUpPlayerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'runner_up_player_id'
  },
  thirdPlacePlayerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'third_place_player_id'
  },
  fourthPlacePlayerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'fourth_place_player_id'
  },
  bracketData: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'bracket_data'
  },
  seedingData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'seeding_data'
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: false
  },
  generatedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'generated_date'
  },
  finalizedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'finalized_date'
  },
}, {
  sequelize,
  modelName: 'TournamentBracket',
  tableName: 'tournament_brackets',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['tournament_id']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['bracket_type']
    },
    {
      fields: ['is_complete']
    },
    {
      fields: ['generated_date']
    }
  ]
});

export default TournamentBracket;