import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Role, RolNombre } from '../../auth/entities/role.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    const roles = await roleRepository.find();
    const roleMap = roles.reduce((acc, role) => {
      acc[role.nombre] = role.id;
      return acc;
    }, {} as Record<string, string>);

    const testPassword = 'Password123!';

    // 1. Root User
    const rootExists = await userRepository.findOneBy({ email: 'root@cloudacademy.com' });
    if (!rootExists) {
      await userRepository.save(userRepository.create({
        nombre_completo: 'Administrador Root',
        email: 'root@cloudacademy.com',
        google_id: 'root-google-id',
        rol_id: roleMap[RolNombre.Root],
        password: testPassword,
      }));
    }

    // 2. Docentes (5)
    for (let i = 1; i <= 5; i++) {
      const email = `docente${i}@cloudacademy.com`;
      const exists = await userRepository.findOneBy({ email });
      if (!exists) {
        await userRepository.save(userRepository.create({
          nombre_completo: `Docente de Prueba ${i}`,
          email,
          google_id: `docente-id-${i}`,
          rol_id: roleMap[RolNombre.Docente],
          password: testPassword,
        }));
      }
    }

    // 3. Estudiantes (20)
    for (let i = 1; i <= 20; i++) {
      const email = `estudiante${i}@cloudacademy.com`;
      const exists = await userRepository.findOneBy({ email });
      if (!exists) {
        await userRepository.save(userRepository.create({
          nombre_completo: `Estudiante de Prueba ${i}`,
          email,
          google_id: `estudiante-id-${i}`,
          rol_id: roleMap[RolNombre.Estudiante],
          password: testPassword,
        }));
      }
    }
  }
}
