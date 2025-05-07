import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {



  private baseUrl = 'http://172.16.100.66:5221/api/projects';


  constructor(private http: HttpClient) {}

  addProject(projectData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-project`, projectData);
  }


  updateProject(id: string, project: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-project/${id}`, project);
  }


 
  getProjectSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/project-summary`);
  }

  private locUrl = 'http://172.16.100.66:5221/api/locations';



  getLocationsByProject(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.locUrl}/project/${projectId}`);
  }




getCanteensByLocation(locationId: string) {
  const url = `http://172.16.100.66:5221/api/canteens/canteen-summary?locationId=${locationId}`;
  console.log("Calling API:", url); 
  return this.http.get<any[]>(url);
}



private addUrl = 'http://172.16.100.66:5221/api/canteens';




addCanteen(canteenData: any): Observable<any> {
  return this.http.post(`${this.addUrl}/add-canteen`, canteenData);
}


//new 

private locaUrl = 'http://172.16.100.66:5221/api/locations/location-summary';
getLocationSummary(): Observable<any[]> {
  return this.http.get<any[]>(this.locaUrl);
}

private locationUrl = 'http://172.16.100.66:5221/api/locations';


  addLocation(locationData: any): Observable<any> {
    return this.http.post(`${this.locationUrl}/add-location`, locationData);
  }

  updateLocation(locationId: string, locationData: any): Observable<any> {
    return this.http.put<any>(`${this.locationUrl}/update-location/${locationId}`, locationData);
  }
  

   // ✅ Delete Location API
   deleteLocationById(locationId: string): Observable<any> {
    return this.http.delete(`${this.locationUrl}/delete-location/${locationId}`);
  }

getCanteensByLocation1(locationId: string): Observable<any[]> {
  return this.http.get<any[]>(`http://172.16.100.66:5221/api/canteens/canteen-summary?locationId=${locationId}`);
}

private candelUrl= 'http://172.16.100.66:5221/api'

deleteCanteenById(canteenId: string): Observable<any> {
  return this.http.delete(`${this.candelUrl}/canteens/delete-canteen/${canteenId}`);
}



private apiUrl = 'http://172.16.100.66:5221/api/RoleHierarchy/summary';



getRoleHierarchy(): Observable<any> {
  return this.http.get<any>(this.apiUrl);
}


updateCanteen(canteenId: string, canteenData: any): Observable<any> {
  const apiUrl = `http://172.16.100.66:5221/api/canteens/update-canteen/${canteenId}`;
  return this.http.put<any>(apiUrl, canteenData);
}

}


