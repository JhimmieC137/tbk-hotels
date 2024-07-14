import { ApiProperty } from "@nestjs/swagger";
import { Hotel } from "../entities/hotel.entity";

export class QueryResponseDto {
    @ApiProperty()
    totalCount: number = null;
    
    @ApiProperty()
    page: number = null;
}


export class HotelsQueryResponseDto extends QueryResponseDto {
    @ApiProperty()
    hotels: Hotel[] = [];
}