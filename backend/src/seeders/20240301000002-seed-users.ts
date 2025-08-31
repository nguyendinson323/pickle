import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const passwordHash = await bcrypt.hash('a', 10);
  
  await queryInterface.bulkInsert('users', [
    // 1 Admin
    {
      username: 'admin',
      email: 'admin@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'federation',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 3 Players
    {
      username: 'player001',
      email: 'player1@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'player',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      username: 'player002',
      email: 'player2@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'player',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      username: 'player003',
      email: 'player3@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'player',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 2 Coaches
    {
      username: 'coach001',
      email: 'coach1@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'coach',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      username: 'coach002',
      email: 'coach2@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'coach',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 2 Partners
    {
      username: 'partner001',
      email: 'partner1@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'partner',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      username: 'partner002',
      email: 'partner2@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'partner',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 2 Clubs
    {
      username: 'club001',
      email: 'club1@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'club',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      username: 'club002',
      email: 'club2@federacionpickleball.mx',
      password_hash: passwordHash,
      role: 'club',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('users', {}, {});
}