import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { PassportModule } from '@nestjs/passport';
import { CustomInfoResDto, CustomListResDto, CustomResDto } from 'src/helpers/schemas.dto';
import { TokenBlacklist } from '../hotels/entities/blacklist.entity';
import { JwtStrategy } from 'src/helpers/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { baseConfig } from 'src/settings/base.config';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [baseConfig().rabbit_url],
          queue: 'notification_queue',
        }
      },
    ]),
    TypeOrmModule.forFeature([Reservation, Hotel, TokenBlacklist])
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, JwtStrategy, CustomResDto, CustomListResDto, CustomInfoResDto],
})
export class ReservationsModule {}
