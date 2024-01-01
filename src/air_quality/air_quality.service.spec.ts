import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air_quality.service';
import { AirQualityAPIFactory } from '../air_quality_api_provider/air_quality_api.factory';
import { AirQualityAPIProvider } from '../air_quality_api_provider/air_quality_api_provider';
import { Coordinates } from '../models/coordinates.model';
import { AirQualityRepository } from './air_quality.repository';
import { AirQuality } from '../models/air-quality.model';

const mockAirQualityResult: AirQuality = {
  mainus: '40',
  aqicn: 40,
  maincn: '30',
  aqius: 30,
  ts: new Date()
};

// Mock AirQualityAPIProvider
class AirQualityAPIProviderMock implements AirQualityAPIProvider {
  getAirQuality = jest.fn(async() => mockAirQualityResult);
}

// Mock AirQualityAPIFactory
class AirQualityAPIFactoryMock {
  getAirQualityProvider = jest.fn(() => new AirQualityAPIProviderMock());
}

// Mock AirQualityRepository
class AirQualityRepositoryMock {
  createOrUpdate = jest.fn();
}

describe('AirQualityService', () => {
  let airQualityService: AirQualityService;
  let airQualityRepository: AirQualityRepositoryMock;
  let airQualityAPIFactory: AirQualityAPIFactoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: AirQualityAPIFactory,
          useClass: AirQualityAPIFactoryMock,
        },
        {
          provide: AirQualityRepository,
          useClass: AirQualityRepositoryMock,
        },
      ],
    }).compile();

    airQualityService = module.get<AirQualityService>(AirQualityService);
    airQualityRepository = module.get<AirQualityRepositoryMock>(AirQualityRepository);
    airQualityAPIFactory = module.get<AirQualityAPIFactoryMock>(AirQualityAPIFactory);
    
  });

  it('should be defined', () => {
    expect(airQualityService).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should get air quality using the provider returned by the factory', async () => {
      const mockCoordinates: Coordinates = { lat: 0, lon: 0 };
      const airQualityAPIProviderMock = new AirQualityAPIProviderMock();
      airQualityAPIProviderMock.getAirQuality.mockResolvedValueOnce(mockAirQualityResult);
  
      airQualityAPIFactory.getAirQualityProvider.mockReturnValueOnce(airQualityAPIProviderMock);
  
      // Act
      const result = await airQualityService.getAirQuality(mockCoordinates);
  
      // Assert
      expect(result).toEqual(mockAirQualityResult);
      expect(airQualityAPIFactory.getAirQualityProvider).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveAirQuality', () => {
    it('should save air quality using the repository', async () => {
      // Act
      await airQualityService.saveAirQuality(mockAirQualityResult);

      // Assert
      expect(airQualityRepository.createOrUpdate).toHaveBeenCalledWith(
        mockAirQualityResult,
      );
    });
  });
});
