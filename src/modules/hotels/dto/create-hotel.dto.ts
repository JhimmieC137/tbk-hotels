import { ApiProperty } from "@nestjs/swagger";

export class CreateHotelDto {
    @ApiProperty({
        nullable: false
    })
    name: String;

    @ApiProperty({
        nullable: true,
        required: false
    })
    address: String;
}
