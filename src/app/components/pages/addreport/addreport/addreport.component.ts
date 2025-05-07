import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../services/report/report.service';

interface ConsolidatedReportResponse {
  data: {
    individualReports: any[]; // Replace `any[]` with the actual type if possible
    summary: any; // Replace `any` with the actual type of summary if possible
  };
}


@Component({
  selector: 'app-addreport',
  imports:[CommonModule,FormsModule],
  templateUrl: './addreport.component.html',
  styleUrls: ['./addreport.component.css'],
  providers: [DatePipe]
})
export class AddreportComponent implements OnInit {


  selectedCanteens: string[] = [];  
  selectedMeals: string[] = [];  

  
  reportName: string = '';
  startDate: string = '';
  endDate: string = '';
 
  selectedTypes :string='';
 
  canteens: any[] = [];   
  meals: any[] = [];     
  constructor(private http: HttpClient,private alertService:AlertService,
    private router: Router,private route: ActivatedRoute,private reportService: ReportService,
    private datePipe: DatePipe) {}



  reportType: string = '';
  employeeName: string = '';




  
  ngOnInit(): void {
    // You can fetch your canteens and meals here if needed
    this.fetchCanteens();
    this.fetchMeals();

    this.route.queryParams.subscribe(params => {
      // Get the employee name from queryParams
      this.reportType = params['type'] || '';
      this.employeeName = params['name'] || '';  // Capture the name parameter
    });


    const navigation = history.state;

    // If report data is passed via navigation state
    if (navigation && navigation.generatedReport) {
      const res = navigation.generatedReport; // ✅ res = res.data
  
      // Set the report data and summary totals
      this.reportData = res.individualReports;
      this.summaryTotals = res.summary;
      this.extractMealHeaders();
      return;
    }
  
    // Fallback: Load report data by route param if no navigation state
    this.route.paramMap.subscribe(params => {
      const name = params.get('reportName');
      if (name) {
        this.reportName = name;
        this.loadReportData(name);
      }
    });
  }

  

  fetchCanteens() {
    // Fetch canteens from your API
    this.http.get<any[]>('http://172.16.100.66:5221/api/canteens/all').subscribe(
      data => {
        this.canteens = data;
      },
      error => {
        console.error('Error fetching canteens:', error);
      }
    );
  }

  fetchMeals() {
    // Fetch meals from your API
    this.http.get<any[]>('http://172.16.100.66:5221/api/extras/meal-config-summary').subscribe(
      data => {
        this.meals = data;
      },
      error => {
        console.error('Error fetching meals:', error);
      }
    );
  }


  mealTypeList: { id: string, name: string }[] = [];


  
  
  applyReport() {
    // Check if required fields are filled
    if (!this.employeeName || !this.startDate || !this.endDate) {
      this.alertService.showAlert("Please fill in all required fields", "error");
      return;
    }
  
    const start = new Date(this.startDate);
    // start.setHours(10, 15, 0, 633);
  
    const end = new Date(this.endDate);
    // end.setHours(10, 15, 0, 633);
  
    const selectedCanteenArray = this.selectedCanteens;
    const selectedMealArray = this.selectedMeals;
  
    const mealTypes = selectedMealArray.length > 0
      ? this.meals
          .filter(meal => selectedMealArray.includes(meal.id))
          .map(meal => meal.mealType)
      : [''];
  
    // Construct the base payload
    const payload: any = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      canteenIds: selectedCanteenArray.length > 0 ? selectedCanteenArray : [''],
      mealTypes: mealTypes
    };
  
    const reportType = this.employeeName?.trim();
  
    if (
      reportType === 'Employee Consolidated' ||
      reportType === 'Visitor Consolidated' ||
      reportType === 'Contractor Consolidated'
    ) {
      // Consolidated Reports
      const personType = reportType.replace(' Consolidated', '');
      payload.personType = personType;
      this.http.post<ConsolidatedReportResponse>('http://172.16.100.66:5221/api/consolidated-reports', payload).subscribe({
        next: (res) => {
          this.alertService.showAlert("Consolidated report generated successfully");
         
          // this.router.navigate(['/addreport'], {
          //   state: { generatedReport: (res as any).data }
          // });
          if (res && res.data && res.data.individualReports) {
            this.reportData = res.data.individualReports; // Set the report data
            this.summaryTotals = res.data.summary || {}; // Set the summary totals if available
            this.extractMealHeaders(); // Extract meal headers for the table
            this.showTable1 = true; // Show the table after data is set
          } else {
            this.alertService.showAlert("No data found for the report", "error");
            this.reportData = [];
            this.summaryTotals = {};
          }

  

        },
        error: (err) => {
          this.alertService.showAlert("Failed to generate consolidated report", "error");
          console.error('Error generating consolidated report', err);
        }
      });
  
    } else if (
      reportType === 'Employee' ||
      reportType === 'Visitor' ||
      reportType === 'Contractor'
    ) {
      // Normal Reports
      payload.type = reportType;
      this.http.post('http://172.16.100.66:5221/api/Report/generate', payload).subscribe({
        next: (res) => {
          this.alertService.showAlert("Report generated successfully");
          if (Array.isArray(res)) {
            this.reportData = res;
          } else if ((res as any).data && Array.isArray((res as any).data)) {
            this.reportData = (res as any).data;
          } else {
            console.error('Unexpected response format:', res);
            this.reportData = [];
          }
           this.showTable = true;
       
          // this.router.navigate(['/addreport'], { state: { generatedReport: res } });

        },
        error: (err) => {
          this.alertService.showAlert("Failed to generate report", "error");
          console.error('Error generating report', err);
        }
      });
  
    } else {
      this.alertService.showAlert("Please select a valid report type", "error");
    }
  }
  


 
  
  canteenDropdownOpen = false;
  mealDropdownOpen = false;
  // For canteens
