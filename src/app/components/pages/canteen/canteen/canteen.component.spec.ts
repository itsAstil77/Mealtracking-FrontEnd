import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenComponent } from './canteen.component';

describe('CanteenComponent', () => {
  let component: CanteenComponent;
  let fixture: ComponentFixture<CanteenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanteenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
