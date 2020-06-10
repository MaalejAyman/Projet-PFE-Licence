import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/User.model';
import { Observable } from 'rxjs';
import { Websites } from '../Models/WebSites.model';
import { Md5 } from 'ts-md5';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class WebSitesService {
  public key = 'key';
  constructor(private http: HttpClient) { }
  baseUrl = 'https://localhost:44331/api/';
  headers = {
    headers : new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
GetWebSitesByUser(u: User): Observable<Websites[]> {
  return this.http.post<Websites[]>(this.baseUrl + 'WebSites/WebSitesByUserId', u, this.headers).pipe();
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
}

