
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoleHierarchyService } from '../../../services/role-hierarchy/role-hierarchy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project/project.service';
import { MealConfigService } from '../../../services/meal-config/meal-config.service';
import { forkJoin } from 'rxjs';
import { AlertService } from '../../../services/alert/alert.service';


interface Canteen {
  canteenId: string;
  canteenName: string;
  selected?: boolean;
  mealConfigurations?: MealConfiguration[];
  id: string;
  name: string;
  locationId: string;
  description: string;
  status: boolean
}

interface MealConfiguration {
 
  mealType: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  selected?: boolean;
}
interface Location {
  id: string;
  name: string;
  expanded?: boolean;
  canteens: Canteen[]; 
}




@Component({
  selector: 'app-rolesedit',
  templateUrl: './rolesedit.component.html',
  imports: [CommonModule, FormsModule,RouterModule],
  styleUrl: './rolesedit.component.css',
})
export class RoleseditComponent implements OnInit {
  roleId: string = '';

  roleName: string = '';
  description: string = '';
  locations: Location[] = [];
  selectedCanteens: Set<string> = new Set();
  mealConfig: MealConfiguration[] = [];
  selectedMeals: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleHierarchyService: RoleHierarchyService,
    private projectService: ProjectService,
    private mealConfigService: MealConfigService,
    private alertService:AlertService
  ) {}


ngOnInit() {
  this.roleId = this.route.snapshot.paramMap.get('roleId') || '';

  if (this.roleId) {
    this.fetchLocations(() => {
      this.locations.forEach(location => {
        this.fetchCanteens(location); // Fetch canteens for each location
      });
  
      this.fetchRoleData(); // Fetch role data AFTER locations are loaded
    });
  }



  this.loadMealConfig();
  
}



roleDetails: any = {};


fetchRoleData() {
  console.log('Fetching role data for roleId:', this.roleId);

  this.roleHierarchyService.getRoleByRoleId(this.roleId).subscribe(
    (data) => {
      console.log('Fetched Role Data:', data);
      this.roleDetails = data; // ✅ REQUIRED for updateRole()
      this.roleName = data.roleName;
      this.description = data.description;
      this.selectedCanteens = new Set();

  
    this.locations.forEach((loc) => {
      const matchedLoc = data.locations.find((l: any) => l.locationId === loc.id);
    
      if (matchedLoc) {
        loc.expanded = true; // Auto-expand if this location has data
    
        loc.canteens = loc.canteens.map((c: any) => {
          const matchedCanteen = matchedLoc.canteens.find(
            (cMapped: any) => cMapped.canteenId === c.id
          );
    
          const isSelected = !!matchedCanteen; // Canteen is selected if found in role
    
          if (isSelected) {
            this.selectedCanteens.add(c.id);
          }

        
          return {
            ...c,
            selected: isSelected,
          };
        });
      }
    });
    
      


      // ✅ Assign Existing Meal Configurations
      this.mealConfig.forEach((meal) => {
        const matchingMeal = data.locations
          .flatMap((loc: any) => loc.canteens.flatMap((canteen: any) => canteen.mealConfigurations))
          .find((m: any) => m.mealType === meal.mealType);

        if (matchingMeal) {
          meal.selected = true; // Mark as selected
        }
      });

      console.log('Updated Locations:', this.locations);
      console.log('Selected Canteens:', this.selectedCanteens);
      console.log('Updated Meal Configurations:', this.mealConfig);

      // setTimeout(() => {
      //   console.log('Timeout triggered: Selected Canteens:', this.selectedCanteens);
      //   this.selectedCanteens = new Set(this.selectedCanteens); // Ensures Angular updates the view
      // }, 500);
    },
    (error) => {
      console.error('Error fetching role data:', error);
    }
  );

  console.log('Selected Canteens:', this.selectedCanteens);



}

// updateRole() {
//   // 📦 Build updated role object
//   const updatedRoleData = {
//     id: this.roleDetails.id,
//     roleId: this.roleId,
//     roleName: this.roleName,
//     description: this.description,
//     locations: this.locations.map(location => {
//       const selectedCanteens = location.canteens
//         .filter(canteen => this.selectedCanteens.has(canteen.id))
//         .map(canteen => ({
//           canteenId: canteen.id,
//           canteenName: canteen.name,
//           mealConfigurations: this.mealConfig
//             .filter(meal => meal.selected)
//             .map(meal => ({
//               mealType: meal.mealType,
//               startTime: meal.startTime,
//               endTime: meal.endTime,
//               isActive: true,
//             }))
//         }));

//       return {
//         locationId: location.id,
//         locationName: location.name,
//         canteens: selectedCanteens
//       };
//     })
//    };

//   console.log('🔁 Update Role Payload:', updatedRoleData);

//   // 🚀 Send update request
//   this.roleHierarchyService.updateRole(this.roleId, updatedRoleData).subscribe(
//     () => {
//       alert('Role updated successfully!');
//       this.router.navigate(['/extrasrole']);
//     },
//     (error) => {
//       console.error('❌ Role update failed:', error);
//       alert('Failed to update role.');
//     }
//   );
// }


