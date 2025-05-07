import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddEmployeeService {



  private baseUrl = 'http://172.16.100.66:5221/api/employees';
  private extrasUrl = 'http://172.16.100.66:5221/api/extras'; // Base URL for dropdown data

  constructor(private http: HttpClient) {}



   // Add an employee
   addEmployee(employeeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/add-employee`, employeeData, { headers });
  }

  // getEmployees(): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/Employee-Summary`);
  // }


  getEmployees(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Employee-Summary?clientid=${clientId}`);
  }
  


  


// Delete an employee
deleteEmployee(id: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/delete-employee/${id}`);
}

// update employee
updateEmployee(employeeData: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put<any>(
    `${this.baseUrl}/update-employee/${employeeData.id}`, employeeData, { headers });
}



 // Fetch dropdown data
 getDepartments(): Observable<any> {
  return this.http.get<any>(`${this.extrasUrl}/department-summary`);
}

getCompanies(): Observable<any> {
  return this.http.get<any>(`${this.extrasUrl}/company-summary`);
}

getRoles(): Observable<any> {
  return this.http.get<any>(`${this.extrasUrl}/role-summary`);
}

getDesignations(): Observable<any> {
  return this.http.get<any>(`${this.extrasUrl}/designation-summary`);
}

getLocations(): Observable<any> {
  return this.http.get<any>(`${this.extrasUrl}/location-summary`);
}





  
}
