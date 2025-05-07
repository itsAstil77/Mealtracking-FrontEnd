import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // private apiUrl = 'http://172.16.100.66:5221/api/Dashboard'; // Base URL

  constructor(private http: HttpClient) {}

  deleteDashboard(dashboardId: string): Observable<any> {
    const url = `http://172.16.100.66:5221/api/Dashboard/${dashboardId}`;  // API URL
    return this.http.delete(url);  // Make DELETE request to the API
  }
  
}
