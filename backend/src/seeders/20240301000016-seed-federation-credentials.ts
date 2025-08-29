import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('credentials', [
    {
      id: uuidv4(),
      user_id: 2,
      user_type: 'player',
      federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
      state_name: 'Ciudad de México',
      state_id: 1,
      full_name: 'Carlos Méndez Rivera',
      nrtp_level: '4.0',
      affiliation_status: 'ACTIVO',
      ranking_position: 1,
      qr_code: 'https://verify.federacionpickleball.mx/FMP-P-001-2024',
      federation_id_number: 'FMP001',
      nationality: '🇲🇽 México',
      issued_date: new Date('2024-01-15'),
      expiration_date: new Date('2025-01-15'),
      status: 'active',
      verification_url: 'https://verify.federacionpickleball.mx/FMP-P-001-2024',
      checksum: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yzab567cdef890',
      verification_count: 0,
      metadata: JSON.stringify({}),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      user_id: 3,
      user_type: 'player',
      federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
      state_name: 'Jalisco',
      state_id: 2,
      full_name: 'Ana García López',
      nrtp_level: '3.5',
      affiliation_status: 'ACTIVO',
      ranking_position: 5,
      qr_code: 'https://verify.federacionpickleball.mx/FMP-P-002-2024',
      federation_id_number: 'FMP002',
      nationality: '🇲🇽 México',
      issued_date: new Date('2024-02-01'),
      expiration_date: new Date('2025-02-01'),
      status: 'active',
      verification_url: 'https://verify.federacionpickleball.mx/FMP-P-002-2024',
      checksum: 'def456ghi789jkl012mno345pqr678stu901vwx234yzab567cdef890abc123',
      verification_count: 2,
      metadata: JSON.stringify({}),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      user_id: 4,
      user_type: 'player',
      federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
      state_name: 'Nuevo León',
      state_id: 3,
      full_name: 'Miguel Torres Hernández',
      nrtp_level: '4.5',
      affiliation_status: 'ACTIVO',
      ranking_position: 2,
      qr_code: 'https://verify.federacionpickleball.mx/FMP-P-003-2024',
      federation_id_number: 'FMP003',
      nationality: '🇲🇽 México',
      issued_date: new Date('2024-01-20'),
      expiration_date: new Date('2025-01-20'),
      status: 'active',
      verification_url: 'https://verify.federacionpickleball.mx/FMP-P-003-2024',
      checksum: 'ghi789jkl012mno345pqr678stu901vwx234yzab567cdef890abc123def456',
      verification_count: 1,
      metadata: JSON.stringify({}),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('credentials', {}, {});
}