import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://172.16.100.66:5221/api/Report';

  constructor(private http: HttpClient) {}

  generateReport(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate`, body);
  }

  getReportSummary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/summary`);
  }


  getReportDetails(reportName: string): Observable<any[]> {
    const url = `${this.baseUrl}/view?reportName=${reportName}`;
    return this.http.get<any[]>(url);
  }

  private conUrl = 'http://172.16.100.66:5221/api/consolidated-reports';

  getConReportDetails(reportName: string): Observable<any[]> {
    const url = `${this.conUrl}/${reportName}`;
    return this.http.get<any[]>(url);
  }
  getConReportDetails1(reportName: string): Observable<any[]> {
    const url = `${this.conUrl}/${reportName}`;
    return this.http.get<any[]>(url);
  }


}
