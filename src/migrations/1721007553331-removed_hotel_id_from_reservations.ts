import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedHotelIdFromReservations1721007553331 implements MigrationInterface {
    name = 'RemovedHotelIdFromReservations1721007553331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "hotel_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "hotel_id" character varying NOT NULL`);
    }

}
