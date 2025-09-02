import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('memberships', {
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
    membership_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'membership_plans',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'),
      allowNull: false,
      defaultValue: 'pending'
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    stripe_subscription_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    renewal_reminder_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    expiration_reminder_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancel_reason: {
      type: DataTypes.TEXT,
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
  await queryInterface.addIndex('memberships', ['user_id']);
  await queryInterface.addIndex('memberships', ['membership_plan_id']);
  await queryInterface.addIndex('memberships', ['status']);
  await queryInterface.addIndex('memberships', ['end_date']);
  await queryInterface.addIndex('memberships', ['stripe_subscription_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('memberships');
}