import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFiles1793450058043 implements MigrationInterface {
  name = 'CreateFiles1793450058043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" DROP CONSTRAINT "FK_forms_signed_scan_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL, "owner_id" uuid NOT NULL, "storage_key" character varying NOT NULL, "content_type" character varying NOT NULL, "size" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_files_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" DROP CONSTRAINT "UQ_forms_signed_scan_id"`,
    );
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "signed_scan_id"`);
    await queryRunner.query(
      `ALTER TABLE "forms" ALTER COLUMN "revision" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" ALTER COLUMN "revision" SET DEFAULT '1'`,
    );
    await queryRunner.query(`ALTER TABLE "forms" ADD "signed_scan_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "forms" ADD CONSTRAINT "UQ_forms_signed_scan_id" UNIQUE ("signed_scan_id")`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(
      `ALTER TABLE "forms" ADD CONSTRAINT "FK_forms_signed_scan_id" FOREIGN KEY ("signed_scan_id") REFERENCES "forms_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
