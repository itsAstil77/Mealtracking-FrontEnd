import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsolidatedReportService {

   constructor(private http: HttpClient) {}

    private conUrl = 'http://172.16.100.66:5221/api/consolidated-reports/reportName';
  
    getConReportDetails(reportName: string): Observable<any[]> {
      const url = `${this.conUrl}/${reportName}`;
      return this.http.get<any[]>(url);
    }
    
}
