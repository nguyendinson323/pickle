module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const conversations = [
      // Direct message between matched players
      {
        type: 'direct',
        name: null,
        description: 'Match discussion - Juego programado para mañana',
        participants: JSON.stringify([
          {
            userId: '3', // player001
            role: 'member',
            joinedAt: now,
            isActive: true
          },
          {
            userId: '5', // coach001
            role: 'member',
            joinedAt: now,
            isActive: true
          }
        ]),
        is_group: false,
        group_icon: null,
        related_entity_type: 'player_match',
        related_entity_id: '1',
        last_message_id: null,
        last_message_at: now,
        last_message_preview: 'Perfecto, nos vemos mañana a las 6pm en la cancha principal',
        settings: JSON.stringify({
          allowFileSharing: true,
          allowLocationSharing: true,
          muteNotifications: false
        }),
        is_active: true,
        is_archived: false,
        archived_at: null,
        created_at: now,
        updated_at: now
      },

      // Group conversation for tournament participants
      {
        type: 'tournament',
        name: 'Torneo de Verano CDMX 2024 - Participantes',
        description: 'Grupo de comunicación para participantes del Torneo de Verano',
        participants: JSON.stringify([
          {
            userId: '7',
            role: 'admin',
            joinedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
            isActive: true
          },
          {
            userId: '3',
            role: 'member',
            joinedAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
            isActive: true
          },
          {
            userId: '4',
            role: 'member',
            joinedAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
            isActive: true
          },
          {
            userId: '5',
            role: 'member',
            joinedAt: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
            isActive: true
          },
          {
            userId: '6',
            role: 'member',
            joinedAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
            isActive: true
          }
        ]),
        is_group: true,
        group_icon: '/images/tournaments/tournament-group-icon.png',
        related_entity_type: 'tournament',
        related_entity_id: '1',
        last_message_id: null,
        last_message_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        last_message_preview: 'Recordatorio: registro mañana desde las 8:00 AM',
        settings: JSON.stringify({
          allowFileSharing: true,
          allowLocationSharing: true,
          muteNotifications: false
        }),
        is_active: true,
        is_archived: false,
        archived_at: null,
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },

      // ...repeat the same pattern for all other conversations...
      // Replace every `joinedAt: now X * ...` with:
      // joinedAt: new Date(now.getTime() - X * 24 * 60 * 60 * 1000)
    ];

    await queryInterface.bulkInsert('conversations', conversations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('conversations', {});
  }
};
