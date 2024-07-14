import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HotelsModule } from './modules/hotels/hotels.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiDocsConfig = new DocumentBuilder()
  .setTitle('Travel Booking Platform - Hotel reservations')
  .setDescription('All endpoints for the hotel reservation operations')
  .setVersion('1.0')
  .addTag('Hotel')
  .build();

  const apiDocs = SwaggerModule.createDocument(app, apiDocsConfig, {
    include: [HotelsModule],
  });

  SwaggerModule.setup('docs', app, apiDocs);

  app.useGlobalPipes(new ValidationPipe());
  const port = app.get(ConfigService).get<number>('PORT', 3100);
  await app.listen(port);
}
bootstrap();
