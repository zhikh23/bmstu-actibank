import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormsDocuments1793619818591 implements MigrationInterface {
  name = 'CreateFormsDocuments1793619818591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" RENAME COLUMN "revision" TO "document_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP COLUMN "form_revision"`,
    );
    await queryRunner.query(`ALTER TABLE "forms_documents" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP COLUMN "storage_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP COLUMN "content_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD "generated_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "forms_documents" ADD "scan_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD "uploaded_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "document_id"`);
    await queryRunner.query(`ALTER TABLE "forms" ADD "document_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "forms" ADD CONSTRAINT "UQ_forms_document_id" UNIQUE ("document_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_forms_documents_form_id" ON "forms_documents"  ("form_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" ADD CONSTRAINT "FK_forms_document_id" FOREIGN KEY ("document_id") REFERENCES "forms_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" DROP CONSTRAINT "FK_forms_document_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_forms_documents_form_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" DROP CONSTRAINT "UQ_forms_document_id"`,
    );
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "document_id"`);
    await queryRunner.query(
      `ALTER TABLE "forms" ADD "document_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP COLUMN "uploaded_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP COLUMN "scan_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" DROP COLUMN "generated_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD "content_type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD "storage_key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD "form_revision" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_documents" ADD "created_by" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" RENAME COLUMN "document_id" TO "revision"`,
    );
  }
}
