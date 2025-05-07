

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,  NgZone,  OnDestroy,  OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project/project.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { AlertService } from '../../services/alert/alert.service';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { Subscription } from 'rxjs';




interface Location {
  id: string;
  name: string;
  expanded?: boolean;
  canteens: Canteen[]; // ✅ Ensure `canteens` is always an array
}


interface Canteen {
  id: string;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit,OnDestroy{

  subscription: Subscription = new Subscription();
  selectedData: any; // <-- ADD THIS LINE


  constructor(private http: HttpClient, private projectService: ProjectService,
    private dashboardService: DashboardService,private alertService:AlertService,
    private wsService: WebsocketService,private ngZone: NgZone) {}

  ngOnInit(): void {
    this.fetchSummary().then(() => {
      this.listenToWebSocket(); // start listening only after data is loaded
    });
    this.fetchLocations()


    
  }
  listenToWebSocket(): void {
    this.subscription = this.wsService.getMessages().subscribe(msg => {
      this.ngZone.run(() => {
        const index = this.dashboards.findIndex(d => d.dashboardid === msg.dashboardId);
        if (index !== -1) {
          this.dashboards[index] = {
            ...this.dashboards[index],
            mealTypeCounts: msg.mealTypeCounts,
            totalToday: msg.totalToday,
            totalThisWeek: msg.totalThisWeek,
            totalThisMonth: msg.totalThisMonth
          };
        }
      });
    });
  }



  ngOnDestroy(): void {
   
    this.subscription.unsubscribe();
  }

  

// fetchSummary(){
//   this.http.get<any[]>('http://172.16.100.66:5221/api/Dashboard/dashboard-mealtype-summary').subscribe(
//     (res) => {
//       this.dashboards = res.reverse();
//       if (this.dashboards.length > 0) {
//         this.selectedCanteen = this.dashboards[0].dashboardid;
//       }
//     },
//     (err) => {
//       console.error('Error loading dashboards', err);
//     }
//   );
// }

fetchSummary(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.http.get<any[]>('http://172.16.100.66:5221/api/Dashboard/dashboard-mealtype-summary').subscribe(
      (res) => {
        this.dashboards = res.reverse();
        if (this.dashboards.length > 0) {
          this.selectedCanteen = this.dashboards[0].dashboardid;
        }
        resolve();
      },
      (err) => {
        console.error('Error loading dashboards', err);
        reject(err);
      }
    );
  });
}



  openPopup1(canteen: string) {
    console.log("Edit clicked for", canteen);
  }

  toggleRemovePopup1() {
    console.log("Delete clicked");
  }
   
 
  
  isPopupVisible: boolean = false;
 

  openPopup(canteenName: string) {
    // this.selectedCanteen = canteenName;
    this.selectedDashboardId = canteenName
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  saveChanges() {
    console.log('Updated Canteen Name:', this.selectedCanteen);
    this.closePopup();
  }
  



  isRemovePopupVisible: boolean = false; // Initialize variable

  // deleteDashboard1() {
  //   this.isRemovePopupVisible = !this.isRemovePopupVisible;
  // }

  




  confirmRemoval() {
    // Add delete logic here (API call, remove item, etc.)
    console.log("Dashboard Deleted");
    this.isRemovePopupVisible = false;
  }
  

  isDashboardPopupVisible = false; // Controls popup visibility
  dashboardName = ''; // Stores input value

  // Function to show the popup
  showDashboardPopup() {
    this.isDashboardPopupVisible = true;
  }









  apiUrl = 'http://172.16.100.66:5221/api/Dashboard/dashboard-mealtype-summary';
  dashboards: any[] = [];
 
  // selectedCanteen: Canteen | null = null;
  

  selectedCanteen:string='';

  selectedDashboardId: string = '';

  // selectCanteen(dashboardId: string) {
  //   this.selectedCanteen = dashboardId;

  //   this.subscription.unsubscribe();

   
  // }

  selectCanteen(dashboardId: string): void {
    this.selectedCanteen = dashboardId;
    const selectedDashboard = this.dashboards.find(d => d.dashboardid === dashboardId);
    if (selectedDashboard) {
      this.selectedData = { ...selectedDashboard };
    }
  }

  

  // selectCanteen(dashboardId: string) {
  //   const found = this.dashboards.find(d => d.dashboardid === dashboardId);
    
  //   if (found) {
  //     this.selectedCanteen = {
  //       id: found.canteenId,
  //       name: found.canteenName
  //     };
  //   }
  // }

  // selectCanteen(dashboardId: string) {
  //   const dashboard = this.dashboards.find(d => d.dashboardid === dashboardId);
  //   if (!dashboard) {
  //     console.warn('Dashboard not found for ID:', dashboardId);
  //     return;
  //   }
  
  //   // Set selected canteen
  //   this.selectedCanteen = {
  //     id: dashboard.canteenId,
  //     name: dashboard.canteenName
  //   };
  
  //   // Expand and match the correct location
  //   for (const location of this.locations) {
  //     const matchedCanteen = location.canteens.find(c => c.id === dashboard.canteenId);
  //     if (matchedCanteen) {
  //       location.expanded = true;
  //       this.selectedCanteens.clear();
  //       this.selectedCanteens.add(matchedCanteen.id);
  //       break;
  //     }
  //   }
  
   
  // }
  
  

  getSelectedCanteenData() {
    return this.dashboards.find(d => d.dashboardid === this.selectedCanteen);
   
  }
  getMealTypes(mealData: any) {
    return Object.keys(mealData || {});
  }

  setDefaultImage(event: any) {
    event.target.src = 'assets/lunch.png'; // Path to your fallback image
  }




  locations: Location[] = [];
  selectedCanteens: Set<string> = new Set();



  fetchLocations(): void {
    this.projectService.getLocationSummary().subscribe(
      (response: Location[]) => {
        this.locations = response.map(loc => ({
          ...loc,
          expanded: false,
          canteens: []
        }));
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  fetchCanteens(location: Location) {
    this.projectService.getCanteensByLocation1(location.id).subscribe(
      (canteens: Canteen[]) => {
        location.canteens = canteens;
      },
      (error) => {
        console.error(`Error fetching canteens for location ${location.id}:`, error);
      }
    );
  }



  toggleDropdown(location: Location) {
    location.expanded = !location.expanded;

    if (location.expanded && location.canteens?.length === 0) {
      this.fetchCanteens(location);
    }
  }

  


  //add dashboard 






  selectCanteen1(canteen: any) {
    this.selectedCanteens.clear(); // Only one canteen selectable at a time
    this.selectedCanteens.add(canteen.id);
    this.selectedCanteen = canteen;
  }

   saveDashboard() {
//     if (!this.dashboardName || !this.selectedCanteen) {
//       alert('Please enter dashboard name and select a canteen.');
//       return;
//     }

//       // Find the location that contains the selected canteen
//   let selectedLocation: Location | undefined;

//   for (let location of this.locations) {
//     if (location.canteens.some(c => c.id === this.selectedCanteen!.id)) {
//       selectedLocation = location;
//       break;
//     }
//   }


//     const payload = {
//       id: '', // New dashboard, so id is empty
//       dashboardName: this.dashboardName,
//       locationId: selectedLocation?.id || '',
//       locationName: selectedLocation?.name || '',
//       canteenId: this.selectedCanteen.id,
//       canteenName: this.selectedCanteen.name
//     };

//     this.http.post('http://172.16.100.66:5221/api/Dashboard/dashboard-preview', payload)
//       .subscribe({
//         next: (response) => {
//           console.log('Dashboard saved successfully', response);
//           this.closeDashboardPopup();
//         },
//         error: (error) => {
//           console.error('Error saving dashboard', error);
//         }
//       });
   }

  closeDashboardPopup() {
    this.isDashboardPopupVisible = false;
    this.dashboardName = '';
    this.selectedCanteens.clear();
    // this.selectedCanteen = null;
  }
// }

openDeletePopup(dashboardId: string) {
  if (dashboardId) {
    this.selectedDashboardId = dashboardId;
    console.log('Selected Dashboard ID:', this.selectedDashboardId); // ← ADD this
    this.isRemovePopupVisible = true;
  } else {
    console.error('No dashboard ID passed to openDeletePopup!');
  }
}


deleteDashboard() {
  if (!this.selectedDashboardId) {
    console.error('No dashboard ID selected.');
    return;
  }

  console.log('Proceeding to delete dashboard with ID:', this.selectedDashboardId);

  this.dashboardService.deleteDashboard(this.selectedDashboardId).subscribe(
    (res) => {
       this.alertService.showAlert('Dashboard deleted successfully');
      this.fetchSummary();
      this.isRemovePopupVisible = false;
      
    },
    (err) => {
      console.error('Error while deleting dashboard:', err);
    }
  );
}
}