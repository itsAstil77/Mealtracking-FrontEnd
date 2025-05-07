import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReportService } from '../../services/report/report.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report-summary',
  imports: [CommonModule],
  templateUrl: './report-summary.component.html',
  styleUrl: './report-summary.component.css'
})
export class ReportSummaryComponent {
  reportName: string = '';
  reportData: any[] = [];


  constructor(private reportService: ReportService,  private route: ActivatedRoute,private alertService:AlertService,private http: HttpClient) {}


 

  ngOnInit(): void {
    const navigation = history.state;
  
   
    if (navigation && navigation.generatedReport) {
      this.reportData = navigation.generatedReport;
      this.extractMealHeaders();
      return;
    }
  

    this.route.paramMap.subscribe(params => {
      const name = params.get('reportName');
      if (name) {
        this.reportName = name;
        this.loadReportData(name);
      }
    });
  }
  
  loadReportData(name: string): void {
    this.reportService.getReportDetails(name).subscribe({
      next: (data) => {
        this.reportData = data;
        this.extractMealHeaders(); 
      },
      error: (err) => {
        console.error('Error fetching report data:', err);
      }
    });
  }

  mealHeaders: string[] = [];

extractMealHeaders() {
  const mealSet = new Set<string>();

  this.reportData.forEach(item => {
    const mealType = item.mealType;
    if (mealType) {
      Object.keys(mealType).forEach(meal => mealSet.add(meal));
    }
  });

  this.mealHeaders = Array.from(mealSet);
}

}