import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1777431778332 implements MigrationInterface {
    name = 'AddPasswordToUser1777431778332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "password"`);
    }

}
