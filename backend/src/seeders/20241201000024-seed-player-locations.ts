module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const playerLocations = [
      // Player locations in CDMX
      {
        user_id: 2, // player001
        current_latitude: 19.418851,
        current_longitude: -99.166425,
        address: JSON.stringify({
          street: 'Av. Insurgentes 123',
          neighborhood: 'Roma Norte',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '06100',
          country: 'México'
        }),
        location_accuracy: 10, // meters
        is_sharing_location: true,
        sharing_radius_km: 15,
        preferred_travel_distance_km: 10,
        transportation_modes: JSON.stringify(['car', 'public_transport', 'uber']),
        availability_zones: JSON.stringify([
          'Roma Norte',
          'Condesa',
          'Polanco',
          'Centro Histórico',
          'Doctores'
        ]),
        home_court_preferences: JSON.stringify([
          { court_id: 1, preference_score: 5 },
          { court_id: 2, preference_score: 4 }
        ]),
        last_location_update: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        location_sharing_expires: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
        privacy_level: 'friends_and_matches',
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        user_id: 3, // player002
        current_latitude: 19.410389,
        current_longitude: -99.165577,
        address: JSON.stringify({
          street: 'Calle Michoacán 456',
          neighborhood: 'Condesa',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '06140',
          country: 'México'
        }),
        location_accuracy: 5,
        is_sharing_location: true,
        sharing_radius_km: 20,
        preferred_travel_distance_km: 12,
        transportation_modes: JSON.stringify(['car', 'bike', 'walking']),
        availability_zones: JSON.stringify([
          'Condesa',
          'Roma Norte',
          'Roma Sur',
          'Del Valle',
          'Narvarte'
        ]),
        home_court_preferences: JSON.stringify([
          { court_id: 4, preference_score: 5 }, // Academia Condesa
          { court_id: 2, preference_score: 4 }
        ]),
        last_location_update: new Date(now.getTime() - 30 * 60 * 1000),
        location_sharing_expires: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        privacy_level: 'public',
        created_at: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 30 * 60 * 1000)
      },
      {
        user_id: 4, // player003
        current_latitude: 19.432608,
        current_longitude: -99.133209,
        address: JSON.stringify({
          street: 'Av. Reforma 789',
          neighborhood: 'Juárez',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '06600',
          country: 'México'
        }),
        location_accuracy: 15,
        is_sharing_location: false,
        sharing_radius_km: 5,
        preferred_travel_distance_km: 8,
        transportation_modes: JSON.stringify(['public_transport', 'uber']),
        availability_zones: JSON.stringify([
          'Centro Histórico',
          'Juárez',
          'Roma Norte',
          'Doctores'
        ]),
        home_court_preferences: JSON.stringify([
          { court_id: 1, preference_score: 3 }
        ]),
        last_location_update: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        location_sharing_expires: null, // Not sharing
        privacy_level: 'private',
        created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      // Coach locations
      {
        user_id: 5, // coach001
        current_latitude: 19.425000,
        current_longitude: -99.170000,
        address: JSON.stringify({
          street: 'Av. Universidad 234',
          neighborhood: 'Del Valle Centro',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '03100',
          country: 'México'
        }),
        location_accuracy: 8,
        is_sharing_location: true,
        sharing_radius_km: 25, // Coaches typically travel more
        preferred_travel_distance_km: 20,
        transportation_modes: JSON.stringify(['car', 'public_transport']),
        availability_zones: JSON.stringify([
          'Del Valle Centro',
          'Del Valle Norte',
          'Narvarte',
          'Roma Norte',
          'Roma Sur',
          'Condesa',
          'Doctores',
          'Álamos'
        ]),
        home_court_preferences: JSON.stringify([
          { court_id: 1, preference_score: 5 },
          { court_id: 2, preference_score: 5 },
          { court_id: 4, preference_score: 4 }
        ]),
        last_location_update: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        location_sharing_expires: new Date(now.getTime() + 8 * 60 * 60 * 1000),
        privacy_level: 'public', // Coaches want to be found
        created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 60 * 60 * 1000)
      },
      {
        user_id: 6, // coach002
        current_latitude: 19.433141,
        current_longitude: -99.192851,
        address: JSON.stringify({
          street: 'Av. Polanco 567',
          neighborhood: 'Polanco V Sección',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '11560',
          country: 'México'
        }),
        location_accuracy: 5,
        is_sharing_location: true,
        sharing_radius_km: 30,
        preferred_travel_distance_km: 15,
        transportation_modes: JSON.stringify(['car', 'uber']),
        availability_zones: JSON.stringify([
          'Polanco',
          'Lomas de Chapultepec',
          'Las Lomas',
          'Condesa',
          'Roma Norte',
          'Santa Fe',
          'Anzures'
        ]),
        home_court_preferences: JSON.stringify([
          { court_id: 3, preference_score: 5 }, // Championship court preference
          { court_id: 1, preference_score: 4 }
        ]),
        last_location_update: new Date(now.getTime() - 45 * 60 * 1000),
        location_sharing_expires: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        privacy_level: 'public',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 45 * 60 * 1000)
      },
      // Partner location
      {
        user_id: 7, // partner001
        current_latitude: 19.410389,
        current_longitude: -99.165577,
        address: JSON.stringify({
          street: 'Calle Amsterdam 789',
          neighborhood: 'Condesa',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '06100',
          country: 'México'
        }),
        location_accuracy: 3, // Very precise for business
        is_sharing_location: true,
        sharing_radius_km: 35, // Business covers wider area
        preferred_travel_distance_km: 25,
        transportation_modes: JSON.stringify(['car', 'delivery_service']),
        availability_zones: JSON.stringify([
          'Condesa',
          'Roma Norte',
          'Roma Sur',
          'Del Valle Centro',
          'Del Valle Norte',
          'Narvarte',
          'Doctores',
          'Juárez',
          'Cuauhtémoc'
        ]),
        home_court_preferences: JSON.stringify([
          { court_id: 4, preference_score: 5 }, // Own facility
          { court_id: 1, preference_score: 3 },
          { court_id: 2, preference_score: 3 }
        ]),
        last_location_update: new Date(now.getTime() - 15 * 60 * 1000),
        location_sharing_expires: new Date(now.getTime() + 24 * 60 * 60 * 1000), // All day
        privacy_level: 'public',
        created_at: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 15 * 60 * 1000)
      },
      // Player from different area
      {
        user_id: 8, // partner002 (as player location)
        current_latitude: 19.370000,
        current_longitude: -99.280000,
        address: JSON.stringify({
          street: 'Av. Santa Fe 1010',
          neighborhood: 'Santa Fe',
          city: 'Ciudad de México',
          state: 'CDMX',
          postal_code: '01219',
          country: 'México'
        }),
        location_accuracy: 12,
        is_sharing_location: true,
        sharing_radius_km: 18,
        preferred_travel_distance_km: 15,
        transportation_modes: JSON.stringify(['car', 'uber']),
        availability_zones: JSON.stringify([
          'Santa Fe',
          'Lomas de Chapultepec',
          'Polanco',
          'Las Lomas',
          'Huixquilucan'
        ]),
        home_court_preferences: JSON.stringify([
          { court_id: 3, preference_score: 4 } // Prefers premium courts
        ]),
        last_location_update: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        location_sharing_expires: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        privacy_level: 'friends_and_matches',
        created_at: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('player_locations', playerLocations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_locations', {});
  }
};