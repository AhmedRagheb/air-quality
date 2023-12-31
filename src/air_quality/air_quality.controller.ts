import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AirQualityService } from './air_quality.service';
import { Coordinates } from '../models/coordinates.model';
import { Response } from '../models/air-quality.model';

@Controller()
export class AirQualityController {
  constructor(private readonly appService: AirQualityService) {}

  @Get('air_quality')
  @ApiOperation({ summary: 'get air quality for a given zone' })
  @UsePipes(ValidationPipe)
  async getAirQuality(@Query() coordinates: Coordinates): Promise<Response> {
    const result = await this.appService.getAirQuality(coordinates);
    const response: Response = { result: { pollution: result } };
    return response;
  }
}
