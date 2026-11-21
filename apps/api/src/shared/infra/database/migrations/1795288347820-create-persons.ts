import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePersons1795288347820 implements MigrationInterface {
  name = 'CreatePersons1795288347820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "persons" ("id" uuid NOT NULL, "full_name" character varying NOT NULL, CONSTRAINT "PK_persons_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" ALTER COLUMN "slug" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forms" ALTER COLUMN "slug" SET DEFAULT upper(substr(md5((random())), 1, 6))`,
    );
    await queryRunner.query(`DROP TABLE "persons"`);
  }
}
