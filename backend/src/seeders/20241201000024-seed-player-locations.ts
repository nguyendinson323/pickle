module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const playerLocations = [
      // Player001 current location in Roma Norte
      {
        player_id: 2, // player001
        latitude: 19.418851,
        longitude: -99.166425,
        address: 'Av. Insurgentes 123',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '06100',
        country: 'Mexico',
        is_current_location: true,
        is_travel_location: false,
        travel_start_date: null,
        travel_end_date: null,
        location_name: 'Home - Roma Norte',
        search_radius: 15, // km
        is_active: true,
        privacy_level: 'city',
        accuracy: 10.5, // meters
        last_updated: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      // Player002 current location in Condesa
      {
        player_id: 3, // player002
        latitude: 19.410389,
        longitude: -99.165577,
        address: 'Calle Amsterdam 456',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '06140',
        country: 'Mexico',
        is_current_location: true,
        is_travel_location: false,
        travel_start_date: null,
        travel_end_date: null,
        location_name: 'Condesa Neighborhood',
        search_radius: 20, // km
        is_active: true,
        privacy_level: 'exact',
        accuracy: 8.2, // meters
        last_updated: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
        updated_at: new Date(now.getTime() - 30 * 60 * 1000)
      },
      // Player003 current location in Polanco
      {
        player_id: 4, // player003
        latitude: 19.432608,
        longitude: -99.133209,
        address: 'Av. Paseo de la Reforma 789',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '11560',
        country: 'Mexico',
        is_current_location: true,
        is_travel_location: false,
        travel_start_date: null,
        travel_end_date: null,
        location_name: 'Polanco Business District',
        search_radius: 30, // km - wider search radius
        is_active: true,
        privacy_level: 'state', // More private
        accuracy: 15.0, // meters
        last_updated: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updated_at: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      },
      // Player002 travel location (upcoming trip to Guadalajara)
      {
        player_id: 3, // player002
        latitude: 20.676109,
        longitude: -103.347701,
        address: 'Av. López Mateos Sur 2375',
        city: 'Guadalajara',
        state: 'Jalisco',
        zip_code: '45050',
        country: 'Mexico',
        is_current_location: false,
        is_travel_location: true,
        travel_start_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        travel_end_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location_name: 'Guadalajara Tournament Location',
        search_radius: 25, // km
        is_active: true,
        privacy_level: 'city',
        accuracy: null, // Not measured yet
        last_updated: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      },
      // Coach001 location in Juárez
      {
        player_id: 5, // coach001
        latitude: 19.425000,
        longitude: -99.170000,
        address: 'Calle Genova 321',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '06600',
        country: 'Mexico',
        is_current_location: true,
        is_travel_location: false,
        travel_start_date: null,
        travel_end_date: null,
        location_name: 'Coaching Studio - Juárez',
        search_radius: 35, // km - coach covers wider area
        is_active: true,
        privacy_level: 'city',
        accuracy: 12.8, // meters
        last_updated: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        updated_at: new Date(now.getTime() - 1 * 60 * 60 * 1000)
      },
      // Player001 old location (historical record, not current)
      {
        player_id: 2, // player001
        latitude: 19.400000,
        longitude: -99.150000,
        address: 'Calle Londres 147',
        city: 'Ciudad de México',
        state: 'CDMX',
        zip_code: '06600',
        country: 'Mexico',
        is_current_location: false, // Historical location
        is_travel_location: false,
        travel_start_date: null,
        travel_end_date: null,
        location_name: 'Previous Home - Juárez',
        search_radius: 15, // km
        is_active: false, // Inactive old location
        privacy_level: 'city',
        accuracy: 25.0, // meters
        last_updated: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updated_at: new Date(now.getTime() - 8 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('player_locations', playerLocations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_locations', {});
  }
};