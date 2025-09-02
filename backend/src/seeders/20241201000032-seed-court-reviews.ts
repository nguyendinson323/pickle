module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const courtReviews = [
      // Excellent reviews for Cancha Principal
      {
        user_id: 2, // player001
        court_id: 1, // Cancha Principal
        facility_id: 1, // Roma Norte facility
        booking_id: 3, // Completed booking
        rating: 5,
        title: 'Excelente cancha y servicio',
        comment: 'La cancha principal es fantástica, superficie perfecta y excelente iluminación LED. El personal muy atento y las instalaciones impecables. Definitivamente regresaremos.',
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
        photos: JSON.stringify([
          '/uploads/reviews/court1_review_player001_1.jpg',
          '/uploads/reviews/court1_review_player001_2.jpg'
        ]),
        would_recommend: true,
        verified_booking: true,
        helpful_votes: 12,
        total_votes: 13,
        facility_response: 'Muchísimas gracias por sus comentarios. Nos alegra saber que disfrutaron de nuestras instalaciones. ¡Los esperamos pronto!',
        response_date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        is_featured: true,
        moderation_status: 'approved',
        created_at: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
      },
      // Good review for Cancha Norte
      {
        user_id: 3, // player002
        court_id: 2, // Cancha Norte
        facility_id: 1, // Roma Norte facility
        booking_id: 3, // Reference completed booking
        rating: 4,
        title: 'Buena opción para juego recreativo',
        comment: 'Cancha en buen estado, ideal para jugar con amigos. La superficie está bien mantenida aunque no es tan premium como la principal. Buen precio y ambiente relajado.',
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
        photos: JSON.stringify([]),
        would_recommend: true,
        verified_booking: true,
        helpful_votes: 8,
        total_votes: 10,
        facility_response: 'Gracias por su reseña. Tomamos nota de sus comentarios sobre la iluminación para futuras mejoras.',
        response_date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        is_featured: false,
        moderation_status: 'approved',
        created_at: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
      },
      // Premium review for Championship Court
      {
        user_id: 7, // partner001
        court_id: 3, // Championship Court (Polanco Elite)
        facility_id: 2, // Polanco Elite facility
        booking_id: null, // Corporate event booking
        rating: 5,
        title: 'Instalaciones de lujo excepcionales',
        comment: 'Organizamos un evento corporativo y la experiencia fue perfecta. Las instalaciones son de primer nivel, el servicio impecable y la atención al detalle extraordinaria. Vale cada peso.',
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
        photos: JSON.stringify([
          '/uploads/reviews/championship_court_corporate_1.jpg',
          '/uploads/reviews/championship_court_corporate_2.jpg',
          '/uploads/reviews/championship_court_corporate_3.jpg'
        ]),
        would_recommend: true,
        verified_booking: false, // Corporate booking not linked
        helpful_votes: 15,
        total_votes: 16,
        facility_response: 'Nos complace enormemente haber superado sus expectativas. Esperamos ser su sede para futuros eventos corporativos.',
        response_date: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        is_featured: true,
        moderation_status: 'approved',
        created_at: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000)
      },
      // Training facility review
      {
        user_id: 5, // coach001
        court_id: 4, // Training Court (Academia Condesa)
        facility_id: 3, // Academia Condesa facility
        booking_id: null,
        rating: 4,
        title: 'Perfecto para entrenamiento y clases',
        comment: 'Como entrenador, esta cancha cumple perfectamente con mis necesidades. El espacio es ideal para clases grupales y el enfoque en entrenamiento se nota en cada detalle.',
        pros: JSON.stringify([
          'Diseñado específicamente para entrenamiento',
          'Buen espacio para clases grupales',
          'Equipo de entrenamiento disponible',
          'Pizarra táctica muy útil',
          'Precio justo para entrenadores',
          'Horarios flexibles'
        ]),
        cons: JSON.stringify([
          'Instalaciones básicas (sin lujos)',
          'Estacionamiento limitado',
          'Al aire libre (dependiente del clima)'
        ]),
        photos: JSON.stringify([
          '/uploads/reviews/training_court_coach_setup.jpg'
        ]),
        would_recommend: true,
        verified_booking: false,
        helpful_votes: 6,
        total_votes: 7,
        facility_response: 'Gracias por elegir nuestra academia. Nos especializamos en brindar las mejores condiciones para el desarrollo técnico.',
        response_date: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        is_featured: false,
        moderation_status: 'approved',
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000)
      },
      // Mixed review
      {
        user_id: 6, // coach002
        court_id: 1, // Cancha Principal
        facility_id: 1, // Roma Norte facility
        booking_id: 7, // Completed private lesson
        rating: 3,
        title: 'Buenas instalaciones pero servicio mejorable',
        comment: 'La cancha en sí está muy bien, pero tuvimos algunos problemas con la reserva y el personal no fue tan eficiente como esperaba. Para el precio, esperaba un servicio más pulido.',
        pros: JSON.stringify([
          'Cancha en excelente estado',
          'Buena ubicación',
          'Tecnología moderna'
        ]),
        cons: JSON.stringify([
          'Servicio al cliente inconsistente',
          'Problemas con la reserva online',
          'Tiempo de espera para check-in',
          'Precio alto vs. servicio recibido'
        ]),
        photos: JSON.stringify([]),
        would_recommend: false,
        verified_booking: true,
        helpful_votes: 4,
        total_votes: 8,
        facility_response: 'Lamentamos que su experiencia no haya sido la esperada. Hemos tomado nota de sus comentarios y estamos mejorando nuestros procesos de reserva y atención al cliente.',
        response_date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        is_featured: false,
        moderation_status: 'approved',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)
      },
      // Recent positive review
      {
        user_id: 9, // club001 (reviewing another facility)
        court_id: 3, // Championship Court
        facility_id: 2, // Polanco Elite
        booking_id: null,
        rating: 5,
        title: 'Estándar de oro para instalaciones deportivas',
        comment: 'Como operador de otro club, debo reconocer que Polanco Elite establece el estándar más alto. Sus instalaciones son verdaderamente de clase mundial.',
        pros: JSON.stringify([
          'Referencia en la industria',
          'Atención al detalle excepcional',
          'Inversión en tecnología de punta',
          'Experiencia del cliente impecable',
          'Mantenimiento perfecto'
        ]),
        cons: JSON.stringify([]),
        photos: JSON.stringify([]),
        would_recommend: true,
        verified_booking: false,
        helpful_votes: 11,
        total_votes: 11,
        facility_response: 'Viniendo de un colega de la industria, este reconocimiento significa mucho para nosotros. Gracias por visitar nuestras instalaciones.',
        response_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        is_featured: true,
        moderation_status: 'approved',
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      // Beginner-friendly review
      {
        user_id: 4, // player003
        court_id: 4, // Training Court
        facility_id: 3, // Academia Condesa
        booking_id: null,
        rating: 4,
        title: 'Perfecto para principiantes',
        comment: 'Empecé a jugar pickleball hace poco y este lugar es ideal para aprender. El ambiente es muy acogedor y no te sientes intimidado como en otros lugares más competitivos.',
        pros: JSON.stringify([
          'Ambiente relajado para principiantes',
          'Instructores pacientes',
          'Precios accesibles',
          'Grupo de jugadores amigables',
          'Enfoque en aprendizaje'
        ]),
        cons: JSON.stringify([
          'Instalaciones básicas',
          'A veces hay mucho viento'
        ]),
        photos: JSON.stringify([]),
        would_recommend: true,
        verified_booking: false,
        helpful_votes: 7,
        total_votes: 8,
        facility_response: 'Nos alegra mucho saber que se siente cómodo aprendiendo con nosotros. ¡Eso es exactamente lo que buscamos!',
        response_date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        is_featured: false,
        moderation_status: 'approved',
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('court_reviews', courtReviews);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('court_reviews', {});
  }
};