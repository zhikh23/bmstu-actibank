import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUnifyNamesColumn1793017882464 implements MigrationInterface {
  name = 'AlterUnifyNamesColumn1793017882464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_types" RENAME COLUMN "label" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formats" RENAME COLUMN "label" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ranks" RENAME COLUMN "title" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" RENAME COLUMN "label" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_categories" RENAME COLUMN "label" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" RENAME COLUMN "label" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "themes" RENAME COLUMN "title" TO "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "themes" RENAME COLUMN "name" TO "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" RENAME COLUMN "name" TO "label"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_categories" RENAME COLUMN "name" TO "label"`,
    );
    await queryRunner.query(
      `ALTER TABLE "levels" RENAME COLUMN "name" TO "label"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ranks" RENAME COLUMN "name" TO "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formats" RENAME COLUMN "name" TO "label"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_types" RENAME COLUMN "name" TO "label"`,
    );
  }
}
