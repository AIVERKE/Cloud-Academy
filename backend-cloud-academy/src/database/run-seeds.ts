import dataSource from '../config/typeorm';
import { runSeeders } from 'typeorm-extension';
import MainSeeder from './seeds/main.seeder';

async function run() {
  try {
    console.log('Initializing Data Source...');
    await dataSource.initialize();
    
    console.log('Running Seeders...');
    await runSeeders(dataSource, {
      seeds: [MainSeeder]
    });
    
    console.log('Seeding finished successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

run();
