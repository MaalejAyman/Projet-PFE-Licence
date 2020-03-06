import { Injectable } from '@angular/core';
import { User } from '../Models/User.model';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public IsAuth = 'false';
  constructor(private http: HttpClient) { }
  baseUrl = 'https://localhost:44330/api/';
  headers = {
    headers : new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  todo(reg: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'TodoItems', reg, this.headers).pipe();
  }
  gettodo(): Observable<User[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<User[]>(this.baseUrl + 'TodoItems', this.headers).pipe(map(data => data.map((data) => new User(null, '', '').deserialize(data))));
  }
  CheckAuth(reg: User){
    User = this.http.post.<User>(this)
    if()
  }
}

