import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from '../../pages/canteen-configration/canteen-configuration/canteen-configuration.component';
import { Employee } from '../../pages/canteen-configration/canteen-configuration/canteen-configuration.component';



@Injectable({
  providedIn: 'root'
})
export class CoupenService {
  private apiUrl = 'http://172.16.100.66:5221/api/Coupon';

  constructor(private http: HttpClient) {}

  getAllCoupons() {
    return this.http.get<any[]>(this.apiUrl);
  }

  generateCoupons(count: number, couponData: any) {
    const url = `${this.apiUrl}/generate-coupons?count=${count}`;
    return this.http.post(url, couponData);
  }





  getActiveCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiUrl}/active-coupons`);
  }

  assignMultipleCoupons(data: any[]): Observable<any> {
    return this.http.post('http://172.16.100.66:5221/api/Coupon/assign-multiple', data, {
      responseType: 'text' as 'json' // 👈 Fixes the parsing issue
    });
  }
  

  getEmployeesByCanteen(canteenId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `http://172.16.100.66:5221/api/employees/by-canteen-role/${canteenId}`
    );
  }
  
}

