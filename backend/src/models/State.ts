import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StateAttributes {
  id: number;
  name: string;
  code: string;
}

interface StateCreationAttributes extends Optional<StateAttributes, 'id'> {}

class State extends Model<StateAttributes, StateCreationAttributes> implements StateAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

State.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  modelName: 'State',
  tableName: 'states',
  timestamps: true,
  underscored: true
});

export default State;