import { Injectable } from '@nestjs/common';
import { AirQualityAPIProvider } from './air_quality_api_provider';
import { AirVisualService } from './airvisual.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AirQualityAPIFactory {
  constructor(private readonly configService: ConfigService) {}

  getAirQualityProvider(): AirQualityAPIProvider {
    return new AirVisualService(this.configService);
  }
}
