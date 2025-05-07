import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepartmentService } from '../../../services/department/department.service';
import { CompanyService } from '../../../services/company/company.service';
import { RolesaddService } from '../../../services/rolesadd/rolesadd.service';
import { MealConfigService } from '../../../services/meal-config/meal-config.service';
import { HttpClient } from '@angular/common/http';
import { ConCompanyService } from '../../../services/con-company/con-company.service';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-access',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.css'
})
export class AccessComponent implements OnInit{


  companies: any=[];

  departments: any[] = [];

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCompanySummary();
    // this.fetchRoles();
    this.loadMealConfig();
    this.fetchProjects();
    this.getAllCompanies();
   
   
  }


  constructor(private departmentService: DepartmentService,private companyService: CompanyService,
    private route: ActivatedRoute, private roleService: RolesaddService, private router: Router,
    private mealConfigService: MealConfigService,private http: HttpClient,private conCompanyService: ConCompanyService,
    private alertService:AlertService
  ) { }



 
 

// add company

  isPopupOpen = false;
  formData = {
    "id":'',
    "companyName": '',
    "description": ''
  };



  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  applyChanges() {
    this.companyService.addCompany(this.formData).subscribe(
      response => {
        console.log('Company added successfully:', response);
        this.closePopup();
        this.alertService.showAlert("Company created successfully");
        // Optionally, reset the formData here
        this.formData = {id:'', companyName: '', description: '' };
        this.loadCompanySummary()
        
      },
      error => {
        console.error('Error adding company:', error);
      }
    );
  }

    // Method to load the company summary
    loadCompanySummary(): void {
      this.companyService.getCompanySummary().subscribe(
        data => {
          this.companies = data.reverse();
          this.companyTotalItems = this.companies.length;
          this.companyCurrentPage = 1;
          this.updatePagedCompanies();

        },
        error => {
          console.error('Error fetching company summary', error);
        }
      );
    }



 isEditCompanyPopupVisible = false;
selectedCompany: any = {};

openEditCompanyPopup(company: any) {
  this.selectedCompany = { ...company }; // Clone the company object
  this.isEditCompanyPopupVisible = true;
  
}


closeEditCompanyPopup() {
  this.isEditCompanyPopupVisible = false;
}

applyEditChanges() {
  this.companyService.updateCompany(this.selectedCompany).subscribe(
    response => {
      console.log('Company updated successfully:', response);
      this.closeEditCompanyPopup();
      this.alertService.showAlert("company updated successfully");
      this.loadCompanySummary()
    },
    error => {
      console.error('Error updating company:', error);
    }
  );
}

isDeletePopupVisible = false;
companyToDelete: any = null;
company: any = {};


 // Method to show the delete confirmation popup
 showDeletePopup(company: any): void {
  this.companyToDelete = company;
  this.isDeletePopupVisible = true;
}

// Method to hide the delete confirmation popup
hideDeletePopup(): void {
  this.isDeletePopupVisible = false;
  this.companyToDelete = null;
}

// Method to confirm deletion
confirmDelete(): void {
  if (this.companyToDelete) {
    this.companyService.deleteCompany(this.companyToDelete.id).subscribe(
      response => {
        console.log('Company deleted successfully:', response);
        this.alertService.showAlert("company deleted successfullly");
        this.hideDeletePopup();

        this.loadCompanySummary(); // Refresh the company list
      },
      error => {
        console.error('Error deleting company:', error);
      }
    );
  }
}

