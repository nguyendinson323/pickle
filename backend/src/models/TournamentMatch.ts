import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'walkover' | 'retired' | 'cancelled' | 'postponed';
export type MatchRound = 'qualification' | 'round_32' | 'round_16' | 'quarterfinal' | 'semifinal' | 'final' | 'bronze_match';

interface SetScore {
  player1Score: number;
  player2Score: number;
  tiebreak?: {
    player1Score: number;
    player2Score: number;
  };
}

interface MatchScore {
  sets: SetScore[];
  retired: boolean;
  walkover: boolean;
  winner: 1 | 2 | null;
}

interface TournamentMatchAttributes {
  id: number;
  tournamentId: number;
  categoryId: number;
  bracketId?: number;
  round: MatchRound;
  matchNumber: number;
  courtId?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  actualStartTime?: Date;
  actualEndTime?: Date;
  player1Id?: number;
  player2Id?: number;
  player1PartnerId?: number;
  player2PartnerId?: number;
  score?: MatchScore;
  winnerId?: number;
  loserId?: number;
  status: MatchStatus;
  refereeId?: number;
  notes?: string;
  videoUrl?: string;
  liveStreamUrl?: string;
  nextMatchId?: number;
  prevMatch1Id?: number;
  prevMatch2Id?: number;
  isThirdPlaceMatch: boolean;
  courtAssignment?: string;
  warmupTime?: number;
  estimatedDuration?: number;
  spectatorCount?: number;
  weatherConditions?: string;
}

interface TournamentMatchCreationAttributes extends Optional<TournamentMatchAttributes, 'id'> {}

class TournamentMatch extends Model<TournamentMatchAttributes, TournamentMatchCreationAttributes> implements TournamentMatchAttributes {
  public id!: number;
  public tournamentId!: number;
  public categoryId!: number;
  public bracketId?: number;
  public round!: MatchRound;
  public matchNumber!: number;
  public courtId?: number;
  public scheduledDate?: string;
  public scheduledTime?: string;
  public actualStartTime?: Date;
  public actualEndTime?: Date;
  public player1Id?: number;
  public player2Id?: number;
  public player1PartnerId?: number;
  public player2PartnerId?: number;
  public score?: MatchScore;
  public winnerId?: number;
  public loserId?: number;
  public status!: MatchStatus;
  public refereeId?: number;
  public notes?: string;
  public videoUrl?: string;
  public liveStreamUrl?: string;
  public nextMatchId?: number;
  public prevMatch1Id?: number;
  public prevMatch2Id?: number;
  public isThirdPlaceMatch!: boolean;
  public courtAssignment?: string;
  public warmupTime?: number;
  public estimatedDuration?: number;
  public spectatorCount?: number;
  public weatherConditions?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TournamentMatch.init({
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
  bracketId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'tournament_brackets', key: 'id' },
    field: 'bracket_id'
  },
  round: {
    type: DataTypes.ENUM('qualification', 'round_32', 'round_16', 'quarterfinal', 'semifinal', 'final', 'bronze_match'),
    allowNull: false
  },
  matchNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'match_number'
  },
  courtId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'courts', key: 'id' },
    field: 'court_id'
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'scheduled_date'
  },
  scheduledTime: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'scheduled_time'
  },
  actualStartTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'actual_start_time'
  },
  actualEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'actual_end_time'
  },
  player1Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'player1_id'
  },
  player2Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'player2_id'
  },
  player1PartnerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'player1_partner_id'
  },
  player2PartnerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'player2_partner_id'
  },
  score: {
    type: DataTypes.JSON,
    allowNull: true
  },
  winnerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'winner_id'
  },
  loserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'loser_id'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'walkover', 'retired', 'cancelled', 'postponed'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  refereeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    field: 'referee_id'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'video_url'
  },
  liveStreamUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'live_stream_url'
  },
  nextMatchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'tournament_matches', key: 'id' },
    field: 'next_match_id'
  },
  prevMatch1Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'tournament_matches', key: 'id' },
    field: 'prev_match1_id'
  },
  prevMatch2Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'tournament_matches', key: 'id' },
    field: 'prev_match2_id'
  },
  isThirdPlaceMatch: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_third_place_match'
  },
  courtAssignment: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'court_assignment'
  },
  warmupTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'warmup_time'
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'estimated_duration'
  },
  spectatorCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'spectator_count'
  },
  weatherConditions: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'weather_conditions'
  },
}, {
  sequelize,
  modelName: 'TournamentMatch',
  tableName: 'tournament_matches',
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
      fields: ['status']
    },
    {
      fields: ['scheduled_date', 'scheduled_time']
    },
    {
      fields: ['court_id']
    },
    {
      fields: ['referee_id']
    },
    {
      fields: ['round']
    }
  ]
});

export default TournamentMatch;