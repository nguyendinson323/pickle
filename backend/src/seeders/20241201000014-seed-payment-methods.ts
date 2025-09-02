module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('payment_methods', [
      {
        user_id: 2, // player001
        stripe_payment_method_id: 'pm_card_visa_4242',
        type: 'card',
        card: JSON.stringify({
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2026,
          funding: 'credit'
        }),
        is_default: true,
        is_active: true,
        billing_details: JSON.stringify({
          name: 'Juan García López',
          email: 'juan.garcia@example.com',
          address: {
            line1: 'Av. Insurgentes 123',
            city: 'Ciudad de México',
            state: 'CDMX',
            postal_code: '06100',
            country: 'MX'
          }
        }),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 3, // player002  
        stripe_payment_method_id: 'pm_card_mastercard_5555',
        type: 'card',
        card: JSON.stringify({
          brand: 'mastercard',
          last4: '5555',
          exp_month: 8,
          exp_year: 2025,
          funding: 'debit'
        }),
        is_default: true,
        is_active: true,
        billing_details: JSON.stringify({
          name: 'María González López',
          email: 'maria.gonzalez@example.com',
          address: {
            line1: 'Calle Reforma 456',
            city: 'Guadalajara',
            state: 'JAL',
            postal_code: '44100',
            country: 'MX'
          }
        }),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 4, // player003
        stripe_payment_method_id: 'pm_card_amex_3782',
        type: 'card',
        card: JSON.stringify({
          brand: 'amex',
          last4: '3782',
          exp_month: 3,
          exp_year: 2027,
          funding: 'credit'
        }),
        is_default: true,
        is_active: true,
        billing_details: JSON.stringify({
          name: 'Roberto Sánchez Torres',
          email: 'roberto.sanchez@example.com',
          address: {
            line1: 'Av. Universidad 789',
            city: 'Monterrey',
            state: 'NL',
            postal_code: '64000',
            country: 'MX'
          }
        }),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 9, // club001
        stripe_payment_method_id: 'pm_card_visa_club_1234',
        type: 'card',
        card: JSON.stringify({
          brand: 'visa',
          last4: '1234',
          exp_month: 6,
          exp_year: 2026,
          funding: 'credit'
        }),
        is_default: true,
        is_active: true,
        billing_details: JSON.stringify({
          name: 'Club Roma Norte',
          email: 'admin@clubromanorte.com',
          address: {
            line1: 'Av. Roma Norte 100',
            city: 'Ciudad de México',
            state: 'CDMX',
            postal_code: '06700',
            country: 'MX'
          }
        }),
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_methods', {}, {});
  }
};