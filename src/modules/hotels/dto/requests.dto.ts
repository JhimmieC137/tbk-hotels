import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

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
  
export class HotelsQueryDto extends paginationDto {
    @ApiProperty({
        required:  false,
    })
    search: string = null;
}
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


export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
