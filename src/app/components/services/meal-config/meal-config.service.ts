import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealConfigService {

  // private apiUrl = 'http://172.16.100.66:5221/api/extras/meal-config-summary';

  constructor(private http: HttpClient) {}

  // getMealConfig(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }

  private baseUrl = 'http://172.16.100.66:5221/api/extras';


  // Fetch meal configuration list
  getMealConfig(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/meal-config-summary`);
  }

  // Add new meal configuration
  addMealConfig(mealData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-meal-config`, mealData);
  }
  

  updateMealConfig(mealId: string, mealData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/update-meal-config/${mealId}`,
      JSON.stringify(mealData),
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

 // Delete meal configuration by ID
deleteMealConfig(mealId: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/delete-meal-config/${mealId}`);
}

  
}