// add department



  isDepartmentPopupVisible = false;
  departmentData = {
    
    departmentName: '',
    description: ''
  };

  

  showDepartmentPopup() {
    this.isDepartmentPopupVisible = true;
  }

  hideDepartmentPopup() {
    this.isDepartmentPopupVisible = false;
  }

  submitDepartmentForm() {
    this.departmentService.addDepartment(this.departmentData).subscribe(
      response => {
        console.log('Department added successfully:', response);
        this.alertService.showAlert("Department added successfully");
        this.hideDepartmentPopup();
        
        this.loadDepartments();
      },
      error => {
        console.error('Error adding department:', error);
      }
    );
  }
  loadDepartments(): void {
    this.departmentService.getDepartmentSummary().subscribe({
      next: (data) => {
        this.departments = data.reverse();
        this.departmentTotalItems = this.departments.length;
this.departmentCurrentPage = 1;
this.updatePagedDepartments();

      },
      error: (error) => {
        console.error('Error fetching department summary:', error);
      }
    });
  }


    isEditDepartmentPopupOpen: boolean = false; 
    departmentFormData: any = {};



    showEditDepartmentPopup(department: any): void {
      this.departmentFormData = { ...department };
      this.isEditDepartmentPopupOpen = true;
    }
    
    // Hide the edit department popup
    hideEditDepartmentPopup(): void {
      this.isEditDepartmentPopupOpen = false;
      this.departmentFormData = {};
    }
    
    // Apply changes to the department
    applyDepartmentChanges(): void {
      if (this.departmentFormData.id) {
        // Update existing department
        this.departmentService.updateDepartment(this.departmentFormData.id, this.departmentFormData).subscribe(
          (response) => {
            console.log('Department updated successfully:', response);
            this.alertService.showAlert("department updated successfullly");
            this.loadDepartments(); // Refresh the department list
            this.hideEditDepartmentPopup();
          },
          (error) => {
            console.error('Error updating department:', error);
          }
        );
      } else {
        // Handle the case where department ID is missing
        console.error('Department ID is missing.');
      }
    }
     


    isDeleteDepartmentPopupVisible = false;
    departmentToDelete: any={};
     


    showDeleteDepartmentPopup(department: any) {
      this.departmentToDelete = department;
      this.isDeleteDepartmentPopupVisible = true;
    }
    

    // Function to hide the delete confirmation popup
    hideDeleteDepartmentPopup() {
      this.isDeleteDepartmentPopupVisible = false;
      this.departmentToDelete = null;
    }
    

   // Function to confirm deletion
   confirmDepartmentDelete() {
    if (this.departmentToDelete) {
      this.departmentService.deleteDepartment(this.departmentToDelete.id).subscribe(
        response => {
          console.log('Department deleted successfully:', response);
          this.alertService.showAlert("department deleted successfullly");
          this.hideDeleteDepartmentPopup();
          this.loadDepartments(); // Refresh the department list
        },
        error => {
          console.error('Error deleting department:', error);
        }
      );
    }
  }
  
    // Define formData for department
    // departmentFormData: { departmentName: string; description: string } = {
    //   departmentName: '',
    //   description: ''
    // };
  
    // Open Edit Department Popup
    // showEditDepartmentPopup(department: any) {
    //   this.departmentFormData = { departmentName: '', description: '' }; // Reset fields
    //   this.isEditDepartmentPopupOpen = true;
    // }
  
    // Close Edit Department Popup
    // hideEditDepartmentPopup() {
    //   this.isEditDepartmentPopupOpen = false;
    // }
  
    // Apply changes (placeholder)
    // applyDepartmentChanges() {
    //   console.log('Department changes applied:', this.departmentFormData);
    // }



    roles: any = {}; // Store the role details

   
  
    // fetchRoles() {
    //   this.roleService.getRoles().subscribe(
    //     (response) => {
    //       this.roles = response;
    //     },
    //     (error) => {
    //       console.error('Error fetching roles:', error);
    //     }
    //   );
    // }
  
    editRole(roleId: string) {
      this.router.navigate(['/rolesedit'], { queryParams: { roleId } });
    }

  //   isMealAdd: boolean = true;
  // showDropdown: string | null = null;
  // dropdownMode: string = 'hours';

  // mealData = {
  //   mealType: '',
  //   startTime: '00:00:00',
  //   endTime: '00:00:00',
  //   status: false,
  // };

  // hours: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  // minutes: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  // seconds: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // toggleDropdown(field: string) {
  //   this.showDropdown = this.showDropdown === field ? null : field;
  // }

  // setDropdownMode(mode: string) {
  //   this.dropdownMode = mode;
  // }
  // selectTime(value: string, field: 'start' | 'end', mode: 'hours' | 'minutes' | 'seconds') {
  //   if (field === 'start') {
  //     const timeParts = this.mealData.startTime.split(':');
  //     if (mode === 'hours') timeParts[0] = value;
  //     if (mode === 'minutes') timeParts[1] = value;
  //     if (mode === 'seconds') timeParts[2] = value;
  //     this.mealData.startTime = timeParts.join(':');
  //   } else if (field === 'end') {
  //     const timeParts = this.mealData.endTime.split(':');
  //     if (mode === 'hours') timeParts[0] = value;
  //     if (mode === 'minutes') timeParts[1] = value;
  //     if (mode === 'seconds') timeParts[2] = value;
  //     this.mealData.endTime = timeParts.join(':');
  //   }
  //   this.showDropdown = null;
  // }
  

  // submitMealForm() {
  //   console.log('Meal Data Submitted:', this.mealData);
  // }

  // closeModal() {
  //   this.isMealAdd = false;
  // }
  // openMealModal() {
  //   this.isMealAdd = true; // Open modal
  // }



  // isMealAdd: boolean = false;

  // mealData: {
  //   mealType: string;
  //   startTime: string;
  //   endTime: string;
  //   status: boolean;
  // } = {
  //   mealType: '',
  //   startTime: 'HH:MM:SS',
  //   endTime: 'HH:MM:SS',
  //   status: false
  // };
  
  // clearPlaceholder(field: 'startTime' | 'endTime') {
  //   if (this.mealData[field] === 'HH:MM:SS') {
  //     this.mealData[field] = '';
  //   }
  // }
  
  // restorePlaceholder(field: 'startTime' | 'endTime') {
  //   if (!this.mealData[field]) {
  //     this.mealData[field] = 'HH:MM:SS';
  //   }
  // }
  
  // formatTime(field: 'startTime' | 'endTime') {
  //   let time = this.mealData[field];
  
   
  //   time = time.replace(/[^0-9:]/g, '');
  
   
  //   let timeParts = time.split(':').map(part => part.padStart(2, '0').slice(0, 2));
  

  //   let hours = Math.min(23, Math.max(0, parseInt(timeParts[0] || '0', 10))).toString().padStart(2, '0');
  //   let minutes = Math.min(59, Math.max(0, parseInt(timeParts[1] || '0', 10))).toString().padStart(2, '0');
  //   let seconds = Math.min(59, Math.max(0, parseInt(timeParts[2] || '0', 10))).toString().padStart(2, '0');
  

  //   this.mealData[field] = `${hours}:${minutes}:${seconds}`;
  // }
  
  

  // submitMealForm() {
  //   console.log('Meal Data Submitted:', this.mealData);
  // }

  // closeModal() {
  //   this.isMealAdd = false;
  // }

  // openMealModal() {
  //   this.isMealAdd = true; 
  // }


