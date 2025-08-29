import { DatabaseSeeder } from '../seeders';

async function runSeeder() {
  try {
    const seeder = new DatabaseSeeder();
    await seeder.run();
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

runSeeder();