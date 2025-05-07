
// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { ProjectService } from '../../../services/project/project.service';
// import { HttpClient } from '@angular/common/http';
// import { RoleHierarchyService } from '../../../services/role-hierarchy/role-hierarchy.service';
// import { MealConfigService } from '../../../services/meal-config/meal-config.service';


// interface Location {
//   id: string;
//   name: string;
//   expanded?: boolean;
//   canteens?: any[];
// }



// interface MealConfig {
//   id: string;
//   mealType: string;
//   startTime: string;
//   endTime: string;
//   selected?: boolean; 
// }
// @Component({
//   selector: 'app-rolesadd',
//   standalone: true,
//   imports: [CommonModule,FormsModule,RouterModule],
//   templateUrl: './rolesadd.component.html',
//   styleUrl: './rolesadd.component.css'
// })
// export class RolesaddComponent implements OnInit {





// constructor(private router: Router,private http: HttpClient, private route: ActivatedRoute,private projectService: ProjectService,
//   private roleHierarchyService: RoleHierarchyService,private mealConfigService: MealConfigService) {}

// locations: Location[] = [];
// selectedCanteens: Set<string> = new Set();
// meals: any[] = [];


// ngOnInit() {
//   this.fetchLocations();
//   this.loadMealConfig(); 
  
// }

  
 


// fetchLocations(): void {
//   this.projectService.getLocationSummary().subscribe(
//     (response: Location[]) => {
//       this.locations = response.map(loc => ({
//         ...loc,
//         expanded: false,
//         canteens: []
//       }));
//     },
//     (error) => {
//       console.error('Error fetching locations:', error);
//     }
//   );
// }

// toggleDropdown(location: Location) {
//   location.expanded = !location.expanded;

//   if (location.expanded && location.canteens?.length === 0) {
//     this.fetchCanteens(location);
//   }
// }

// fetchCanteens(location: Location) {
//   this.projectService.getCanteensByLocation1(location.id).subscribe(
//     (canteens: any[]) => {
//       location.canteens = canteens.map(canteen => ({
//         id: canteen.id,
//         name: canteen.name
//       }));
//     },
//     (error) => {
//       console.error(`Error fetching canteens for location ${location.id}:`, error);
//     }
//   );
// }

// isCanteenSelected(canteenName: string): boolean {
//   return this.selectedCanteens.has(canteenName);
// }


// selectCanteen(canteen: any) {
//   if (this.selectedCanteens.has(canteen.name)) {
//     this.selectedCanteens.delete(canteen.name); 
//   } else {
//     this.selectedCanteens.add(canteen.name); }
// }



// selectAll = false;





// mealConfig: any[] = [];




// loadMealConfig() {
//   this.mealConfigService.getMealConfig().subscribe(
//     (data: MealConfig[]) => {
     
//       this.mealConfig = data.map((meal: MealConfig) => ({
//         ...meal,
//         selected: false, 
//       }));
//     },
//     (error) => {
//       console.error('Error fetching meal config:', error);
//     }
//   );
// }


// toggleSelectAll() {
//   this.mealConfig.forEach(meal => (meal.selected = this.selectAll));
// }


// toggleMealSelection() {
//   this.selectAll = this.mealConfig.every(meal => meal.selected);
// }




// }









import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project/project.service';
import { RoleHierarchyService } from '../../../services/role-hierarchy/role-hierarchy.service';
import { MealConfigService } from '../../../services/meal-config/meal-config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';

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

interface MealConfig {
  id: string;
  mealType: string;
  startTime: string;
  endTime: string;
  selected?: boolean;
}

@Component({
  selector: 'app-rolesadd',
  templateUrl: './rolesadd.component.html',
  imports:[CommonModule,FormsModule,RouterModule],
  styleUrl: './rolesadd.component.css'
})
export class RolesaddComponent implements OnInit {
  roleName: string = '';
  description: string = '';

  locations: Location[] = [];
  selectedCanteens: Set<string> = new Set();
  mealConfig: MealConfig[] = [];
  selectedMeals: Set<string> = new Set();


  constructor(
    private router: Router,
    private projectService: ProjectService,
    private roleHierarchyService: RoleHierarchyService,
    private mealConfigService: MealConfigService,
    private alertService:AlertService
  ) {}

  ngOnInit() {
    this.fetchLocations();
    this.loadMealConfig();
  }

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

  toggleDropdown(location: Location) {
    location.expanded = !location.expanded;

    if (location.expanded && location.canteens?.length === 0) {
      this.fetchCanteens(location);
    }
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

  selectCanteen(canteen: Canteen) {
    if (this.selectedCanteens.has(canteen.id)) {
      this.selectedCanteens.delete(canteen.id);
    } else {
      this.selectedCanteens.add(canteen.id);
    }
  }

  loadMealConfig() {
    this.mealConfigService.getMealConfig().subscribe(
      (data: MealConfig[]) => {
        this.mealConfig = data.map(meal => ({
          ...meal,
          selected: false
        }));
      },
      (error) => {
        console.error('Error fetching meal config:', error);
      }
    );
  }

  toggleMealSelection(meal: MealConfig) {
    if (this.selectedMeals.has(meal.id)) {
      this.selectedMeals.delete(meal.id);
    } else {
      this.selectedMeals.add(meal.id);
    }
  }


  saveRole() {
    const requestBody = {
      id: '',  // Backend auto-generates
      roleId: '', // Backend auto-generates
      roleName: this.roleName,
      description: this.description,
      locations: this.locations
        .filter(loc => loc.canteens.some(canteen => this.selectedCanteens.has(canteen.id))) // Only selected locations
        .map(loc => ({
          locationId: loc.id,
          locationName: loc.name,
          canteens: loc.canteens
            .filter(canteen => this.selectedCanteens.has(canteen.id)) // Only selected canteens
            .map(canteen => ({
              canteenId: canteen.id,
              canteenName: canteen.name,
              mealConfigurations: this.mealConfig
                .filter(meal => this.selectedMeals.has(meal.id)) // Only selected meals
                .map(meal => ({
                  id: meal.id, // Meal ID from API
                  mealType: meal.mealType,
                  startTime: meal.startTime,
                  endTime: meal.endTime,
                  isActive: true
                }))
            }))
        }))
    };
  
    console.log('Final Request Body:', JSON.stringify(requestBody, null, 2));
  
    this.roleHierarchyService.saveRoleHierarchy(requestBody).subscribe(
      (response) => {
        console.log('Role saved successfully', response);
        this.alertService.showAlert("role created successfully");
        this.router.navigate(['/extrasrole']);
      },
      (error) => console.error('Error saving role:', error)
    );
  }
  



  
}
