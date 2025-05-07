import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = 'http://172.16.100.66:5221/api/devices/summary'; 
  private addDeviceUrl = 'http://172.16.100.66:5221/api/devices/add';
  private updateDeviceUrl = 'http://172.16.100.66:5221/api/devices/update';

  private apidUrl = 'http://172.16.100.66:5221/api/devices';

  constructor(private http: HttpClient) {}

  getDevices(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addDevice(device: any): Observable<any> {
    return this.http.post<any>(`${this.addDeviceUrl}`, device);
  }
  updateDevice(device: any): Observable<any> {
    return this.http.put<any>(`${this.updateDeviceUrl}/${device.uniqueId}`, device);
  }
  
  deleteDevice(uniqueId: string): Observable<any> {
    return this.http.delete<any>(`${this.apidUrl}/delete/${uniqueId}`);
  }


}
