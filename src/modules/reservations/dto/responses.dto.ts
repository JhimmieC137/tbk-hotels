import { ApiProperty } from "@nestjs/swagger";
import { Reservation } from "../entities/reservation.entity";

export class QueryResponseDto {
    @ApiProperty()
    totalCount: number = null;
    
    @ApiProperty()
    page: number = null;
}


export class ReservationQueryResponseDto extends QueryResponseDto {
    @ApiProperty()
    reservations: Reservation[] = [];
}