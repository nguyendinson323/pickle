module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('states', [
      { name: 'Aguascalientes', code: 'AGU', created_at: now, updated_at: now },
      { name: 'Baja California', code: 'BC', created_at: now, updated_at: now },
      { name: 'Baja California Sur', code: 'BCS', created_at: now, updated_at: now },
      { name: 'Campeche', code: 'CAM', created_at: now, updated_at: now },
      { name: 'Chiapas', code: 'CHIS', created_at: now, updated_at: now },
      { name: 'Chihuahua', code: 'CHIH', created_at: now, updated_at: now },
      { name: 'Ciudad de México', code: 'CDMX', created_at: now, updated_at: now },
      { name: 'Coahuila', code: 'COAH', created_at: now, updated_at: now },
      { name: 'Colima', code: 'COL', created_at: now, updated_at: now },
      { name: 'Durango', code: 'DUR', created_at: now, updated_at: now },
      { name: 'Estado de México', code: 'MEX', created_at: now, updated_at: now },
      { name: 'Guanajuato', code: 'GTO', created_at: now, updated_at: now },
      { name: 'Guerrero', code: 'GRO', created_at: now, updated_at: now },
      { name: 'Hidalgo', code: 'HGO', created_at: now, updated_at: now },
      { name: 'Jalisco', code: 'JAL', created_at: now, updated_at: now },
      { name: 'Michoacán', code: 'MICH', created_at: now, updated_at: now },
      { name: 'Morelos', code: 'MOR', created_at: now, updated_at: now },
      { name: 'Nayarit', code: 'NAY', created_at: now, updated_at: now },
      { name: 'Nuevo León', code: 'NL', created_at: now, updated_at: now },
      { name: 'Oaxaca', code: 'OAX', created_at: now, updated_at: now },
      { name: 'Puebla', code: 'PUE', created_at: now, updated_at: now },
      { name: 'Querétaro', code: 'QRO', created_at: now, updated_at: now },
      { name: 'Quintana Roo', code: 'QROO', created_at: now, updated_at: now },
      { name: 'San Luis Potosí', code: 'SLP', created_at: now, updated_at: now },
      { name: 'Sinaloa', code: 'SIN', created_at: now, updated_at: now },
      { name: 'Sonora', code: 'SON', created_at: now, updated_at: now },
      { name: 'Tabasco', code: 'TAB', created_at: now, updated_at: now },
      { name: 'Tamaulipas', code: 'TAMS', created_at: now, updated_at: now },
      { name: 'Tlaxcala', code: 'TLAX', created_at: now, updated_at: now },
      { name: 'Veracruz', code: 'VER', created_at: now, updated_at: now },
      { name: 'Yucatán', code: 'YUC', created_at: now, updated_at: now },
      { name: 'Zacatecas', code: 'ZAC', created_at: now, updated_at: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('states', null, {});
  }
};