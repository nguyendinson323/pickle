import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('player_locations', [
    {
      player_id: 1, // Carlos Méndez
      latitude: 19.432608,
      longitude: -99.133209,
      address: 'Av. Reforma 123, Roma Norte, CDMX',
      city: 'Ciudad de México',
      state: 'Ciudad de México',
      zip_code: '06700',
      country: 'Mexico',
      is_current_location: true,
      location_name: 'Casa',
      radius: 15,
      is_public: true,
      accuracy: 10.5,
      last_updated: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('player_locations', {}, {});
}