import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('federation_credentials', {
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
    credential_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    credential_type: {
      type: DataTypes.ENUM('player', 'coach', 'referee', 'official', 'club', 'state_committee', 'partner'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'expired', 'revoked', 'pending'),
      defaultValue: 'pending',
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('basic', 'intermediate', 'advanced', 'professional', 'master', 'national', 'international'),
      defaultValue: 'basic',
      allowNull: false
    },
    issued_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    effective_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    renewal_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    last_renewed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    renewal_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    issued_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'states',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    specializations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    qualifications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    endorsements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    restrictions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    privileges: {
      type: DataTypes.JSON,
      allowNull: true
    },
    requirements_met: {
      type: DataTypes.JSON,
      allowNull: true
    },
    background_check_status: {
      type: DataTypes.ENUM('not_required', 'pending', 'approved', 'rejected', 'expired'),
      defaultValue: 'not_required',
      allowNull: false
    },
    background_check_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    background_check_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    insurance_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    insurance_status: {
      type: DataTypes.ENUM('not_required', 'pending', 'valid', 'expired', 'cancelled'),
      defaultValue: 'not_required',
      allowNull: false
    },
    insurance_expiry_date: {
      type: DataTypes.DATEONLY,
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
    digital_card_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    physical_card_issued: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    physical_card_issued_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    physical_card_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    photo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    signature_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    verification_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    verification_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    annual_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    renewal_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM('not_required', 'pending', 'paid', 'overdue', 'waived'),
      defaultValue: 'not_required',
      allowNull: false
    },
    last_payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    next_payment_due: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    continuing_education_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    continuing_education_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    continuing_education_completed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    continuing_education_due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    performance_evaluations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    disciplinary_actions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    commendations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    tournament_participations: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    coaching_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    officiating_matches: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    volunteer_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    activity_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    compliance_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    overall_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    public_profile: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    contact_authorized: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    directory_listing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    marketing_consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    data_sharing_consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    emergency_contact_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    emergency_contact_relationship: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    medical_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    administrative_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    audit_log: {
      type: DataTypes.JSON,
      allowNull: true
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
  await queryInterface.addIndex('federation_credentials', ['user_id']);
  await queryInterface.addIndex('federation_credentials', ['issued_by']);
  await queryInterface.addIndex('federation_credentials', ['approved_by']);
  await queryInterface.addIndex('federation_credentials', ['state_id']);
  await queryInterface.addIndex('federation_credentials', ['credential_number'], { unique: true });
  await queryInterface.addIndex('federation_credentials', ['credential_type']);
  await queryInterface.addIndex('federation_credentials', ['status']);
  await queryInterface.addIndex('federation_credentials', ['level']);
  await queryInterface.addIndex('federation_credentials', ['issued_date']);
  await queryInterface.addIndex('federation_credentials', ['effective_date']);
  await queryInterface.addIndex('federation_credentials', ['expiry_date']);
  await queryInterface.addIndex('federation_credentials', ['renewal_date']);
  await queryInterface.addIndex('federation_credentials', ['background_check_status']);
  await queryInterface.addIndex('federation_credentials', ['insurance_status']);
  await queryInterface.addIndex('federation_credentials', ['payment_status']);
  await queryInterface.addIndex('federation_credentials', ['next_payment_due']);
  await queryInterface.addIndex('federation_credentials', ['physical_card_issued']);
  await queryInterface.addIndex('federation_credentials', ['public_profile']);
  await queryInterface.addIndex('federation_credentials', ['user_id', 'credential_type']);
  await queryInterface.addIndex('federation_credentials', ['credential_type', 'status']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('federation_credentials');
}