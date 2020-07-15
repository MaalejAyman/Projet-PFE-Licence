import { Injectable } from '@angular/core';
import { User } from '../Models/User.model';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import {map} from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import {Md5} from 'ts-md5/dist/md5';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public key = 'key';
  public IsAuth = 'false';

  constructor(private http: HttpClient) { }
  baseUrl = 'https://localhost:44331/api/';
  headers = {
    headers : new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  postUser(reg: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'Users/PostUser', this.CryptUser(reg), this.headers).pipe();
  }
  getAllUsers(): Observable<User[]> {
    return this.http.post<User[]>(this.baseUrl + 'Users/GetUsers', this.headers).pipe();
  }
  getUser(): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'Users', this.headers).pipe();
  }
  Auth(reg: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'Users/UserByData', this.CryptUser(reg), this.headers).pipe();
  }
  public Decryptage(str: string, key: string): string {
    return CryptoJS.AES.decrypt(str.trim(), key.trim()).toString(CryptoJS.enc.Utf8);
  }
  public Cryptage(str: string, key: string): string {
    return CryptoJS.AES.encrypt(str.trim(), key.trim()).toString();
  }
  public CryptUser(reg: User) {
    reg.Login = reg.Login;
    // reg.Password = this.Cryptage(reg.Password, this.key);
    reg.Password = this.hashString(reg.Password).toString();
    return reg;
  }
  public DecryptUser(reg: User) {
    reg.Password = this.Decryptage(reg.Password, this.key);
    return reg;
  }
  public hashString(str: string) {
    const md5 = new Md5();
    return md5.appendStr(str).end();
  }
  public checkLogin(str: string): boolean {
    this.http.get<boolean>(this.baseUrl + 'Users/CheckLogin/' + str, this.headers).pipe().subscribe(
      (res: any) => {
        return res;
      }
    );

    return false;
  }
}

