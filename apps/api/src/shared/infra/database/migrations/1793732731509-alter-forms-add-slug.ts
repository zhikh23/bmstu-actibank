import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFormsAddSlug1793732731509 implements MigrationInterface {
  name = 'AlterFormsAddSlug1793732731509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" ADD "slug" character varying NOT NULL DEFAULT upper(substr(md5(random()::text), 1, 6))`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "filename" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "filename" SET DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "slug"`);
  }
}
