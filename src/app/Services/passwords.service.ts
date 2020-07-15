import { Injectable } from '@angular/core';
import { User } from '../Models/User.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Passwords } from '../Models/passwords.model';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  public u = JSON.parse(sessionStorage.getItem('user')) as User;
  public key = 'key';
  constructor(private http: HttpClient) {}
  baseUrl = 'https://localhost:44331/api/';
  headers = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  InsertPass(reg: Passwords): Observable<Passwords> {
    return this.http
      .post<Passwords>(
        this.baseUrl + 'Passwords/PostPasswords',
        reg,
        this.headers
      )
      .pipe();
  }
  UpdatePass(reg: Passwords): Observable<Passwords> {
    return this.http
      .post<Passwords>(
        this.baseUrl + 'Passwords/UpdatePasswords',
        reg,
        this.headers
      )
      .pipe();
  }
  public CryptPass(P: Passwords): Passwords {
    P.Value = this.Cryptage(P.Value);
    return P;
  }
  public DecryptPass(P: Passwords): Passwords {
    P.Value = this.Decryptage(P.Value);
    return P;
  }
  public Decryptage(str: string): string {
    return CryptoJS.AES.decrypt(str.trim(), this.u.Password).toString(
      CryptoJS.enc.Utf8
    );
  }
  public DecryptageShared(p: Passwords): string {
    let x = CryptoJS.AES.decrypt(p.Value2.trim(), p.Value).toString(
      CryptoJS.enc.Utf8
    );
    return x;
  }

  public Cryptage(str: string): string {
    return CryptoJS.AES.encrypt(str.trim(), this.u.Password).toString();
  }
  public getPassworsds() {
    return this.http.post<Passwords[]>(this.baseUrl + 'Passwords/GetPasswordsByUser', this.u).pipe();
  }
  public getSharedPassworsds() {
    return this.http.post<Passwords[]>(this.baseUrl + 'Passwords/GetSharedPasswords', this.u).pipe();
  }
}