//this is working
// updateRole() {
//   const updatedRoleData = {
//     id: this.roleDetails.id,
//     roleId: this.roleId,
//     roleName: this.roleName,
//     description: this.description,
//     locations: this.locations.map(location => {
//       const selectedCanteens = location.canteens
//         .filter(canteen => this.selectedCanteens.has(canteen.id))
//         .map(canteen => {
//           // Use only selected meal types
//           const selectedMeals = this.mealConfig
//             .filter(meal => meal.selected)
//             .map(meal => ({
//               mealType: meal.mealType,
//               startTime: meal.startTime,
//               endTime: meal.endTime,
//               isActive: true,
//             }));

//           return {
//             canteenId: canteen.id,
//             canteenName: canteen.name,
//             mealConfigurations: selectedMeals
//           };
//         });

//       return {
//         locationId: location.id,
//         locationName: location.name,
//         canteens: selectedCanteens
//       };
//     })
//   };

//   console.log('🔁 Final Payload to Update Role:', updatedRoleData);

//   this.roleHierarchyService.updateRole(this.roleId, updatedRoleData).subscribe(
//     () => {
//       alert('Role updated successfully!');
//       this.router.navigate(['/extrasrole']);
//     },
//     (error) => {
//       console.error('❌ Role update failed:', error);
//       alert('Failed to update role.');
//     }
//   );
// }



updateRole() {
  const updatedRoleData = {
    id: this.roleDetails.id,
    roleId: this.roleId,
    roleName: this.roleName,
    description: this.description,
    locations: this.locations.map(location => {
      const selectedCanteens = location.canteens
        .filter(canteen => this.selectedCanteens.has(canteen.id))
        .map(canteen => {
          // Only include selected meals
          const selectedMeals = this.mealConfig
            .filter(meal => meal.selected)
            .map(meal => ({
              mealType: meal.mealType,
              startTime: meal.startTime,
              endTime: meal.endTime,
              isActive: true
            }));

          return {
            canteenId: canteen.id,
            canteenName: canteen.name,
            mealConfigurations: selectedMeals
          };
        });

      return {
        locationId: location.id,
        locationName: location.name,
        canteens: selectedCanteens
      };
    })
  };

  console.log('🔁 Update Role Payload:', updatedRoleData);

  this.roleHierarchyService.updateRole(this.roleId, updatedRoleData).subscribe(
    () => {
      this.alertService.showAlert('Role updated successfully!');
      this.router.navigate(['/extrasrole']);
    },
    (error) => {
      console.error('❌ Role update failed:', error);
      this.alertService.showAlert('Failed to update role.',"error");
    }
  );

}




fetchLocations(callback?: () => void): void {
  this.projectService.getLocationSummary().subscribe(
    (response: Location[]) => {
      this.locations = response.map((loc) => ({
        id: loc.id,
        name: loc.name,
        expanded: true,
        canteens: [],
      }));

      // Get canteens for all locations in parallel
      const canteenRequests = this.locations.map(location =>
        this.projectService.getCanteensByLocation1(location.id)
      );

      forkJoin(canteenRequests).subscribe(
        (canteensArray: Canteen[][]) => {
          this.locations.forEach((location, index) => {
            location.canteens = canteensArray[index].map((canteen) => ({
              ...canteen,
              selected: false,
              mealConfigurations: this.mealConfig.map(meal => ({
                mealType: meal.mealType,
                startTime: meal.startTime,
                endTime: meal.endTime,
                isActive: false
              }))
            }));
          });

          console.log('✅ Locations with Canteens:', this.locations);

          if (callback) callback(); // Only proceed after canteens are ready
        },
        (error) => {
          console.error('Error fetching canteens:', error);
        }
      );
    },
    (error) => {
      console.error('Error fetching locations:', error);
    }
  );
}


/** ✅ Fetch Meal Configurations */
loadMealConfig() {
  this.mealConfigService.getMealConfig().subscribe(
    (data: MealConfiguration[]) => {
      this.mealConfig = data.map((meal) => ({
        mealType: meal.mealType,
        startTime: meal.startTime,
        endTime: meal.endTime,
        isActive: meal.isActive,
        selected: false,
      }));
    },
    (error) => console.error('Error fetching meal config:', error)
  );
}




  /** ✅ Toggle Meal Selection */
  toggleMealSelection(meal: MealConfiguration) {
    if (this.selectedMeals.has(meal.mealType)) {
      this.selectedMeals.delete(meal.mealType);
      meal.selected = false;
    } else {
      this.selectedMeals.add(meal.mealType);
      meal.selected = true;
    }
  }


selectCanteen(canteen: Canteen) {
  if (this.selectedCanteens.has(canteen.id)) {
    this.selectedCanteens.delete(canteen.id);
  } else {
    this.selectedCanteens.add(canteen.id);
  }
}









  /** ✅ Toggle Dropdown for Locations */
  toggleDropdown(location: Location) {
    location.expanded = !location.expanded;

    if (location.expanded && location.canteens.length === 0) {
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


  

}

