import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateResourcesTable1777429323954 implements MigrationInterface {
    name = 'CreateResourcesTable1777429323954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recursos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "googleDriveId" character varying NOT NULL, "webViewLink" character varying NOT NULL, "mimeType" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b1ab9957d2d6e5239c4ade00f61" UNIQUE ("googleDriveId"), CONSTRAINT "PK_5a0d9a8e3adc0a5c2961159930a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "recursos"`);
    }

}
