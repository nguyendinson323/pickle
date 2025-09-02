import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PaymentMethodAttributes {
  id: number;
  userId: number;
  stripePaymentMethodId: string;
  
  // Payment Method Details
  type: 'card' | 'bank_account';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    country: string;
  };
  
  bankAccount?: {
    bankName: string;
    last4: string;
    accountType: 'checking' | 'savings';
    routingNumber: string;
  };
  
  // Settings
  isDefault: boolean;
  isActive: boolean;
  
  // Billing Details
  billingDetails: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
}

interface PaymentMethodCreationAttributes extends Optional<PaymentMethodAttributes, 'id' | 'card' | 'bankAccount'> {}

class PaymentMethod extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes> implements PaymentMethodAttributes {
  public id!: number;
  public userId!: number;
  public stripePaymentMethodId!: string;
  
  public type!: 'card' | 'bank_account';
  public card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    country: string;
  };
  
  public bankAccount?: {
    bankName: string;
    last4: string;
    accountType: 'checking' | 'savings';
    routingNumber: string;
  };
  
  public isDefault!: boolean;
  public isActive!: boolean;
  
  public billingDetails!: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  
  // Association properties
  public user?: any;
}

PaymentMethod.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  stripePaymentMethodId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'stripe_payment_method_id'
  },
  type: {
    type: DataTypes.ENUM('card', 'bank_account'),
    allowNull: false
  },
  card: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidCard(value: any) {
        if (this.type === 'card' && value) {
          if (!value.brand || !value.last4 || !value.expMonth || !value.expYear || !value.funding || !value.country) {
            throw new Error('Card must include brand, last4, expMonth, expYear, funding, and country');
          }
          
          if (!['credit', 'debit', 'prepaid', 'unknown'].includes(value.funding)) {
            throw new Error('Invalid card funding type');
          }
          
          if (value.expMonth < 1 || value.expMonth > 12) {
            throw new Error('Invalid expiration month');
          }
          
          if (value.expYear < new Date().getFullYear()) {
            throw new Error('Card is expired');
          }
        }
      }
    }
  },
  bankAccount: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'bank_account',
    validate: {
      isValidBankAccount(value: any) {
        if (this.type === 'bank_account' && value) {
          if (!value.bankName || !value.last4 || !value.accountType || !value.routingNumber) {
            throw new Error('Bank account must include bankName, last4, accountType, and routingNumber');
          }
          
          if (!['checking', 'savings'].includes(value.accountType)) {
            throw new Error('Invalid account type');
          }
        }
      }
    }
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_default'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  billingDetails: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    field: 'billing_details',
    validate: {
      isValidBillingDetails(value: any) {
        if (value && typeof value !== 'object') {
          throw new Error('Billing details must be an object');
        }
        
        if (value && value.address && typeof value.address !== 'object') {
          throw new Error('Address must be an object');
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'PaymentMethod',
  tableName: 'payment_methods',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['stripe_payment_method_id'],
      unique: true
    },
    {
      fields: ['type']
    },
    {
      fields: ['is_default']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default PaymentMethod;