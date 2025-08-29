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
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    legal_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    business_type: {
      type: DataTypes.ENUM('resort', 'hotel', 'sports_facility', 'equipment_supplier', 'media', 'technology', 'financial', 'other'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    registration_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    founded_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    employee_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    annual_revenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    partnership_type: {
      type: DataTypes.ENUM('sponsor', 'venue_provider', 'service_provider', 'official_supplier', 'media_partner', 'technology_partner'),
      allowNull: false
    },
    partnership_level: {
      type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum', 'title'),
      allowNull: false
    },
    partnership_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    partnership_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    contract_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    payment_terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deliverables: {
      type: DataTypes.JSON,
      allowNull: true
    },
    benefits_offered: {
      type: DataTypes.JSON,
      allowNull: true
    },
    marketing_materials: {
      type: DataTypes.JSON,
      allowNull: true
    },
    event_participation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    tournament_hosting: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    equipment_provision: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    venue_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    media_coverage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    contact_person_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    contact_person_title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_person_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contact_person_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_contact_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    billing_contact_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    billing_address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    payment_method: {
      type: DataTypes.ENUM('bank_transfer', 'credit_card', 'check', 'cash', 'other'),
      allowNull: true
    },
    bank_details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    insurance_coverage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    insurance_provider: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    insurance_policy_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    compliance_certifications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    performance_metrics: {
      type: DataTypes.JSON,
      allowNull: true
    },
    satisfaction_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    renewal_status: {
      type: DataTypes.ENUM('auto_renew', 'review_required', 'terminated', 'expired'),
      defaultValue: 'review_required',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'terminated'),
      defaultValue: 'active',
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
  await queryInterface.addIndex('partners', ['user_id'], { unique: true });
  await queryInterface.addIndex('partners', ['tax_id'], { unique: true });
  await queryInterface.addIndex('partners', ['registration_number'], { unique: true });
  await queryInterface.addIndex('partners', ['state_id']);
  await queryInterface.addIndex('partners', ['business_type']);
  await queryInterface.addIndex('partners', ['partnership_type']);
  await queryInterface.addIndex('partners', ['partnership_level']);
  await queryInterface.addIndex('partners', ['status']);
  await queryInterface.addIndex('partners', ['partnership_start_date']);
  await queryInterface.addIndex('partners', ['partnership_end_date']);
  await queryInterface.addIndex('partners', ['renewal_status']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('partners');
}