import dataSource from '../config/typeorm';

async function truncate() {
  try {
    console.log('Initializing Data Source for truncation...');
    await dataSource.initialize();
    
    const entities = dataSource.entityMetadatas;
    
    console.log('Truncating tables...');
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
    
    console.log('All tables truncated successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Truncation failed:', error);
    process.exit(1);
  }
}

truncate();
