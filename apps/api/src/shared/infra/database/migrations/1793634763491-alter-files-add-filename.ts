import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFilesAddFilename1793634763491 implements MigrationInterface {
  name = 'AlterFilesAddFilename1793634763491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" ADD "filename" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "filename"`);
  }
}
