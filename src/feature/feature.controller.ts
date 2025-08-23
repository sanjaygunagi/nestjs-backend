import { Controller, Get } from '@nestjs/common';
import { FeatureService } from './feature.service';

@Controller('feature')
export class FeatureController {
  constructor(private readonly feature: FeatureService) {}

  @Get()
  getFeature(): string {
    return this.feature.getFeature();
  }
}
