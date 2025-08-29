const { Client } = require('pg');

async function checkPostgreSQL() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'pickleball_federation',
    password: 'password',
    port: 5432,
  });

  try {
    console.log('🔄 Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('✅ PostgreSQL connection successful!');
    
    const result = await client.query('SELECT version();');
    console.log('📊 PostgreSQL Version:', result.rows[0].version);
    
    // Check if database exists
    const dbResult = await client.query('SELECT current_database();');
    console.log('🗄️  Current Database:', dbResult.rows[0].current_database);
    
    // List tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('📋 Tables in database:', tablesResult.rows.length > 0 ? tablesResult.rows.map(r => r.table_name) : 'No tables yet');
    
    await client.end();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
}

checkPostgreSQL();