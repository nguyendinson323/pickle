import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('coaches', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    curp: {
      type: DataTypes.STRING(18),
      allowNull: true,
      unique: true
    },
    nrtp_level: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    mobile_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    profile_photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    id_document_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Mexican'
    },
    license_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ranking_position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    federation_id_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
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

  // Add indexes
  await queryInterface.addIndex('coaches', ['user_id']);
  await queryInterface.addIndex('coaches', ['state_id']);
  await queryInterface.addIndex('coaches', ['curp'], { unique: true });
  await queryInterface.addIndex('coaches', ['federation_id_number'], { unique: true });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('coaches');
}