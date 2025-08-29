const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

// Database configuration (matches our backend config)
const sequelize = new Sequelize({
  database: 'pickleball_federation',
  username: 'postgres', 
  password: 'password',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log
});

async function seedTestData() {
  try {
    console.log('Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database');

    // Hash password for test user
    const passwordHash = await bcrypt.hash('password123', 10);

    console.log('Creating test user...');
    
    // Insert test user
    const [user] = await sequelize.query(`
      INSERT INTO users (username, email, password_hash, role, is_active, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `, {
      bind: ['testuser', 'test@example.com', passwordHash, 'player', true, true]
    });

    // Insert some Mexican states for testing
    console.log('Seeding Mexican states...');
    await sequelize.query(`
      INSERT INTO states (name, code, created_at) VALUES
      ('Ciudad de México', 'CDMX', NOW()),
      ('Jalisco', 'JAL', NOW()),
      ('Nuevo León', 'NL', NOW()),
      ('Yucatán', 'YUC', NOW()),
      ('Quintana Roo', 'QR', NOW())
      ON CONFLICT (code) DO NOTHING;
    `);

    console.log('✅ Test data seeded successfully!');
    console.log('\n📧 Test User Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('Role: player');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error seeding test data:', error.message);
    process.exit(1);
  }
}

seedTestData();