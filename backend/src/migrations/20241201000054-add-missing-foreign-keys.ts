module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint for tournament_registrations.payment_id
    await queryInterface.addConstraint('tournament_registrations', {
      fields: ['payment_id'],
      type: 'foreign key',
      name: 'tournament_registrations_payment_id_fkey',
      references: {
        table: 'payments',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add foreign key constraint for reservations.payment_id
    await queryInterface.addConstraint('reservations', {
      fields: ['payment_id'],
      type: 'foreign key',
      name: 'reservations_payment_id_fkey',
      references: {
        table: 'payments',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add foreign key constraint for conversations.last_message_id
    await queryInterface.addConstraint('conversations', {
      fields: ['last_message_id'],
      type: 'foreign key',
      name: 'conversations_last_message_id_fkey',
      references: {
        table: 'messages',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraints
    await queryInterface.removeConstraint('tournament_registrations', 'tournament_registrations_payment_id_fkey');
    await queryInterface.removeConstraint('reservations', 'reservations_payment_id_fkey');
    await queryInterface.removeConstraint('conversations', 'conversations_last_message_id_fkey');
  }
};