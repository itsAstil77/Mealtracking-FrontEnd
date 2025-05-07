import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesaddComponent } from './rolesadd.component';

describe('RolesaddComponent', () => {
  let component: RolesaddComponent;
  let fixture: ComponentFixture<RolesaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesaddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
