import {
  Controller,
  Get,
  Body,
  Post,
  Delete,
  Param,
  Query,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CustomInfoResDto, CustomListResDto, CustomResDto } from 'src/helpers/schemas.dto';
import { CreateReservationDto, ReservationQueryDto, UpdateReservationDto } from './dto/resquests.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/helpers/jwt-auth.guard';


@ApiTags('Reservation')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createReservationDto: CreateReservationDto): Promise<CustomResDto> {
    const response = this.customResDto;
    response.results = await this.reservationsService.create(createReservationDto);
    response.message = "Reservation created successfully"

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() reservationQueryDto: ReservationQueryDto): Promise<CustomListResDto> {
    const page = Number(reservationQueryDto?.page) ?? 1;
    const limit = Number(reservationQueryDto?.limit) ?? 10;

    const reservations =  await this.reservationsService.findAll(page, limit, reservationQueryDto.search);
    
    const response = this.customListResDto;
    response.results = reservations.reservations;
    response.total_count = reservations.totalCount;
    response.count = response.results.length;
    response.page = reservations.page
    response.message = 'Reservations retrieved successfully'
    response.next_page = reservations.page + 1
    return response;

  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string): Promise<CustomResDto> {
    const reservations =  await this.reservationsService.findOne(id);
    
    const response = this.customResDto;
    response.results = reservations;
    response.message = 'Reservation retrieved successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    const reservation =  await this.reservationsService.update(id, updateReservationDto);
    
    const response = this.customResDto;
    response.results = reservation;
    response.message = 'Reservation updated successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string): Promise<CustomInfoResDto> {
    await this.reservationsService.remove(id);
    const response = this.customInfoResDto;
    response.info = 'Deleted successfully';
    return response;
  }


  @EventPattern('blacklist_token')
  async handleBlacklistToken(@Payload() token: string): Promise<CustomInfoResDto> {
    const response = this.customInfoResDto; 
    response.message = await this.reservationsService.blacklistToken(token);
    return response
  }
}
