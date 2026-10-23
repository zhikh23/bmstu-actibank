import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateForms1792672813304 implements MigrationInterface {
  name = 'CreateForms1792672813304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "forms_links" ("form_id" uuid NOT NULL, "number" integer NOT NULL, "link" character varying NOT NULL, CONSTRAINT "PK_forms_links_form_id_number" PRIMARY KEY ("form_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forms_venues" ("form_id" uuid NOT NULL, "number" integer NOT NULL, "venue_id" character varying NOT NULL, CONSTRAINT "PK_forms_venues_form_id_number" PRIMARY KEY ("form_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forms_themes" ("form_id" uuid NOT NULL, "number" integer NOT NULL, "theme_id" character varying NOT NULL, CONSTRAINT "PK_forms_themes_form_id_number" PRIMARY KEY ("form_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forms_guests" ("form_id" uuid NOT NULL, "number" integer NOT NULL, "user_id" uuid NOT NULL, "rank_id" uuid NOT NULL, CONSTRAINT "PK_forms_guests_form_id_number" PRIMARY KEY ("form_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forms_members" ("form_id" uuid NOT NULL, "number" integer NOT NULL, "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_forms_members_form_id_number" PRIMARY KEY ("form_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forms" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, "format_id" uuid NOT NULL, "type_id" uuid NOT NULL, "level_id" uuid NOT NULL, "participants_students" integer NOT NULL, "participants_employees" integer NOT NULL, "participants_others" integer NOT NULL, "status" character varying NOT NULL, "reason" text, "submitter_id" uuid NOT NULL, "reviewer_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "reviewed_at" TIMESTAMP WITH TIME ZONE, "canceled_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_forms_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_forms_status" ON "forms"  ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_forms_submitter_id" ON "forms"  ("submitter_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_forms_deleted_at" ON "forms"  ("deleted_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_links" ADD CONSTRAINT "FK_forms_links_form_id" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_venues" ADD CONSTRAINT "FK_forms_venues_form_id" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_themes" ADD CONSTRAINT "FK_forms_themes_form_id" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_guests" ADD CONSTRAINT "FK_forms_guests_form_id" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_members" ADD CONSTRAINT "FK_forms_members_form_id" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms_members" DROP CONSTRAINT "FK_forms_members_form_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_guests" DROP CONSTRAINT "FK_forms_guests_form_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_themes" DROP CONSTRAINT "FK_forms_themes_form_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_venues" DROP CONSTRAINT "FK_forms_venues_form_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_links" DROP CONSTRAINT "FK_forms_links_form_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_forms_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_forms_submitter_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_forms_status"`);
    await queryRunner.query(`DROP TABLE "forms"`);
    await queryRunner.query(`DROP TABLE "forms_members"`);
    await queryRunner.query(`DROP TABLE "forms_guests"`);
    await queryRunner.query(`DROP TABLE "forms_themes"`);
    await queryRunner.query(`DROP TABLE "forms_venues"`);
    await queryRunner.query(`DROP TABLE "forms_links"`);
  }
}
