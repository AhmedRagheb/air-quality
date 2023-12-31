import { ApiProperty } from '@nestjs/swagger';
import { IsLongitude, IsLatitude } from 'class-validator';

export class Coordinates {
  @ApiProperty({
    description: 'Longitude must be between the range [-180, 180].',
  })
  @IsLongitude()
  lon: number;

  @ApiProperty({
    description: 'Latitude must be between the range [-90, 90].',
  })
  @IsLatitude()
  lat: number;
}
