import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('partners', {
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
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rfc: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contact_person_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contact_person_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    partner_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    social_media: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    plan_type: {
      type: DataTypes.ENUM('premium'),
      defaultValue: 'premium',
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

  // Add indexes
  await queryInterface.addIndex('partners', ['user_id']);
  await queryInterface.addIndex('partners', ['partner_type']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('partners');
}