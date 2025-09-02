module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('media_files', [
      {
        microsite_id: null,
        user_id: 1, // admin001
        original_name: 'logo_federacion.png',
        file_name: 'logo_federacion_2024.png',
        file_path: '/uploads/system/logo_federacion_2024.png',
        file_url: 'https://cdn.pickleball.mx/uploads/system/logo_federacion_2024.png',
        mime_type: 'image/png',
        file_size: 45678,
        alt: 'Logo oficial de la Federación Mexicana de Pickleball',
        title: 'Logo Federación',
        description: 'Logo oficial de la Federación Mexicana de Pickleball para uso en documentos y sitios web',
        tags: JSON.stringify(['logo', 'oficial', 'federacion', 'branding']),
        is_public: true,
        created_at: now,
        updated_at: now
      },
      {
        microsite_id: null,
        user_id: 2, // player001
        original_name: 'mi_foto_perfil.jpg',
        file_name: 'player001_profile.jpg',
        file_path: '/uploads/profiles/2024/player001_profile.jpg',
        file_url: 'https://cdn.pickleball.mx/uploads/profiles/2024/player001_profile.jpg',
        mime_type: 'image/jpeg',
        file_size: 245760,
        alt: 'Foto de perfil de Juan García',
        title: 'Perfil Juan García',
        description: 'Foto de perfil del jugador Juan García López',
        tags: JSON.stringify(['perfil', 'jugador', 'foto']),
        is_public: true,
        created_at: now,
        updated_at: now
      },
      {
        microsite_id: null,
        user_id: 3, // player002
        original_name: 'foto_maria.jpg',
        file_name: 'player002_profile.jpg',
        file_path: '/uploads/profiles/2024/player002_profile.jpg',
        file_url: 'https://cdn.pickleball.mx/uploads/profiles/2024/player002_profile.jpg',
        mime_type: 'image/jpeg',
        file_size: 198432,
        alt: 'Foto de perfil de María González',
        title: 'Perfil María González',
        description: 'Foto de perfil de la jugadora María González López',
        tags: JSON.stringify(['perfil', 'jugadora', 'foto']),
        is_public: true,
        created_at: now,
        updated_at: now
      },
      {
        microsite_id: null,
        user_id: 5, // coach001
        original_name: 'coach_luis.jpg',
        file_name: 'coach001_profile.jpg',
        file_path: '/uploads/profiles/coaches/coach001_profile.jpg',
        file_url: 'https://cdn.pickleball.mx/uploads/profiles/coaches/coach001_profile.jpg',
        mime_type: 'image/jpeg',
        file_size: 312456,
        alt: 'Foto de perfil del entrenador Luis Hernández',
        title: 'Perfil Coach Luis',
        description: 'Foto de perfil del entrenador certificado Luis Hernández Morales',
        tags: JSON.stringify(['perfil', 'entrenador', 'coach', 'certificado']),
        is_public: true,
        created_at: now,
        updated_at: now
      },
      {
        microsite_id: null,
        user_id: 9, // club001
        original_name: 'club_roma_norte_banner.jpg',
        file_name: 'club_roma_norte_banner.jpg',
        file_path: '/uploads/clubs/roma_norte/banner.jpg',
        file_url: 'https://cdn.pickleball.mx/uploads/clubs/roma_norte/banner.jpg',
        mime_type: 'image/jpeg',
        file_size: 567890,
        alt: 'Banner del Club Roma Norte',
        title: 'Banner Club Roma Norte',
        description: 'Imagen principal del Club de Pickleball Roma Norte mostrando las instalaciones',
        tags: JSON.stringify(['club', 'roma_norte', 'banner', 'instalaciones']),
        is_public: true,
        created_at: now,
        updated_at: now
      },
      {
        microsite_id: null,
        user_id: 1, // admin001
        original_name: 'reglamento_oficial.pdf',
        file_name: 'reglamento_pickleball_2024.pdf',
        file_path: '/uploads/documents/reglamento_pickleball_2024.pdf',
        file_url: 'https://cdn.pickleball.mx/uploads/documents/reglamento_pickleball_2024.pdf',
        mime_type: 'application/pdf',
        file_size: 1234567,
        alt: 'Reglamento oficial de Pickleball 2024',
        title: 'Reglamento Oficial 2024',
        description: 'Documento con el reglamento oficial del pickleball actualizado para 2024',
        tags: JSON.stringify(['reglamento', 'oficial', 'reglas', 'documento', '2024']),
        is_public: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('media_files', {}, {});
  }
};