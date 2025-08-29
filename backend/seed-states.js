const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance (same config as our app)
const dbPath = path.join(__dirname, 'data/development.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

const mexicanStates = [
  { name: 'Aguascalientes', code: 'AGS' },
  { name: 'Baja California', code: 'BC' },
  { name: 'Baja California Sur', code: 'BCS' },
  { name: 'Campeche', code: 'CAMP' },
  { name: 'Chiapas', code: 'CHIS' },
  { name: 'Chihuahua', code: 'CHIH' },
  { name: 'Ciudad de México', code: 'CDMX' },
  { name: 'Coahuila', code: 'COAH' },
  { name: 'Colima', code: 'COL' },
  { name: 'Durango', code: 'DGO' },
  { name: 'Guanajuato', code: 'GTO' },
  { name: 'Guerrero', code: 'GRO' },
  { name: 'Hidalgo', code: 'HGO' },
  { name: 'Jalisco', code: 'JAL' },
  { name: 'México', code: 'MEX' },
  { name: 'Michoacán', code: 'MICH' },
  { name: 'Morelos', code: 'MOR' },
  { name: 'Nayarit', code: 'NAY' },
  { name: 'Nuevo León', code: 'NL' },
  { name: 'Oaxaca', code: 'OAX' },
  { name: 'Puebla', code: 'PUE' },
  { name: 'Querétaro', code: 'QRO' },
  { name: 'Quintana Roo', code: 'QROO' },
  { name: 'San Luis Potosí', code: 'SLP' },
  { name: 'Sinaloa', code: 'SIN' },
  { name: 'Sonora', code: 'SON' },
  { name: 'Tabasco', code: 'TAB' },
  { name: 'Tamaulipas', code: 'TAMS' },
  { name: 'Tlaxcala', code: 'TLAX' },
  { name: 'Veracruz', code: 'VER' },
  { name: 'Yucatán', code: 'YUC' },
  { name: 'Zacatecas', code: 'ZAC' }
];

async function seedStates() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if states table exists and has data
    const [results] = await sequelize.query("SELECT COUNT(*) as count FROM states");
    const count = results[0].count;

    if (count > 0) {
      console.log(`States table already has ${count} records. Skipping seed.`);
      await sequelize.close();
      return;
    }

    console.log('Seeding Mexican states...');
    
    // Insert all states
    for (const state of mexicanStates) {
      await sequelize.query(`
        INSERT INTO states (name, code, created_at) 
        VALUES (?, ?, datetime('now'))
      `, {
        replacements: [state.name, state.code]
      });
    }

    console.log(`✅ Successfully seeded ${mexicanStates.length} Mexican states!`);
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error seeding states:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedStates();