import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  //   private apiUrl = 'http://172.16.100.67:5221/api/extras/add-company';
  //   private companySummaryUrl = 'http://172.16.100.67:5221/api/extras/company-summary';

  // constructor(private http: HttpClient) {}

  // addCompany(companyData: any): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post<any>(this.apiUrl, companyData, { headers });
  // }



  // getCompanySummary(): Observable<any> {
  //   return this.http.get<any>(this.companySummaryUrl);
  // }


  private baseUrl = 'http://172.16.100.66:5221/api/extras';

  constructor(private http: HttpClient) {}

  // Method to add a new company
  addCompany(companyData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/add-company`, companyData, { headers });
  }

  // Method to retrieve the company summary
  getCompanySummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/company-summary`);
  }

  updateCompany(companyData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.baseUrl}/update-company/${companyData.id}`, companyData, { headers });
  }
  

  deleteCompany(companyId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${this.baseUrl}/delete-company/${companyId}`, { headers });
  }

}
