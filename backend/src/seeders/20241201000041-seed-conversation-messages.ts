module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('conversation_messages', [
    {
      conversation_id: 1, // Tournament coordination conversation
      message_id: 1, // Reference to messages table
      sender_id: 2, // Carlos Méndez Rivera
      message_order: 1,
      is_system_message: false,
      thread_id: null,
      reply_to_message_id: null,
      message_metadata: JSON.stringify({
        device: 'mobile',
        app_version: '2.1.0',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-20T10:15:00Z'
      }),
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 1, // Tournament coordination conversation
      message_id: 2, // Reference to messages table
      sender_id: 4, // Roberto Sánchez Torres
      message_order: 2,
      is_system_message: false,
      thread_id: null,
      reply_to_message_id: 1, // Replying to Carlos's message
      message_metadata: JSON.stringify({
        device: 'desktop',
        app_version: '2.1.0',
        location_sent: 'Monterrey',
        timestamp_sent: '2024-11-20T10:18:00Z'
      }),
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 1, // Tournament coordination conversation
      message_id: 3, // Reference to messages table
      sender_id: 3, // María González López
      message_order: 3,
      is_system_message: false,
      thread_id: null,
      reply_to_message_id: null,
      message_metadata: JSON.stringify({
        device: 'mobile',
        app_version: '2.0.9',
        location_sent: 'Guadalajara',
        timestamp_sent: '2024-11-20T10:22:00Z'
      }),
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 2, // Coaching session discussion
      message_id: 4, // Reference to messages table
      sender_id: 5, // Luis Hernández Morales (coach)
      message_order: 1,
      is_system_message: false,
      thread_id: 'training_tips',
      reply_to_message_id: null,
      message_metadata: JSON.stringify({
        device: 'tablet',
        app_version: '2.1.0',
        location_sent: 'Monterrey',
        timestamp_sent: '2024-11-25T14:30:00Z'
      }),
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 2, // Coaching session discussion
      message_id: 5, // Reference to messages table
      sender_id: 2, // Carlos Méndez Rivera
      message_order: 2,
      is_system_message: false,
      thread_id: 'training_tips',
      reply_to_message_id: 4, // Replying to coach's message
      message_metadata: JSON.stringify({
        device: 'mobile',
        app_version: '2.1.0',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-25T14:45:00Z'
      }),
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 3, // Club management coordination
      message_id: 6, // Reference to messages table - system message
      sender_id: null, // System message
      message_order: 1,
      is_system_message: true,
      thread_id: null,
      reply_to_message_id: null,
      message_metadata: JSON.stringify({
        system_event: 'conversation_created',
        trigger: 'club_admin_action',
        timestamp_sent: '2024-11-30T09:00:00Z'
      }),
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 3, // Club management coordination
      message_id: 7, // Reference to messages table
      sender_id: 9, // club001 user
      message_order: 2,
      is_system_message: false,
      thread_id: null,
      reply_to_message_id: null,
      message_metadata: JSON.stringify({
        device: 'desktop',
        app_version: '2.1.0',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-30T09:15:00Z'
      }),
      created_at: now,
      updated_at: now
    },
    {
      conversation_id: 3, // Club management coordination
      message_id: 8, // Reference to messages table
      sender_id: 1, // admin001
      message_order: 3,
      is_system_message: false,
      thread_id: null,
      reply_to_message_id: 7, // Replying to club message
      message_metadata: JSON.stringify({
        device: 'desktop',
        app_version: '2.1.1',
        location_sent: 'CDMX',
        timestamp_sent: '2024-11-30T09:30:00Z',
        admin_priority: 'high'
      }),
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('conversation_messages', {}, {});
  }
};