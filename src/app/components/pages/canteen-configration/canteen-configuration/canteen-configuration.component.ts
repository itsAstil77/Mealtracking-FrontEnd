import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project/project.service';
import { Router, RouterModule } from '@angular/router';
import { CoupenService } from '../../../services/coupen/coupen.service';
import { AddEmployeeService } from '../../../services/add-employee/add-employee.service';
import { AlertService } from '../../../services/alert/alert.service';
import { HttpClient } from '@angular/common/http';



interface Location {
  id: string;
  name: string;
  expanded?: boolean;
  canteens: Canteen[];
  
}


interface Canteen {
  id: string;
  name: string;

  departments?: Department[];
}



export interface Coupon {
  id: number;
  couponCode: string;
  startDate: string;
  endDate: string;
  createdat: string;
}

export interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  idNumber: string;
  startDate: string;
  endDate: string;
}


interface Department {
  id: string;
  departmentName: string;
  description: string;
}




@Component({
  selector: 'app-canteen-configuration',
  imports: [CommonModule,RouterModule],
  templateUrl: './canteen-configuration.component.html',
  styleUrl: './canteen-configuration.component.css'
})
export class CanteenConfigurationComponent implements OnInit{


  ngOnInit() {
    this.fetchLocations();
    this.fetchActiveCoupons();
   
  }


  coupons: Coupon[] = [];
  employees: Employee[] = [];


  locations: Location[] = [];
  selectedCanteens: Set<string> = new Set();

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private couponService: CoupenService,
    private alertService:AlertService,
    private http:HttpClient
  ) {}

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




  // selectedCanteenId: string | null = null;

  // selectCanteen(canteen: Canteen) {
  //   if (this.selectedCanteenId === canteen.id) {
  //     // Deselect if same canteen clicked again
  //     this.selectedCanteenId = null;
  //     this.employees = [];
  //   } else {
  //     // Select new canteen
  //     this.selectedCanteenId = canteen.id;
  //     this.employees = [];
  //     this.fetchEmployeesByCanteen(canteen.id);
  //   }
  // }



  selectedCanteenId: string | null = null;
selectedDepartment: string | null = null;


selectCanteen(location: Location, canteen: Canteen) {
  if (this.selectedCanteenId === canteen.id) {
    // Deselect
    this.selectedCanteenId = null;
    canteen.departments = [];
    return;
  }

  this.selectedCanteenId = canteen.id;


  this.http.get<Department[]>('http://172.16.100.66:5221/api/extras/department-summary')
    .subscribe({
      next: (departments) => {
        canteen.departments = departments; // ✅ now it's typed correctly
      },
      error: (err) => {
        console.error('Failed to load departments', err);
      }
    });
}




selectedDepartmentId: string | null = null;

selectDepartment(dept: Department) {
  if (this.selectedDepartmentId === dept.id) {
    // Deselect if same department is clicked
    this.selectedDepartmentId = null;
    this.employees = [];
  } else {
    // Select new department
    this.selectedDepartmentId = dept.id;
    this.employees = []; // Clear old department's employees before fetching new
    this.fetchEmployeesByDepartment(dept.departmentName);
  }
}


fetchEmployeesByDepartment(deptName: string) {
  this.http.get<Employee[]>(`http://172.16.100.66:5221/api/employees/department/${encodeURIComponent(deptName)}`)
    .subscribe(
      employees => {
        this.employees = employees;

        this.employeeMap = {};
        this.employees.forEach(emp => {
          this.employeeMap[emp.id] = `${emp.firstname} ${emp.lastname}`; // 👈 Combines first & last name
        });
        
      },
      error => {
        console.error('Error fetching employees by department:', error);
      }
    );
}

  
  
  fetchActiveCoupons(): void {
    this.couponService.getActiveCoupons().subscribe({
      next: (data) => {
        this.coupons = data;
      },
      error: (err) => {
        console.error('Error fetching active coupons:', err);
      }
    });
  }



  fetchEmployeesByCanteen(canteenId: string): void {
    this.couponService.getEmployeesByCanteen(canteenId).subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error) => {
        console.error(`Error fetching employees for canteen ${canteenId}:`, error);
      }
    );
  }


  selectedEmployeeIds:Set<string> = new Set();


  toggleEmployeeSelection(event: Event, employeeId: string) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
  
    if (isChecked) {
      this.selectedEmployeeIds.add(employeeId);
    } else {
      this.selectedEmployeeIds.delete(employeeId);
    }

    
  }
  

selectedCouponIds: Set<number> = new Set();

onCouponCheckboxChange(event: Event, couponId: number): void {
  const target = event.target as HTMLInputElement;
  const checked = target.checked;

  if (checked) {
    this.selectedCouponIds.add(couponId);
  } else {
    this.selectedCouponIds.delete(couponId);
  }
}




 selectedEmployeeId: string | null = null;



onEmployeeCheckboxChange(employeeId: string): void {
  // Toggle logic: If already selected, uncheck. Otherwise, select new one.
  if (this.selectedEmployeeId === employeeId) {
    this.selectedEmployeeId = null;
  } else {
    this.selectedEmployeeId = employeeId;
  }
}
employeeMap: { [key: string]: string } = {};

  assignCoupons() {
    const currentDate = new Date().toISOString();
    const assignedBy = 'admin'; // 🔁 Replace with real user if available
  
    const payload = [];
  
    for (let couponId of this.selectedCouponIds) {
      for (let employeeId of this.selectedEmployeeIds) {
        const assignedEmployee = this.employeeMap?.[employeeId] || 'Unknown'; // employeeMap should contain { [id]: name }

        payload.push({
          couponId: couponId,
          assignedBy: assignedBy,
          assignedTo: employeeId,
          assignedEmployee: assignedEmployee,
          assignedAt: currentDate,
          redeemStatus: true,
          redeemedCanteen: this.selectedCanteenId
        });
      }
    }
  
    this.couponService.assignMultipleCoupons(payload).subscribe({
      next: (res) => {
        console.log('✅ API success response:', res); 
        this.alertService.showAlert('Coupons assigned successfully!');
        this.router.navigate(['/coupen']);
        this.selectedCouponIds.clear();
        this.selectedEmployeeIds.clear();
        this.selectedCanteenId = null;
        this.fetchActiveCoupons();
      },
      error: (err) => {
        console.error('Error assigning coupons:', err);
      }
    });
  }
  
  
}
