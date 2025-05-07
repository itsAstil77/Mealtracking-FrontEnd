// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {

//   constructor() { }
// }
// websocket.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  private readonly WS_ENDPOINT = 'ws://172.16.100.66:5221/ws/mealcount';

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(this.WS_ENDPOINT);
    }
  }

  public getMessages(): Observable<any> {
    this.connect();
    return this.socket$.asObservable();
  }

  public sendMessage(msg: any): void {
    this.socket$.next(msg);
  }

  public close(): void {
    this.socket$.complete();
  }

  public isConnected(): boolean {
    return this.socket$ && !this.socket$.closed;
  }
}

