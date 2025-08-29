import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

interface InvoiceAttributes {
  id: number;
  invoiceNumber: string;
  userId: number;
  paymentId?: number;
  membershipPlanId?: number;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  description: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  pdfUrl?: string;
  emailedAt?: Date;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public invoiceNumber!: string;
  public userId!: number;
  public paymentId?: number;
  public membershipPlanId?: number;
  public status!: InvoiceStatus;
  public subtotal!: number;
  public taxAmount!: number;
  public totalAmount!: number;
  public currency!: string;
  public description!: string;
  public issueDate!: Date;
  public dueDate!: Date;
  public paidDate?: Date;
  public pdfUrl?: string;
  public emailedAt?: Date;
  public metadata!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'invoice_number'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    field: 'user_id'
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'payments', key: 'id' },
    field: 'payment_id'
  },
  membershipPlanId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'membership_plans', key: 'id' },
    field: 'membership_plan_id'
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'tax_amount'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'mxn'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'issue_date'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'due_date'
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_date'
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'pdf_url'
  },
  emailedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'emailed_at'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'Invoice',
  tableName: 'invoices',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['invoice_number']
    },
    {
      fields: ['status']
    },
    {
      fields: ['due_date']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Invoice;