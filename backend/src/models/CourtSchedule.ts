import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type BlockType = 'maintenance' | 'private_event' | 'weather' | 'staff_unavailable' | 'other';

interface CourtScheduleAttributes {
  id: number;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  isBlocked: boolean;
  blockType?: BlockType;
  blockReason?: string;
  specialRate?: number;
  notes?: string;
}

interface CourtScheduleCreationAttributes extends Optional<CourtScheduleAttributes, 'id'> {}

class CourtSchedule extends Model<CourtScheduleAttributes, CourtScheduleCreationAttributes> implements CourtScheduleAttributes {
  public id!: number;
  public courtId!: number;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public isBlocked!: boolean;
  public blockType?: BlockType;
  public blockReason?: string;
  public specialRate?: number;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourtSchedule.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  courtId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'courts', key: 'id' },
    field: 'court_id'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'end_time'
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_blocked'
  },
  blockType: {
    type: DataTypes.ENUM('maintenance', 'private_event', 'weather', 'staff_unavailable', 'other'),
    allowNull: true,
    field: 'block_type'
  },
  blockReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'block_reason'
  },
  specialRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'special_rate'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'CourtSchedule',
  tableName: 'court_schedules',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['court_id']
    },
    {
      fields: ['date']
    },
    {
      fields: ['court_id', 'date']
    },
    {
      fields: ['is_blocked']
    }
  ]
});

export default CourtSchedule;