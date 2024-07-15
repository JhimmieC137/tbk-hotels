import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateReservationDto {
    @ApiProperty({
        required: true,
    })
    user_id: String;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}


export class paginationDto {
    @ApiPropertyOptional({
      default: 1
    })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    page?: number;
    
    @ApiPropertyOptional({
      default: 10
    })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    limit?: number;
  }
  
  export class ReservationQueryDto extends paginationDto {
    @ApiProperty({
      required:  false,
    })
    search: string = null;
  }