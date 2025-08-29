const { Sequelize } = require('sequelize');
const path = require('path');

// Import models - need to use the compiled JS files
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data/development.sqlite'),
  logging: console.log
});

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database with Sequelize models...');
    
    // Force sync to recreate all tables
    await sequelize.sync({ force: true });
    
    console.log('✅ Database synced successfully!');
    console.log('Note: All data has been cleared. Please run seed-comprehensive-data.js to add test data.');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();