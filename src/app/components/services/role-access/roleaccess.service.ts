import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleaccessService {

  private apiUrl = 'http://172.16.100.66:5221/api/role-access';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  createRole(roleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, roleData);
  }


  deleteRole(roleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete${roleId}`);
  }

  updateRole(roleId: string, roleData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${roleId}`, roleData);
  }
}
