import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { baseConfig } from './settings/base.config';
import { dataSourceOptions } from './settings/dataSource.config';
import { dbConfig } from './settings/db.config';
import { RouterModule } from '@nestjs/core';
import { appRoutes } from './helpers/router';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [
    HotelsModule,
    RouterModule.register([
      ...appRoutes
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfig, dbConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    HotelsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
