import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('credentials', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    user_type: {
      type: DataTypes.ENUM('player', 'coach', 'referee', 'club_admin'),
      allowNull: false
    },
    federation_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'FEDERACIÓN MEXICANA DE PICKLEBALL'
    },
    federation_logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    state_name: {
      type: DataTypes.STRING(100),
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
    full_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    nrtp_level: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    affiliation_status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'PENDIENTE'),
      allowNull: false,
      defaultValue: 'ACTIVO'
    },
    ranking_position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    club_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    license_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    federation_id_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '🇲🇽 México'
    },
    photo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    issued_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'suspended', 'revoked', 'pending'),
      allowNull: false,
      defaultValue: 'active'
    },
    verification_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    checksum: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    last_verified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verification_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
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
  await queryInterface.addIndex('credentials', ['user_id']);
  await queryInterface.addIndex('credentials', ['user_type']);
  await queryInterface.addIndex('credentials', ['federation_id_number'], { unique: true });
  await queryInterface.addIndex('credentials', ['status']);
  await queryInterface.addIndex('credentials', ['state_id']);
  await queryInterface.addIndex('credentials', ['expiration_date']);
  await queryInterface.addIndex('credentials', ['checksum']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('credentials');
}