import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleaccessComponent } from './add-roleaccess.component';

describe('AddRoleaccessComponent', () => {
  let component: AddRoleaccessComponent;
  let fixture: ComponentFixture<AddRoleaccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoleaccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoleaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
