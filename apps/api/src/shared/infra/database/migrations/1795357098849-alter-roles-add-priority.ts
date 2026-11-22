import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRolesAddPriority1795357098849 implements MigrationInterface {
    name = 'AlterRolesAddPriority1795357098849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_categories" ADD "priority" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "priority" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "priority"`);
        await queryRunner.query(`ALTER TABLE "role_categories" DROP COLUMN "priority"`);
    }

}