//meal 

  isMealAdd: boolean = false;
  mealConfigList: any[] = [];

  mealData: {
    id:string;
    mealType: string;
    description:string;
    startTime: string;
    endTime: string;
    isActive: boolean;
  } = {
    id:'',
    mealType: '',
    description:'',
    startTime: 'HH:MM:SS',
    endTime: 'HH:MM:SS',
    isActive: false
  };




 
 
  submitMealForm() {
    const requestData = {
      id: "",
      mealType: this.mealData.mealType,
      description:this.mealData.description,
      startTime: this.mealData.startTime,
      endTime: this.mealData.endTime,
      isActive: this.mealData.isActive // Ensure this is a boolean
    };
  
    this.mealConfigService.addMealConfig(requestData).subscribe({
      next: (response) => {
        console.log('Meal Added:', response);
        this.alertService.showAlert(response.message);
        this.closeModal();
   
        this.loadMealConfig(); // Refresh meal list after adding
      },
      error: (error) => {
        console.error('Error Adding Meal:', error);
        this.alertService.showAlert(`Failed to add meal: ${error.error.message || 'Invalid request'}`,"error");
      }
    });
  }
  

  closeModal() {
    this.isMealAdd = false;
  }

  openMealModal() {
    this.mealData = {
      id: '',  // Reset ID for adding a new meal
      mealType: '',
      description:'',
      startTime: 'HH:MM:SS',
      endTime: 'HH:MM:SS',
      isActive: false
    };
    this.isMealAdd = true;
  
  }



  clearSection(field: 'startTime' | 'endTime', position: number, event: any) {
    let timeParts = this.mealData[field].split(':');
  
    if (timeParts.length !== 3) {
      this.mealData[field] = 'HH:MM:SS';
      return;
    }
  
    // Clear only the clicked section if it's the default placeholder
    if (position === 0 && timeParts[0] === 'HH') timeParts[0] = ''; // Clear HH
    else if (position === 1 && timeParts[1] === 'MM') timeParts[1] = ''; // Clear MM
    else if (position === 2 && timeParts[2] === 'SS') timeParts[2] = ''; // Clear SS
  
    this.mealData[field] = timeParts.join(':');
  
    // Wait for DOM update and move cursor to the correct position
    setTimeout(() => {
      const input = event.target;
      input.setSelectionRange(position * 3, position * 3);
    });
  }
  
  getClickPosition(event: any): number {
    const caretPos = event.target.selectionStart;
  
    if (caretPos <= 2) return 0; // HH
    if (caretPos > 2 && caretPos <= 5) return 1; // MM
    return 2; // SS
  }
  
  
  

  isMealEdit: boolean = false;
 
  meals: any[] = [];





  openEditModal(meal: any) {
    this.isMealEdit = true;
    this.mealData = { ...meal }; 
  }

  closeEditModal() {
    this.isMealEdit = false;
  }

  updateMeal() {
    this.mealConfigService.updateMealConfig(this.mealData.id, this.mealData).subscribe(
      response => {
        console.log('Meal updated successfully:', response);
        this.alertService.showAlert("meal updated successfully");
        this.closeEditModal();
        this.loadMealConfig();
      },
      error => {
        console.error('Error updating meal:', error);
      }
    );
  }


  isDelMeal: boolean = false;
