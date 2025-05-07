import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSummaryComponent } from './report-summary.component';

describe('ReportSummaryComponent', () => {
  let component: ReportSummaryComponent;
  let fixture: ComponentFixture<ReportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
