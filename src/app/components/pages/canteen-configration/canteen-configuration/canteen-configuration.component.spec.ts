import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenConfigurationComponent } from './canteen-configuration.component';

describe('CanteenConfigurationComponent', () => {
  let component: CanteenConfigurationComponent;
  let fixture: ComponentFixture<CanteenConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanteenConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
