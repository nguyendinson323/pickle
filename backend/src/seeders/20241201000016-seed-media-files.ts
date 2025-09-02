module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const mediaFiles = [
      // Profile pictures
      {
        user_id: 2, // player001
        file_name: 'player001_profile.jpg',
        original_name: 'mi_foto_perfil.jpg',
        file_path: '/uploads/profiles/2024/player001_profile.jpg',
        file_size: 245760,
        mime_type: 'image/jpeg',
        file_type: 'image',
        category: 'profile_picture',
        alt_text: 'Foto de perfil de Juan García',
        is_public: true,
        metadata: JSON.stringify({
          width: 400,
          height: 400,
          format: 'jpeg',
          quality: 85
        }),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 5, // coach001
        file_name: 'coach001_profile.jpg',
        original_name: 'entrenador_foto.jpg',
        file_path: '/uploads/profiles/2024/coach001_profile.jpg',
        file_size: 312450,
        mime_type: 'image/jpeg',
        file_type: 'image',
        category: 'profile_picture',
        alt_text: 'Foto de perfil del entrenador Carlos',
        is_public: true,
        metadata: JSON.stringify({
          width: 400,
          height: 400,
          format: 'jpeg',
          quality: 90
        }),
        created_at: now,
        updated_at: now
      },
      // Court photos
      {
        user_id: 9, // club001
        file_name: 'cancha_principal_club001.jpg',
        original_name: 'cancha_principal.jpg',
        file_path: '/uploads/courts/2024/cancha_principal_club001.jpg',
        file_size: 1024768,
        mime_type: 'image/jpeg',
        file_type: 'image',
        category: 'court_photo',
        alt_text: 'Cancha principal del Club Roma Norte',
        is_public: true,
        metadata: JSON.stringify({
          width: 1200,
          height: 800,
          format: 'jpeg',
          quality: 85,
          court_id: 1
        }),
        created_at: now,
        updated_at: now
      },
      {
        user_id: 9, // club001
        file_name: 'instalaciones_club001.jpg',
        original_name: 'instalaciones_completas.jpg',
        file_path: '/uploads/facilities/2024/instalaciones_club001.jpg',
        file_size: 856432,
        mime_type: 'image/jpeg',
        file_type: 'image',
        category: 'facility_photo',
        alt_text: 'Vista general de las instalaciones del club',
        is_public: true,
        metadata: JSON.stringify({
          width: 1400,
          height: 900,
          format: 'jpeg',
          quality: 80,
          facility_type: 'overview'
        }),
        created_at: now,
        updated_at: now
      },
      // Tournament photos
      {
        user_id: 7, // partner001
        file_name: 'torneo_verano_2024.jpg',
        original_name: 'torneo_verano_banner.jpg',
        file_path: '/uploads/tournaments/2024/torneo_verano_2024.jpg',
        file_size: 645123,
        mime_type: 'image/jpeg',
        file_type: 'image',
        category: 'tournament_banner',
        alt_text: 'Banner del Torneo de Verano 2024',
        is_public: true,
        metadata: JSON.stringify({
          width: 1000,
          height: 600,
          format: 'jpeg',
          quality: 85,
          tournament_id: 1
        }),
        created_at: now,
        updated_at: now
      },
      // Certification documents
      {
        user_id: 5, // coach001
        file_name: 'certificacion_nivel1_coach001.pdf',
        original_name: 'certificacion_entrenador.pdf',
        file_path: '/uploads/certificates/2024/certificacion_nivel1_coach001.pdf',
        file_size: 456789,
        mime_type: 'application/pdf',
        file_type: 'document',
        category: 'certification',
        alt_text: 'Certificación de entrenador nivel 1',
        is_public: false,
        metadata: JSON.stringify({
          pages: 2,
          certification_type: 'coaching_level_1',
          issued_by: 'Federación Mexicana de Pickleball'
        }),
        created_at: now,
        updated_at: now
      },
      // Microsite assets
      {
        user_id: 10, // club002
        file_name: 'logo_club002.png',
        original_name: 'club_logo.png',
        file_path: '/uploads/microsites/2024/logo_club002.png',
        file_size: 89432,
        mime_type: 'image/png',
        file_type: 'image',
        category: 'logo',
        alt_text: 'Logo del Club Polanco',
        is_public: true,
        metadata: JSON.stringify({
          width: 300,
          height: 200,
          format: 'png',
          transparent: true
        }),
        created_at: now,
        updated_at: now
      },
      // Video content
      {
        user_id: 6, // coach002
        file_name: 'tecnica_servicio_basico.mp4',
        original_name: 'video_tecnica_servicio.mp4',
        file_path: '/uploads/training/2024/tecnica_servicio_basico.mp4',
        file_size: 15678912,
        mime_type: 'video/mp4',
        file_type: 'video',
        category: 'training_video',
        alt_text: 'Video instructivo: Técnica básica de servicio',
        is_public: false,
        metadata: JSON.stringify({
          duration: 480, // seconds
          width: 1280,
          height: 720,
          format: 'mp4',
          bitrate: 2500,
          codec: 'h264'
        }),
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('media_files', mediaFiles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('media_files', {});
  }
};