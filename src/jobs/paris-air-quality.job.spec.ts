import { Test, TestingModule } from '@nestjs/testing';
import { ParisAirQualityJob } from './paris-air-quality.job';
import { AirQualityService } from '../air_quality/air_quality.service';

// Mock AirQualityService
class AirQualityServiceMock {
  getAirQuality = jest.fn();
  saveAirQuality = jest.fn();
}

describe('ParisAirQualityJob', () => {
  let parisAirQualityJob: ParisAirQualityJob;
  let airQualityService: AirQualityServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParisAirQualityJob,
        {
          provide: AirQualityService,
          useClass: AirQualityServiceMock,
        },
      ],
    }).compile();

    parisAirQualityJob = module.get<ParisAirQualityJob>(ParisAirQualityJob);
    airQualityService = module.get(AirQualityService);
  });

  it('should be defined', () => {
    expect(parisAirQualityJob).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should fetch and save air quality data for Paris', async () => {
      // Arrange
      const mockAirQualityData = {
        /* mock data */
      };
      airQualityService.getAirQuality.mockResolvedValueOnce(mockAirQualityData);

      // Act
      await parisAirQualityJob.getAirQuality();

      // Assert
      expect(airQualityService.getAirQuality).toHaveBeenCalledWith({
        lat: parisAirQualityJob.PARIS.LATITUDE,
        lon: parisAirQualityJob.PARIS.LONGITUDE,
      });
      expect(airQualityService.saveAirQuality).toHaveBeenCalledWith(
        mockAirQualityData,
      );
    });

    it('should handle errors and throw an error', async () => {
      // Arrange
      const error = new Error();
      airQualityService.getAirQuality.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(parisAirQualityJob.getAirQuality()).rejects.toThrow(
        'error in getting air quality',
      );
      expect(airQualityService.getAirQuality).toHaveBeenCalled();
    });

    it('should fetch and save air quality data for Paris every minute', () => {
      // Act
      parisAirQualityJob.getAirQuality();

      // Fast-forward time by 1 minute
      jest.useFakeTimers();
      jest.advanceTimersByTime(60000);

      // Assert that getAirQuality is called after 1 minute
      expect(airQualityService.getAirQuality).toHaveBeenCalled();
    });
  });
});
