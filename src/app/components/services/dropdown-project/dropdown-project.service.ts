import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownProjectService {

  private projectUrl = 'http://172.16.100.66:5221/api/projects/project-summary';
  private locationUrl = 'http://172.16.100.66:5221/api/locations/location-summary';
 
  constructor(private http: HttpClient) { }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.projectUrl);
  }

  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.locationUrl}`);
  }
  

  

  getCanteens(locationId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://172.16.100.66:5221/api/canteens/canteen-summary?locationId=${locationId}`);
}


}
