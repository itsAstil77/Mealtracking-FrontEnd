

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportService } from '../../services/report/report.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-reports',
  imports:[CommonModule,RouterModule,FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent  implements OnInit {


 reportList: any[] = [];


  isAddReport: boolean = false;


  constructor(private reportService: ReportService,private http:HttpClient,private alertService:AlertService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getReportSummary();
    
    this.fetchCanteens();
    this.getMealList();

   
  }

  // Fetch summary list
  getReportSummary(): void {
    this.reportService.getReportSummary().subscribe({
      next: (data: any) => {
        this.reportList = data;
        this.reportTotalItems = this.reportList.length;
        this.reportCurrentPage = 1;
        this.updateReportPagination();
      },
      error: (err) => {
        console.error('Error fetching report summary:', err);
      }
    });
  }

  // Open Add Report Modal
  addReport(): void {
    this.isAddReport = true;

    this.reportName = '';
    this.startDate = '';
    this.endDate = '';
    this.selectedTypes.clear();
    this.selectedCanteens.clear();
    this.selectedMeals.clear();
    this.isCountChecked = false;
   
  }


  downloadReport(reportName: string): void {
    const url = `http://172.16.100.66:5221/api/Report/download?reportName=${reportName}`;
  
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `${reportName}.csv`; // Optional: custom filename
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
      .catch(error => {
        console.error('Download failed:', error);
      });
  }




  pagedReportList: any[] = [];

reportCurrentPage: number = 1;
reportItemsPerPage: number = 10;
reportPageSizes: number[] = [5, 10, 20, 50];

reportTotalItems: number = 0;
reportStartIndex: number = 0;
reportEndIndex: number = 0;




updateReportPagination() {
  const start = (this.reportCurrentPage - 1) * this.reportItemsPerPage;
  const end = start + this.reportItemsPerPage;

  this.pagedReportList = this.reportList.slice(start, end);
  this.reportStartIndex = start + 1;
  this.reportEndIndex = Math.min(end, this.reportTotalItems);
}

onReportPageSizeChange() {
  this.reportCurrentPage = 1;
  this.updateReportPagination();
}

goToNextReportPage() {
  if (this.reportEndIndex < this.reportTotalItems) {
    this.reportCurrentPage++;
    this.updateReportPagination();
  }
}

goToPreviousReportPage() {
  if (this.reportCurrentPage > 1) {
    this.reportCurrentPage--;
    this.updateReportPagination();
  }
}

  



reportName = '';
startDate: string = '';
endDate: string = '';
type:string='';
canteenId:string='';
mealType:string='';
selectedTypes: Set<string> = new Set();
selectedCanteens: Set<string> = new Set();
canteenList: any[] = [];





fetchCanteens() {
  this.http.get<any[]>('http://172.16.100.66:5221/api/canteens/all').subscribe(
    data => this.canteenList = data,
    err => console.error('Canteen fetch error:', err)
  );
}

toggleType(type: string, event: any) {
  if (event.target.checked) {
    this.selectedTypes.add(type);
    this.isCountSelected = false; // disable count
  } else {
    this.selectedTypes.delete(type);
  }
}

toggleCanteen(id: string, event: any) {
  if (event.target.checked) {
    this.selectedCanteens.add(id);
    this.isCountSelected = false; // disable count
  } else {
    this.selectedCanteens.delete(id);
  }
 }
// applyReport() {
//   const allTypes = ['Employee', 'Visitor', 'Sub-Contractor'];
//   const allCanteens = this.canteenList;
//   const allMeals = this.mealList;

//   const selectedTypeArray = this.selectedTypes.size > 0 ? Array.from(this.selectedTypes) : allTypes;
//   const selectedCanteenArray = this.selectedCanteens.size > 0 ? Array.from(this.selectedCanteens) : allCanteens.map(c => c.id);
//   const selectedMealArray = this.selectedMeals.size > 0 ? Array.from(this.selectedMeals) : allMeals.map(m => m.id);


//   const start = new Date(this.startDate);
//   start.setHours(10, 15, 0, 633);

//   const end = new Date(this.endDate);
//   end.setHours(10, 15, 0, 633);

//   const payloads = selectedTypeArray.flatMap(type =>
//     selectedCanteenArray.flatMap(canteenId => {
//       const canteen = allCanteens.find(c => c.id === canteenId);
//       const canteenName = canteen ? canteen.name : '';

//       return selectedMealArray.map(mealId => {
//         const meal = allMeals.find(m => m.id === mealId);
//         const mealType = meal ? meal.mealType : '';

//         return {
//           reportName: this.reportName,
//           startDate: start.toISOString(),
//           endDate: end.toISOString(),
          
//           type,
//           canteenId: canteenId,   // 👈 Send name, not ID
//           mealType: mealType        // 👈 Send name, not ID
//         };
//       });
//     })
//   );

//   if (payloads.length > 0) {
//     this.http.post('http://172.16.100.67:5221/api/Report/generate', payloads[0]).subscribe(
//       res => {
//         console.log('Generated:', res);
//         this.getReportSummary();
//       },
//       err => console.error('Error generating report', err)
//     );
//     this.closePopup();
//   }
// }  



// applyReport() {


//   if (!this.reportName || !this.startDate || !this.endDate) {
//     return;
//   }

//   const start = new Date(this.startDate);
//   start.setHours(10, 15, 0, 633);

//   const end = new Date(this.endDate);
//   end.setHours(10, 15, 0, 633);

//   // Check and assign type
//   const type =
//     this.selectedTypes.size === 0
//       ? ''
//       : Array.from(this.selectedTypes).join(',');

//   // Check and assign canteen name
//   const canteen =
//     this.selectedCanteens.size === 0
//       ? ''
//       : this.canteenList.find(c => c.id === Array.from(this.selectedCanteens)[0])?.name || '';

//   // Check and assign meal type
//   const meal =
//     this.selectedMeals.size === 0
//       ? ''
//       : this.mealList.find(m => m.id === Array.from(this.selectedMeals)[0])?.mealType || '';

//   const payload = {
//     reportName: this.reportName,
//     startDate: start.toISOString(),
//     endDate: end.toISOString(),
//     type: type,             // 👈 "" if not selected
//     canteenId: canteen,     // 👈 "" if not selected
//     mealType: meal          // 👈 "" if not selected
//   };

//   this.http.post('http://172.16.100.67:5221/api/Report/generate', payload).subscribe(
//     res => {
//       console.log('Generated:', res);
//       this.getReportSummary(); // Refresh report table
//     },
//     err => console.error('Error generating report', err)
//   );

//   this.closePopup(); // Close modal
// }




applyReport() {
  if (!this.reportName || !this.startDate || !this.endDate) {
    return;
  }

  const start = new Date(this.startDate);
  start.setHours(10, 15, 0, 633);

  const end = new Date(this.endDate);
  end.setHours(10, 15, 0, 633);

  // Check and assign type
  const type =
    this.selectedTypes.size === 0
      ? (this.selectedCanteens.size > 0 || this.selectedMeals.size > 0 ? '' : '')
      : Array.from(this.selectedTypes).join(',');

  // Check and assign canteen name
  const canteen =
    this.selectedCanteens.size === 0
      ? (this.selectedTypes.size > 0 || this.selectedMeals.size > 0 ? '' : '')
      : this.canteenList.find(c => c.id === Array.from(this.selectedCanteens)[0])?.name || '';

  // Check and assign meal type
  const meal =
    this.selectedMeals.size === 0
      ? (this.selectedTypes.size > 0 || this.selectedCanteens.size > 0 ? '' : '')
      : this.mealList.find(m => m.id === Array.from(this.selectedMeals)[0])?.mealType || '';

  const payload = {
    reportName: this.reportName,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    type: type ,             // 👈 "" or actual value or "All"
    canteenId: canteen,     // 👈 "" or actual value or "All"
    mealType: meal          // 👈 "" or actual value or "All"
  };

  this.http.post('http://172.16.100.66:5221/api/Report/generate', payload).subscribe(
    res => {
      console.log('Generated:', res);
      this.alertService.showAlert("report generated successfully");
      // this.getReportSummary(); // Refresh report table
    },
    err => console.error('Error generating report', err)
  );

  this.closePopup(); // Close modal

}


isCountChecked: boolean = false;
isCountSelected: boolean = false;


applyCountReport() {
  if (!this.reportName || !this.startDate || !this.endDate) {
    return;
  }

  const startDate = new Date(this.startDate).toISOString().split('T')[0];
  const endDate = new Date(this.endDate).toISOString().split('T')[0];

  const url = `http://172.16.100.66:5221/api/Report/meal-counts?startDate=${startDate}&endDate=${endDate}`;

  this.http.get(url).subscribe(
    res => {
      console.log('Count Report Response:', res);
    
      this.showCountPopup(res); 
      this.closePopup();
    },
    err => {
      console.error('Error generating count report:', err);
      this.alertService.showAlert('Failed to generate count report.',"error");
    }
  );
}
showCountPopup(data: any) {
  const formatted = Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

    this.alertService.showAlert(`Count:\n${formatted}`);
}

closePopup() {
  this.isAddReport = false;
}


mealList: any[] = [];
selectedMeals: Set<string> = new Set();



getMealList() {
  this.http.get('http://172.16.100.66:5221/api/extras/meal-config-summary').subscribe((res: any) => {
    this.mealList = res;
  });
}

toggleMeal(mealId: string, event: any) {
  if (event.target.checked) {
    this.selectedMeals.add(mealId);
    this.isCountSelected = false; // disable count
  } else {
    this.selectedMeals.delete(mealId);
  }
}




alertMessage: string = '';
isAlertVisible: boolean = false;


selectedReportType: string = 'report';
consolidatedReportList: any[] = [];


onReportTypeChange() {
  if (this.selectedReportType === 'report') {
    this.getReportSummary();
  } else if (this.selectedReportType === 'consolidated') {
    this.loadConsolidatedSummary();
  }
}



loadConsolidatedSummary() {
  this.http.get<any[]>("http://172.16.100.66:5221/api/consolidated-reports/summaries").subscribe({
    next: (res) => {
      // this.consolidatedReportList = res;
      // this.pagedReportList = this.consolidatedReportList;
      this.consolidatedReportList = res;
      this.consolidatedTotalItems = this.consolidatedReportList.length;
      this.updateConsolidatedPagination(); 
    },
    error: (err) => {
      console.error("Error loading consolidated report summary:", err);
    }
  });

}





pagedConsolidatedReportList: any[] = [];

consolidatedCurrentPage: number = 1;
consolidatedItemsPerPage: number = 10;
consolidatedPageSizes: number[] = [5, 10, 20, 50];

consolidatedTotalItems: number = 0;
consolidatedStartIndex: number = 0;
consolidatedEndIndex: number = 0;


updateConsolidatedPagination() {
  const start = (this.consolidatedCurrentPage - 1) * this.consolidatedItemsPerPage;
  const end = start + this.consolidatedItemsPerPage;

  this.pagedConsolidatedReportList = this.consolidatedReportList.slice(start, end);
  this.consolidatedStartIndex = start + 1;
  this.consolidatedEndIndex = Math.min(end, this.consolidatedTotalItems);
}

onConsolidatedPageSizeChange() {
  this.consolidatedCurrentPage = 1;
  this.updateConsolidatedPagination();
}

goToNextConsolidatedPage() {
  if (this.consolidatedEndIndex < this.consolidatedTotalItems) {
    this.consolidatedCurrentPage++;
    this.updateConsolidatedPagination();
  }
}

goToPreviousConsolidatedPage() {
  if (this.consolidatedCurrentPage > 1) {
    this.consolidatedCurrentPage--;
    this.updateConsolidatedPagination();
  }
}



reportType: string = '';

}

