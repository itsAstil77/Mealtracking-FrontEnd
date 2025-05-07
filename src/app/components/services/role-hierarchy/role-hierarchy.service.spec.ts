import { TestBed } from '@angular/core/testing';

import { RoleHierarchyService } from './role-hierarchy.service';

describe('RoleHierarchyService', () => {
  let service: RoleHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
