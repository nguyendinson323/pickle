module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const playerFinderRequests = [
      // Active requests
      {
        user_id: 2, // player001
        skill_level: 'intermediate',
        preferred_play_style: 'competitive',
        available_days: JSON.stringify(['monday', 'wednesday', 'friday', 'saturday']),
        available_times: JSON.stringify({
          morning: ['08:00-10:00', '09:00-11:00'],
          afternoon: ['14:00-16:00', '15:00-17:00'],
          evening: ['18:00-20:00', '19:00-21:00']
        }),
        preferred_location_radius_km: 10,
        preferred_courts: JSON.stringify([1, 2]), // Roma Norte courts
        age_preference: JSON.stringify({
          min_age: 25,
          max_age: 45
        }),
        gender_preference: 'any',
        match_type: 'doubles',
        language_preference: JSON.stringify(['spanish', 'english']),
        additional_preferences: 'Busco jugadores regulares para formar grupo de práctica semanal. Nivel intermedio-alto.',
        max_travel_distance_km: 12,
        is_recurring: true,
        recurring_schedule: JSON.stringify({
          frequency: 'weekly',
          days: ['wednesday', 'saturday'],
          time: '18:00-20:00'
        }),
        status: 'active',
        priority: 'normal',
        expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        auto_match: true,
        notification_preferences: JSON.stringify({
          immediate: true,
          daily_digest: false,
          weekly_summary: true
        }),
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: 3, // player002
        skill_level: 'intermediate',
        preferred_play_style: 'recreational',
        available_days: JSON.stringify(['tuesday', 'thursday', 'sunday']),
        available_times: JSON.stringify({
          morning: ['10:00-12:00'],
          afternoon: ['16:00-18:00'],
          evening: []
        }),
        preferred_location_radius_km: 8,
        preferred_courts: JSON.stringify([2, 4]), // Norte and Condesa
        age_preference: JSON.stringify({
          min_age: 20,
          max_age: 50
        }),
        gender_preference: 'female_preferred',
        match_type: 'singles',
        language_preference: JSON.stringify(['spanish']),
        additional_preferences: 'Principiante-intermedio, busco ambiente relajado y divertido para mejorar técnica.',
        max_travel_distance_km: 15,
        is_recurring: false,
        recurring_schedule: null,
        status: 'active',
        priority: 'normal',
        expires_at: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        auto_match: true,
        notification_preferences: JSON.stringify({
          immediate: true,
          daily_digest: true,
          weekly_summary: false
        }),
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      // Coach looking for practice partners
      {
        user_id: 5, // coach001
        skill_level: 'advanced',
        preferred_play_style: 'competitive',
        available_days: JSON.stringify(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
        available_times: JSON.stringify({
          morning: ['06:00-08:00', '07:00-09:00'],
          afternoon: [],
          evening: ['20:00-22:00', '21:00-23:00']
        }),
        preferred_location_radius_km: 20,
        preferred_courts: JSON.stringify([1, 2, 3]), // Premium courts
        age_preference: JSON.stringify({
          min_age: 25,
          max_age: 55
        }),
        gender_preference: 'any',
        match_type: 'both', // singles and doubles
        language_preference: JSON.stringify(['spanish', 'english']),
        additional_preferences: 'Entrenador buscando sparring partners de alto nivel. Puedo ofrecer consejos técnicos a cambio de juegos desafiantes.',
        max_travel_distance_km: 25,
        is_recurring: true,
        recurring_schedule: JSON.stringify({
          frequency: 'weekly',
          days: ['tuesday', 'thursday'],
          time: '06:30-08:30'
        }),
        status: 'active',
        priority: 'high', // Coach has flexible schedule
        expires_at: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        auto_match: false, // Wants to review manually
        notification_preferences: JSON.stringify({
          immediate: true,
          daily_digest: false,
          weekly_summary: true
        }),
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      // Beginner player request
      {
        user_id: 4, // player003
        skill_level: 'beginner',
        preferred_play_style: 'recreational',
        available_days: JSON.stringify(['saturday', 'sunday']),
        available_times: JSON.stringify({
          morning: ['09:00-11:00', '10:00-12:00'],
          afternoon: ['14:00-16:00'],
          evening: []
        }),
        preferred_location_radius_km: 6,
        preferred_courts: JSON.stringify([4]), // Training court only
        age_preference: JSON.stringify({
          min_age: 18,
          max_age: 40
        }),
        gender_preference: 'any',
        match_type: 'doubles',
        language_preference: JSON.stringify(['spanish']),
        additional_preferences: 'Principiante total, busco jugadores pacientes para aprender juntos. Muy motivado!',
        max_travel_distance_km: 10,
        is_recurring: false,
        recurring_schedule: null,
        status: 'active',
        priority: 'normal',
        expires_at: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        auto_match: true,
        notification_preferences: JSON.stringify({
          immediate: true,
          daily_digest: false,
          weekly_summary: false
        }),
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      // Advanced player seeking competitive matches
      {
        user_id: 6, // coach002
        skill_level: 'advanced',
        preferred_play_style: 'competitive',
        available_days: JSON.stringify(['friday', 'saturday', 'sunday']),
        available_times: JSON.stringify({
          morning: ['08:00-10:00'],
          afternoon: ['15:00-17:00'],
          evening: ['19:00-21:00']
        }),
        preferred_location_radius_km: 15,
        preferred_courts: JSON.stringify([3]), // Only championship court
        age_preference: JSON.stringify({
          min_age: 28,
          max_age: 50
        }),
        gender_preference: 'any',
        match_type: 'singles',
        language_preference: JSON.stringify(['spanish', 'english']),
        additional_preferences: 'Jugador avanzado buscando matches competitivos de alto nivel. Preparándome para torneos nacionales.',
        max_travel_distance_km: 20,
        is_recurring: false,
        recurring_schedule: null,
        status: 'active',
        priority: 'high',
        expires_at: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        auto_match: false, // Wants to screen opponents
        notification_preferences: JSON.stringify({
          immediate: true,
          daily_digest: true,
          weekly_summary: true
        }),
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      // Paused request
      {
        user_id: 7, // partner001
        skill_level: 'intermediate',
        preferred_play_style: 'mixed',
        available_days: JSON.stringify(['wednesday', 'saturday']),
        available_times: JSON.stringify({
          morning: [],
          afternoon: ['16:00-18:00'],
          evening: ['20:00-22:00']
        }),
        preferred_location_radius_km: 12,
        preferred_courts: JSON.stringify([1, 2, 4]),
        age_preference: JSON.stringify({
          min_age: 30,
          max_age: 55
        }),
        gender_preference: 'any',
        match_type: 'doubles',
        language_preference: JSON.stringify(['spanish']),
        additional_preferences: 'Dueño de academia busca partners ocasionales para juegos relajados después del trabajo.',
        max_travel_distance_km: 18,
        is_recurring: false,
        recurring_schedule: null,
        status: 'paused', // Temporarily not looking
        priority: 'low',
        expires_at: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        auto_match: true,
        notification_preferences: JSON.stringify({
          immediate: false,
          daily_digest: false,
          weekly_summary: true
        }),
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      // Expired request
      {
        user_id: 8, // partner002
        skill_level: 'intermediate',
        preferred_play_style: 'recreational',
        available_days: JSON.stringify(['sunday']),
        available_times: JSON.stringify({
          morning: ['10:00-12:00'],
          afternoon: [],
          evening: []
        }),
        preferred_location_radius_km: 25,
        preferred_courts: JSON.stringify([3]), // Premium court preference
        age_preference: JSON.stringify({
          min_age: 35,
          max_age: 60
        }),
        gender_preference: 'any',
        match_type: 'doubles',
        language_preference: JSON.stringify(['spanish', 'english']),
        additional_preferences: 'Ejecutivo buscando juego relajado los domingos por la mañana.',
        max_travel_distance_km: 30,
        is_recurring: false,
        recurring_schedule: null,
        status: 'expired',
        priority: 'low',
        expires_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Expired a week ago
        auto_match: true,
        notification_preferences: JSON.stringify({
          immediate: false,
          daily_digest: true,
          weekly_summary: false
        }),
        created_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      // Recently fulfilled request
      {
        user_id: 9, // club001
        skill_level: 'intermediate',
        preferred_play_style: 'recreational',
        available_days: JSON.stringify(['friday']),
        available_times: JSON.stringify({
          morning: [],
          afternoon: [],
          evening: ['18:00-20:00']
        }),
        preferred_location_radius_km: 5,
        preferred_courts: JSON.stringify([1, 2]), // Own facility
        age_preference: JSON.stringify({
          min_age: 25,
          max_age: 50
        }),
        gender_preference: 'any',
        match_type: 'doubles',
        language_preference: JSON.stringify(['spanish']),
        additional_preferences: 'Gerente de club buscando juego semanal después del trabajo.',
        max_travel_distance_km: 8,
        is_recurring: true,
        recurring_schedule: JSON.stringify({
          frequency: 'weekly',
          days: ['friday'],
          time: '18:00-20:00'
        }),
        status: 'fulfilled', // Found regular partners
        priority: 'normal',
        expires_at: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
        auto_match: true,
        notification_preferences: JSON.stringify({
          immediate: false,
          daily_digest: false,
          weekly_summary: false
        }),
        created_at: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('player_finder_requests', playerFinderRequests);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_finder_requests', {});
  }
};