onCanteenToggle(event: any, id: string) {
  event.stopPropagation(); // Prevent dropdown from closing immediately
  if (event.target.checked) {
    if (!this.selectedCanteens.includes(id)) {
      this.selectedCanteens.push(id);
    }
  } else {
    this.selectedCanteens = this.selectedCanteens.filter(item => item !== id);
  }
}

// For meals
onMealToggle(event: any, id: string) {
  event.stopPropagation();
  if (event.target.checked) {
    if (!this.selectedMeals.includes(id)) {
      this.selectedMeals.push(id);
    }
  } else {
    this.selectedMeals = this.selectedMeals.filter(item => item !== id);
  }
}

toggleCanteenDropdown() {
  this.canteenDropdownOpen = !this.canteenDropdownOpen;
}

toggleMealDropdown() {
  this.mealDropdownOpen = !this.mealDropdownOpen;
}

  
  getCanteenName(id: string): string {
    const canteen = this.canteens.find(c => c.id === id);
    return canteen ? canteen.name : '';
  }
  
  getMealName(id: string): string {
    const meal = this.meals.find(m => m.id === id);
    return meal ? meal.mealType : '';
  }
  





  // Returns a comma-separated list of canteen names or a default prompt
getSelectedCanteenNames(): string {
  if (this.selectedCanteens && this.selectedCanteens.length > 0) {
    return this.selectedCanteens.map(id => this.getCanteenName(id)).join(', ');
  }
  return '';
}

// Similar method for meal names
getSelectedMealNames(): string {
  if (this.selectedMeals && this.selectedMeals.length > 0) {
    return this.selectedMeals.map(id => this.getMealName(id)).join(', ');
  }
  return '';
}

  reportData: any[] = [];


  

loadReportData(name: string): void {
  this.reportService.getReportDetails(name).subscribe({
    next: (res: any) => {
      // Assuming `res` is an object containing the report data
      this.reportData = res.data.individualReports || [];
      this.summaryTotals = res.data.summary || {};
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
    const mealCounts = item.mealCounts;
    if (mealCounts) {
      Object.keys(mealCounts).forEach(meal => mealSet.add(meal));
    }
  });

  this.mealHeaders = Array.from(mealSet);
}



showTable: boolean = false;

clearReport() {
  this.reportData = [];
  this.mealHeaders = [];
  this.showTable = false; // 👉 Hide table
  this.showTable1 = false; 
}

showTable1: boolean = false;

    summaryTotals: any = {};




    downloadNormalCSV() {
      const headers = [
        'Type', 'Date', 'ID Number', 'Name', 'Location', 'Canteen', 'Device Name',
        'Role', 'Company', 'Start Date', 'End Date', 'Card Badge Number',
        ...this.mealHeaders
      ];
    
      const rows = this.reportData.map(item => {
        const meals = this.mealHeaders.map(meal =>
          item.mealType && item.mealType[meal] !== undefined ? item.mealType[meal] : '-'
        );
    
        return [
          item.type || '-',
          item.date ? new Date(item.date).toLocaleDateString('en-GB') : '-',
          item.idNumber || item.contractorId || '-',
          item.name || item.contractorName || item.visitorName || '-',
          item.location || '-',
          item.canteen || '-',
          item.deviceName || '-',
          item.role || '-',
          item.company || item.companyName || item.visitorCompany || '-',
          item.startDate ? new Date(item.startDate).toLocaleDateString('en-GB') : '-',
          item.endDate ? new Date(item.endDate).toLocaleDateString('en-GB') : '-',
          item.cardBadgeNumber || '-',
          ...meals
        ];
      });
    
      this.exportCSV('report.csv', headers, rows);
    }
    
    downloadConsolidatedCSV() {
      const headers = ['Type', 'ID Number', 'Name', 'Location', 'Canteen', 'Company', ...this.mealHeaders];
    
      const rows = this.reportData.map(item => {
        const meals = this.mealHeaders.map(meal =>
          item.mealCounts && item.mealCounts[meal] !== undefined ? item.mealCounts[meal] : '-'
        );
    
        return [
          item.type || '-',
          item.personId || '-',
          item.name || '-',
          item.location || '-',
          item.canteen || '-',
          item.company || '-',
          ...meals
        ];
      });
    
      // Add total row if needed
      const totalRow = [
        'Total', '', '', '', '', '',
        ...this.mealHeaders.map(meal =>
          this.summaryTotals.mealTypeCounts && this.summaryTotals.mealTypeCounts[meal] !== undefined
            ? this.summaryTotals.mealTypeCounts[meal]
            : '-'
        )
      ];
    
      rows.push(totalRow);
    
      this.exportCSV('consolidated-report.csv', headers, rows);
    }
    
    exportCSV(filename: string, headers: string[], rows: string[][]) {
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(val => `"${val}"`).join(','))
      ].join('\n');
    
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
    

}

   
   
   
   
   