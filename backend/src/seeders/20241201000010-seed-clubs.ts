module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('clubs', [
      {
        user_id: 9, // club001
        name: 'Club Pickleball CDMX',
        manager_name: 'Roberto García Vega',
        manager_role: 'Director General',
        contact_email: 'info@pickleballcdmx.mx',
        phone: '+52 55 1234 5678',
        state_id: 9, // Ciudad de México
        club_type: 'Deportivo',
        website: 'https://www.pickleballcdmx.mx',
        has_courts: true,
        plan_type: 'premium',
        created_at: now,
        updated_at: now
      },
      {
        user_id: 10, // club002
        name: 'Club Pickleball Jalisco',
        manager_name: 'Elena Morales Silva',
        manager_role: 'Directora Ejecutiva',
        contact_email: 'contacto@pickleballjalisco.mx',
        phone: '+52 33 9876 5432',
        state_id: 17, // Jalisco
        club_type: 'Deportivo',
        website: 'https://www.pickleballjalisco.mx',
        has_courts: true,
        plan_type: 'basic',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clubs', null, {});
  }
};