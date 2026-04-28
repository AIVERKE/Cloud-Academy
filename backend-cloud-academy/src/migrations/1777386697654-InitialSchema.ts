import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777386697654 implements MigrationInterface {
    name = 'InitialSchema1777386697654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "google_sheets_buffer" ("fila_id" integer NOT NULL, "marca_temporal" TIMESTAMP NOT NULL, "correo_estudiante" character varying NOT NULL, "id_tarea" character varying NOT NULL, "url_archivo_drive" character varying NOT NULL, "calificacion_ref" numeric, CONSTRAINT "PK_165dac3656a8b7d0a848f90d8f1" PRIMARY KEY ("fila_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."roles_nombre_enum" AS ENUM('Root', 'Docente', 'Estudiante')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" "public"."roles_nombre_enum" NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "logs_auditoria" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "usuario_id" uuid NOT NULL, "accion" character varying NOT NULL, "detalle" jsonb, "fecha_hora" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_034892b883599b2857c75d5d639" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "google_id" character varying NOT NULL, "nombre_completo" character varying NOT NULL, "email" character varying NOT NULL, "rol_id" uuid NOT NULL, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7297e3daa75b842415eddc76cc5" UNIQUE ("google_id"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "aulas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying NOT NULL, "codigo_acceso" character varying NOT NULL, "docente_id" uuid NOT NULL, "estado" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2240358d61412b321e66d41686d" UNIQUE ("codigo_acceso"), CONSTRAINT "PK_1c24faf8a7f2309f6b44679ee91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tareas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "aula_id" uuid NOT NULL, "titulo" character varying NOT NULL, "descripcion" text, "fecha_limite" TIMESTAMP NOT NULL, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9370ac1b0569cacf8cda6815c97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."entregas_estado_enum" AS ENUM('Pendiente', 'Calificado', 'Atrasado')`);
        await queryRunner.query(`CREATE TYPE "public"."entregas_sync_status_enum" AS ENUM('Sincronizado', 'Pendiente_Actualizacion', 'Error_Sync')`);
        await queryRunner.query(`CREATE TABLE "entregas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tarea_id" uuid NOT NULL, "estudiante_id" uuid NOT NULL, "google_drive_file_id" character varying NOT NULL, "google_drive_url" character varying NOT NULL, "calificacion" numeric(5,2), "estado" "public"."entregas_estado_enum" NOT NULL DEFAULT 'Pendiente', "fecha_entrega" TIMESTAMP NOT NULL DEFAULT now(), "sheet_row_index" integer, "sync_status" "public"."entregas_sync_status_enum" NOT NULL DEFAULT 'Sincronizado', "ultima_sincronizacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b0bdf868c69c227aefd59085282" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inscripciones" ("estudiante_id" uuid NOT NULL, "aula_id" uuid NOT NULL, CONSTRAINT "PK_778c6eaef46206c98ca706d8c22" PRIMARY KEY ("estudiante_id", "aula_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_562e7adc0f4986a76bfc4243bc" ON "inscripciones" ("estudiante_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a1bc93564b33ae7c7f1fc0595" ON "inscripciones" ("aula_id") `);
        await queryRunner.query(`ALTER TABLE "logs_auditoria" ADD CONSTRAINT "FK_40a1967a69863f775a46300313b" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "FK_9e519760a660751f4fa21453d3e" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "aulas" ADD CONSTRAINT "FK_bcf3ae3c70f4eba45d9c24a885a" FOREIGN KEY ("docente_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tareas" ADD CONSTRAINT "FK_05afa19bfe997228827a957d0ca" FOREIGN KEY ("aula_id") REFERENCES "aulas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entregas" ADD CONSTRAINT "FK_c77f7fafb407ba3bd7ebd564de5" FOREIGN KEY ("tarea_id") REFERENCES "tareas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entregas" ADD CONSTRAINT "FK_4d2a7cc4bb12c6026f8ae2a4a17" FOREIGN KEY ("estudiante_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD CONSTRAINT "FK_562e7adc0f4986a76bfc4243bc7" FOREIGN KEY ("estudiante_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD CONSTRAINT "FK_5a1bc93564b33ae7c7f1fc05954" FOREIGN KEY ("aula_id") REFERENCES "aulas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP CONSTRAINT "FK_5a1bc93564b33ae7c7f1fc05954"`);
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP CONSTRAINT "FK_562e7adc0f4986a76bfc4243bc7"`);
        await queryRunner.query(`ALTER TABLE "entregas" DROP CONSTRAINT "FK_4d2a7cc4bb12c6026f8ae2a4a17"`);
        await queryRunner.query(`ALTER TABLE "entregas" DROP CONSTRAINT "FK_c77f7fafb407ba3bd7ebd564de5"`);
        await queryRunner.query(`ALTER TABLE "tareas" DROP CONSTRAINT "FK_05afa19bfe997228827a957d0ca"`);
        await queryRunner.query(`ALTER TABLE "aulas" DROP CONSTRAINT "FK_bcf3ae3c70f4eba45d9c24a885a"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "FK_9e519760a660751f4fa21453d3e"`);
        await queryRunner.query(`ALTER TABLE "logs_auditoria" DROP CONSTRAINT "FK_40a1967a69863f775a46300313b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a1bc93564b33ae7c7f1fc0595"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_562e7adc0f4986a76bfc4243bc"`);
        await queryRunner.query(`DROP TABLE "inscripciones"`);
        await queryRunner.query(`DROP TABLE "entregas"`);
        await queryRunner.query(`DROP TYPE "public"."entregas_sync_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."entregas_estado_enum"`);
        await queryRunner.query(`DROP TABLE "tareas"`);
        await queryRunner.query(`DROP TABLE "aulas"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "logs_auditoria"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_nombre_enum"`);
        await queryRunner.query(`DROP TABLE "google_sheets_buffer"`);
    }

}
