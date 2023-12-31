import { Module } from '@nestjs/common';
import { AirQualityController } from './air_quality/air_quality.controller';
import { AirQualityService } from './air_quality/air_quality.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AirQualityRecord,
  AirQualityRecordSchema,
} from './db/air-quality.record';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AirVisualService } from './air_quality_api_provider/airvisual.service';
import { AirQualityAPIFactory } from './air_quality_api_provider/air_quality_api.factory';
import { ParisAirQualityJob } from './jobs/paris-air-quality.job';
import { AirQualityRepository } from './air_quality/air_quality.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get(
          'MONGODB_USERNAME',
        )}:${configService.get('MONGODB_PASSWORD')}@${configService.get(
          'MONGODB_HOST',
        )}`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: AirQualityRecord.name, schema: AirQualityRecordSchema },
    ]),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AirQualityController],
  providers: [
    AirQualityService,
    AirVisualService,
    AirQualityAPIFactory,
    ParisAirQualityJob,
    AirQualityRepository,
  ],
})
export class AppModule {}