deleteMealId: string = '';

showDeleteMealPopup(id: string) {
  this.deleteMealId = id; 
  this.isDelMeal = true;  
}

hideMeal() {
  this.isDelMeal = false;  
  this.deleteMealId = '';  
}

delMeal() {
  if (this.deleteMealId) {
    this.mealConfigService.deleteMealConfig(this.deleteMealId).subscribe({
      next: (response) => {
        console.log('Meal deleted successfully:', response);
        this.alertService.showAlert("deleted successfully");
        this.isDelMeal = false;
        this.deleteMealId = ''; 
        this.hideMeal();
        this.loadMealConfig();
      },
      error: (error) => {
        console.error('Error deleting meal:', error);
      }
    });
  }
}
  



  mealConfig: any[] = []; 



  loadMealConfig() {
    this.mealConfigService.getMealConfig().subscribe(
      (data) => {
        this.mealConfig = data.reverse();
        this.mealTotalItems = this.mealConfig.length;
this.mealCurrentPage = 1;
this.updatePagedMeals();

      },
      (error) => {
        console.error('Error fetching meal config:', error);
      }
    );
  }



  private apiUrl = 'http://172.16.100.66:5221/api/projects'; // API base URL
  projects: any[] = [];

  fetchProjects(): void {
    this.http.get<any[]>(`${this.apiUrl}/project-summary`)
      .subscribe({
        next: (response) => {
          console.log("Fetched projects:", response);
          this.projects = response.reverse();
          this.projectTotalItems = this.projects.length;
this.projectCurrentPage = 1;
this.updatePagedProjects();

        },
        error: (error) => {
          console.error("Error fetching projects:", error);
        
        }
      });
  }
  isProjectPopupOpen = false;
  projectName: string = '';
