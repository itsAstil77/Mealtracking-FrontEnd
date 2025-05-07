import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private baseUrl = 'http://172.16.100.66:5221/api/visitors';

  constructor(private http: HttpClient) {}

  createVisitor(visitorData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/create`, visitorData, { headers });
  }

  getVisitors(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary`);
  }
  

  updateVisitor(visitorData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${visitorData.id}`, visitorData);
  }



  deleteVisitor(id: string): Observable<any> {
    return this.http.delete<any>(`http://172.16.100.66:5221/api/visitors/delete/${id}`);
  }
  
  
  
  
}
