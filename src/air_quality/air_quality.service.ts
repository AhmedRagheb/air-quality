import { Injectable, Logger } from '@nestjs/common';
import { AirQuality } from '../models/air-quality.model';
import { Coordinates } from '../models/coordinates.model';
import { AirQualityAPIFactory } from '../air_quality_api_provider/air_quality_api.factory';
import { AirQualityAPIProvider } from '../air_quality_api_provider/air_quality_api_provider';
import { AirQualityRepository } from './air_quality.repository';

@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);
  private readonly air_quality_provider: AirQualityAPIProvider;

  constructor(
    air_quality_provider_factory: AirQualityAPIFactory,
    private air_quality_repository: AirQualityRepository,
  ) {
    this.air_quality_provider =
      air_quality_provider_factory.getAirQualityProvider();
  }

  async getAirQuality(coordinates: Coordinates): Promise<AirQuality> {
    this.logger.log(
      `getting air quality for ${coordinates.lat}, ${coordinates.lon}`,
    );

    const result: AirQuality = await this.air_quality_provider.getAirQuality(
      coordinates.lat,
      coordinates.lon,
    );

    return result;
  }

  async saveAirQuality(air_quality: AirQuality) {
    this.logger.log(`save qir quality model ${air_quality}`);
    await this.air_quality_repository.createOrUpdate(air_quality);
  }
}
