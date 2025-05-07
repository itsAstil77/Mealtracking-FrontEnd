import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventEmitter } from 'node:stream';
import { AddEmployeeService } from '../../../services/add-employee/add-employee.service';
import { VisitorService } from '../../../services/visitor/visitor.service';
import { SubContractorService } from '../../../services/subcontractor/sub-contractor.service';
import { DropdownProjectService } from '../../../services/dropdown-project/dropdown-project.service';
import { AlertService } from '../../../services/alert/alert.service';



@Component({
  selector: 'app-object',
  standalone:true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './object.component.html',
  styleUrl: './object.component.css',
  providers: [DatePipe]

})
export class ObjectComponent implements OnInit{

  visitors: any[] = [];
  
  subContractors: any[] = [];

  departments: any[] = [];
  companies: any[] = [];
  roles: any[] = [];
  designations: any[] = [];
  locations: any[] = [];
name:any[]=[];

formattedDate: string = '';

ngOnInit() {
  this.fetchSubContractors();
  this.loadEmployees();
  this.loadDropdowns();
  this.loadVisitors();

  this.totalItems = this.employees.length;
  this.updatePagedEmployees();

  

  
}

// loadEmployees() {
//   this.addEmpService.getEmployees().subscribe(
//     (response: any) => {
//       console.log('API Response:', response);
      
      
//       if (response && Array.isArray(response)) {
//         this.employees = response;
//       } else if (response && response.employeeList) {
//         this.employees = response.employeeList;
//       } else {
//         console.warn('Unexpected API response format:', response);
//       }
//     },
//     (error) => {
//       console.error('Error fetching employees:', error);
//     }
//   );
// }


loadEmployees() {
  const clientId = 'c01'; // Change this dynamically if needed

  this.addEmpService.getEmployees(clientId).subscribe(
    (response: any) => {
      console.log('Employee Summary API Response:', response);
     
     

      if (Array.isArray(response)) {
        this.employees = response.reverse(); 
      } else if (response && typeof response === 'object' && response.employeeList) {
        this.employees = response.employeeList; 
      } else {
        console.warn('Unexpected Employee API response:', response);
      }
      this.totalItems = this.employees.length;
      this.currentPage = 1; // reset to first page
      this.updatePagedEmployees(); // ✨ paginate
    },
    (error) => {
      console.error('Error fetching employees:', error);
    }
  );
}








loadDropdowns() {
  this.addEmpService.getDepartments().subscribe(data => {
    console.log("Departments API Response:", data);
    this.departments = data;
  });

  this.addEmpService.getCompanies().subscribe(data => {
    console.log("Companies API Response:", data);
    this.companies = data;
  });

  this.addEmpService.getRoles().subscribe(data => {
    console.log("Roles API Response:", data);
    this.roles = data;
  });

  this.addEmpService.getDesignations().subscribe(data => {
    console.log("Designations API Response:", data);
    this.designations = data;
  });

  this.addEmpService.getLocations().subscribe(data => {
    console.log("Locations API Response:", data);
    this.locations = data;
  });
}




employees: any[] = [];



constructor(private addEmpService: AddEmployeeService,private visitorService: VisitorService,
  private subContractorService: SubContractorService,private http:HttpClient,
  private dropdownService: DropdownProjectService,private alertService:AlertService,
  private datePipe: DatePipe) {} 




// formData :{
//   id:string ;
//   idNumber:  string;
//   firstname:  string;
//   lastname:  string;
//   startDate: string;
//   endDate:  string;
//   phone_no: string;
//   dept:  string;
//   role:  string;
//   designation:  string;
//   imageUrl: string;
//   company:  string;
//   location:  string;
//   referenceid:  string;
//   cardBadgeNumber: string;
//   status:boolean;

// }= {
//   id: '',
//     idNumber: '',
//     firstname: '',
//     lastname: '',
//     startDate: '',
//     endDate: '',
//     phone_no: '',
//     dept: '',
//     role: '',
//     designation: '',
//     imageUrl: '',
//     company: '',
//     location: '',
//     referenceid: '',
//     cardBadgeNumber: '',
//     status: true
// };


// isPopupOpen = false;

// openPopup() {
//   this.isPopupOpen = true;
// }

// closePopup() {
//   this.isPopupOpen = false;
// }



// applyChanges() {

//   const requestData = {
//     id: '',
//       idNumber: this.formData.idNumber,
//       firstname: this.formData.firstname,
//       lastname: this.formData.lastname,
//       startDate: this.formData.startDate,
//       endDate: this.formData.endDate,
//       phone_no: this.formData.phone_no,
//       dept: this.formData.dept,
//       role: this.formData.role,
//       designation:this.formData.designation,
//       imageUrl:this.formData.imageUrl,
//       company: this.formData.company,
//       location:this.formData.location,
//       referenceid:this.formData.referenceid,
//       cardBadgeNumber: this.formData.cardBadgeNumber,
//       status: !!this.formData.status 
//   };

//   this.addEmpService.addEmployee(requestData).subscribe(
//     (response: any) => {
//       console.log('✅ Employee added successfully:', response);
//       alert(response.message || '✅ Employee added successfully!');
    
//       this.closePopup();
    
      
//       this.loadEmployees(); 
//     },
//     (error) => {
//       console.error('❌ API Error:', error);
//       alert('❌ Failed to add employee! Check console.');
//     }
//   );
// }



formData: {
  id: string;
  idNumber: string;
  firstname: string;
  lastname: string;
  email:string;
  startDate: string;
  endDate: string;
  phone_no: string;
  dept: string;
  role: string;
  designation: string;
  imageUrl: string;
  company: string;
  location: string;
  referenceid: string;
  cardBadgeNumber: string;
  status: boolean;
} = {
  id: '',
  idNumber: '',
  firstname: '',
  lastname: '',
  email:'',
  startDate: '',
  endDate: '',
  phone_no: '',
  dept: '',
  role: '',
  designation: '',
  imageUrl: '',
  company: '',
  location: '',
  referenceid: '',
  cardBadgeNumber: '',
  status: true
};

isPopupOpen = false;

openPopup() {
  this.formData = {
    id: '',
    idNumber: '',
    firstname: '',
    lastname: '',
    email:'',
    startDate: '',
    endDate: '',
    phone_no: '',
    dept: '',
    role: '',
    designation: '',
    imageUrl: '',
    company: '',
    location: '',
    referenceid: '',
    cardBadgeNumber: '',
    status: true
  };
  this.isPopupOpen = true;
}

closePopup() {
  this.isPopupOpen = false;
}



applyChanges() {
  const requestData = {
    id: '',
    idNumber: this.formData.idNumber,
    firstname: this.formData.firstname,
    lastname: this.formData.lastname,
    email:this.formData.email,
    startDate: this.formData.startDate,
    endDate: this.formData.endDate,
    phone_no: this.formData.phone_no,
    dept: this.formData.dept,
    role: this.formData.role,
    designation: this.formData.designation,
    imageUrl: this.formData.imageUrl,
    company: this.formData.company,
    location: this.formData.location,
    referenceid: this.formData.referenceid,
    cardBadgeNumber: this.formData.cardBadgeNumber,
    status: this.formData.status // boolean, not string
  };

  this.addEmpService.addEmployee(requestData).subscribe({
    next: (response) => {
      console.log('✅ Employee added successfully:', response);
      this.alertService.showAlert(response.message || ' Employee added successfully!');
      this.closePopup();
      this.loadEmployees();
    },
    error: (error) => {
      console.error('❌ API Error:', error);
       this.alertService.showAlert(` Failed to add employee: ${error.error.message || 'Something went wrong!'}`,"error");
    }
  });
}






  
// add visitor popup

isEditCompanyPopupVisible: boolean = false; 




  
//  add subcontractor popup 
// isPopupOpen1=false;

// formData1={

//            contractor_name:'',
//            contractor_id:'',
//            companyName:'',
//            project_name:'',
//            address:'',
//            phone_no:'',
//            nationality:'',
//            vehicle_name:'',
//            contractor_image:''

// }

// openPopup1() {
//     this.isPopupOpen1 = true;
//   }
  
//   closePopup1() {
//     this.isPopupOpen1 = false;
//   }
  
//   applyChanges1() {
//     this.closePopup1();
//   }








isEditemp = false;



openEditPopup(employee: any) {
  this.formData = { ...employee }; // pre-fill formData
  this.isEditemp = true;
}

closeEditPopup() {
  this.isEditemp = false;
}

updateEmployee() {
  const requestData = {
    ...this.formData,
    status: !!this.formData.status // ensure boolean
  };

  this.addEmpService.updateEmployee(requestData).subscribe({
    next: (res) => {
      console.log('✅ Employee updated:', res);
      this.alertService.showAlert(res.message || 'Employee updated successfully!');
      this.closeEditPopup();
      this.loadEmployees(); // reload list
    },
    error: (err) => {
      console.error('❌ Update error:', err);
      this.alertService.showAlert(`Failed to update employee: ${err.error.message || 'Something went wrong!'}`,"error");
    }
  });
}




// edit visitor popup

isEditvisitorPopupVisible: boolean = false; 


// isPopupOpensub=false;

// formsub={

//            contractor_name:'',
//            contractor_id:'',
//            companyName:'',
//            project_name:'',
//            address:'',
//            phone_no:'',
//            nationality:'',
//            vehicle_name:'',
//            contractor_image:''

// }

// openPopupsub() {
//     this.isPopupOpensub = true;
//   }
  
//   closePopupsub() {
//     this.isPopupOpensub = false;
//   }
  
//   applyChangessub() {
//     this.closePopupsub();
//   }






// delete popup 

isDeletePopupVisible = false;



showDeletePopup() {
  this.isDeletePopupVisible = true;

}


selectedEmployee: any = null; // Store the selected employee


confirmDelete(emp: any) {
  this.selectedEmployee = emp; // Store selected employee
  this.isDeletePopupVisible = true;
}

// Close delete popup without deleting
hideDeletePopup() {
  this.isDeletePopupVisible = false;
  this.selectedEmployee = null;
}
deleteEmployee() {
  if (!this.selectedEmployee) {
    console.error('❌ No employee selected!');
    this.alertService.showAlert(' Please select an employee to delete.',"error");
    return;
  }

  this.addEmpService.deleteEmployee(this.selectedEmployee.id).subscribe(
    () => {
      console.log('✅ Employee deleted successfully!');
      this.alertService.showAlert(' Employee deleted successfully!');

      // Remove the deleted employee from the list without reloading the page
      this.employees = this.employees.filter(emp => emp.id !== this.selectedEmployee.id);

      this.hideDeletePopup();
      this.loadEmployees();
    },
    (error) => {
      console.error('❌ Failed to delete employee:', error);
      this.alertService.showAlert(' Failed to delete employee!',"error");
    }
  );
}



// toggleStatus(emp: any) {

//   emp.status = emp.status === "active" ? "inactive" : "active";

  
//   this.addEmpService.updateEmployee(emp).subscribe(
//     (response) => {
//       console.log("✅ Status updated successfully:", response);
//     },
//     (error) => {
//       console.error("❌ Error updating status:", error);
//       alert("❌ Failed to update status!");
//     }
//   );
//}




//visitor

visitorForm = {
  visitorName: '',
  id:'',
  role:'',
  idNumber:'',
  email: '',
  startDate: '',
  endDate: '',
  visitorCompany: '',
  contactNo: '',
  remarks:''

};

applyVisitor() {
  this.visitorService.createVisitor(this.visitorForm).subscribe(
    (response: any) => {
      this.alertService.showAlert(response.message); // Success message
      this.closeEditCompanyPopup(); // Close modal
      this.loadVisitors();
      this.visitorForm = {visitorName: '',
        id:'',
        role:'',
        idNumber:'',
        email: '',
        startDate: '',
        endDate: '',
        visitorCompany: '',
        contactNo: '',
        remarks:''
      
      };
    },
    (error) => {
      console.error('Error creating visitor:', error);
      this.alertService.showAlert('Failed to create visitor',"error");
    }
  );
}


loadVisitors() {
  this.visitorService.getVisitors().subscribe(
    (data) => {
      this.visitors = data.reverse(); // Bind response to visitors array
     
      this.visitorTotalItems = this.visitors.length;
      this.currentPage = 1;
      this.updatePagedVisitors();
      
    },
    (error) => {
      console.error('Error fetching visitors:', error);
    }
  );
}

closeEditCompanyPopup() {
  this.isEditCompanyPopupVisible = false;
}

openEditCompanyPopup() {
  this.visitorForm = {
    id:'',
    visitorName: '',
    role:'',
    idNumber:'',
    email: '',
    startDate: '',
    endDate: '',
    visitorCompany: '',
    contactNo: '',
    remarks:''
  };
  this.isEditCompanyPopupVisible = true;
}





openEditvisitorPopup(visitor: any) {
  this.visitorForm = { ...visitor }; // Populate visitorForm with selected visitor details
  this.visitorForm.startDate = this.formatDate(visitor.startDate);
  this.visitorForm.endDate = this.formatDate(visitor.endDate);
  this.isEditvisitorPopupVisible = true;
}

closeEditvisitorPopup() {
  this.isEditvisitorPopupVisible = false;
}

applyEditVisitor() {
  this.visitorService.updateVisitor(this.visitorForm).subscribe(
    (response: any) => {
      this.alertService.showAlert('Visitor updated successfully');
      this.closeEditvisitorPopup();
      
      this.loadVisitors(); // Refresh visitor list
    },
    (error) => {
      console.error('Error updating visitor:', error);
      this.alertService.showAlert('Failed to update visitor',"error");
    }
  );
}


formatDate(dateString: string): string {
  if (!dateString) return ''; // Handle null/undefined case
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD' format
}



onStartDateChange(event: Event) {
  const inputValue = (event.target as HTMLInputElement).value;
  this.formData.startDate = inputValue; // Keep it in the yyyy-mm-dd format
}

// Handle change for end date
onEndDateChange(event: Event) {
  const inputValue = (event.target as HTMLInputElement).value;
  this.formData.endDate = inputValue; // Keep it in the yyyy-mm-dd format
}




isVisitorDeletePopupVisible: boolean = false; 
visitorToDeleteId: string | null = null;

showVisitorDeletePopup(visitorId: string) {
  this.visitorToDeleteId = visitorId;
  this.isVisitorDeletePopupVisible = true;
}

hideVisitorDeletePopup() {
  this.isVisitorDeletePopupVisible = false;
  this.visitorToDeleteId = null;
}

deleteVisitor() {
  if (!this.visitorToDeleteId) {
    this.alertService.showAlert(' No visitor selected!',"error");
    return;
  }

  this.visitorService.deleteVisitor(this.visitorToDeleteId).subscribe(
    (response) => {
      console.log("✅ Visitor deleted successfully:", response);
      this.alertService.showAlert(response.message || " Visitor deleted successfully!");

      this.loadVisitors(); // Refresh visitor list after deletion
      this.hideVisitorDeletePopup(); // Close the modal
    },
    (error) => {
      console.error("❌ Error deleting visitor:", error);
      this.alertService.showAlert(error.error?.message || " Failed to delete visitor. Please try again.","error");
    }
  );
}
//sub
isPopupOpen1 = false;

formData1 = {
  id: '',
  contractorName: '',
  contractorId: '',
  role:'',
  
 companyName: '',
  projectName: '',
  address: '',
  phoneNo: '',
  nationality: '',
  vehicleName: '',
  vehicleId: '',
  imageUrl: ''
 
};


isPopupOpensub: boolean = false;
formsub: any = { 
  id: '', 
  contractorName: '',
   contractorId: '',
  
  companyName: '',
     projectName: '', 
     address: '',
      phoneNo: '', 
     nationality: '', 
     vehicleName: '',
      vehicleId: '',
       imageUrl: '' 
     
    };

openPopup1() {
  console.log('Opening Popup'); 
  this.isPopupOpen1 = true;
}

closePopup1() {
  this.isPopupOpen1 = false;
}

submitSubContractor() {
  this.subContractorService.addSubContractor(this.formData1).subscribe(
    response => {
      console.log('Subcontractor added successfully', response);
      this.alertService.showAlert("Contracter added successfully");

      this.closePopup1();
     this.formData1 = {
        id: '',
        contractorName: '',
        contractorId: '',
        role:'',
      
       companyName: '',
        projectName: '',
        address: '',
        phoneNo: '',
        nationality: '',
        vehicleName: '',
        vehicleId: '',
        imageUrl: ''
        
      };
      this.fetchSubContractors();
    },
    error => {
      console.error('Error adding subcontractor', error);
    }
  );
}

fetchSubContractors() {
  this.subContractorService.getEmployeeSummary().subscribe(
    (data: any[]) => {
      this.subContractors = data.reverse();  // Updated variable name
     

    
      this.subTotalItems = data.length;
      // this.subTotalItems = this.subContractors.length;
      this.subCurrentPage = 1;
      this.updatePagedSubContractors();
    },
    (error) => {
      console.error('Error fetching subcontractors:', error);
    }
  );
}


// Open Edit Subcontractor Popup
openPopupsub(subContractor: any) {
  this.isPopupOpensub = true;
  this.formsub = { ...subContractor };

  this.fetchProjects();
 
  this.fetchCompanies();
}

// Close Edit Subcontractor Popup
closePopupsub() {
  this.isPopupOpensub = false;
}

// Update subcontractor details
applyChangessub() {
  this.subContractorService.updateSubContractor(this.formsub.id, this.formsub).subscribe(
    (response) => {
      this.alertService.showAlert('Contractor updated successfully!');
      this.closePopupsub();
      this.fetchSubContractors();
    },
    (error) => {
      console.error('Error updating subcontractor:', error);
    }
  );
}



isDeletesubPopupVisible:boolean=false;
selectedSubContractorId: string | null = null;

