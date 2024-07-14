import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { TokenBlacklist } from './entities/blacklist.entity';
import { CustomInfoResDto, CustomListResDto, CustomResDto } from '../../helpers/schemas.dto';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Reservation, TokenBlacklist])],
  controllers: [HotelsController],
  providers: [HotelsService, CustomInfoResDto, CustomListResDto, CustomResDto],
})
export class HotelsModule {}
