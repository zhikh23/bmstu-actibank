import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyRoles1792883814149 implements MigrationInterface {
  name = 'AddForeignKeyRoles1792883814149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_roles_category_id" FOREIGN KEY ("category_id") REFERENCES "role_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_roles_category_id"`,
    );
  }
}
