// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class SubContractorService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubContractorService {

  private baseUrl = 'http://172.16.100.66:5221/api/sub-contractors';

  constructor(private http: HttpClient) { }


  getEmployeeSummary(): Observable<any[]> {
     return this.http.get<any[]>(`${this.baseUrl}/summary?clientid=c01`);

  }

  addSubContractor(subContractor: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, subContractor);
  }
    // Update subcontractor
    updateSubContractor(id: string, subContractor: any): Observable<any> {
      return this.http.put(`${this.baseUrl}/update/${id}`, subContractor);
    }
   // Delete subcontractor by ID
   deleteSubContractor(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  
}
