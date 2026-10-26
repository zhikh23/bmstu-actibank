import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRanks1793013343432 implements MigrationInterface {
    name = 'CreateRanks1793013343432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ranks" ("id" uuid NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_ranks_id" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ranks"`);
    }

}
