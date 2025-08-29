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
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'paid', 'cancelled', 'waitlisted', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    registration_date: {
      type: DataTypes.DATE,
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
      allowNull: false,
      defaultValue: 0
    },
    seed_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_contact: {
      type: DataTypes.JSON,
      allowNull: false
    },
    medical_information: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tshirt_size: {
      type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL'),
      allowNull: true
    },
    dietary_restrictions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transportation_needs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accommodation_needs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    waiver_signed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    waiver_signed_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_checked_in: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    withdrawal_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    withdrawal_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    refund_processed_date: {
      type: DataTypes.DATE,
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
  await queryInterface.addIndex('tournament_registrations', ['status']);
  await queryInterface.addIndex('tournament_registrations', ['registration_date']);
  await queryInterface.addIndex('tournament_registrations', ['tournament_id', 'category_id', 'player_id'], { 
    unique: true,
    name: 'tournament_registrations_unique_constraint'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('tournament_registrations');
}