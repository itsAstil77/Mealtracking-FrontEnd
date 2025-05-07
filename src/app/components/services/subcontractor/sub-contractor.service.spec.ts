import { TestBed } from '@angular/core/testing';

import { SubContractorService } from './sub-contractor.service';

describe('SubContractorService', () => {
  let service: SubContractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubContractorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
