import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreportComponent } from './addreport.component';

describe('AddreportComponent', () => {
  let component: AddreportComponent;
  let fixture: ComponentFixture<AddreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
