// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {

//   constructor() { }
// }
// ws.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$!: WebSocketSubject<any>;
  private WS_URL = 'ws://172.16.100.66:5221/ws/mealcount';

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket$ = webSocket(this.WS_URL);
  }

  public getMessages(): Observable<any> {
    return this.socket$.pipe(share()); // share ensures one connection is reused
  }

  public close() {
    this.socket$.complete(); // Close when needed
  }
}
