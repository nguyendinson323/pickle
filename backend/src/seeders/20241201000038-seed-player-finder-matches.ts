module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const playerFinderMatches = [
      {
        request_id: 1,
        matched_user_id: 5, // coach001
        distance: 2.5,
        compatibility_score: 92,
        status: 'accepted',
        response_message: 'Perfecto! Me encanta jugar con jugadores comprometidos. Podemos intercambiar técnicas.',
        matched_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        responded_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        contact_shared: true,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        request_id: 2,
        matched_user_id: 4, // player003
        distance: 4.8,
        compatibility_score: 78,
        status: 'accepted',
        response_message: 'Me parece genial! Soy principiante pero muy motivado a aprender.',
        matched_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        responded_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        contact_shared: true,
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        request_id: 3,
        matched_user_id: 6, // coach002
        distance: 12.3,
        compatibility_score: 88,
        status: 'pending',
        response_message: null,
        matched_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        responded_at: null,
        contact_shared: false,
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      },
      {
        request_id: 4,
        matched_user_id: 6, // coach002
        distance: 18.7,
        compatibility_score: 65,
        status: 'declined',
        response_message: 'Gracias por la invitación, pero creo que la diferencia de nivel es demasiada grande por ahora.',
        matched_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        responded_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        contact_shared: false,
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        request_id: 1,
        matched_user_id: 8, // partner002
        distance: 15.2,
        compatibility_score: 72,
        status: 'expired',
        response_message: null,
        matched_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        responded_at: null,
        contact_shared: false,
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        request_id: 3,
        matched_user_id: 8, // partner002
        distance: 8.1,
        compatibility_score: 81,
        status: 'accepted',
        response_message: 'Excelente! Me gusta jugar temprano. Confirmo para el martes a las 7 AM.',
        matched_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        responded_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        contact_shared: true,
        created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('player_finder_matches', playerFinderMatches);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_finder_matches', {});
  }
};