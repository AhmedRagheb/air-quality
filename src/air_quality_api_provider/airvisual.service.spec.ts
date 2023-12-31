import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AirQualityApiException } from './air_quality_api.error';
import { AirVisualService } from './airvisual.service';
import mockAxios from 'axios';

describe('AirVisualService', () => {
  let airVisualService: AirVisualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirVisualService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'API_KEY') {
                return 'your_api_key';
              } else if (key === 'BASE_URL') return 'your_base_url';
              return null;
            }),
          },
        },
      ],
    }).compile();

    airVisualService = module.get<AirVisualService>(AirVisualService);
  });

  it('should be defined', () => {
    expect(airVisualService).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('should get air quality successfully', async () => {
      // Arrange
      const mockLat = 48.856613;
      const mockLon = 2.352222;
      const mockAirQualityResult = {
        /* mock air quality data */
      };
      // @ts-ignore
      mockAxios.get.mockResolvedValue({
        status: 200,
        data: { data: { current: { pollution: mockAirQualityResult } } },
      });

      // Act
      const result = await airVisualService.getAirQuality(mockLat, mockLon);

      // Assert
      expect(result).toEqual(mockAirQualityResult);
    });

    it('should throw AirQualityApiException when API call fails', async () => {
      // Arrange
      const mockLat = 48.856613;
      const mockLon = 2.352222;
      // @ts-ignore
      mockAxios.get.mockResolvedValue({ status: 500 });

      // Act & Assert
      await expect(
        airVisualService.getAirQuality(mockLat, mockLon),
      ).rejects.toThrow(AirQualityApiException);
    });
  });
});
