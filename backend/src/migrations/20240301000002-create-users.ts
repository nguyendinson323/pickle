import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('player', 'coach', 'club', 'partner', 'state', 'federation'),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
      allowNull: true
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
  await queryInterface.addIndex('users', ['email'], { unique: true });
  await queryInterface.addIndex('users', ['username'], { unique: true });
  await queryInterface.addIndex('users', ['role']);
  await queryInterface.addIndex('users', ['is_active']);
  await queryInterface.addIndex('users', ['email_verified']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('users');
}