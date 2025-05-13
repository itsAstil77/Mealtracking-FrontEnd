import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { RoleaccessService } from '../../../services/role-access/roleaccess.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-roles',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{


  
    constructor(private router: Router, private route: ActivatedRoute,private roleService: RoleaccessService,private http:HttpClient,
      private alertService:AlertService
    ) {} 
    
 


    roleData: any = {
      roleId: '',
      roleName: '',
      allowedModules: {
        dashboard: false,
        events: false,
        processAutomation: false,
        reports: false,
        administration: false
      }
    };
  



  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     const roleId = params['roleId'];
  //     if (roleId) {
  //       this.loadRoleData(roleId);
  //     }
  //   });
  // }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const roleId = params['roleId'];  
      if (roleId) {
        this.loadRoleData(roleId);
        
      }
    });
    this.fetchRoles(); // Fetch roles when the component loads
  }
  

  // loadRoleData(roleId: string) {
  //   this.roleService.getRoles().subscribe(response => {
  //     const role = response.find((r: any) => r.roleId === roleId);
  //     if (role) {
  //       this.roleData = { ...role };
  //     }
  //   });
  // }


  loadRoleData(roleId: string) {
    this.roleService.getRoles().subscribe(response => {
      const role = response.find((r: any) => r.roleId === roleId);
      if (role) {
        this.roleData = { 
          roleId: role.roleId,
          roleName: role.roleName,  // ✅ Set roleName for dropdown
          description: role.description,
          allowedModules: role.allowedModules || { 
            dashboard: false, 
            events: false, 
            processAutomation: false, 
            reports: false, 
            administration: false
          }
        };
  
        // Ensure roles are fetched before assigning the dropdown value
        this.fetchRoles();
      }
    });
  }
  

  
  
  
    togglePermission(module: string) {
      this.roleData.allowedModules[module] = !this.roleData.allowedModules[module];
    }
  
    updateRole() {
      if (!this.roleData.roleId) {
        this.alertService.showAlert('Invalid Role ID',"error");
        return;
      }
      this.roleService.updateRole(this.roleData.roleId, this.roleData).subscribe(
        (response) => {
          this.alertService.showAlert('RoleAccess updated successfully');
          // this.router.navigate(['/roles']);
          this.router.navigate(['/rolesmanagement']);
        },
        (error) => {
          console.error('Update failed', error);
          this.alertService.showAlert('Failed to update role',"error");
        }
      );
    }



    roleDrop: any[] = [];  
    selectedRoleId: string = ''; 
    isLoading: boolean = false;
  
   
  
    
    fetchRoles(): void {
      if (this.roleDrop.length === 0 && !this.isLoading) {  
        this.isLoading = true;
        this.http.get<any[]>('http://172.16.100.66:5221/api/RoleHierarchy/summary').subscribe(
          (response) => {
            this.roleDrop = response || [];
            this.isLoading = false;
            console.log("Roles fetched:", this.roleDrop); 
          },
          (error) => {
            console.error('Error fetching roles:', error);
            this.isLoading = false;
          }
        );
      }
    }
  }
  
  
  
  
  


