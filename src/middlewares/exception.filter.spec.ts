import { Test, TestingModule } from '@nestjs/testing';
import { HttpAdapterHost } from '@nestjs/core';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { AirQualityApiException } from '../air_quality_api_provider/air_quality_api.error';
import { AxiosError, AxiosHeaders } from 'axios';
import { AllExceptionsFilter } from './exception.filter';
import { InvalidModelException } from '../air_quality/air_quality.error';

const mockAppLoggerService = {
  error: jest.fn(),
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  sendStatus: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('AllExceptionsFilter', () => {
  let service: AllExceptionsFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: HttpAdapterHost,
          useValue: mockAppLoggerService,
        },
      ],
    }).compile();
    service = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should handle InvalidModelException and set BAD_REQUEST status code', () => {
      // Act
      service.catch(new InvalidModelException(), mockArgumentsHost);

      // assert
      expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
      expect(mockHttpArgumentsHost).toHaveBeenCalledWith();
      expect(mockGetResponse).toHaveBeenCalledTimes(1);
      expect(mockGetResponse).toHaveBeenCalledWith();
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should handle BadRequestException and set BAD_REQUEST status code', () => {
      // Act
      service.catch(new BadRequestException(), mockArgumentsHost);

      // assert
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should handle AirQualityApiException and set TOO_MANY_REQUESTS status code', () => {
      // Act
      service.catch(
        new AirQualityApiException(HttpStatus.TOO_MANY_REQUESTS),
        mockArgumentsHost,
      );

      // assert
      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    });
  });
});
