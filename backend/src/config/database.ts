import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'pickleball_federation',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: isDevelopment ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 PostgreSQL connection established successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  }
})();

export default sequelize;