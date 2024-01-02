import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { HttpExceptionFilter } from 'common/http-exception';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [
        // file on daily rotation (error only)
        new transports.DailyRotateFile({
          // %DATE will be replaced by the current date
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // don't want to zip our logs
          maxFiles: '30d', // will keep log until they are older than 30 days
        }),
        // same for all levels
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
          format: format.combine(
            format.errors({ stack: true }),
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf(info => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            })
          ),
        }),
      ],
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => {
        const result = {
          property: errors[0].property,
          message: Object.values(errors[0].constraints)[0],
        };
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
      whitelist: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('APP_PORT'));
  logger.log(`Application listening on PORT:${configService.getOrThrow<number>('APP_PORT')}`);
}
bootstrap();
