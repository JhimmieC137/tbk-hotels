import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedHotelReservationsMapping1721175800242 implements MigrationInterface {
    name = 'AddedHotelReservationsMapping1721175800242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_866caf314a4659c9b0f97430953" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_866caf314a4659c9b0f97430953"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "hotelId"`);
    }

}
