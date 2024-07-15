import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import {
  CustomInfoResDto,
  CustomListResDto,
  CustomResDto,
} from '../../helpers/schemas.dto';
import { HotelsQueryDto } from './dto/requests.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/helpers/jwt-auth.guard';

@ApiTags('Hotel')
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createHotelDto: CreateHotelDto): Promise<CustomResDto> {
    const response = this.customResDto;
    response.results = await this.hotelsService.create(createHotelDto);
    response.message = "Hotel created successfully"

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() hotelsQueryDto: HotelsQueryDto): Promise<CustomListResDto> {
    const page = Number(hotelsQueryDto?.page) ?? 1;
    const limit = Number(hotelsQueryDto?.limit) ?? 10;
    
    const hotels =  await this.hotelsService.findAll(page, limit, hotelsQueryDto.search);
    
    const response = this.customListResDto;
    response.results = hotels.hotels;
    response.total_count = hotels.totalCount;
    response.count = response.results.length;
    response.page = hotels.page
    response.message = 'Hotels retrieved successfully'
    response.next_page = hotels.page + 1
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string): Promise<CustomResDto> {
    const hotel =  await this.hotelsService.findOne(id);
    const response = this.customResDto;
    response.results = hotel;
    response.message = 'Hotel retrieved successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    const hotel =  await this.hotelsService.update(id, updateHotelDto);
    const response = this.customResDto;
    response.results = hotel;
    response.message = 'Hotel updated successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.hotelsService.remove(id);
    const response = this.customInfoResDto;
    response.info = 'Hotel Deactivation successful';
    return response;
  }

  @EventPattern('blacklist_token')
  async handleBlacklistToken(@Payload() token: string): Promise<CustomInfoResDto> {
    const response = this.customInfoResDto; 
    response.message = await this.hotelsService.blacklistToken(token);
    return response
  }
}
