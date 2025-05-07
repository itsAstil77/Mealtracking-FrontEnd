import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-user-management',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent  implements OnInit {
   

  constructor(private userService: UserService,private http: HttpClient,private alertService:AlertService) {}


  ngOnInit(): void {
    this.loadUsers();
  }


  users: any[] = [];
  isAddUserPopupOpen: boolean = false;
  isEditUserPopupOpen: boolean = false;
  isDeletePopupOpen: boolean = false;
  selectedUser: any = {};
 
  newUser: any = {
    username: '',
    password: '',
    ConfirmPassword: '',
    email: '',
    contactNo: '',
    roleName: ''
  };
  


  

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.reverse(); 
        this.userTotalItems = this.users.length;
        this.userCurrentPage = 1;
this.updatePagedUsers();

      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }


    
    openAddUserPopup(): void {
      this.isAddUserPopupOpen = true;
    }
  

    closeAddUserPopup(): void {
      this.isAddUserPopupOpen = false;
    }
  




    saveUser(): void {
      if (!this.newUser.roleName) {
        this.alertService.showAlert("Please select a role before saving.","error");
        return;
      }
    
      const userPayload = {
        username: this.newUser.username,
        password: this.newUser.password,
        ConfirmPassword: this.newUser.ConfirmPassword,
        email: this.newUser.email,
        contactNo: this.newUser.contactNo,
       
        roleName: this.newUser.roleName // Ensure roleName is correctly set from dropdown
      };
    
      console.log("Payload Sent to API:", JSON.stringify(userPayload, null, 2));
    
      this.userService.addUser(userPayload).subscribe(
        (response) => {
          console.log("User added successfully:", response);
          this.loadUsers(); 
          this.closeAddUserPopup();
          this.alertService.showAlert("User created successfully");
        },
        (error) => {
          console.error("Error adding user:", error);
          if (error.error) {
            console.error("API Validation Errors:", error.error.errors);
            this.alertService.showAlert("API Error: " + JSON.stringify(error.error.errors),"error");
          }
        }
      );
    }
    




    


      
  openDeletePopup(user: any): void {
    this.selectedUser = user;
    this.isDeletePopupOpen = true;
  }

  
  closeDeletePopup(): void {
    this.isDeletePopupOpen = false;
  }

  
  deleteUser(): void {
    this.userService.deleteUser(this.selectedUser.id).subscribe(
      () => {
        this.loadUsers();
       
        this.closeDeletePopup();
        this.alertService.showAlert("user deleted successfully");
       
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  // openEditUserPopup(user: any): void {
  //   this.selectedUser = { ...user }; // Password comes from API
  //   this.isEditUserPopupOpen = true;
  // }

  openEditUserPopup(user: any): void {
    this.selectedUser = { ...user }; 
    this.isEditUserPopupOpen = true;
    this.fetchRoles(); // Ensure roles are loaded when editing
  }
  
  
  



  closeEditUserPopup(): void {
    this.isEditUserPopupOpen = false;
  }
  
  updateUser(): void {
    if (!this.selectedUser.id) {
      console.error('User ID is missing');
      return;
    }

    this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
      () => {
        this.loadUsers(); 
        this.closeEditUserPopup();
        this.alertService.showAlert("user updated successfully");
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  roles: any[] = [];
  isRoleDropdownOpen: boolean = false;
  fetchRoles(): void {
    if (!this.isRoleDropdownOpen) {
      this.http.get<any[]>('http://172.16.100.66:5221/api/RoleHierarchy/summary').subscribe(
        (response) => {
          this.roles = response;
          this.isRoleDropdownOpen = true; // Open dropdown after fetching
        },
        (error) => {
          console.error('Error fetching roles:', error);
        }
      );
    } else {
      this.isRoleDropdownOpen = false; // Close dropdown if already open
    }
  }





  pagedUsers: any[] = [];

userCurrentPage: number = 1;
userItemsPerPage: number = 10;
userPageSizeOptions: number[] = [5, 10, 20, 50];

userTotalItems: number = 0;
userStartItem: number = 0;
userEndItem: number = 0;

updatePagedUsers() {
  const start = (this.userCurrentPage - 1) * this.userItemsPerPage;
  const end = start + this.userItemsPerPage;

  this.pagedUsers = this.users.slice(start, end); // use your full user list
  this.userStartItem = start + 1;
  this.userEndItem = Math.min(end, this.userTotalItems);
}

onUserItemsPerPageChange() {
  this.userCurrentPage = 1;
  this.updatePagedUsers();
}

nextUserPage() {
  if (this.userEndItem < this.userTotalItems) {
    this.userCurrentPage++;
    this.updatePagedUsers();
  }
}

prevUserPage() {
  if (this.userCurrentPage > 1) {
    this.userCurrentPage--;
    this.updatePagedUsers();
  }
}

}



