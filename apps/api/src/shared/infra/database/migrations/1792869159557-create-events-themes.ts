import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsThemes1792869159557 implements MigrationInterface {
  name = 'CreateEventsThemes1792869159557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events_themes" ("id" uuid NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_events_themes_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events_themes"`);
  }
}
