import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('states', [
    { name: 'Aguascalientes', code: 'AGU', created_at: new Date() },
    { name: 'Baja California', code: 'BC', created_at: new Date() },
    { name: 'Baja California Sur', code: 'BCS', created_at: new Date() },
    { name: 'Campeche', code: 'CAM', created_at: new Date() },
    { name: 'Chiapas', code: 'CHIS', created_at: new Date() },
    { name: 'Chihuahua', code: 'CHIH', created_at: new Date() },
    { name: 'Ciudad de México', code: 'CDMX', created_at: new Date() },
    { name: 'Coahuila', code: 'COAH', created_at: new Date() },
    { name: 'Colima', code: 'COL', created_at: new Date() },
    { name: 'Durango', code: 'DUR', created_at: new Date() },
    { name: 'Estado de México', code: 'MEX', created_at: new Date() },
    { name: 'Guanajuato', code: 'GTO', created_at: new Date() },
    { name: 'Guerrero', code: 'GRO', created_at: new Date() },
    { name: 'Hidalgo', code: 'HGO', created_at: new Date() },
    { name: 'Jalisco', code: 'JAL', created_at: new Date() },
    { name: 'Michoacán', code: 'MICH', created_at: new Date() },
    { name: 'Morelos', code: 'MOR', created_at: new Date() },
    { name: 'Nayarit', code: 'NAY', created_at: new Date() },
    { name: 'Nuevo León', code: 'NL', created_at: new Date() },
    { name: 'Oaxaca', code: 'OAX', created_at: new Date() },
    { name: 'Puebla', code: 'PUE', created_at: new Date() },
    { name: 'Querétaro', code: 'QRO', created_at: new Date() },
    { name: 'Quintana Roo', code: 'QROO', created_at: new Date() },
    { name: 'San Luis Potosí', code: 'SLP', created_at: new Date() },
    { name: 'Sinaloa', code: 'SIN', created_at: new Date() },
    { name: 'Sonora', code: 'SON', created_at: new Date() },
    { name: 'Tabasco', code: 'TAB', created_at: new Date() },
    { name: 'Tamaulipas', code: 'TAMS', created_at: new Date() },
    { name: 'Tlaxcala', code: 'TLAX', created_at: new Date() },
    { name: 'Veracruz', code: 'VER', created_at: new Date() },
    { name: 'Yucatán', code: 'YUC', created_at: new Date() },
    { name: 'Zacatecas', code: 'ZAC', created_at: new Date() }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('states', {}, {});
}