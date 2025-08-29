import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('coaches', [
    {
      user_id: 5, // coach001
      full_name: 'Luis Hernández Morales',
      date_of_birth: new Date('1982-07-18'),
      gender: 'Male',
      state_id: 19, // Nuevo León (NL)
      curp: 'HEML820718HNLRLS01',
      nrtp_level: '5.0',
      mobile_phone: '+52 81 4567 8901',
      nationality: 'Mexican',
      license_type: 'Certificado Nacional',
      ranking_position: 1,
      federation_id_number: 'FMC001',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 6, // coach002
      full_name: 'Ana Patricia Ruiz Vega',
      date_of_birth: new Date('1978-12-03'),
      gender: 'Female',
      state_id: 7, // Ciudad de México
      curp: 'RUPA781203MDFNNT02',
      nrtp_level: '5.0+',
      mobile_phone: '+52 55 5678 9012',
      nationality: 'Mexican',
      license_type: 'Certificado Master',
      ranking_position: 2,
      federation_id_number: 'FMC002',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('coaches', {}, {});
}