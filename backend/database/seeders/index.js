const sequelize = require('../../src/config/database').default;
const MicrositeSeeder = require('./MicrositeSeeder');

async function runAllSeeders() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Sync database first
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');

    // Run seeders in order
    await MicrositeSeeder.run();

    console.log('🎉 All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  runAllSeeders();
}

module.exports = {
  runAllSeeders,
  MicrositeSeeder
};