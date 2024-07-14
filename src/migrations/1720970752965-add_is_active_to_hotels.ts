import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToHotels1720970752965 implements MigrationInterface {
    name = 'AddIsActiveToHotels1720970752965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "is_active"`);
    }

}
