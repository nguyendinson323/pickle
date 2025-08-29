const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance (same config as our app)
const dbPath = path.join(__dirname, 'data/development.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Hash password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Insert test user directly with raw SQL
    await sequelize.query(`
      INSERT INTO users (username, email, password_hash, role, is_active, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, {
      replacements: ['testuser', 'test@example.com', passwordHash, 'player', 1, 1]
    });

    console.log('Test user created successfully:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('Role: player');

    await sequelize.close();
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();