import { TestBed } from '@angular/core/testing';

import { RolesaddService } from './rolesadd.service';

describe('RolesaddService', () => {
  let service: RolesaddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesaddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
