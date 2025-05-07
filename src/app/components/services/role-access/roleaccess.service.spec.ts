import { TestBed } from '@angular/core/testing';

import { RoleaccessService } from './roleaccess.service';

describe('RoleaccessService', () => {
  let service: RoleaccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleaccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