projectDescription: string = '';


  // Open the "Add Project" popup
  openProjectPopup(): void {
    this.isProjectPopupOpen = true;
  }

   // Close the "Add Project" popup
   closeProject(): void {
    this.isProjectPopupOpen = false;
    this.projectName = ''; // Reset input fields
    this.projectDescription = '';
  }

  addProject(): void {
    console.log("Project Name:", this.projectName);
    console.log("Project Description:", this.projectDescription);
  
    if (!this.projectName.trim() || !this.projectDescription.trim()) {
      this.alertService.showAlert("Please enter project name and description.","error");
      return;
    }
  
    const newProject = {
      name: this.projectName,
      description: this.projectDescription
    };
  
    this.http.post(`${this.apiUrl}/add-project`, newProject).subscribe({
      next: (response) => {
        console.log("Project added successfully:", response);
        this.alertService.showAlert("Project added successfully!");
        this.closeProject(); // Close modal
        this.fetchProjects(); // Refresh list
      },
      error: (error) => {
        console.error("Error adding project:", error);
        this.alertService.showAlert("Failed to add project.","error");
      }
    });
  }


  isProUpOpen: boolean = false;  // Controls popup visibility
  updatedProjectName: string = '';
  updatedProjectDescription: string = '';
  selectedProjectId: string = '';
  

  openUpdateProject(project: any): void {
    this.selectedProjectId = project.id;
    this.updatedProjectName = project.name;
    this.updatedProjectDescription = project.description;
    this.isProUpOpen = true;
  }
  

  updateProject(): void {
    if (!this.updatedProjectName.trim() || !this.updatedProjectDescription.trim()) {
      this.alertService.showAlert("Please enter project name and description.","error");
      return;
    }

    const updatedProject = {
      id: this.selectedProjectId,
      name: this.updatedProjectName,
      description: this.updatedProjectDescription
    };

    this.http.put(`${this.apiUrl}/update-project/${this.selectedProjectId}`, updatedProject)
      .subscribe({
        next: (response) => {
          console.log("Project updated successfully:", response);
          this.alertService.showAlert("Project updated successfully!");

          this.closeUpdateProject(); // Close modal
          this.fetchProjects(); // Refresh project list
        },
        error: (error) => {
          console.error("Error updating project:", error);
          this.alertService.showAlert("Failed to update project.","error");
        }
      });
  }

  closeUpdateProject(): void {
    this.isProUpOpen = false;
    this.selectedProjectId = '';
    this.updatedProjectName = '';
    this.updatedProjectDescription = '';
  }


  isDeletePopupProVisible: boolean = false; // Controls delete popup visibility
  // Open Delete Confirmation Popup
  openDeleteProjectPopup(projectId: string): void {
    this.selectedProjectId = projectId;
    this.isDeletePopupProVisible = true;
  }

  // Confirm and Delete Project
  confirmProjectDelete(): void {
    if (!this.selectedProjectId) {
      this.alertService.showAlert("No project selected for deletion.","error");
      return;
    }

    this.http.delete(`${this.apiUrl}/delete-project/${this.selectedProjectId}`)
      .subscribe({
        next: () => {
          this.alertService.showAlert("Project deleted successfully!");
          this.isDeletePopupProVisible = false;
          this.fetchProjects(); // Refresh project list
        },
        error: (error) => {
          console.error("Error deleting project:", error);
          this.alertService.showAlert("Failed to delete project.","error");
        }
      });
  }

  // Hide Delete Confirmation Popup
  hideProjectDeletePopup(): void {
    this.isDeletePopupProVisible = false;
    this.selectedProjectId = '';
  }


  concompanies: any[] = [];
  formCon: any = {
    id: '',
    subcompany: '',
    description: ''
  };

  isAddModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  deleteId: string = '';



  getAllCompanies() {
    this.conCompanyService.getCompanies().subscribe((res: any) => {
      this.concompanies = res.reverse();
      this.conCompanyTotalItems = this.concompanies.length;
this.conCompanyCurrentPage = 1;
this.updateConCompanyPagination();

    });
  }

  // Add Modal
  openCompanyAddModal() {
    this.formCon = {
      id: '',
      subcompany: '',
      description: ''
    };
    this.isAddModalOpen = true;
  }

  // Edit Modal
  openCompanyEditModal(company: any) {
    this.formCon = {
      id: company.id,
      subcompany: company.subcompany,
      description: company.description
    };
    this.isEditModalOpen = true;
  }

  // Delete Modal
  openCompanyDeleteModal(id: string) {
    this.deleteId = id;
    this.isDeleteModalOpen = true;
  }

  // Close all modals
  closeCompanyModals() {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.formCon = {
      id: '',
      subcompany: '',
      description: ''
    };
    this.deleteId = '';
  }

  // Create / Update
  submitCompanyForm() {
    if (this.formCon.id) {
      // Update
      this.conCompanyService.updateCompany(this.formCon.id, this.formCon).subscribe(() => {
        this.alertService.showAlert('Contractor company updated successfully!')
        this.getAllCompanies();
        this.closeCompanyModals();
      });
    } else {
      // Add
      this.conCompanyService.addCompany(this.formCon).subscribe(() => {
        this.alertService.showAlert('Contractor company added successfully!');
        this.getAllCompanies();
        this.closeCompanyModals();
      });
    }
  }

  // Delete
  confirmCompanyDelete() {
    this.conCompanyService.deleteCompany(this.deleteId).subscribe(() => {
      this.alertService.showAlert('Contractor company deleted successfully!');
      this.getAllCompanies();
      this.closeCompanyModals();
    });
  }


  pagedCompanies: any[] = [];

  companyCurrentPage: number = 1;
  companyItemsPerPage: number = 10;
  companyPageSizeOptions: number[] = [5, 10, 20, 50];
  
  companyTotalItems: number = 0;
  companyStartItem: number = 0;
  companyEndItem: number = 0;
  
