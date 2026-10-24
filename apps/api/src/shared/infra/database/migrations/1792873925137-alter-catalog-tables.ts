import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCatalogTables1792873925137 implements MigrationInterface {
  name = 'AlterCatalogTables1792873925137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events_venues" RENAME TO "venues"`);
    await queryRunner.query(
      `ALTER TABLE "events_buildings" RENAME TO "buildings"`,
    );
    await queryRunner.query(`ALTER TABLE "events_themes" RENAME TO "themes"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "venues" RENAME TO "events_venues"`);
    await queryRunner.query(
      `ALTER TABLE "buildings" RENAME TO "events_buildings"`,
    );
    await queryRunner.query(`ALTER TABLE "themes" RENAME TO "events_themes"`);
  }
}
