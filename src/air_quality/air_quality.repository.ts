import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AirQualityRecord,
  AirQualityRecordDocument,
} from '../db/air-quality.record';
import { AirQuality } from '../models/air-quality.model';
import { InvalidModelException } from './air_quality.error';

@Injectable()
export class AirQualityRepository {
  private readonly logger = new Logger(AirQualityRepository.name);

  constructor(
    @InjectModel(AirQualityRecord.name)
    private AirQualityRecordModel: Model<AirQualityRecordDocument>,
  ) {}

  async createOrUpdate(air_quality: AirQuality) {
    this.logger.log(`connect to DB to save model  ${air_quality}`);

    const airQualityRecord = new this.AirQualityRecordModel(air_quality);
    if (airQualityRecord.$isValid) {
      await airQualityRecord.save();
    } else {
      throw new InvalidModelException();
    }
  }
}
