const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data/development.sqlite'),
  logging: false
});

async function checkUsers() {
  try {
    const [results] = await sequelize.query(
      "SELECT id, username, email, password_hash, role, is_active FROM users"
    );
    
    console.log('Users in database:');
    console.log('==================');
    results.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Active: ${user.is_active}`);
      console.log(`Has password: ${user.password_hash ? 'Yes' : 'No'}`);
      console.log('---');
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();