import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupenComponent } from './coupen.component';

describe('CoupenComponent', () => {
  let component: CoupenComponent;
  let fixture: ComponentFixture<CoupenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoupenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoupenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