  // New function name for opening delete confirmation popup
  openDeleteConfirmation(subContractorId: string) {
    this.selectedSubContractorId = subContractorId;
    this.isDeletesubPopupVisible = true;
  }

  // Close delete confirmation popup
  closeDeleteConfirmation() {
    this.isDeletesubPopupVisible = false;
    this.selectedSubContractorId = null;
  }


  // Confirm and delete subcontractor
  confirmDeleteSubContractor() {
    if (this.selectedSubContractorId) {
      this.subContractorService.deleteSubContractor(this.selectedSubContractorId).subscribe(
        () => {
          this.alertService.showAlert('Contractor deleted successfully!');
          this.fetchSubContractors(); // Refresh list
        },
        (error) => {
          console.error('Error deleting subcontractor:', error);
        }
      );
    }
    this.closeDeleteConfirmation(); // Close modal after deletion
  }













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




  locationDrop: any[] = [];
selectedLocationId: number | null = null;


loadLocations(): void {
  this.dropdownService.getLocations().subscribe({
    next: (data) => {
      if (data && data.length > 0) {
        this.locationDrop = data;
        console.log("Locations loaded:", this.locationDrop); // ✅ Debugging
      } else {
        console.warn("No locations found!"); // ✅ Handle empty data
      }
    },
    error: (err) => {
      console.error('Error fetching locations:', err);
    }
  });
}









fetchRoles1(callback?: () => void) {
  if (this.roles.length === 0) {
    this.http.get<any[]>('http://172.16.100.66:5221/api/RoleHierarchy/summary').subscribe(response => {
      this.roles = response;
      if (callback) callback();
    });
  } else if (callback) {
    callback();
  }
}




// Function to load locations
loadLocations1(callback?: () => void) {
  if (this.locationDrop.length === 0) { 
    this.http.get<any[]>('http://172.16.100.66:5221/api/locations/location-summary').subscribe({
      next: (response) => {
        this.locationDrop = response;
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error fetching locations:', err);
      }
    });
  } else if (callback) {
    callback();
  }
}



isprojectDropdownOpen:boolean=false;

fetchProjects(): void {
  if (!this.isprojectDropdownOpen) {
    this.http.get<any[]>('http://172.16.100.66:5221/api/projects/project-summary').subscribe(
      (response) => {
        console.log("Fetched projects:", response); // Debugging log
        this.name = response; // Assign the response directly
        this.isprojectDropdownOpen = true; 

  
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  } else {
    this.isprojectDropdownOpen = false; // Close dropdown if already open
  }
}









// companyName:any=[];


// iscompanyDropdownOpen:boolean=false;

// fetchCompany(): void {
//   if (!this.iscompanyDropdownOpen) {
//     this.http.get<any[]>('http://172.16.100.67:5221/api/extras/subcompany-summary').subscribe(
//       (response) => {
//         console.log("Fetched company:", response); // Debugging log
//         this.companyName = response; // Assign the response directly
//         this.iscompanyDropdownOpen = true; // Open dropdown after fetching
//       },
//       (error) => {
//         console.error('Error fetching company:', error);
//       }
//     );
//   } else {
//     this.iscompanyDropdownOpen = false; // Close dropdown if already open
//   }
// }


companyList: any[] = [];
isCompanyDropdownOpen: boolean = false;

fetchCompanies(): void {
  if (!this.isCompanyDropdownOpen) {
    this.http.get<any[]>('http://172.16.100.66:5221/api/extras/subcompany-summary').subscribe(
      (response) => {
        console.log("Fetched companies:", response);
        this.companyList = response;
        this.isCompanyDropdownOpen = true;
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  } else {
    this.isCompanyDropdownOpen = false;
  }
}





// pagedEmployees: any[] = []; 
// currentPage = 1;
// itemsPerPage = 10;
// totalItems = 0;
// pageSizeOptions = [5, 10, 20, 50];

// get startItem() {
//   return (this.currentPage - 1) * this.itemsPerPage + 1;
// }

// get endItem() {
//   return Math.min(this.startItem + this.itemsPerPage - 1, this.totalItems);
// }



// updatePagedEmployees() {
//   const start = (this.currentPage - 1) * this.itemsPerPage;
//   const end = start + this.itemsPerPage;
//   this.pagedEmployees = this.employees.slice(start, end);
// }

// prevPage() {
//   if (this.currentPage > 1) {
//     this.currentPage--;
//     this.updatePagedEmployees();
//   }
// }

// nextPage() {
//   if (this.endItem < this.totalItems) {
//     this.currentPage++;
//     this.updatePagedEmployees();
//   }
// }

// onItemsPerPageChange() {
//   this.currentPage = 1;
//   this.updatePagedEmployees();
// }

       // your data
pagedEmployees: any[] = [];

itemsPerPage: number = 10;
currentPage: number = 1;
totalItems: number = 0;
startItem: number = 0;
endItem: number = 0;
pageSizeOptions: number[] = [5, 10, 20, 50];



fetchEmployees() {
  // After loading employees[]:
  this.totalItems = this.employees.length;
  this.updatePagedEmployees();
}

updatePagedEmployees() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.pagedEmployees = this.employees.slice(start, end);

  this.startItem = start + 1;
  this.endItem = Math.min(end, this.totalItems);
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagedEmployees();
  }
}

nextPage() {
  if (this.endItem < this.totalItems) {
    this.currentPage++;
    this.updatePagedEmployees();
  }
}

onItemsPerPageChange() {
  this.currentPage = 1;
  this.updatePagedEmployees();
}



// Pagination variables

pagedVisitors: any[] = [];

visitorCurrentPage: number = 1;
visitorItemsPerPage: number = 10;
visitorPageSizeOptions: number[] = [5, 10, 20, 50];

visitorTotalItems: number = 0;
visitorStartItem: number = 0;
visitorEndItem: number = 0;

updatePagedVisitors() {
  const start = (this.visitorCurrentPage - 1) * this.visitorItemsPerPage;
  const end = start + this.visitorItemsPerPage;

  this.pagedVisitors = this.visitors.slice(start, end);
  this.visitorStartItem = start + 1;
  this.visitorEndItem = Math.min(end, this.visitorTotalItems);
}

onVisitorItemsPerPageChange() {
  this.visitorCurrentPage = 1;
  this.updatePagedVisitors();
}

nextVisitorPage() {
  if (this.visitorEndItem < this.visitorTotalItems) {
    this.visitorCurrentPage++;
    this.updatePagedVisitors();
  }
}

prevVisitorPage() {
  if (this.visitorCurrentPage > 1) {
    this.visitorCurrentPage--;
    this.updatePagedVisitors();
  }
}





//Pagination variables

pagedSubContractors: any[] = [];

subCurrentPage: number = 1;
subItemsPerPage: number = 10;
subPageSizeOptions: number[] = [5, 10, 20, 50];

subTotalItems: number = 0;
subStartItem: number = 0;
subEndItem: number = 0;


updatePagedSubContractors() {
  const start = (this.subCurrentPage - 1) * this.subItemsPerPage;
  const end = start + this.subItemsPerPage;

  this.pagedSubContractors = this.subContractors.slice(start, end); // Only 'per page' items
  this.subStartItem = start + 1;
  this.subEndItem = Math.min(end, this.subContractors.length); // not totalItems, use actual data
}


onSubItemsPerPageChange() {
  this.subCurrentPage = 1;
 
  this.updatePagedSubContractors();
}

nextSubPage() {
  if (this.subEndItem < this.subTotalItems) {
    this.subCurrentPage++;
    this.updatePagedSubContractors();
  }
}

prevSubPage() {
  if (this.subCurrentPage > 1) {
    this.subCurrentPage--;
    this.updatePagedSubContractors();
  }
}


selectedRole: string = 'Employee';

}




