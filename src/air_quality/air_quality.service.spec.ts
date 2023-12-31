import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air_quality.service';
import { AirQualityAPIFactory } from '../air_quality_api_provider/air_quality_api.factory';
import { AirQualityAPIProvider } from '../air_quality_api_provider/air_quality_api_provider';
import { Coordinates } from '../models/coordinates.model';
import { AirQualityRepository } from './air_quality.repository';
import { AirQuality } from '../models/air-quality.model';

// Mock AirQualityAPIProvider
class AirQualityAPIProviderMock implements AirQualityAPIProvider {
  getAirQuality = jest.fn();
}

// Mock AirQualityAPIFactory
const airQualityAPIFactoryMock = {
  getAirQualityProvider: jest.fn(() => new AirQualityAPIProviderMock()),
};

// Mock AirQualityRepository
class AirQualityRepositoryMock {
  createOrUpdate = jest.fn();
}

describe('AirQualityService', () => {
  let airQualityService: AirQualityService;
  let airQualityRepository: AirQualityRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: AirQualityAPIFactory,
          useValue: airQualityAPIFactoryMock,
        },
        {
          provide: AirQualityRepository,
          useClass: AirQualityRepositoryMock,
        },
      ],
    }).compile();

    airQualityService = module.get<AirQualityService>(AirQualityService);
    airQualityRepository =
      module.get<AirQualityRepositoryMock>(AirQualityRepository);
  });

  it('should be defined', () => {
    expect(airQualityService).toBeDefined();
  });

  // describe('getAirQuality', () => {
  //   it('should get air quality using the provider returned by the factory', async () => {
  //     // Arrange
  //     const mockCoordinates: Coordinates = { lat: 0, lon: 0 };
  //     const mockAirQualityResult: AirQuality = {
  //       ts: new Date(),
  //       mainus: '40',
  //       aqicn: 40,
  //       maincn: '30',
  //       aqius: 30,
  //     };
  //     airQualityAPIFactoryMock
  //       .getAirQualityProvider()
  //       .getAirQuality.mockResolvedValueOnce(mockAirQualityResult);

  //     // Act
  //     const result = await airQualityService.getAirQuality(mockCoordinates);

  //     // Assert
  //     //expect(result).toEqual(mockAirQualityResult);
  //     expect(
  //       airQualityAPIFactoryMock.getAirQualityProvider().getAirQuality,
  //     ).toHaveBeenCalledWith(mockCoordinates.lat, mockCoordinates.lon);
  //   });

    describe('saveAirQuality', () => {
      it('should save air quality using the repository', async () => {
        // Arrange
        const mockAirQualityData: AirQuality = {
          ts: new Date(),
          mainus: '40',
          aqicn: 40,
          maincn: '30',
          aqius: 30,
        };

        // Act
        await airQualityService.saveAirQuality(mockAirQualityData);

        // Assert
        expect(airQualityRepository.createOrUpdate).toHaveBeenCalledWith(
          mockAirQualityData,
        );
      });
    });
  });
