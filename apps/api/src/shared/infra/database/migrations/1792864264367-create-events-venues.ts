import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsVenues1792864264367 implements MigrationInterface {
  name = 'CreateEventsVenues1792864264367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events_buildings" ("id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_events_buildings_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_venues" ("id" uuid NOT NULL, "building_id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_events_venues_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_venues" ADD CONSTRAINT "FK_events_venues_building_id" FOREIGN KEY ("building_id") REFERENCES "events_buildings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_venues" DROP CONSTRAINT "FK_events_venues_building_id"`,
    );
    await queryRunner.query(`DROP TABLE "events_venues"`);
    await queryRunner.query(`DROP TABLE "events_buildings"`);
  }
}
