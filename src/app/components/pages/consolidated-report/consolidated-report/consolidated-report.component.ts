import { Component } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consolidated-report',
  imports: [CommonModule],
  templateUrl: './consolidated-report.component.html',
  styleUrl: './consolidated-report.component.css'
})
export class ConsolidatedReportComponent {

   reportName: string = '';
    reportData: any[] = [];
    summaryTotals: any = {};
  
    constructor(private reportService: ReportService,  private route: ActivatedRoute,private alertService:AlertService) {}
  
    // ngOnInit(): void {
    //   this.route.paramMap.subscribe(params => {
    //     const name = params.get('reportName');
    //     if (name) {
    //       this.reportName = name;
    //       this.loadReportData(name);
    //     }
    //   });
      
    // }
    // ngOnInit(): void {
    //   const navigation = history.state;
    
    //   // Check if report data is passed via navigation state
    //   if (navigation && navigation.generatedReport) {
    //     const res = navigation.generatedReport;
    
    //     // Assign data directly from navigation state
    //     this.reportData = res.data.individualReports;
    //     this.summaryTotals = res.data.summary;
    //     this.extractMealHeaders();
    //     return;
    //   }
    
    //   // Fallback: Load by route param if no navigation state
    //   this.route.paramMap.subscribe(params => {
    //     const name = params.get('reportName');
    //     if (name) {
    //       this.reportName = name;
    //       this.loadReportData(name);
    //     }
    //   });
    // }

 
    ngOnInit(): void {
      const navigation = history.state;
    
      // Check if report data is passed via navigation state
      if (navigation && navigation.generatedReport) {
        const res = navigation.generatedReport;  // ✅ res = res.data
    
        // ✅ Remove '.data' here
        this.reportData = res.individualReports;
        this.summaryTotals = res.summary;
        this.extractMealHeaders();
        return;
      }
    
      // Fallback: Load by route param if no navigation state
      this.route.paramMap.subscribe(params => {
        const name = params.get('reportName');
        if (name) {
          this.reportName = name;
          this.loadReportData(name);
        }
      });
    }
    
    
  



    loadReportData(name: string): void {
      this.reportService.getConReportDetails(name).subscribe({
        next: (res: any) => {
          this.reportData = res.data.individualReports || [];
          this.extractMealHeaders();
          this.summaryTotals = res.data.summary || {};
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
      const mealCounts = item.mealCounts;
      if (mealCounts) {
        Object.keys(mealCounts).forEach(meal => mealSet.add(meal));
      }
    });
  
    this.mealHeaders = Array.from(mealSet);
  }

  
  }


