import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEvents1795434408035 implements MigrationInterface {
  name = 'CreateEvents1795434408035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events_organizers" ("event_id" uuid NOT NULL, "number" integer NOT NULL, "organizer_id" uuid NOT NULL, CONSTRAINT "PK_events_organizers_event_id_number" PRIMARY KEY ("event_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_links" ("event_id" uuid NOT NULL, "number" integer NOT NULL, "link" character varying NOT NULL, CONSTRAINT "PK_events_links_event_id_number" PRIMARY KEY ("event_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_venues" ("event_id" uuid NOT NULL, "number" integer NOT NULL, "venue_id" uuid NOT NULL, CONSTRAINT "PK_events_venues_event_id_number" PRIMARY KEY ("event_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_themes" ("event_id" uuid NOT NULL, "number" integer NOT NULL, "theme_id" uuid NOT NULL, CONSTRAINT "PK_events_themes_event_id_number" PRIMARY KEY ("event_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_guests" ("event_id" uuid NOT NULL, "number" integer NOT NULL, "user_id" uuid NOT NULL, "rank_id" uuid NOT NULL, CONSTRAINT "PK_events_guests_event_id_number" PRIMARY KEY ("event_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_members" ("event_id" uuid NOT NULL, "number" integer NOT NULL, "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_events_members_event_id_number" PRIMARY KEY ("event_id", "number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL, "form_id" uuid NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, "format_id" uuid NOT NULL, "type_id" uuid NOT NULL, "level_id" uuid NOT NULL, "participants_students" integer NOT NULL, "participants_employees" integer NOT NULL, "participants_others" integer NOT NULL, "signed_scan_id" uuid NOT NULL, "submitter_id" uuid NOT NULL, "reviewed_by" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_events_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_submitter_id" ON "events"  ("submitter_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_deleted_at" ON "events"  ("deleted_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "events_organizers" ADD CONSTRAINT "FK_events_organizers_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_links" ADD CONSTRAINT "FK_events_links_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_venues" ADD CONSTRAINT "FK_events_venues_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_themes" ADD CONSTRAINT "FK_events_themes_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_guests" ADD CONSTRAINT "FK_events_guests_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_members" ADD CONSTRAINT "FK_events_members_event_id" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_members" DROP CONSTRAINT "FK_events_members_event_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_guests" DROP CONSTRAINT "FK_events_guests_event_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_themes" DROP CONSTRAINT "FK_events_themes_event_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_venues" DROP CONSTRAINT "FK_events_venues_event_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_links" DROP CONSTRAINT "FK_events_links_event_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_organizers" DROP CONSTRAINT "FK_events_organizers_event_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_events_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_events_submitter_id"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "events_members"`);
    await queryRunner.query(`DROP TABLE "events_guests"`);
    await queryRunner.query(`DROP TABLE "events_themes"`);
    await queryRunner.query(`DROP TABLE "events_venues"`);
    await queryRunner.query(`DROP TABLE "events_links"`);
    await queryRunner.query(`DROP TABLE "events_organizers"`);
  }
}
