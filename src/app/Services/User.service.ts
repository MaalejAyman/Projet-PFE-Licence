import { Injectable } from '@angular/core';
import { User } from '../Models/User.model';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import {map} from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public key = 'key';
  public IsAuth = 'false';
  constructor(private http: HttpClient) { }
  baseUrl = 'https://localhost:44330/api/';
  headers = {
    headers : new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  postUser(reg: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'TodoItems', this.CryptUser(reg), this.headers).pipe();
  }
  getUsers(): Observable<User[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<User[]>(this.baseUrl + 'TodoItems', this.headers).pipe(map(data => data.map((data) => new User(null, '', '').deserialize(data))));
  }
  getUser(): Observable<User> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<User>(this.baseUrl + 'TodoItems', this.headers).pipe();
  }
  Auth(reg: User): boolean {
    return true;
  }
  public Decryptage(str: string, key: string): string {
    return CryptoJS.AES.decrypt(str.trim(), key.trim()).toString(CryptoJS.enc.Utf8);
  }
  public Cryptage(str: string, key: string): string {
    return CryptoJS.AES.encrypt(str.trim(), key.trim()).toString();
  }
  public CryptUser(reg: User) {
    reg.Login = this.Cryptage(reg.Login, this.key);
    reg.Password = this.Cryptage(reg.Password, this.key);
    return reg;
  }
  public DecryptUser(reg: User) {
    reg.Login = this.Decryptage(reg.Login, this.key);
    reg.Password = this.Decryptage(reg.Password, this.key);
    return reg;
  }
}

