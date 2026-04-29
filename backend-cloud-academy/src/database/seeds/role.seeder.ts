import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role, RolNombre } from '../../auth/entities/role.entity';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(Role);
    
    const roles = [
      { nombre: RolNombre.Root },
      { nombre: RolNombre.Docente },
      { nombre: RolNombre.Estudiante },
    ];

    for (const roleData of roles) {
      const exists = await repository.findOneBy({ nombre: roleData.nombre });
      if (!exists) {
        await repository.save(repository.create(roleData));
      }
    }
  }
}
