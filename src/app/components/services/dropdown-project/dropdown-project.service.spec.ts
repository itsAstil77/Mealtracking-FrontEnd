import { TestBed } from '@angular/core/testing';

import { DropdownProjectService } from './dropdown-project.service';

describe('DropdownProjectService', () => {
  let service: DropdownProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropdownProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
