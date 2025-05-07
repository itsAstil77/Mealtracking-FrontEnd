import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoleaccessService } from '../../../services/role-access/roleaccess.service';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-rolesmanagement',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './rolesmanagement.component.html',
  styleUrl: './rolesmanagement.component.css'
})
export class RolesmanagementComponent {

  

// delete popup 

isDeletePopupVisible = false;

// showDeletePopup() {
//   this.isDeletePopupVisible = true;
// }

// hideDeletePopup() {
//   this.isDeletePopupVisible = false;
// }

showDeletePopup(roleId: string) {
  this.selectedRoleId = roleId;
  this.isDeletePopupVisible = true;
}

hideDeletePopup() {
  this.isDeletePopupVisible = false;
  this.selectedRoleId = null;
}



roles: any[] = [];

selectedRoleId: string | null = null;

constructor(private roleAccessService: RoleaccessService,private router: Router,private alertService:AlertService) {}

ngOnInit() {
  this.fetchRoles();
}

fetchRoles() {
  this.roleAccessService.getRoles().subscribe(
    (response: any) => {
      this.roles = response.reverse();
      this.permissionRoleTotalItems = this.roles.length;
      this.permissionRoleCurrentPage = 1;
this.updatePagedPermissionRoles();

    },
    (error) => {
      console.error('Error fetching roles:', error);
    }
  );
}

getAllowedModules(allowedModules: any): string[] {
  return Object.keys(allowedModules).filter(module => allowedModules[module]);
}


confirmDelete() {
  if (this.selectedRoleId) {
    this.roleAccessService.deleteRole(this.selectedRoleId).subscribe(
      () => {
        this.roles = this.roles.filter(role => role.id !== this.selectedRoleId);
        this.hideDeletePopup();
      },
      (error) => {
        console.error('Error deleting role:', error);
      }
    );
  }
}
editRole(roleId: string) {
  this.router.navigate(['/roles'], { queryParams: { roleId } });
}





pagedPermissionRoles: any[] = [];

permissionRoleCurrentPage: number = 1;
permissionRoleItemsPerPage: number = 10;
permissionRolePageSizeOptions: number[] = [5, 10, 20, 50];

permissionRoleTotalItems: number = 0;
permissionRoleStartItem: number = 0;
permissionRoleEndItem: number = 0;

updatePagedPermissionRoles() {
  const start = (this.permissionRoleCurrentPage - 1) * this.permissionRoleItemsPerPage;
  const end = start + this.permissionRoleItemsPerPage;

  this.pagedPermissionRoles = this.roles.slice(start, end);
  this.permissionRoleStartItem = start + 1;
  this.permissionRoleEndItem = Math.min(end, this.permissionRoleTotalItems);
}

onPermissionRolePageSizeChange() {
  this.permissionRoleCurrentPage = 1;
  this.updatePagedPermissionRoles();
}

nextPermissionRolePage() {
  if (this.permissionRoleEndItem < this.permissionRoleTotalItems) {
    this.permissionRoleCurrentPage++;
    this.updatePagedPermissionRoles();
  }
}

prevPermissionRolePage() {
  if (this.permissionRoleCurrentPage > 1) {
    this.permissionRoleCurrentPage--;
    this.updatePagedPermissionRoles();
  }
}

}
