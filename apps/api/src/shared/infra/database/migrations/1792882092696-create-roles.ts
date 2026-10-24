import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1792882092696 implements MigrationInterface {
  name = 'CreateRoles1792882092696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_categories" ("id" uuid NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_role_categories_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL, "category_id" uuid NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_roles_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "role_categories"`);
  }
}
