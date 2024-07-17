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
import * as reqType from 'express';
import { FORBIDDEN_403 } from 'src/helpers/exceptions/auth';

@ApiTags('Reservation')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  async checkBlacklist(req: reqType.Request) {
    try {
      const isBlacklisted = await this.reservationsService.checkBlacklist(req.headers.authorization.split(' ')[1])
      if (isBlacklisted) {
        throw new FORBIDDEN_403("Invalid token")
      }
    } catch (error) {
      throw error
    }

  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: reqType.Request, @Body() createReservationDto: CreateReservationDto): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const response = this.customResDto;
    response.results = await this.reservationsService.create(req.user['id'], createReservationDto);
    response.message = "Reservation created successfully"

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: reqType.Request, @Query() reservationQueryDto: ReservationQueryDto): Promise<CustomListResDto> {
    await this.checkBlacklist(req);
    const page = Number(reservationQueryDto?.page) ?? 1;
    const limit = Number(reservationQueryDto?.limit) ?? 10;

    const reservations =  await this.reservationsService.findAll(req.user['id'], page, limit, reservationQueryDto.search);
    
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
  async findOne(@Request() req: reqType.Request, @Param('id') id: string): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const reservations =  await this.reservationsService.findOne(req.user['id'], id);
    
    const response = this.customResDto;
    response.results = reservations;
    response.message = 'Reservation retrieved successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req: reqType.Request, @Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    await this.checkBlacklist(req);
    const reservation =  await this.reservationsService.update(id, req.user['id'], updateReservationDto);
    
    const response = this.customResDto;
    response.results = reservation;
    response.message = 'Reservation updated successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req: reqType.Request, @Param('id') id: string): Promise<CustomInfoResDto> {
    await this.checkBlacklist(req);
    await this.reservationsService.remove(req.user['id'], id);
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
