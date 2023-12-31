import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air_quality.controller';
import { AirQualityService } from './air_quality.service';
import { Coordinates } from '../models/coordinates.model';

// Mock AirQualityService
class AirQualityServiceMock {
  getAirQuality = jest.fn();
}

describe('AirQualityController', () => {
  let airQualityController: AirQualityController;
  let airQualityService: AirQualityServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useClass: AirQualityServiceMock,
        },
      ],
    }).compile();

    airQualityController =
      module.get<AirQualityController>(AirQualityController);
    airQualityService = module.get(AirQualityService);
  });

  it('should be defined', () => {
    expect(airQualityController).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should call getAirQuality method of AirQualityService and return the result', async () => {
      // Arrange
      const mockCoordinates: Coordinates = { lat: 0, lon: 0 };
      const mockAirQualityResult = {
        /* mock air quality data */
      };
      airQualityService.getAirQuality.mockResolvedValueOnce(
        mockAirQualityResult,
      );

      // Act
      const result = await airQualityController.getAirQuality(mockCoordinates);

      // Assert
      expect(result).toEqual({ result: { pollution: mockAirQualityResult } });
      expect(airQualityService.getAirQuality).toHaveBeenCalledWith(
        mockCoordinates,
      );
    });
  });
});
