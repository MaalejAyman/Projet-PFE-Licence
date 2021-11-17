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
  private lowercase = 'abcdefghijklmnopqrstuvwxyz';
  private uppercase = 'ABCDEFGHIJKLMNOPWRSTUVWXYZ';
  private numbers = '0123456789';
  private symbols = '!@#$%^&*-_=+\\|:;\',.\<>/?~';
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
    const x = CryptoJS.AES.decrypt(p.Value2.trim(), p.Value).toString(
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
  public dropPassword(ps: Passwords ) {
    return this.http.post(this.baseUrl + 'Passwords/DeletePasswords', ps, this.headers);
  }
  public CalculateScore(v: string): number {
    let score = 0;
    const s = v.length;
    if (s >= 8) {
      score += s * 4 ;
    } else {
      score -= 20;
    }
    return score + this.getnLower(v) + this.getnNumber(v) + this.getnUpper(v) + this.getnSymbols(v) + this.checkRec(v);
  }
  public getnUpper(v: string): number {
    let n = 0;
    for (const c of v) {
      if (this.uppercase.search(c) >= 0 ) {
        n++;
      }
    }
    if ( n !== 0 ) {
      return (v.length - n) * 2;
    } else {
      return n;
    }
  }
  public getnLower(v: string): number {
    let n = 0;
    for (const c of v) {
      if (this.lowercase.search(c) >= 0) {
        n++;
      }
    }
    if ( n !== 0 ) {
      return (v.length - n) * 2;
    } else {
      return n;
    }
  }
  public getnNumber(v: string): number {
    let n = 0;
    for (const c of v) {
      if (this.numbers.search(c) >= 0) {
        n++;
      }
    }
    if ( n !== 0 ) {
      return n * 4;
    } else {
      return n;
    }
  }
  public getnSymbols(v: string): number {
    let n = 0;
    for (const c of v) {
      if (this.symbols.search(c) >= 0) {
        n++;
      }
    }
    if ( n !== 0 ) {
      return n * 6;
    } else {
      return n;
    }
  }
  public checkRec(v: string ): number {
    let s = 0;
    if (this.getnLower(v) !== 0 ) {
      s++;
    }
    if (this.getnSymbols(v) !== 0 ) {
      s++;
    }
    if (this.getnUpper(v) !== 0 ) {
      s++;
    }
    if (this.getnNumber(v) !== 0 ) {
      s++;
    }
    return s * 2;
  }
}
