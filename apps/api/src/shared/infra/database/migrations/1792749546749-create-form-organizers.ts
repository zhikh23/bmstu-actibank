import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormOrganizers1792749546749 implements MigrationInterface {
  name = 'CreateFormOrganizers1792749546749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "forms_organizers" ("form_id" uuid NOT NULL, "number" integer NOT NULL, "organizer_id" uuid NOT NULL, CONSTRAINT "PK_forms_organizers_form_id_number" PRIMARY KEY ("form_id", "number"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms_organizers" ADD CONSTRAINT "FK_forms_organizers_form_id" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms_organizers" DROP CONSTRAINT "FK_forms_organizers_form_id"`,
    );
    await queryRunner.query(`DROP TABLE "forms_organizers"`);
  }
}
