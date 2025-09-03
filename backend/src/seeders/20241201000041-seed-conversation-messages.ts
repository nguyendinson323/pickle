module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('conversation_messages', [
    {
      conversation_id: 1, // Tournament coordination conversation
      sender_id: 2, // Carlos Méndez Rivera
      content: 'Hola Carlos, vi que me propusiste un juego para mañana a las 6pm. Me parece perfecto!',
      message_type: 'text',
      reply_to_id: null,
      attachments: null,
      metadata: JSON.stringify({
        device: 'mobile',
        app_version: '2.1.0',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-20T10:15:00Z'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 1, // Tournament coordination conversation
      sender_id: 4, // Roberto Sánchez Torres
      content: 'Excelente! Te propongo jugar en la cancha principal. Podemos aprovechar para trabajar tu técnica de volea si quieres.',
      message_type: 'text',
      reply_to_id: 1, // Replying to Carlos's message
      attachments: null,
      metadata: JSON.stringify({
        device: 'desktop',
        app_version: '2.1.0',
        location_sent: 'Monterrey',
        timestamp_sent: '2024-11-20T10:18:00Z'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 1, // Tournament coordination conversation
      sender_id: 3, // María González López
      content: 'Perfecto, nos vemos mañana a las 6pm en la cancha principal',
      message_type: 'text',
      reply_to_id: null,
      attachments: null,
      metadata: JSON.stringify({
        device: 'mobile',
        app_version: '2.0.9',
        location_sent: 'Guadalajara',
        timestamp_sent: '2024-11-20T10:22:00Z'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 2, // Coaching session discussion
      sender_id: 5, // Luis Hernández Morales (coach)
      content: '¡Bienvenidos al grupo del Torneo de Verano CDMX 2024! Aquí compartiremos toda la información importante del torneo.',
      message_type: 'text',
      reply_to_id: null,
      attachments: null,
      metadata: JSON.stringify({
        device: 'tablet',
        app_version: '2.1.0',
        location_sent: 'Monterrey',
        timestamp_sent: '2024-11-25T14:30:00Z'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 2, // Coaching session discussion
      sender_id: 2, // Carlos Méndez Rivera
      content: 'Gracias por crear el grupo! Muy emocionado por mi primer torneo 🏓',
      message_type: 'text',
      reply_to_id: 4, // Replying to coach's message
      attachments: null,
      metadata: JSON.stringify({
        device: 'mobile',
        app_version: '2.1.0',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-25T14:45:00Z'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 2, // Club management coordination
      sender_id: 1, // System message via admin
      content: 'Buenos días miembros! Les informo que hemos recibido nuevas pelotas Penn Championship. Ya están disponibles en recepción.',
      message_type: 'image',
      reply_to_id: null,
      attachments: JSON.stringify([{
        type: 'image',
        url: '/uploads/club/new_balls_photo.jpg',
        name: 'nuevas_pelotas.jpg',
        size: 156432
      }]),
      metadata: JSON.stringify({
        system_event: 'conversation_created',
        trigger: 'club_admin_action',
        timestamp_sent: '2024-11-30T09:00:00Z'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 2, // Club management coordination
      sender_id: 9, // club001 user
      content: 'Perfecto! Las necesitaba para mi clase de mañana. ¿También llegaron las paletas que habían ordenado?',
      message_type: 'text',
      reply_to_id: null,
      attachments: null,
      metadata: JSON.stringify({
        device: 'desktop',
        app_version: '2.1.0',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-30T09:15:00Z'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 2, // Club management coordination
      sender_id: 1, // admin001
      content: 'Hola Roberto, gracias por contactarnos. He revisado tu certificado médico y procederé con el reembolso inmediatamente. El proceso tarda 24-48 horas.',
      message_type: 'text',
      reply_to_id: 7, // Replying to club message
      attachments: null,
      metadata: JSON.stringify({
        device: 'desktop',
        app_version: '2.1.1',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-30T09:30:00Z',
        admin_priority: 'high'
      }),
      is_edited: false,
      edited_at: null,
      is_deleted: false,
      deleted_at: null,
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('conversation_messages', {}, {});
  }
};