import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('invoices', {
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
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    stripe_invoice_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true
    },
    invoice_type: {
      type: DataTypes.ENUM('membership', 'tournament', 'court_rental', 'coaching', 'merchandise', 'other'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'open', 'paid', 'void', 'uncollectible', 'overdue'),
      defaultValue: 'draft',
      allowNull: false
    },
    subtotal: {
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
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    amount_due: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    paid_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    line_items: {
      type: DataTypes.JSON,
      allowNull: true
    },
    billing_address: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tax_details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    discount_details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    payment_terms: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    footer_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pdf_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    hosted_invoice_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    payment_intent_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    collection_method: {
      type: DataTypes.ENUM('charge_automatically', 'send_invoice'),
      defaultValue: 'send_invoice',
      allowNull: false
    },
    auto_advance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    attempt_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    next_payment_attempt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_reminder_sent: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reminder_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
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
  await queryInterface.addIndex('invoices', ['user_id']);
  await queryInterface.addIndex('invoices', ['membership_id']);
  await queryInterface.addIndex('invoices', ['payment_id']);
  await queryInterface.addIndex('invoices', ['invoice_number'], { unique: true });
  await queryInterface.addIndex('invoices', ['stripe_invoice_id'], { unique: true });
  await queryInterface.addIndex('invoices', ['invoice_type']);
  await queryInterface.addIndex('invoices', ['status']);
  await queryInterface.addIndex('invoices', ['issue_date']);
  await queryInterface.addIndex('invoices', ['due_date']);
  await queryInterface.addIndex('invoices', ['paid_date']);
  await queryInterface.addIndex('invoices', ['total_amount']);
  await queryInterface.addIndex('invoices', ['amount_due']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('invoices');
}