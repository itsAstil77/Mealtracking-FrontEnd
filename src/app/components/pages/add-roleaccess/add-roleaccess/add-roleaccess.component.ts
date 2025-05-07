import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RoleaccessService } from '../../../services/role-access/roleaccess.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-add-roleaccess',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './add-roleaccess.component.html',
  styleUrl: './add-roleaccess.component.css'
})
export class AddRoleaccessComponent {


 
   
      constructor(private router: Router,private roleAccessService: RoleaccessService,private http:HttpClient,private alertService:AlertService) {} 
      
      // projects: any[] = [
      //   {
      //       name: "Meal Tracking",
      //       expanded: false,
      //       children: [
      //           {
      //               name: "Saudi",
      //               expanded: false,
      //               canteens: [
      //                 { name: "Canteen1", expanded: false },
      //                 { name: "Canteen2", expanded: false },
      //                 { name: "Canteen3", expanded: false }
      //               ]
      //           }
      //       ]
      //   },
      //   {
      //       name: "Customer Analytics MALL",
      //       expanded: false,
      //       children: []
      //   }
      // ];
    
      // toggleDropdown(item: any) {
      //   item.expanded = !item.expanded;
      // }
    
      // isDeletePopupVisible = false;
      // selectedItemForDeletion: any = null;
    
      // openDeletePopup(item: any) {
      //   this.selectedItemForDeletion = item;
      //   this.isDeletePopupVisible = true;
      // }
    
      // closeDeletePopup() {
      //   this.isDeletePopupVisible = false;
      //   this.selectedItemForDeletion = null;
      // }
    
      // editCanteenPopupVisible = false;
      // canteenName: string = '';
      // canteenDescription: string = '';
    
      // showEditCanteenPopup() {
      //   this.editCanteenPopupVisible = true;
      // }
    
      // hideEditCanteenPopup() {
      //   this.editCanteenPopupVisible = false;
      // }



      roleName: string = '';
      description: string = '';
      allowedModules: any = {
        dashboard: false,
        events: false,
        processAutomation: false,
        reports: false,
        administration: false
      };
  
    
      toggleModule(module: string) {
        this.allowedModules[module] = !this.allowedModules[module]; // Toggle selection
      }
    
      saveRole() {
        console.log('Save button clicked!');
        const newRole = {
          id: '',
          roleid: '', // Adjust this if needed
          roleName: this.roleName,
          allowedModules: this.allowedModules
        };
    
        this.roleAccessService.createRole(newRole).subscribe(response => {
          console.log('Role created successfully', response);
          this.alertService.showAlert('RoleAccess created successfully!');
          this.router.navigate(['/rolesmanagement']);
        }, error => {
          console.error('Error creating role', error);
        });
      }



      roleDrop: any[] = [];  // Stores role data from API
      selectedRoleId: string = ''; // Stores selected role ID
      isLoading: boolean = false; // Prevents multiple API calls
    
     
    
      // Fetch roles when clicking the dropdown
      fetchRoles(): void {
        if (this.roleDrop.length === 0 && !this.isLoading) {  // Fetch only if not already loaded
          this.isLoading = true;
          this.http.get<any[]>('http://172.16.100.66:5221/api/RoleHierarchy/summary').subscribe(
            (response) => {
              this.roleDrop = response || []; // Ensure it's an array
              this.isLoading = false;
              console.log("Roles fetched:", this.roleDrop); // Debugging
            },
            (error) => {
              console.error('Error fetching roles:', error);
              this.isLoading = false;
            }
          );
        }
      }
    }
    
    
    
    
    

