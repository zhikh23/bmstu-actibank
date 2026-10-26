import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizations1792936620869 implements MigrationInterface {
  name = 'CreateOrganizations1792936620869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization_categories" ("id" uuid NOT NULL, "name" character varying NOT NULL, "parent_id" uuid, CONSTRAINT "PK_organization_categories_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL, "name" character varying NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_organizations_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_categories" ADD CONSTRAINT "FK_organization_categories_parent_id" FOREIGN KEY ("parent_id") REFERENCES "organization_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_organizations_category_id" FOREIGN KEY ("category_id") REFERENCES "organization_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_organizations_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_categories" DROP CONSTRAINT "FK_organization_categories_parent_id"`,
    );
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "organization_categories"`);
  }
}
