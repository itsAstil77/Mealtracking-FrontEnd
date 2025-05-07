import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  // private apiUrl = 'http://172.16.100.67:5221/api/extras/add-department';

  // private summaryUrl = 'http://172.16.100.67:5221/api/extras/department-summary';

  private baseUrl = 'http://172.16.100.66:5221/api/extras';

  constructor(private http: HttpClient) { }

  // addDepartment(departmentData: any): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post<any>(this.apiUrl, departmentData, { headers });
  // }


   // Fetch Department Summary
  //  getDepartmentSummary(): Observable<any> {
  //   return this.http.get<any>(this.summaryUrl);
  // }
    

  addDepartment(departmentData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/add-department`, departmentData, { headers });
  }

    // Fetch department summary
    getDepartmentSummary(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/department-summary`);
    }
  
    // Update an existing department
    updateDepartment(id: number, departmentData: any): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.put<any>(`${this.baseUrl}/update-department/${id}`, departmentData, { headers });
    }
  
    // Delete a department
    // deleteDepartment(id: number): Observable<any> {
    //   return this.http.delete<any>(`${this.baseUrl}/delete-department/${id}`);
    // }
   

    deleteDepartment(id: string): Observable<any> {
      return this.http.delete<any>(`${this.baseUrl}/delete-department/${id}`);
    }
    

    }



