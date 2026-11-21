import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPersonsRenameToStudents1795293990328 implements MigrationInterface {
  name = 'AlterPersonsRenameToStudents1795293990328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "students" ("id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "middle_name" character varying, CONSTRAINT "PK_students_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "students"`);
  }
}
