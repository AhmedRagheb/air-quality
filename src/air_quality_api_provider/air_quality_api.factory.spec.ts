import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AirVisualService } from './airvisual.service';
import { AirQualityAPIFactory } from './air_quality_api.factory';

// Mock ConfigService
class ConfigServiceMock {
  get = jest.fn();
}

describe('AirQualityAPIFactory', () => {
  let airQualityAPIFactory: AirQualityAPIFactory;
  let configService: ConfigServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityAPIFactory,
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
        AirVisualService, // Include the real AirVisualService to test the factory's logic
      ],
    }).compile();

    airQualityAPIFactory =
      module.get<AirQualityAPIFactory>(AirQualityAPIFactory);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(airQualityAPIFactory).toBeDefined();
  });

  describe('getAirQualityProvider', () => {
    it('should return an instance of AirVisualService', () => {
      // Arrange
      configService.get.mockReturnValueOnce('your_api_key'); // Set the expected API key

      // Act
      const result = airQualityAPIFactory.getAirQualityProvider();

      // Assert
      expect(result).toBeInstanceOf(AirVisualService);
      expect(configService.get).toHaveBeenCalledWith('API_KEY');
    });
  });
});
