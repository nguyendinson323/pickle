module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const tournaments = [
      {
        name: 'Torneo de Verano Ciudad de México 2024',
        description: 'Torneo oficial de verano con participación de jugadores de toda la región metropolitana. Categorías para todos los niveles.',
        organizer_type: 'partner',
        organizer_id: 7, // partner001
        tournament_type: 'open',
        level: 'municipal',
        state_id: 1, // Ciudad de México
        venue_name: 'Complejo Deportivo Roma Norte',
        venue_address: 'Av. Álvaro Obregón 123, Roma Norte, CDMX',
        venue_city: 'Ciudad de México',
        venue_state: 'CDMX',
        start_date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 47 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_end: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        entry_fee: 500.00,
        max_participants: 128,
        current_participants: 67,
        status: 'open',
        prize_pool: 8000.00,
        rules_document: 'Formato de eliminación doble. Partidos al mejor de 3 sets. Sistema de puntuación rally point a 11.',
        images: JSON.stringify(['/uploads/tournaments/verano-2024/banner.jpg', '/uploads/tournaments/verano-2024/gallery1.jpg']),
        requires_ranking: false,
        allow_late_registration: true,
        enable_waiting_list: true,
        registration_message: 'Torneo abierto para todos los niveles. ¡Únete a la diversión!',
        sponsor_logos: JSON.stringify(['/logos/sponsors/deportes-mx.png', '/logos/sponsors/raquetas-pro.png']),
        contact_email: 'torneos@pickleballcondesa.mx',
        contact_phone: '+52 55 5555 1234',
        website_url: 'https://pickleballcondesa.mx/torneos',
        social_media_links: JSON.stringify({
          facebook: 'https://facebook.com/pickleballcondesa',
          instagram: '@pickleballcondesa'
        }),
        special_instructions: 'Traer certificado médico y equipo completo',
        weather_contingency: 'En caso de lluvia, el torneo se pospondrá un día',
        transportation_info: 'Metro Insurgentes línea 1, a 5 minutos caminando',
        accommodation_info: 'Hoteles recomendados: Hotel Roma Norte, Hotel Condesa',
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        name: 'Campeonato Estatal CDMX 2024',
        description: 'Campeonato oficial del estado de Ciudad de México. Clasificatorio para el campeonato nacional.',
        organizer_type: 'state',
        organizer_id: 11, // state_committee001
        tournament_type: 'championship',
        level: 'state',
        state_id: 1, // Ciudad de México
        venue_name: 'Centro Deportivo Polanco Elite',
        venue_address: 'Av. Presidente Masaryk 456, Polanco, CDMX',
        venue_city: 'Ciudad de México',
        venue_state: 'CDMX',
        start_date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 93 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_start: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_end: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        entry_fee: 750.00,
        max_participants: 64,
        current_participants: 23,
        status: 'open',
        prize_pool: 20000.00,
        rules_document: 'Formato round robin + eliminación. Partidos al mejor de 5 sets. Puntuación rally point a 11.',
        images: JSON.stringify(['/uploads/tournaments/campeonato-estatal-2024/banner.jpg']),
        requires_ranking: true,
        min_ranking_points: 1000,
        allow_late_registration: false,
        enable_waiting_list: true,
        registration_message: 'Solo jugadores con ranking mínimo de 3.5 y membresía federativa vigente',
        sponsor_logos: JSON.stringify(['/logos/sponsors/federacion-mx.png']),
        contact_email: 'campeonatos@federacioncdmx.mx',
        contact_phone: '+52 55 2222 3333',
        website_url: 'https://federacioncdmx.mx',
        social_media_links: JSON.stringify({
          facebook: 'https://facebook.com/federacioncdmx',
          instagram: '@federacioncdmx'
        }),
        special_instructions: 'Membresía federativa obligatoria. Certificado médico no mayor a 6 meses.',
        weather_contingency: 'Instalaciones techadas, sin contingencia por clima',
        transportation_info: 'Metro Polanco línea 7, estacionamiento disponible',
        accommodation_info: 'Hotel oficial: Grand Polanco (descuento especial para participantes)',
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        name: 'Torneo Mensual Roma Norte - Noviembre',
        description: 'Torneo mensual recreativo para miembros y invitados. Ambiente familiar y competitivo.',
        organizer_type: 'club',
        organizer_id: 9, // club001
        tournament_type: 'friendly',
        level: 'local',
        state_id: 1, // Ciudad de México
        venue_name: 'Club Raqueta CDMX',
        venue_address: 'Calle Roma 123, Roma Norte, CDMX',
        venue_city: 'Ciudad de México',
        venue_state: 'CDMX',
        start_date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_start: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_end: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        entry_fee: 200.00,
        max_participants: 32,
        current_participants: 28,
        status: 'registration_closed',
        prize_pool: 2000.00,
        rules_document: 'Eliminación simple. Partidos al mejor de 3 sets. Límite de tiempo 45 minutos.',
        images: JSON.stringify(['/uploads/tournaments/mensual-roma-nov/banner.jpg']),
        requires_ranking: false,
        allow_late_registration: true,
        enable_waiting_list: false,
        registration_message: 'Torneo familiar, todos los niveles bienvenidos',
        sponsor_logos: JSON.stringify([]),
        contact_email: 'torneos@clubromanorte.mx',
        contact_phone: '+52 55 1234 5678',
        special_instructions: 'Evento familiar, menores acompañados por adultos',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        name: 'Copa Nacional de Pickleball México 2024',
        description: 'Torneo nacional oficial con participación de los mejores jugadores del país. Evento clasificatorio internacional.',
        organizer_type: 'federation',
        organizer_id: 1, // admin (federation)
        tournament_type: 'championship',
        level: 'national',
        state_id: 1, // Ciudad de México (sede nacional)
        venue_name: 'Centro Nacional de Desarrollo de Talentos Deportivos',
        venue_address: 'CNAR, Ciudad de México',
        venue_city: 'Ciudad de México',
        venue_state: 'CDMX',
        start_date: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 185 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_start: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registration_end: new Date(now.getTime() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        entry_fee: 1500.00,
        max_participants: 256,
        current_participants: 0,
        status: 'draft',
        prize_pool: 80000.00,
        rules_document: 'Sistema suizo + eliminación. Partidos al mejor de 5 sets. Rally point a 15 en finales.',
        images: JSON.stringify([]),
        requires_ranking: true,
        min_ranking_points: 2000,
        max_ranking_points: null,
        allow_late_registration: false,
        enable_waiting_list: true,
        registration_message: 'Solo jugadores profesionales con ranking nacional mínimo 4.5',
        sponsor_logos: JSON.stringify(['/logos/sponsors/conade.png', '/logos/sponsors/federacion-nacional.png']),
        contact_email: 'nacional@federacionpickleball.mx',
        contact_phone: '+52 55 0000 1111',
        website_url: 'https://federacionpickleball.mx/copa-nacional',
        social_media_links: JSON.stringify({
          facebook: 'https://facebook.com/federacionpickleballmx',
          instagram: '@federacionpickleballmx',
          youtube: 'https://youtube.com/federacionpickleballmx'
        }),
        special_instructions: 'Certificación médica deportiva obligatoria. Seguro de vida requerido.',
        weather_contingency: 'Instalaciones techadas de alto rendimiento',
        transportation_info: 'Transporte oficial desde aeropuerto disponible',
        accommodation_info: 'Villa Olímpica - alojamiento oficial para participantes',
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('tournaments', tournaments);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tournaments', {});
  }
};
