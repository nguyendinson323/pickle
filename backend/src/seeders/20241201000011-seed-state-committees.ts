module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('state_committees', [
      {
        user_id: 2, // player001 (representing state committee)
        name: 'Comité CDMX de Pickleball',
        rfc: 'CCP240101ABC',
        president_name: 'Ana Patricia Ruiz',
        president_title: 'Presidenta',
        institutional_email: 'cdmx@federacionpickleball.mx',
        phone: '+52 55 3030 4040',
        state_id: 9, // Ciudad de México
        affiliate_type: 'Comité Estatal',
        website: 'https://cdmx.federacionpickleball.mx',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('state_committees', null, {});
  }
};