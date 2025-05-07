import { TestBed } from '@angular/core/testing';

import { ConCompanyService } from './con-company.service';

describe('ConCompanyService', () => {
  let service: ConCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
