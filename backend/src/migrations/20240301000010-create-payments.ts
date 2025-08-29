import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('payments', {
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
    membership_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'memberships',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    payment_intent_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true
    },
    stripe_payment_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    payment_type: {
      type: DataTypes.ENUM('membership', 'tournament_registration', 'court_rental', 'merchandise', 'coaching', 'other'),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash', 'check', 'other'),
      allowNull: false
    },
    card_brand: {
      type: DataTypes.ENUM('visa', 'mastercard', 'amex', 'discover', 'other'),
      allowNull: true
    },
    card_last_four: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    fee_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    net_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded'),
      defaultValue: 'pending',
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receipt_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    invoice_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    failure_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    failure_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    refund_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billing_details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    webhook_processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    reconciled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    reconciliation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
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
  await queryInterface.addIndex('payments', ['user_id']);
  await queryInterface.addIndex('payments', ['membership_id']);
  await queryInterface.addIndex('payments', ['payment_intent_id'], { unique: true });
  await queryInterface.addIndex('payments', ['stripe_payment_id'], { unique: true });
  await queryInterface.addIndex('payments', ['transaction_id'], { unique: true });
  await queryInterface.addIndex('payments', ['payment_type']);
  await queryInterface.addIndex('payments', ['payment_method']);
  await queryInterface.addIndex('payments', ['status']);
  await queryInterface.addIndex('payments', ['payment_date']);
  await queryInterface.addIndex('payments', ['due_date']);
  await queryInterface.addIndex('payments', ['amount']);
  await queryInterface.addIndex('payments', ['reconciled']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('payments');
}