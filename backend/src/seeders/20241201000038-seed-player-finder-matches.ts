module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const playerFinderMatches = [
      // Successful match between player001 and coach001
      {
        requester_id: 2, // player001
        matched_player_id: 5, // coach001
        request_id: 1, // player001's request
        match_score: 0.92, // High compatibility
        compatibility_factors: JSON.stringify({
          skill_level_match: 0.85, // intermediate vs advanced (close enough)
          location_proximity: 0.95, // Very close locations
          time_availability: 0.90, // Good time overlap
          play_style_compatibility: 0.95, // Both competitive
          age_compatibility: 1.0, // Within preferences
          court_preference_overlap: 0.90 // Both prefer courts 1,2
        }),
        proposed_meeting_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // Day after tomorrow 6PM
        proposed_court_id: 1, // Cancha Principal
        estimated_travel_time_requester: 15, // minutes
        estimated_travel_time_matched: 20, // minutes
        meeting_location: JSON.stringify({
          court_id: 1,
          court_name: 'Cancha Principal',
          facility_name: 'Complejo Deportivo Roma Norte',
          address: 'Av. Álvaro Obregón 123, Roma Norte, CDMX'
        }),
        status: 'accepted',
        requester_response: 'accepted',
        matched_player_response: 'accepted',
        requester_responded_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        matched_player_responded_at: new Date(now.getTime() - 20 * 60 * 60 * 1000),
        match_confirmed_at: new Date(now.getTime() - 20 * 60 * 60 * 1000),
        played_at: null,
        feedback_from_requester: null,
        feedback_from_matched_player: null,
        match_rating_requester: null,
        match_rating_matched_player: null,
        would_play_again_requester: null,
        would_play_again_matched_player: null,
        notes: 'Coach disponible para juego técnico con consejos incluidos',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 20 * 60 * 60 * 1000)
      },
      // Completed match with feedback
      {
        requester_id: 3, // player002
        matched_player_id: 4, // player003
        request_id: 2, // player002's request
        match_score: 0.78,
        compatibility_factors: JSON.stringify({
          skill_level_match: 0.75, // intermediate vs beginner
          location_proximity: 0.88,
          time_availability: 0.85,
          play_style_compatibility: 1.0, // Both recreational
          age_compatibility: 0.90,
          court_preference_overlap: 0.50 // Different court preferences
        }),
        proposed_meeting_time: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 5 days ago 4PM
        proposed_court_id: 4, // Training court (compromise)
        estimated_travel_time_requester: 12,
        estimated_travel_time_matched: 18,
        meeting_location: JSON.stringify({
          court_id: 4,
          court_name: 'Cancha de Entrenamiento',
          facility_name: 'Academia de Pickleball Condesa',
          address: 'Calle Amsterdam 789, Condesa, CDMX'
        }),
        status: 'completed',
        requester_response: 'accepted',
        matched_player_response: 'accepted',
        requester_responded_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        matched_player_responded_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        match_confirmed_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        played_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
        feedback_from_requester: 'Excelente persona, muy paciente conmigo siendo principiante. Me ayudó mucho con la técnica básica.',
        feedback_from_matched_player: 'María es muy buena compañera de juego, me motivó a mejorar. Definitivamente jugaríamos otra vez.',
        match_rating_requester: 5,
        match_rating_matched_player: 4,
        would_play_again_requester: true,
        would_play_again_matched_player: true,
        notes: 'Match exitoso entre jugadoras de diferentes niveles',
        created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
      },
      // Pending match awaiting response
      {
        requester_id: 6, // coach002
        matched_player_id: 5, // coach001
        request_id: 5, // coach002's request
        match_score: 0.88,
        compatibility_factors: JSON.stringify({
          skill_level_match: 1.0, // Both advanced
          location_proximity: 0.75, // Different areas but acceptable
          time_availability: 0.95, // Great time overlap
          play_style_compatibility: 1.0, // Both competitive
          age_compatibility: 0.85,
          court_preference_overlap: 0.80 // Both prefer premium courts
        }),
        proposed_meeting_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 3 days from now 8AM
        proposed_court_id: 3, // Championship court
        estimated_travel_time_requester: 25,
        estimated_travel_time_matched: 30,
        meeting_location: JSON.stringify({
          court_id: 3,
          court_name: 'Cancha Championship',
          facility_name: 'Centro Deportivo Polanco Elite',
          address: 'Av. Presidente Masaryk 456, Polanco, CDMX'
        }),
        status: 'pending',
        requester_response: 'accepted',
        matched_player_response: 'pending',
        requester_responded_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        matched_player_responded_at: null,
        match_confirmed_at: null,
        played_at: null,
        feedback_from_requester: null,
        feedback_from_matched_player: null,
        match_rating_requester: null,
        match_rating_matched_player: null,
        would_play_again_requester: null,
        would_play_again_matched_player: null,
        notes: 'Match entre entrenadores avanzados - potencial sparring regular',
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },
      // Declined match
      {
        requester_id: 4, // player003
        matched_player_id: 6, // coach002
        request_id: 4, // player003's request
        match_score: 0.65,
        compatibility_factors: JSON.stringify({
          skill_level_match: 0.30, // beginner vs advanced - poor match
          location_proximity: 0.60, // Different areas
          time_availability: 0.85,
          play_style_compatibility: 0.50, // recreational vs competitive
          age_compatibility: 0.70,
          court_preference_overlap: 0.0 // No overlap in court preferences
        }),
        proposed_meeting_time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
        proposed_court_id: 3, // Too advanced for beginner
        estimated_travel_time_requester: 45,
        estimated_travel_time_matched: 15,
        meeting_location: JSON.stringify({
          court_id: 3,
          court_name: 'Cancha Championship',
          facility_name: 'Centro Deportivo Polanco Elite',
          address: 'Av. Presidente Masaryk 456, Polanco, CDMX'
        }),
        status: 'declined',
        requester_response: 'declined',
        matched_player_response: 'pending',
        requester_responded_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        matched_player_responded_at: null,
        match_confirmed_at: null,
        played_at: null,
        feedback_from_requester: null,
        feedback_from_matched_player: null,
        match_rating_requester: null,
        match_rating_matched_player: null,
        would_play_again_requester: null,
        would_play_again_matched_player: null,
        notes: 'Match rechazado por diferencia de nivel y ubicación',
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      // Expired match (no response)
      {
        requester_id: 7, // partner001
        matched_player_id: 2, // player001
        request_id: 6, // partner001's request
        match_score: 0.72,
        compatibility_factors: JSON.stringify({
          skill_level_match: 0.90, // Both intermediate
          location_proximity: 0.95,
          time_availability: 0.60, // Limited overlap
          play_style_compatibility: 0.75, // mixed vs competitive
          age_compatibility: 0.80,
          court_preference_overlap: 0.85
        }),
        proposed_meeting_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
        proposed_court_id: 2,
        estimated_travel_time_requester: 10,
        estimated_travel_time_matched: 12,
        meeting_location: JSON.stringify({
          court_id: 2,
          court_name: 'Cancha Norte',
          facility_name: 'Complejo Deportivo Roma Norte',
          address: 'Av. Álvaro Obregón 123, Roma Norte, CDMX'
        }),
        status: 'expired',
        requester_response: 'pending',
        matched_player_response: 'pending',
        requester_responded_at: null,
        matched_player_responded_at: null,
        match_confirmed_at: null,
        played_at: null,
        feedback_from_requester: null,
        feedback_from_matched_player: null,
        match_rating_requester: null,
        match_rating_matched_player: null,
        would_play_again_requester: null,
        would_play_again_matched_player: null,
        notes: 'Match expirado - ambos jugadores no respondieron a tiempo',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      // Recent match with mixed feedback
      {
        requester_id: 5, // coach001
        matched_player_id: 8, // partner002
        request_id: 3, // coach001's request
        match_score: 0.81,
        compatibility_factors: JSON.stringify({
          skill_level_match: 0.80, // advanced vs intermediate
          location_proximity: 0.70, // Different areas but manageable
          time_availability: 0.90,
          play_style_compatibility: 0.85, // competitive vs mixed
          age_compatibility: 0.95,
          court_preference_overlap: 0.90 // Both prefer premium courts
        }),
        proposed_meeting_time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        proposed_court_id: 1,
        estimated_travel_time_requester: 20,
        estimated_travel_time_matched: 35,
        meeting_location: JSON.stringify({
          court_id: 1,
          court_name: 'Cancha Principal',
          facility_name: 'Complejo Deportivo Roma Norte',
          address: 'Av. Álvaro Obregón 123, Roma Norte, CDMX'
        }),
        status: 'completed',
        requester_response: 'accepted',
        matched_player_response: 'accepted',
        requester_responded_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        matched_player_responded_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        match_confirmed_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        played_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        feedback_from_requester: 'Buen jugador, aunque llegó 15 minutos tarde. El juego fue competitivo y entretenido.',
        feedback_from_matched_player: 'Carlos es excelente jugador y muy profesional. Me ayudó a mejorar varios aspectos técnicos durante el juego.',
        match_rating_requester: 3, // Average due to lateness
        match_rating_matched_player: 5, // Excellent experience
        would_play_again_requester: true,
        would_play_again_matched_player: true,
        notes: 'Match exitoso a pesar de la tardanza inicial',
        created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('player_finder_matches', playerFinderMatches);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('player_finder_matches', {});
  }
};