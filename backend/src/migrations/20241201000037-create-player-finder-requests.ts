import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_finder_requests', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    requester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player_locations',
        key: 'id'
      }
    },
    nrtp_level_min: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    nrtp_level_max: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    preferred_gender: {
      type: DataTypes.ENUM('male', 'female', 'any'),
      allowNull: true,
      defaultValue: 'any'
    },
    preferred_age_min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preferred_age_max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    search_radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25
    },
    available_time_slots: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  });

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('player_finder_requests', ['requester_id']);
  await queryInterface.addIndex('player_finder_requests', ['location_id']);
  await queryInterface.addIndex('player_finder_requests', ['is_active', 'expires_at']);
  await queryInterface.addIndex('player_finder_requests', ['preferred_gender']);
  await queryInterface.addIndex('player_finder_requests', ['nrtp_level_min', 'nrtp_level_max']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_finder_requests');
}