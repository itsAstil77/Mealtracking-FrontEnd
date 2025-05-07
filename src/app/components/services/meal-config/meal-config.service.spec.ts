import { TestBed } from '@angular/core/testing';

import { MealConfigService } from './meal-config.service';

describe('MealConfigService', () => {
  let service: MealConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
