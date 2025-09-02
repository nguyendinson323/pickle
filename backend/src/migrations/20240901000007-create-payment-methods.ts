import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('payment_methods', {
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
      }
    },
    stripe_payment_method_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('card', 'bank_account'),
      allowNull: false
    },
    card: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    bank_account: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    billing_details: {
      type: DataTypes.JSONB,
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

  // Add indexes exactly as defined in the model
  await queryInterface.addIndex('payment_methods', ['user_id']);
  await queryInterface.addIndex('payment_methods', ['stripe_payment_method_id'], { unique: true });
  await queryInterface.addIndex('payment_methods', ['type']);
  await queryInterface.addIndex('payment_methods', ['is_default']);
  await queryInterface.addIndex('payment_methods', ['is_active']);
  await queryInterface.addIndex('payment_methods', ['created_at']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('payment_methods');
}