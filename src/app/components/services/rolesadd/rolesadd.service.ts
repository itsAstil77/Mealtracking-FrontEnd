// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// interface Role {
//   id: string;
//   roleId: string;
//   roleName: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class RolesaddService {

//   private apiUrl = 'http://172.16.100.66:5221/api/extras/role-summary';

//   constructor(private http: HttpClient) {}

//   getRoles(): Observable<any> {
//     return this.http.get<any>(this.apiUrl);
//   }

//   private apiUrl = 'http://172.16.100.67:5221/api/RoleHierarchy/summary';

//   constructor(private http: HttpClient) {}

//   getRoleSummary(): Observable<Role[]> {
//     return this.http.get<Role[]>(this.apiUrl);
//   }
// }


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Role {
  id: string;
  roleId: string;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesaddService {
  private apiUrl = 'http://172.16.100.66:5221/api/RoleHierarchy/summary'; // Correct API URL

  constructor(private http: HttpClient) {}

  getRoleSummary(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }
}

