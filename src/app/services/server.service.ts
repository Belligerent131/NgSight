import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from "@angular/common/http";
import { Observable, config } from 'rxjs';
import { ServerMessage } from '../shared/server-message';
import { Server } from '../shared/server';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerService {


  constructor(private _http: HttpClient) { 
    //this.options.set('Content-Type', 'application/json');
   }

  getServer(): Observable<Server[]> {
    const localUrl = 'http://localhost:5000/api/server';

    return this._http.get<Server[]>(localUrl);
  }

  handleServerMessage(msg: ServerMessage) : Observable<Response> {
    
    console.log(msg);
    const url = 'http://localhost:5000/api/server/' + msg.id;
    return this._http.put<Response>(url, msg);
  }

  handleError(): any {
    
  }
}
