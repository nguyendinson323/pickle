const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('a', 10);
    
    await queryInterface.bulkInsert('users', [
      // 1 Admin
      {
        username: 'admin',
        email: 'admin@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      // 3 Players
      {
        username: 'player001',
        email: 'player1@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'player',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        username: 'player002',
        email: 'player2@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'player',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        username: 'player003',
        email: 'player3@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'player',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      // 2 Coaches
      {
        username: 'coach001',
        email: 'coach1@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'coach',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        username: 'coach002',
        email: 'coach2@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'coach',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      // 2 Partners
      {
        username: 'partner001',
        email: 'partner1@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'partner',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        username: 'partner002',
        email: 'partner2@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'partner',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      // 2 Clubs
      {
        username: 'club001',
        email: 'club1@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'club',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      },
      {
        username: 'club002',
        email: 'club2@federacionpickleball.mx',
        password_hash: passwordHash,
        role: 'club',
        is_active: true,
        email_verified: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};