updatePagedCompanies() {
  const start = (this.companyCurrentPage - 1) * this.companyItemsPerPage;
  const end = start + this.companyItemsPerPage;

  this.pagedCompanies = this.companies.slice(start, end);
  this.companyStartItem = start + 1;
  this.companyEndItem = Math.min(end, this.companyTotalItems);
}

onCompanyItemsPerPageChange() {
  this.companyCurrentPage = 1;
  this.updatePagedCompanies();
}

nextCompanyPage() {
  if (this.companyEndItem < this.companyTotalItems) {
    this.companyCurrentPage++;
    this.updatePagedCompanies();
  }
}

prevCompanyPage() {
  if (this.companyCurrentPage > 1) {
    this.companyCurrentPage--;
    this.updatePagedCompanies();
  }
}



pagedDepartments: any[] = [];

departmentCurrentPage: number = 1;
departmentItemsPerPage: number = 10;
departmentPageSizeOptions: number[] = [5, 10, 20, 50];

departmentTotalItems: number = 0;
departmentStartItem: number = 0;
departmentEndItem: number = 0;

updatePagedDepartments() {
  const start = (this.departmentCurrentPage - 1) * this.departmentItemsPerPage;
  const end = start + this.departmentItemsPerPage;

  this.pagedDepartments = this.departments.slice(start, end);
  this.departmentStartItem = start + 1;
  this.departmentEndItem = Math.min(end, this.departmentTotalItems);
}

