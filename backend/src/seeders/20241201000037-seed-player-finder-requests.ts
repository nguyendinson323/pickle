module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const playerFinderRequests = [
      {
        requester_id: 2, // user002 - player001
        location_id: 1,
        nrtp_level_min: '3.0',
        nrtp_level_max: '4.5',
        preferred_gender: 'any',
        preferred_age_min: 25,
        preferred_age_max: 45,
        search_radius: 10,
        available_time_slots: JSON.stringify({
          monday: ['08:00-10:00', '18:00-20:00'],
          wednesday: ['14:00-16:00', '19:00-21:00'],
          friday: ['15:00-17:00'],
          saturday: ['09:00-11:00', '18:00-20:00']
        }),
        message: 'Busco jugadores regulares para formar grupo de práctica semanal. Nivel intermedio-alto.',
        is_active: true,
        expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        requester_id: 3, // user003 - player002  
        location_id: 2,
        nrtp_level_min: '2.5',
        nrtp_level_max: '4.0',
        preferred_gender: 'female',
        preferred_age_min: 20,
        preferred_age_max: 50,
        search_radius: 8,
        available_time_slots: JSON.stringify({
          tuesday: ['10:00-12:00', '16:00-18:00'],
          thursday: ['16:00-18:00'],
          sunday: ['10:00-12:00']
        }),
        message: 'Principiante-intermedio, busco ambiente relajado y divertido para mejorar técnica.',
        is_active: true,
        expires_at: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        requester_id: 5, // user005 - coach001
        location_id: 1,
        nrtp_level_min: '4.0',
        nrtp_level_max: '5.5',
        preferred_gender: 'any',
        preferred_age_min: 25,
        preferred_age_max: 55,
        search_radius: 20,
        available_time_slots: JSON.stringify({
          monday: ['06:00-08:00', '20:00-22:00'],
          tuesday: ['07:00-09:00', '21:00-23:00'],
          wednesday: ['06:00-08:00'],
          thursday: ['07:00-09:00', '21:00-23:00'],
          friday: ['06:00-08:00', '20:00-22:00']
        }),
        message: 'Entrenador buscando sparring partners de alto nivel. Puedo ofrecer consejos técnicos a cambio de juegos desafiantes.',
        is_active: true,
        expires_at: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        requester_id: 4, // user004 - player003
        location_id: 3,
        nrtp_level_min: '2.0',
        nrtp_level_max: '3.5',
        preferred_gender: 'any',
        preferred_age_min: 18,
        preferred_age_max: 40,
        search_radius: 6,
        available_time_slots: JSON.stringify({
          saturday: ['09:00-11:00', '10:00-12:00', '14:00-16:00'],
          sunday: ['09:00-11:00', '10:00-12:00']
        }),
        message: 'Principiante total, busco jugadores pacientes para aprender juntos. Muy motivado!',
        is_active: true,
        expires_at: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        requester_id: 6, // user006 - coach002
        location_id: 1,
        nrtp_level_min: '4.5',
        nrtp_level_max: '5.5',
        preferred_gender: 'any',
        preferred_age_min: 28,
        preferred_age_max: 50,
        search_radius: 15,
        available_time_slots: JSON.stringify({
          friday: ['08:00-10:00', '15:00-17:00', '19:00-21:00'],
          saturday: ['08:00-10:00', '19:00-21:00'],
          sunday: ['15:00-17:00']
        }),
        message: 'Jugador avanzado buscando matches competitivos de alto nivel. Preparándome para torneos nacionales.',
        is_active: true,
        expires_at: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        requester_id: 7, // user007 - partner001
        location_id: 2,
        nrtp_level_min: '3.0',
        nrtp_level_max: '4.0',
        preferred_gender: 'any',
        preferred_age_min: 30,
        preferred_age_max: 55,
        search_radius: 12,
        available_time_slots: JSON.stringify({
          wednesday: ['16:00-18:00', '20:00-22:00'],
          saturday: ['16:00-18:00']
        }),
        message: 'Dueño de academia busca partners ocasionales para juegos relajados después del trabajo.',
        is_active: false,
        expires_at: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        requester_id: 8, // user008 - partner002
        location_id: 1,
        nrtp_level_min: '3.0',
        nrtp_level_max: '4.0',
        preferred_gender: 'any',
        preferred_age_min: 35,
        preferred_age_max: 60,
        search_radius: 25,
        available_time_slots: JSON.stringify({
          sunday: ['10:00-12:00']
        }),
        message: 'Ejecutivo buscando juego relajado los domingos por la mañana.',
        is_active: false,
        expires_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('player_finder_requests', playerFinderRequests);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_finder_requests', {});
  }
};