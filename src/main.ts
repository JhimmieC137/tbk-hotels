import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HotelsModule } from './modules/hotels/hotels.module';
import { Transport } from '@nestjs/microservices';
import { baseConfig } from './settings/base.config';
import { ReservationsModule } from './modules/reservations/reservations.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [baseConfig().rabbit_url],
      queue: 'hotel_queue'
    }
  })

  const apiDocsConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Travel Booking Platform - Hotel reservations')
  .setDescription('All endpoints for the hotel reservation operations')
  .setVersion('1.0')
  .addTag('Hotel')
  .build();

  const apiDocs = SwaggerModule.createDocument(app, apiDocsConfig, {
    include: [HotelsModule, ReservationsModule],
  });

  SwaggerModule.setup('docs', app, apiDocs);

  app.useGlobalPipes(new ValidationPipe());
  const port = app.get(ConfigService).get<number>('PORT', 3100);
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
