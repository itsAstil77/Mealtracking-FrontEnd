import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConCompanyService {
  private baseUrl = 'http://172.16.100.66:5221/api/extras';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/subcompany-summary`);
  }

  addCompany(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-subcompany`, data);
  }

  updateCompany(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-subcompany/${id}`, data);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-subcompany/${id}`);
  }
}
