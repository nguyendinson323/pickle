module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('message_read_status', [
      {
        message_id: 1, // Carlos's tournament message
        user_id: 4, // Roberto read it
        read_at: new Date('2024-11-20T10:16:00Z'),
        created_at: now,
        updated_at: now
      },
      {
        message_id: 1,
        user_id: 3,
        read_at: new Date('2024-11-20T10:21:00Z'),
        created_at: now,
        updated_at: now
      },
      {
        message_id: 1,
        user_id: 5,
        read_at: new Date('2024-11-20T10:24:00Z'),
        created_at: new Date('2024-11-20T10:15:30Z'),
        updated_at: new Date('2024-11-20T10:24:00Z')
      },
      {
        message_id: 2,
        user_id: 2,
        read_at: new Date('2024-11-20T10:19:00Z'),
        created_at: new Date('2024-11-20T10:18:30Z'),
        updated_at: new Date('2024-11-20T10:19:00Z')
      },
      {
        message_id: 2,
        user_id: 3,
        read_at: new Date('2024-11-20T10:22:30Z'),
        created_at: new Date('2024-11-20T10:18:30Z'),
        updated_at: new Date('2024-11-20T10:22:30Z')
      },
      {
        message_id: 2,
        user_id: 5,
        read_at: new Date('2024-11-20T10:25:15Z'),
        created_at: new Date('2024-11-20T10:18:30Z'),
        updated_at: new Date('2024-11-20T10:25:15Z')
      },
      {
        message_id: 3,
        user_id: 2,
        read_at: new Date('2024-11-20T10:23:00Z'),
        created_at: new Date('2024-11-20T10:22:30Z'),
        updated_at: new Date('2024-11-20T10:23:00Z')
      },
      {
        message_id: 3,
        user_id: 4,
        read_at: new Date('2024-11-20T10:24:30Z'),
        created_at: new Date('2024-11-20T10:22:30Z'),
        updated_at: new Date('2024-11-20T10:24:30Z')
      },
      {
        message_id: 3,
        user_id: 5,
        read_at: new Date('2024-11-20T10:22:30Z'), // Set to delivery time since read_at cannot be null
        created_at: new Date('2024-11-20T10:22:30Z'),
        updated_at: new Date('2024-11-20T10:22:30Z')
      },
      {
        message_id: 4,
        user_id: 2,
        read_at: new Date('2024-11-25T14:31:00Z'),
        created_at: new Date('2024-11-25T14:30:30Z'),
        updated_at: new Date('2024-11-25T14:31:00Z')
      },
      {
        message_id: 4,
        user_id: 3,
        read_at: new Date('2024-11-25T14:34:00Z'),
        created_at: new Date('2024-11-25T14:30:30Z'),
        updated_at: new Date('2024-11-25T14:34:00Z')
      },
      {
        message_id: 5,
        user_id: 5,
        read_at: new Date('2024-11-25T14:46:00Z'),
        created_at: new Date('2024-11-25T14:45:30Z'),
        updated_at: new Date('2024-11-25T14:46:00Z')
      },
      {
        message_id: 5,
        user_id: 3,
        read_at: new Date('2024-11-25T15:10:00Z'),
        created_at: new Date('2024-11-25T14:45:30Z'),
        updated_at: new Date('2024-11-25T15:10:00Z')
      },
      {
        message_id: 7,
        user_id: 1,
        read_at: new Date('2024-11-30T09:18:00Z'),
        created_at: new Date('2024-11-30T09:15:30Z'),
        updated_at: new Date('2024-11-30T09:18:00Z')
      },
      {
        message_id: 8,
        user_id: 9,
        read_at: new Date('2024-11-30T09:31:00Z'),
        created_at: new Date('2024-11-30T09:30:30Z'),
        updated_at: new Date('2024-11-30T09:31:00Z')
      },
      {
        message_id: 6,
        user_id: 9,
        read_at: new Date('2024-11-30T09:02:00Z'),
        created_at: new Date('2024-11-30T09:00:30Z'),
        updated_at: new Date('2024-11-30T09:02:00Z')
      },
      {
        message_id: 6,
        user_id: 1,
        read_at: new Date('2024-11-30T09:05:00Z'),
        created_at: new Date('2024-11-30T09:00:30Z'),
        updated_at: new Date('2024-11-30T09:05:00Z')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('message_read_status', {}, {});
  }
};
