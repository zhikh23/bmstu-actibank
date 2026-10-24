import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCatalogTables1792878020761 implements MigrationInterface {
  name = 'CreateCatalogTables1792878020761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "venues" DROP CONSTRAINT "FK_events_venues_building_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_types" ("id" uuid NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_event_types_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "formats" ("id" uuid NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_formats_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "levels" ("id" uuid NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_levels_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "venues" ADD CONSTRAINT "FK_venues_building_id" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "venues" DROP CONSTRAINT "FK_venues_building_id"`,
    );
    await queryRunner.query(`DROP TABLE "levels"`);
    await queryRunner.query(`DROP TABLE "formats"`);
    await queryRunner.query(`DROP TABLE "event_types"`);
    await queryRunner.query(
      `ALTER TABLE "venues" ADD CONSTRAINT "FK_events_venues_building_id" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
