module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('user_management', 'content_moderation', 'system_config', 'financial', 'tournament', 'communication'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      target_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      previous_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      new_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      ip_address: {
        type: Sequelize.INET,
        allowNull: false
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      severity: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium'
      },
      affected_users: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('success', 'failed', 'partial'),
        allowNull: false,
        defaultValue: 'success'
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    });

    // Add indexes exactly as defined in the model
    await queryInterface.addIndex('admin_logs', ['admin_id']);
    await queryInterface.addIndex('admin_logs', ['action']);
    await queryInterface.addIndex('admin_logs', ['category']);
    await queryInterface.addIndex('admin_logs', ['severity']);
    await queryInterface.addIndex('admin_logs', ['status']);
    await queryInterface.addIndex('admin_logs', ['created_at']);
    await queryInterface.addIndex('admin_logs', ['target_id', 'target_type']);

    // Add GIN indexes for JSONB fields
    await queryInterface.addIndex('admin_logs', ['previous_data'], {
      using: 'gin'
    });
    await queryInterface.addIndex('admin_logs', ['new_data'], {
      using: 'gin'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admin_logs');
  }
};