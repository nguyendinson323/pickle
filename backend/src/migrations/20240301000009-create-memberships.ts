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
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'membership_plans',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    membership_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'cancelled', 'expired', 'pending'),
      defaultValue: 'pending',
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    renewal_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('credit_card', 'bank_transfer', 'cash', 'check', 'paypal', 'other'),
      allowNull: true
    },
    stripe_customer_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    stripe_subscription_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    billing_cycle: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'semi_annual', 'annual'),
      defaultValue: 'annual',
      allowNull: false
    },
    next_billing_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    total_amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    discount_applied: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    discount_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    promo_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    referral_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    referred_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    activation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    suspension_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    suspension_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    features_used: {
      type: DataTypes.JSON,
      allowNull: true
    },
    usage_statistics: {
      type: DataTypes.JSON,
      allowNull: true
    },
    billing_address: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tax_information: {
      type: DataTypes.JSON,
      allowNull: true
    },
    payment_failures_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    last_payment_failure_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    grace_period_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    digital_certificate_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    digital_card_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    qr_code_url: {
      type: DataTypes.STRING(500),
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
  await queryInterface.addIndex('memberships', ['plan_id']);
  await queryInterface.addIndex('memberships', ['membership_number'], { unique: true });
  await queryInterface.addIndex('memberships', ['stripe_subscription_id'], { unique: true });
  await queryInterface.addIndex('memberships', ['status']);
  await queryInterface.addIndex('memberships', ['start_date']);
  await queryInterface.addIndex('memberships', ['end_date']);
  await queryInterface.addIndex('memberships', ['renewal_date']);
  await queryInterface.addIndex('memberships', ['next_billing_date']);
  await queryInterface.addIndex('memberships', ['auto_renew']);
  await queryInterface.addIndex('memberships', ['referred_by_user_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('memberships');
}