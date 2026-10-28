import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAddForeignKeysFormsDocuments1793130118315 implements MigrationInterface {
  name = 'AlterAddForeignKeysFormsDocuments1793130118315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" ADD "revision" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "forms" ADD "signed_scan_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "forms" ADD CONSTRAINT "UQ_forms_signed_scan_id" UNIQUE ("signed_scan_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD CONSTRAINT "FK_forms_documents_form_id" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" ADD CONSTRAINT "FK_forms_signed_scan_id" FOREIGN KEY ("signed_scan_id") REFERENCES "forms_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" DROP CONSTRAINT "FK_forms_signed_scan_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP CONSTRAINT "FK_forms_documents_form_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" DROP CONSTRAINT "UQ_forms_signed_scan_id"`,
    );
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "signed_scan_id"`);
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "revision"`);
  }
}
