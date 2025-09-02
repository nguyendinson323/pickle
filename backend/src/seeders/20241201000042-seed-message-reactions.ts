module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('message_reactions', [
    {
      message_id: 1, // Carlos's tournament message
      user_id: 4, // Roberto reacting
      reaction_type: 'like',
      reaction_emoji: '👍',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 1, // Carlos's tournament message
      user_id: 3, // María reacting
      reaction_type: 'excited',
      reaction_emoji: '🔥',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 2, // Roberto's reply
      user_id: 2, // Carlos reacting to Roberto's response
      reaction_type: 'like',
      reaction_emoji: '👍',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 2, // Roberto's reply
      user_id: 5, // Coach Luis showing support
      reaction_type: 'support',
      reaction_emoji: '💪',
      created_at: new Date('2024-11-20T10:25:00Z'),
      updated_at: new Date('2024-11-20T10:25:00Z')
    },
    {
      message_id: 3, // María's message
      user_id: 2, // Carlos reacting
      reaction_type: 'heart',
      reaction_emoji: '❤️',
      created_at: new Date('2024-11-20T10:23:00Z'),
      updated_at: new Date('2024-11-20T10:23:00Z')
    },
    {
      message_id: 3, // María's message
      user_id: 4, // Roberto reacting
      reaction_type: 'like',
      reaction_emoji: '👍',
      created_at: new Date('2024-11-20T10:24:00Z'),
      updated_at: new Date('2024-11-20T10:24:00Z')
    },
    {
      message_id: 4, // Coach Luis's training message
      user_id: 2, // Carlos showing gratitude
      reaction_type: 'grateful',
      reaction_emoji: '🙏',
      created_at: new Date('2024-11-25T14:32:00Z'),
      updated_at: new Date('2024-11-25T14:32:00Z')
    },
    {
      message_id: 4, // Coach Luis's training message
      user_id: 3, // María finding it helpful
      reaction_type: 'helpful',
      reaction_emoji: '💡',
      created_at: new Date('2024-11-25T14:35:00Z'),
      updated_at: new Date('2024-11-25T14:35:00Z')
    },
    {
      message_id: 5, // Carlos's reply to coach
      user_id: 5, // Coach Luis acknowledging
      reaction_type: 'like',
      reaction_emoji: '👍',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 7, // Club management message
      user_id: 1, // Admin acknowledging
      reaction_type: 'noted',
      reaction_emoji: '✅',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 8, // Admin response to club
      user_id: 9, // Club user acknowledging admin response
      reaction_type: 'grateful',
      reaction_emoji: '🙏',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 2, // Roberto's reply - another reaction
      user_id: 6, // Coach Ana showing professional support
      reaction_type: 'professional',
      reaction_emoji: '🎾',
      created_at: now,
      updated_at: now
    },
    {
      message_id: 4, // Coach Luis's message
      user_id: 4, // Roberto appreciating the coaching advice
      reaction_type: 'learning',
      reaction_emoji: '📚',
      created_at: now,
      updated_at: now
    }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('message_reactions', {}, {});
  }
};