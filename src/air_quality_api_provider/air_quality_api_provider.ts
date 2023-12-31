import { AirQuality } from '../models/air-quality.model';

export interface AirQualityAPIProvider {
  getAirQuality(lat: number, lon: number): Promise<AirQuality>;
}
