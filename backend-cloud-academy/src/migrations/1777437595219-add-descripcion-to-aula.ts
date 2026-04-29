import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescripcionToAula1777437595219 implements MigrationInterface {
    name = 'AddDescripcionToAula1777437595219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aulas" ADD "descripcion" text`);
        await queryRunner.query(`ALTER TABLE "logs_auditoria" DROP CONSTRAINT "FK_40a1967a69863f775a46300313b"`);
        await queryRunner.query(`ALTER TABLE "logs_auditoria" ALTER COLUMN "usuario_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "logs_auditoria" ADD CONSTRAINT "FK_40a1967a69863f775a46300313b" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs_auditoria" DROP CONSTRAINT "FK_40a1967a69863f775a46300313b"`);
        await queryRunner.query(`ALTER TABLE "logs_auditoria" ALTER COLUMN "usuario_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "logs_auditoria" ADD CONSTRAINT "FK_40a1967a69863f775a46300313b" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "aulas" DROP COLUMN "descripcion"`);
    }

}
