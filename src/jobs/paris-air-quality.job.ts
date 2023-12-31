import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AirQualityService } from '../air_quality/air_quality.service';
import { Coordinates } from '../models/coordinates.model';
import { AirQuality } from '../models/air-quality.model';

@Injectable()
export class ParisAirQualityJob {
  PARIS = Object.freeze({
    LONGITUDE: 2.352222,
    LATITUDE: 48.856613,
  });

  private readonly logger = new Logger(ParisAirQualityJob.name);

  constructor(private air_quality_service: AirQualityService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async getAirQuality() {
    this.logger.log('running the job to fetch paris qir quality.');

    try {
      const coordinates: Coordinates = {
        lat: this.PARIS.LATITUDE,
        lon: this.PARIS.LONGITUDE,
      };
      const result: AirQuality = await this.air_quality_service.getAirQuality(coordinates);

      await this.air_quality_service.saveAirQuality(result);
    } catch (err) {
      this.logger.error(err);
      throw new Error('error in getting air quality');
    }
  }
}
