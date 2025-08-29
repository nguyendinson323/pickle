import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('tournament_registrations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tournaments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tournament_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    registration_status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'waiting_list', 'cancelled', 'rejected', 'withdrawn'),
      defaultValue: 'pending',
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'partial', 'refunded', 'failed'),
      defaultValue: 'pending',
      allowNull: false
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
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    amount_due: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    entry_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    late_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    discount_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'MXN',
      allowNull: false
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    confirmation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    confirmation_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    seed_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ranking_points_at_registration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ntrp_level_at_registration: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    partner_ranking_points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partner_ntrp_level: {
      type: DataTypes.ENUM('2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0'),
      allowNull: true
    },
    team_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    team_ranking: {
      type: DataTypes.INTEGER,
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
    emergency_contact_relationship: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    medical_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dietary_restrictions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accommodation_needed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    accommodation_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transportation_needed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    transportation_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shirt_size: {
      type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'),
      allowNull: true
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    waiver_signed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    waiver_signed_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    waiver_ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    medical_clearance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    medical_clearance_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    medical_clearance_document: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    insurance_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    insurance_document: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    check_in_status: {
      type: DataTypes.ENUM('pending', 'checked_in', 'no_show'),
      defaultValue: 'pending',
      allowNull: false
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    check_in_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bib_number: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    packet_received: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    packet_received_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    withdrawal_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    withdrawal_reason: {
      type: DataTypes.TEXT,
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    administrative_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referee_assignment: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    court_assignment: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    time_slot_preference: {
      type: DataTypes.JSON,
      allowNull: true
    },
    opponent_preferences: {
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
  await queryInterface.addIndex('tournament_registrations', ['tournament_id']);
  await queryInterface.addIndex('tournament_registrations', ['category_id']);
  await queryInterface.addIndex('tournament_registrations', ['player_id']);
  await queryInterface.addIndex('tournament_registrations', ['partner_id']);
  await queryInterface.addIndex('tournament_registrations', ['payment_id']);
  await queryInterface.addIndex('tournament_registrations', ['confirmation_code'], { unique: true });
  await queryInterface.addIndex('tournament_registrations', ['registration_status']);
  await queryInterface.addIndex('tournament_registrations', ['payment_status']);
  await queryInterface.addIndex('tournament_registrations', ['registration_date']);
  await queryInterface.addIndex('tournament_registrations', ['confirmation_date']);
  await queryInterface.addIndex('tournament_registrations', ['seed_number']);
  await queryInterface.addIndex('tournament_registrations', ['check_in_status']);
  await queryInterface.addIndex('tournament_registrations', ['check_in_date']);
  await queryInterface.addIndex('tournament_registrations', ['waiver_signed']);
  await queryInterface.addIndex('tournament_registrations', ['tournament_id', 'category_id']);
  await queryInterface.addIndex('tournament_registrations', ['player_id', 'partner_id']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_registrations');
}