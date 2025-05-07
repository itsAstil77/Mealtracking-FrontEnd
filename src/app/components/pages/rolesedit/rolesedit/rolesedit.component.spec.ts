import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleseditComponent } from './rolesedit.component';

describe('RoleseditComponent', () => {
  let component: RoleseditComponent;
  let fixture: ComponentFixture<RoleseditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleseditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
