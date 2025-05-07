import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://172.16.100.66:5221/api/user';


  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, user);
  }



  updateUser(userId: string, userData: any): Observable<any> {
    const url = `http://172.16.100.66:5221/api/user/update?id=${userId}`;
    return this.http.put<any>(url, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  

   // Delete a user
   deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete?id=${userId}`);
  }

}