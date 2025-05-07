import { TestBed } from '@angular/core/testing';

import { CoupenService } from './coupen.service';

describe('CoupenService', () => {
  let service: CoupenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoupenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