onDepartmentItemsPerPageChange() {
  this.departmentCurrentPage = 1;
  this.updatePagedDepartments();
}

nextDepartmentPage() {
  if (this.departmentEndItem < this.departmentTotalItems) {
    this.departmentCurrentPage++;
    this.updatePagedDepartments();
  }
}

prevDepartmentPage() {
  if (this.departmentCurrentPage > 1) {
    this.departmentCurrentPage--;
    this.updatePagedDepartments();
  }
}



pagedProjects: any[] = [];

projectCurrentPage: number = 1;
projectItemsPerPage: number = 10;
projectPageSizeOptions: number[] = [5, 10, 20, 50];

projectTotalItems: number = 0;
projectStartItem: number = 0;
projectEndItem: number = 0;

updatePagedProjects() {
  const start = (this.projectCurrentPage - 1) * this.projectItemsPerPage;
  const end = start + this.projectItemsPerPage;

  this.pagedProjects = this.projects.slice(start, end);
  this.projectStartItem = start + 1;
  this.projectEndItem = Math.min(end, this.projectTotalItems);
}

onProjectItemsPerPageChange() {
  this.projectCurrentPage = 1;
  this.updatePagedProjects();
}

nextProjectPage() {
  if (this.projectEndItem < this.projectTotalItems) {
    this.projectCurrentPage++;
    this.updatePagedProjects();
  }
}

prevProjectPage() {
  if (this.projectCurrentPage > 1) {
    this.projectCurrentPage--;
    this.updatePagedProjects();
  }
}




pagedMeals: any[] = [];

mealCurrentPage: number = 1;
mealItemsPerPage: number = 10;
mealPageSizeOptions: number[] = [5, 10, 20, 50];

mealTotalItems: number = 0;
mealStartItem: number = 0;
mealEndItem: number = 0;

updatePagedMeals() {
  const start = (this.mealCurrentPage - 1) * this.mealItemsPerPage;
  const end = start + this.mealItemsPerPage;

  this.pagedMeals = this.mealConfig.slice(start, end);
  this.mealStartItem = start + 1;
  this.mealEndItem = Math.min(end, this.mealTotalItems);
}

onMealItemsPerPageChange() {
  this.mealCurrentPage = 1;
  this.updatePagedMeals();
}

nextMealPage() {
  if (this.mealEndItem < this.mealTotalItems) {
    this.mealCurrentPage++;
    this.updatePagedMeals();
  }
}

prevMealPage() {
  if (this.mealCurrentPage > 1) {
    this.mealCurrentPage--;
    this.updatePagedMeals();
  }
}



pagedConCompanyList: any[] = [];

conCompanyCurrentPage: number = 1;
conCompanyItemsPerPage: number = 10;
conCompanyPageSizes: number[] = [5, 10, 20, 50];

conCompanyTotalItems: number = 0;
conCompanyStartIndex: number = 0;
conCompanyEndIndex: number = 0;

updateConCompanyPagination() {
  const start = (this.conCompanyCurrentPage - 1) * this.conCompanyItemsPerPage;
  const end = start + this.conCompanyItemsPerPage;

  this.pagedConCompanyList = this.concompanies.slice(start, end);
  this.conCompanyStartIndex = start + 1;
  this.conCompanyEndIndex = Math.min(end, this.conCompanyTotalItems);
}

onConCompanyPageSizeChange() {
  this.conCompanyCurrentPage = 1;
  this.updateConCompanyPagination();
}

goToNextConCompanyPage() {
  if (this.conCompanyEndIndex < this.conCompanyTotalItems) {
    this.conCompanyCurrentPage++;
    this.updateConCompanyPagination();
  }
}

goToPreviousConCompanyPage() {
  if (this.conCompanyCurrentPage > 1) {
    this.conCompanyCurrentPage--;
    this.updateConCompanyPagination();
  }
}

selectedRole: string = 'Company'; 

  }
  



  
  
  
  