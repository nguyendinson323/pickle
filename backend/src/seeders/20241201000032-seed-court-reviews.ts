module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const courtReviews = [
      {
        court_id: 1,
        facility_id: 1,
        user_id: 2,
        booking_id: 3,
        review_type: 'overall',
        ratings: JSON.stringify({
          overall: 5,
          court_condition: 5,
          facilities: 5,
          service: 4,
          value_for_money: 4,
          cleanliness: 5
        }),
        review_title: 'Excelente cancha y servicio',
        review_text: 'La cancha principal es fantástica, superficie perfecta y excelente iluminación LED. El personal muy atento y las instalaciones impecables. Definitivamente regresaremos.',
        pros: JSON.stringify([
          'Superficie profesional en excelente estado',
          'Iluminación LED de alta calidad',
          'Personal muy profesional y atento',
          'Instalaciones limpias y modernas',
          'Buen estacionamiento'
        ]),
        cons: JSON.stringify([
          'Precio un poco alto para uso recreativo'
        ]),
        visit_date: '2024-11-15',
        visit_duration: 120,
        players_count: 2,
        skill_level: 'intermediate',
        weather_conditions: JSON.stringify({
          temperature: 22,
          humidity: 60,
          wind: 'light',
          conditions: 'clear'
        }),
        photos: JSON.stringify([
          '/uploads/reviews/court1_review_player001_1.jpg',
          '/uploads/reviews/court1_review_player001_2.jpg'
        ]),
        is_verified: true,
        verification_method: 'booking_match',
        helpful_votes: 12,
        unhelpful_votes: 1,
        report_count: 0,
        status: 'active',
        moderation_notes: null,
        responses: JSON.stringify([
          {
            type: 'facility_response',
            author: 'Facility Manager',
            text: 'Muchísimas gracias por sus comentarios. Nos alegra saber que disfrutaron de nuestras instalaciones. ¡Los esperamos pronto!',
            date: '2024-11-18T10:30:00Z'
          }
        ]),
        tags: JSON.stringify(['excellent_service', 'premium_court', 'professional_lighting']),
        recommend_to_friends: true,
        would_play_again: true,
        language_code: 'es',
        translated_versions: null,
        metadata: JSON.stringify({
          device: 'mobile',
          app_version: '1.2.0',
          review_source: 'post_booking'
        }),
        is_active: true,
        created_at: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        court_id: 2,
        facility_id: 1,
        user_id: 3,
        booking_id: null,
        review_type: 'court',
        ratings: JSON.stringify({
          overall: 4,
          court_condition: 4,
          facilities: 3,
          service: 4,
          value_for_money: 5,
          cleanliness: 4
        }),
        review_title: 'Buena opción para juego recreativo',
        review_text: 'Cancha en buen estado, ideal para jugar con amigos. La superficie está bien mantenida aunque no es tan premium como la principal. Buen precio y ambiente relajado.',
        pros: JSON.stringify([
          'Precio accesible',
          'Ambiente relajado',
          'Superficie en buen estado',
          'Personal amable',
          'Fácil acceso'
        ]),
        cons: JSON.stringify([
          'Iluminación no tan profesional como la cancha principal',
          'Sin sistema de sonido'
        ]),
        visit_date: '2024-11-20',
        visit_duration: 90,
        players_count: 4,
        skill_level: 'beginner',
        weather_conditions: JSON.stringify({
          temperature: 24,
          humidity: 55,
          wind: 'moderate',
          conditions: 'partly_cloudy'
        }),
        photos: JSON.stringify([]),
        is_verified: false,
        verification_method: null,
        helpful_votes: 8,
        unhelpful_votes: 2,
        report_count: 0,
        status: 'active',
        moderation_notes: null,
        responses: JSON.stringify([
          {
            type: 'facility_response',
            author: 'Operations Team',
            text: 'Gracias por su reseña. Tomamos nota de sus comentarios sobre la iluminación para futuras mejoras.',
            date: '2024-11-22T14:15:00Z'
          }
        ]),
        tags: JSON.stringify(['good_value', 'recreational_play', 'friendly_atmosphere']),
        recommend_to_friends: true,
        would_play_again: true,
        language_code: 'es',
        translated_versions: null,
        metadata: JSON.stringify({
          device: 'desktop',
          app_version: '1.2.0',
          review_source: 'voluntary'
        }),
        is_active: true,
        created_at: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        court_id: 3,
        facility_id: 2,
        user_id: 7,
        booking_id: null,
        review_type: 'facility',
        ratings: JSON.stringify({
          overall: 5,
          court_condition: 5,
          facilities: 5,
          service: 5,
          value_for_money: 3,
          cleanliness: 5,
          luxury: 5,
          technology: 5
        }),
        review_title: 'Instalaciones de lujo excepcionales',
        review_text: 'Organizamos un evento corporativo y la experiencia fue perfecta. Las instalaciones son de primer nivel, el servicio impecable y la atención al detalle extraordinaria. Vale cada peso.',
        pros: JSON.stringify([
          'Instalaciones de lujo genuino',
          'Servicio de concierge excepcional',
          'Superficie certificada ITF',
          'Tecnología de punta (transmisión 4K, stats en vivo)',
          'Catering gourmet disponible',
          'Estacionamiento valet',
          'Ambiente exclusivo'
        ]),
        cons: JSON.stringify([
          'Precio premium - no para todos los presupuestos'
        ]),
        visit_date: '2024-10-28',
        visit_duration: 180,
        players_count: 12,
        skill_level: 'advanced',
        weather_conditions: null,
        photos: JSON.stringify([
          '/uploads/reviews/championship_court_corporate_1.jpg',
          '/uploads/reviews/championship_court_corporate_2.jpg',
          '/uploads/reviews/championship_court_corporate_3.jpg'
        ]),
        is_verified: true,
        verification_method: 'manual_verification',
        helpful_votes: 15,
        unhelpful_votes: 1,
        report_count: 0,
        status: 'active',
        moderation_notes: 'Featured review - excellent corporate event feedback',
        responses: JSON.stringify([
          {
            type: 'facility_response',
            author: 'General Manager',
            text: 'Nos complace enormemente haber superado sus expectativas. Esperamos ser su sede para futuros eventos corporativos.',
            date: '2024-11-02T09:45:00Z'
          }
        ]),
        tags: JSON.stringify(['luxury_experience', 'corporate_events', 'premium_service', 'technology']),
        recommend_to_friends: true,
        would_play_again: true,
        language_code: 'es',
        translated_versions: null,
        metadata: JSON.stringify({
          device: 'desktop',
          app_version: '1.2.0',
          review_source: 'post_event',
          event_type: 'corporate'
        }),
        is_active: true,
        created_at: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('court_reviews', courtReviews);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('court_reviews', {});
  }
};