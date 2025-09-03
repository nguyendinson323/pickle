module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('message_reactions', [
    {
      message_id: 1, // First conversation message
      user_id: 5, // coach001 reacting
      reaction: 'like',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 1, // First conversation message
      user_id: 4, // player003 reacting
      reaction: 'heart',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 2, // Second conversation message
      user_id: 2, // player001 reacting
      reaction: 'like',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 2, // Second conversation message
      user_id: 4, // player003 showing support
      reaction: 'thumbs_up',
      created_at: new Date(now.getTime() + 5 * 60 * 1000),
      updated_at: new Date(now.getTime() + 5 * 60 * 1000)
    },
    {
      message_id: 3, // Third conversation message
      user_id: 5, // coach001 reacting
      reaction: 'like',
      created_at: new Date(now.getTime() + 10 * 60 * 1000),
      updated_at: new Date(now.getTime() + 10 * 60 * 1000)
    },
    {
      message_id: 4, // Tournament group message
      user_id: 2, // player001 showing gratitude
      reaction: 'heart',
      created_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000),
      updated_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000)
    },
    {
      message_id: 5, // Tournament response
      user_id: 7, // partner001 acknowledging
      reaction: 'like',
      created_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      updated_at: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
    },
    {
      message_id: 6, // Tournament document message
      user_id: 2, // player001 acknowledging
      reaction: 'thumbs_up',
      created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      updated_at: new Date(now.getTime() - 6 * 60 * 60 * 1000)
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('message_reactions', {}, {});
  }
};