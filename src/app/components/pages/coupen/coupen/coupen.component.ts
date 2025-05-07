import { Component } from '@angular/core';
import { CoupenService } from '../../../services/coupen/coupen.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-coupen',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './coupen.component.html',
  styleUrl: './coupen.component.css'
})
export class CoupenComponent {

  coupons: any[] = [];

  constructor(private coupenService: CoupenService,private alertService:AlertService,private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCoupons();
  }




  
  

  fetchCoupons(): void {
    this.coupenService.getAllCoupons().subscribe({
      next: (data) => {
        this.coupons = data.reverse();
        this.couponTotalItems = this.coupons.length;
        this.couponCurrentPage = 1;
        
        this.applyFilterAndPagination(); // use filtering
        console.log("Coupons fetched:", this.coupons);
        
      },
      error: (err) => {
        console.error("Error fetching coupons:", err);
      }
    });
  }

  refreshCoupons(): void {
    this.fetchCoupons();
  }


  pagedCouponList: any[] = [];

  couponCurrentPage: number = 1;
  couponItemsPerPage: number = 10;
  couponPageSizes: number[] = [5, 10, 20, 50];
  
  couponTotalItems: number = 0;
  couponStartIndex: number = 0;
  couponEndIndex: number = 0;
  

  
  updateCouponPagination() {
    const start = (this.couponCurrentPage - 1) * this.couponItemsPerPage;
    const end = start + this.couponItemsPerPage;
  
    this.pagedCouponList = this.coupons.slice(start, end);
    this.couponStartIndex = start + 1;
    this.couponEndIndex = Math.min(end, this.couponTotalItems);
  }
  
  onCouponPageSizeChange() {
    this.couponCurrentPage = 1;
    // this.updateCouponPagination();
    this.applyFilterAndPagination();
  
  }
  
  goToNextCouponPage() {
    if (this.couponEndIndex < this.couponTotalItems) {
      this.couponCurrentPage++;
      // this.updateCouponPagination();
      this.applyFilterAndPagination();
  
    }
  }
  
  goToPreviousCouponPage() {
    if (this.couponCurrentPage > 1) {
      this.couponCurrentPage--;
      // this.updateCouponPagination();
      this.applyFilterAndPagination();
    
    }
  }
  



  isAddCoupen: boolean = false;
 
  startDate: string = '';
  endDate: string = '';
  count:string='';
  couponCode = '';
  description:string='';
  status:boolean=true;

   // Close Add Report Modal
   closePopup(): void {
    this.isAddCoupen = false;

     // Clear all input fields
  this.description = '';
  this.count = '';
  const today = new Date().toISOString().split('T')[0];
  this.startDate = today;
  this.endDate = today;
  this.status = true;
  this.couponCode = ''; 
    
  }

  openCoupen(): void {
    this.isAddCoupen = true;
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;


    this.http.get<any>('http://172.16.100.66:5221/api/Coupon/next-coupon-code')
    .subscribe({
      next: (res: any) => {
        this.couponCode = res.nextCouponCode; // ✅ FIX: extract the value
      },
      error: (err) => {
        console.error('Failed to fetch coupon code', err);
      }
    });
  
  }


  addCoupen(): void {
    const countNumber = parseInt(this.count, 10);
    if (isNaN(countNumber) || countNumber <= 0) {
      this.alertService.showAlert('Please enter a valid count.',"error");
      return;
    }

    const couponPayload = {
      id: "",
      couponCode: "",
      startDate: new Date(this.startDate).toISOString(),
      endDate: new Date(this.endDate).toISOString(),
      serialCode: "",
      description: this.description,
      status: this.status,
      createdat: new Date().toISOString(),
      createdby: "admin",
      modifiedat: new Date().toISOString(),
      assignedEmployee:"",
      redeemedcanteen: "",
      modifiedby: "",
      redeemstatus: false,
      assignedto: "",
      assignedat:   new Date().toISOString(),
      redeemedat:  new Date().toISOString()
        };

    this.coupenService.generateCoupons(countNumber, couponPayload).subscribe({
      next: (res) => {
        this.alertService.showAlert('Coupons generated successfully!');
       

        this.closePopup();
        this.fetchCoupons();
      },
      error: (err) => {
        console.error(err);
         this.alertService.showAlert('Failed to generate coupons.',"error");
      }
    });
  }




  selectedCouponFilter: string = 'all'; // 'assigned', 'notAssigned', or 'all'

  applyFilterAndPagination(): void {
    // let filteredCoupons = this.coupons;
    let filteredCoupons = [...this.coupons]; // Always work on full list
  
    if (this.selectedCouponFilter === 'assigned') {
      filteredCoupons = this.coupons.filter(c => c.redeemstatus === true);
    } else if (this.selectedCouponFilter === 'notAssigned') {
      filteredCoupons = this.coupons.filter(c => c.redeemstatus === false);
    }

   // Step 2: Apply search filter
  // if (this.searchText && this.searchText.trim()!== '') {
  //   const searchLower = this.searchText.toLowerCase();
  //   filteredCoupons = filteredCoupons.filter(c =>
  //     (c.couponCode && c.couponCode.toLowerCase().includes(searchLower)) ||
  //     (c.description && c.description.toLowerCase().includes(searchLower)) ||
  //     (c.assignedto && c.assignedto.toLowerCase().includes(searchLower)) ||
  //     (c.assignedEmployee && c.assignedEmployee.toLowerCase().includes(searchLower)) ||  //
  //     (c.createdat && c.createdat.toLowerCase().includes(searchLower)) || 
  //     (c.startDate && c.startDate.toLowerCase().includes(searchLower)) || 
  //     (c.endDate && c.endDate.toLowerCase().includes(searchLower))      
  //   );
  // }



  // 2. Apply search filter (even single letter)
  const search = this.searchText.trim().toLowerCase();
  if (search) {
    filteredCoupons = filteredCoupons.filter(c =>
      (c.couponCode?.toLowerCase().includes(search)) ||
      (c.description?.toLowerCase().includes(search)) ||
      (c.assignedto?.toLowerCase().includes(search)) ||
      (c.assignedEmployee?.toLowerCase().includes(search)) ||
      (c.createdat?.toLowerCase().includes(search)) ||
      (c.startDate?.toLowerCase().includes(search)) ||
      (c.endDate?.toLowerCase().includes(search))
    );
  }
  
    this.couponTotalItems = filteredCoupons.length;
  
    const start = (this.couponCurrentPage - 1) * this.couponItemsPerPage;
    const end = start + this.couponItemsPerPage;
  
    this.pagedCouponList = filteredCoupons.slice(start, end);
    this.couponStartIndex = start + 1;
    this.couponEndIndex = Math.min(end, this.couponTotalItems);
  }
  


  searchText: string = '';
}
