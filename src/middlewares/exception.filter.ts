import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { AirQualityApiException } from '../air_quality_api_provider/air_quality_api.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.constructor.name) {
      case 'HttpException':
        httpStatus = (exception as HttpException).getStatus();
        break;
      case 'AxiosError':
        httpStatus = (exception as AxiosError).response?.status;
        break;
      case 'InvalidModelException':
      case 'BadRequestException':
        httpStatus = HttpStatus.BAD_REQUEST;
        break;
      case 'AirQualityApiException':
        httpStatus = (exception as AirQualityApiException).status;
        break;
    }

    this.logger.error(exception);

    response.sendStatus(httpStatus);
  }
}
