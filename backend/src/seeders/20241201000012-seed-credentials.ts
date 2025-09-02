module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const { v4: uuidv4 } = require('uuid');

    const credentials = [
      // Coach credentials
      {
        id: uuidv4(),
        user_id: 5, // coach001
        user_type: 'coach',
        federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
        federation_logo: '/logos/fmp-logo.png',
        state_name: 'Ciudad de México',
        state_id: 1,
        full_name: 'Carlos Rodríguez',
        nrtp_level: '4.5',
        affiliation_status: 'ACTIVO',
        ranking_position: 25,
        club_name: 'Club Raqueta CDMX',
        license_type: 'Entrenador Certificado',
        qr_code: 'QR_FMP_COACH_001_2023',
        federation_id_number: 'FMP-COACH-001-2023',
        nationality: '🇲🇽 México',
        photo: '/photos/coach001.jpg',
        issued_date: new Date('2023-06-15'),
        expiration_date: new Date('2025-06-15'),
        status: 'active',
        verification_url: 'https://federacionpickleball.mx/verify/FMP-COACH-001-2023',
        checksum: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
        last_verified: new Date('2024-01-15'),
        verification_count: 12,
        metadata: JSON.stringify({
          score: 95,
          practical_exam: 92,
          theory_exam: 98,
          specializations: ['beginners', 'intermediate'],
          certification_level: 1
        }),
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        user_id: 6, // coach002
        user_type: 'coach',
        federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
        federation_logo: '/logos/fmp-logo.png',
        state_name: 'Jalisco',
        state_id: 2,
        full_name: 'Ana García',
        nrtp_level: '5.0',
        affiliation_status: 'ACTIVO',
        ranking_position: 15,
        club_name: 'Pickleball Guadalajara',
        license_type: 'Entrenador Avanzado',
        qr_code: 'QR_FMP_COACH_002_2023',
        federation_id_number: 'FMP-COACH-002-2023',
        nationality: '🇲🇽 México',
        photo: '/photos/coach002.jpg',
        issued_date: new Date('2023-08-20'),
        expiration_date: new Date('2025-08-20'),
        status: 'active',
        verification_url: 'https://federacionpickleball.mx/verify/FMP-COACH-002-2023',
        checksum: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
        last_verified: new Date('2024-01-10'),
        verification_count: 8,
        metadata: JSON.stringify({
          score: 88,
          practical_exam: 90,
          theory_exam: 86,
          specializations: ['advanced', 'competitive', 'tournament_preparation'],
          certification_level: 2
        }),
        created_at: now,
        updated_at: now
      },
      // Player credentials
      {
        id: uuidv4(),
        user_id: 3, // player001
        user_type: 'player',
        federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
        federation_logo: '/logos/fmp-logo.png',
        state_name: 'Ciudad de México',
        state_id: 1,
        full_name: 'Juan Pérez',
        nrtp_level: '3.5',
        affiliation_status: 'ACTIVO',
        ranking_position: 150,
        club_name: 'Club Raqueta CDMX',
        license_type: 'Jugador Federado',
        qr_code: 'QR_FMP_PLAYER_001_2024',
        federation_id_number: 'FMP-PLAYER-001-2024',
        nationality: '🇲🇽 México',
        photo: '/photos/player001.jpg',
        issued_date: new Date('2024-01-15'),
        expiration_date: new Date('2024-12-31'),
        status: 'active',
        verification_url: 'https://federacionpickleball.mx/verify/FMP-PLAYER-001-2024',
        checksum: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4',
        last_verified: new Date('2024-02-01'),
        verification_count: 3,
        metadata: JSON.stringify({
          tournament_history: [],
          achievements: [],
          membership_type: 'annual'
        }),
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        user_id: 4, // player002
        user_type: 'player',
        federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
        federation_logo: '/logos/fmp-logo.png',
        state_name: 'Jalisco',
        state_id: 2,
        full_name: 'María López',
        nrtp_level: '4.0',
        affiliation_status: 'ACTIVO',
        ranking_position: 85,
        club_name: 'Pickleball Guadalajara',
        license_type: 'Jugadora Federada',
        qr_code: 'QR_FMP_PLAYER_002_2024',
        federation_id_number: 'FMP-PLAYER-002-2024',
        nationality: '🇲🇽 México',
        photo: '/photos/player002.jpg',
        issued_date: new Date('2024-02-01'),
        expiration_date: new Date('2024-12-31'),
        status: 'active',
        verification_url: 'https://federacionpickleball.mx/verify/FMP-PLAYER-002-2024',
        checksum: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5',
        last_verified: new Date('2024-02-15'),
        verification_count: 5,
        metadata: JSON.stringify({
          tournament_history: ['Torneo CDMX 2024'],
          achievements: ['3er lugar en categoria 4.0'],
          membership_type: 'annual'
        }),
        created_at: now,
        updated_at: now
      },
      // Club admin credential
      {
        id: uuidv4(),
        user_id: 9, // club001 admin
        user_type: 'club_admin',
        federation_name: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
        federation_logo: '/logos/fmp-logo.png',
        state_name: 'Ciudad de México',
        state_id: 1,
        full_name: 'Roberto Sánchez',
        affiliation_status: 'ACTIVO',
        club_name: 'Club Raqueta CDMX',
        license_type: 'Administrador de Club',
        qr_code: 'QR_FMP_ADMIN_001_2024',
        federation_id_number: 'FMP-ADMIN-001-2024',
        nationality: '🇲🇽 México',
        photo: '/photos/admin001.jpg',
        issued_date: new Date('2024-01-01'),
        expiration_date: new Date('2024-12-31'),
        status: 'active',
        verification_url: 'https://federacionpickleball.mx/verify/FMP-ADMIN-001-2024',
        checksum: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6',
        last_verified: new Date('2024-01-15'),
        verification_count: 7,
        metadata: JSON.stringify({
          club_permissions: ['manage_courts', 'schedule_tournaments', 'manage_members'],
          admin_level: 'club_owner'
        }),
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('credentials', credentials);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('credentials', {});
  }
};