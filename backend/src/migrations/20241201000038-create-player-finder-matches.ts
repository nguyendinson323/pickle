import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('player_finder_matches', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player_finder_requests',
        key: 'id'
      }
    },
    matched_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    distance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    compatibility_score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'expired'),
      allowNull: false,
      defaultValue: 'pending'
    },
    response_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    matched_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    responded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    contact_shared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
  await queryInterface.addIndex('player_finder_matches', ['request_id']);
  await queryInterface.addIndex('player_finder_matches', ['matched_user_id']);
  await queryInterface.addIndex('player_finder_matches', ['status']);
  await queryInterface.addIndex('player_finder_matches', ['matched_at']);
  await queryInterface.addIndex('player_finder_matches', ['compatibility_score']);
  await queryInterface.addIndex('player_finder_matches', ['request_id', 'matched_user_id'], { 
    unique: true
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_finder_matches');
}