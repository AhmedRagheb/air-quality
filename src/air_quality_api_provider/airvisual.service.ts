import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AirQuality } from '../models/air-quality.model';
import { AirQualityAPIProvider } from './air_quality_api_provider';
import { ConfigService } from '@nestjs/config';
import { AirQualityApiException } from './air_quality_api.error';

@Injectable()
export class AirVisualService implements AirQualityAPIProvider {
  private API_KEY: string;
  private BASE_URL: string;
  private apiClient: AxiosInstance = axios.create();

  private readonly logger = new Logger(AirVisualService.name);

  constructor(private configService: ConfigService) {
    this.API_KEY = this.configService.get<string>('API_KEY');
    this.BASE_URL = this.configService.get<string>('BASE_URL');
  }

  async getAirQuality(lat: number, lon: number): Promise<AirQuality> {
    this.logger.log('calling air virtual api');

    const result: any = await this.apiClient.get(
      `${this.BASE_URL}/nearest_city?lat=${lat}&lon=${lon}&key=${this.API_KEY}`,
    );

    if (result.status === HttpStatus.OK) {
      return result.data?.data?.current.pollution;
    } else {
      throw new AirQualityApiException(result.status);
    }
  }
}
