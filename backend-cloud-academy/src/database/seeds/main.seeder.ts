import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import RoleSeeder from './role.seeder';
import UserSeeder from './user.seeder';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    console.log('--- Database Seeding Started ---');
    
    console.log('Step 1: Seeding Roles...');
    await runSeeder(dataSource, RoleSeeder);
    
    console.log('Step 2: Seeding Users...');
    await runSeeder(dataSource, UserSeeder);
    
    console.log('--- Database Seeding Completed ---');
  }
}
