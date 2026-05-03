import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeGoogleIdNullable1777816011890 implements MigrationInterface {
    name = 'MakeGoogleIdNullable1777816011890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "google_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "google_id" SET NOT NULL`);
    }

}
