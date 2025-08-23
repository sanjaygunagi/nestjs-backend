import { Injectable } from '@nestjs/common';

@Injectable()
export class FeatureService {
  getFeature(): string {
    return 'Hi Feature!';
  }
}
