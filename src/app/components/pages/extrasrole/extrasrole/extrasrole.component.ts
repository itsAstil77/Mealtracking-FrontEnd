import { Component, OnInit } from '@angular/core';
import { RolesaddService } from '../../../services/rolesadd/rolesadd.service';
import { Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleHierarchyService } from '../../../services/role-hierarchy/role-hierarchy.service';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-extrasrole',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './extrasrole.component.html',
  styleUrl: './extrasrole.component.css'
})
export class ExtrasroleComponent implements OnInit{

  roles: any[] = []; 

  constructor(private roleService: RolesaddService, private router: Router,private roleHierarchyService: RoleHierarchyService,private alertService:AlertService ) {}

  ngOnInit() {
    this.loadRoles(); 
  }

  loadRoles() {
    this.roleService.getRoleSummary().subscribe(
      (response: any[]) => {
        this.roles = response.reverse();
        this.roleTotalItems = this.roles.length;
        this.roleCurrentPage = 1;
this.updatePagedRoles();

        console.log('Roles loaded:', this.roles);
      },
      (error: any) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

//   editRole(roleId: string) {
//     console.log('Edit role:', roleId);
//     this.router.navigate(['/rolesedit']); 
//   }
//  editRole(roleId: string) {
//       this.router.navigate(['/rolesedit'], { queryParams: { roleId } });
//     }

editRole(roleId: string) {
  console.log('Navigating to edit page with roleId:', roleId); // Debug
  this.router.navigate(['/rolesedit', roleId]);
}


isDeletePopupOpen: boolean = false;  // Flag to control the popup visibility
roleIdToDelete: string = '';  // Store the roleId to be deleted



// Open the delete confirmation popup and set the roleId to delete
openDeletePopup(roleId: string): void {
  this.roleIdToDelete = roleId;
  this.isDeletePopupOpen = true;  // Show the confirmation popup
}

// Close the delete confirmation popup without performing any action
closeDeletePopup(): void {
  this.isDeletePopupOpen = false;  // Close the popup
}

// Confirm the deletion of the role
deleteRole(): void {
  this.roleHierarchyService.deleteRole(this.roleIdToDelete).subscribe({
    next: (response) => {
      console.log('Role deleted successfully:', response);
      this.isDeletePopupOpen = false;  // Close the popup
      // Optionally, refresh the list of roles or show a success message
      this.alertService.showAlert("role deleted successfully");
      this.loadRoles(); 
    },
    error: (error) => {
      console.error('Error deleting role:', error);
      this.alertService.showAlert('Failed to delete the role. Please try again.',"error");
    }
  });
}



pagedRoles: any[] = [];

roleCurrentPage: number = 1;
roleItemsPerPage: number = 10;
rolePageSizeOptions: number[] = [5, 10, 20, 50];

roleTotalItems: number = 0;
roleStartItem: number = 0;
roleEndItem: number = 0;

updatePagedRoles() {
  const start = (this.roleCurrentPage - 1) * this.roleItemsPerPage;
  const end = start + this.roleItemsPerPage;

  this.pagedRoles = this.roles.slice(start, end);
  this.roleStartItem = start + 1;
  this.roleEndItem = Math.min(end, this.roleTotalItems);
}

onRoleItemsPerPageChange() {
  this.roleCurrentPage = 1;
  this.updatePagedRoles();
}

nextRolePage() {
  if (this.roleEndItem < this.roleTotalItems) {
    this.roleCurrentPage++;
    this.updatePagedRoles();
  }
}

prevRolePage() {
  if (this.roleCurrentPage > 1) {
    this.roleCurrentPage--;
    this.updatePagedRoles();
  }
}

 }

  
 


     

  
  


