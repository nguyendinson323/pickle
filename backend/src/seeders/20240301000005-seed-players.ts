import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('players', [
    {
      user_id: 2, // player001
      full_name: 'Carlos Méndez Rivera',
      date_of_birth: new Date('1990-05-15'),
      gender: 'Male',
      state_id: 7, // Ciudad de México (CDMX)
      curp: 'MERC900515HDFNVR01',
      nrtp_level: '4.0',
      mobile_phone: '+52 55 1234 5678',
      nationality: 'Mexican',
      can_be_found: true,
      is_premium: false,
      ranking_position: 1,
      federation_id_number: 'FMP001',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 3, // player002
      full_name: 'María González López',
      date_of_birth: new Date('1995-08-22'),
      gender: 'Female',
      state_id: 15, // Jalisco (JAL)
      curp: 'GOLM950822MJCLPR02',
      nrtp_level: '3.5',
      mobile_phone: '+52 33 2345 6789',
      nationality: 'Mexican',
      can_be_found: true,
      is_premium: true,
      ranking_position: 2,
      federation_id_number: 'FMP002',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 4, // player003
      full_name: 'Roberto Sánchez Torres',
      date_of_birth: new Date('1988-03-10'),
      gender: 'Male',
      state_id: 19, // Nuevo León (NL)
      curp: 'SATR880310HNLNRB03',
      nrtp_level: '4.5',
      mobile_phone: '+52 81 3456 7890',
      nationality: 'Mexican',
      can_be_found: true,
      is_premium: true,
      ranking_position: 3,
      federation_id_number: 'FMP003',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('players', {}, {});
}