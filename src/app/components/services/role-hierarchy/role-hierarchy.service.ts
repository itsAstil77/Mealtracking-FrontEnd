// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleHierarchyService {
//   private apiUrl = 'http://172.16.100.67:5221/api/RoleHierarchy/create';

//   constructor(private http: HttpClient) {}

//   saveRoleHierarchy(data: any): Observable<any> {
    
//     return this.http.post<any>(this.apiUrl, data);
//   }

//   updateRoleHierarchy(roleId: string, roleData: any) {
//     return this.http.put(`http://172.16.100.67:5221/api/RoleHierarchy/update/${roleId}`, roleData);
//   }

//   private apiiUrl = 'http://172.16.100.67:5221/api/RoleHierarchy';

//   /** ✅ Fetch Role Data Based on `roleId` */
//   getRoleByRoleId(roleId: string): Observable<any> {
//     return this.http.get<any>(`${this.apiiUrl}/get/${roleId}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleHierarchyService {
  private apiUrl = 'http://172.16.100.66:5221/api/RoleHierarchy';

  constructor(private http: HttpClient) {}

  /** ✅ Save Role */
  saveRoleHierarchy(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, data);
  }

  /** ✅ Update Role Based on `roleId` */
  // updateRoleHierarchy(roleId: string, roleData: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/update/${roleId}`, roleData);
  // }

  /** ✅ Fetch Role Data Using `roleId` */
  getRoleByRoleId(roleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${roleId}`);
  }

  /** ✅ Update role */
  updateRole(roleId: string, roleData: any) {
    return this.http.put(`http://172.16.100.66:5221/api/RoleHierarchy/update/${roleId}`, roleData);
  }
  

  deleteRole(roleId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${roleId}`);
  }
  getCanteenSummary(locationId: number) {
    return this.http.get<any[]>(`http://172.16.100.66:5221/api/canteens/canteen-summary?locationId=${locationId}`);
  }
  
}
