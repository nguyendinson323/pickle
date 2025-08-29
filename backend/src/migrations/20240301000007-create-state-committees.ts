import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('state_committees', {
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
    committee_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    president_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    president_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    president_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    vice_president_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    secretary_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    treasurer_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
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
    registration_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    established_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    recognition_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    member_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    club_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    coach_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    tournament_count_annual: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    annual_budget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    funding_sources: {
      type: DataTypes.JSON,
      allowNull: true
    },
    programs_offered: {
      type: DataTypes.JSON,
      allowNull: true
    },
    facilities_managed: {
      type: DataTypes.JSON,
      allowNull: true
    },
    events_calendar: {
      type: DataTypes.JSON,
      allowNull: true
    },
    board_members: {
      type: DataTypes.JSON,
      allowNull: true
    },
    meeting_schedule: {
      type: DataTypes.JSON,
      allowNull: true
    },
    bylaws_document: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    strategic_plan_document: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    annual_report: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    insurance_provider: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    insurance_policy_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bank_account_details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    achievements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    partnerships: {
      type: DataTypes.JSON,
      allowNull: true
    },
    contact_hours: {
      type: DataTypes.JSON,
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'dissolved'),
      defaultValue: 'active',
      allowNull: false
    },
    accreditation_status: {
      type: DataTypes.ENUM('pending', 'accredited', 'probationary', 'suspended', 'revoked'),
      defaultValue: 'pending',
      allowNull: false
    },
    accreditation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    accreditation_expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    last_audit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    next_audit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    compliance_notes: {
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
  await queryInterface.addIndex('state_committees', ['user_id'], { unique: true });
  await queryInterface.addIndex('state_committees', ['state_id'], { unique: true });
  await queryInterface.addIndex('state_committees', ['registration_number'], { unique: true });
  await queryInterface.addIndex('state_committees', ['tax_id'], { unique: true });
  await queryInterface.addIndex('state_committees', ['status']);
  await queryInterface.addIndex('state_committees', ['accreditation_status']);
  await queryInterface.addIndex('state_committees', ['established_date']);
  await queryInterface.addIndex('state_committees', ['city']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('state_committees');
}