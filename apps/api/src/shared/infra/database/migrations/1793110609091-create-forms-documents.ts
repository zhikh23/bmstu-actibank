import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormsDocuments1793110609091 implements MigrationInterface {
  name = 'CreateFormsDocuments1793110609091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "forms_documents" ("id" uuid NOT NULL, "form_id" uuid NOT NULL, "form_revision" integer NOT NULL, "type" character varying NOT NULL, "storage_key" character varying NOT NULL, "content_type" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_by" uuid NOT NULL, CONSTRAINT "PK_forms_documents_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "forms_documents"`);
  }
}
