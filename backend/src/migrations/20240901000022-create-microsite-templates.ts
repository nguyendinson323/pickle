import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('microsite_templates', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('club', 'state_committee', 'general'),
      allowNull: false,
      defaultValue: 'general'
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    structure: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        colorScheme: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#06b6d4',
          background: '#ffffff',
          text: '#1e293b'
        },
        pages: [],
        availableComponents: []
      }
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    required_plan: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0.0'
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
  await queryInterface.addIndex('microsite_templates', ['category']);
  await queryInterface.addIndex('microsite_templates', ['is_active']);
  await queryInterface.addIndex('microsite_templates', ['is_premium']);

  // Add GIN indexes for JSONB fields
  await queryInterface.addIndex('microsite_templates', ['structure'], {
    using: 'gin'
  });
  await queryInterface.addIndex('microsite_templates', ['features'], {
    using: 'gin'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('microsite_templates');
}