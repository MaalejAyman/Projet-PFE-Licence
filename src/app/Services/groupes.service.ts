import { Observable } from 'rxjs/Observable';
import { Groupes } from './../Models/Groupes.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/User.model';
import { Md5 } from 'ts-md5';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class GroupesService {
  public key = 'key';
  public u = JSON.parse(sessionStorage.getItem('user')) as User;
  constructor(private http: HttpClient) {}
  baseUrl = 'https://localhost:44331/api/';
  headers = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  public Decryptage(str: string, key: string): string {
    return CryptoJS.AES.decrypt(str.trim(), key.trim()).toString(
      CryptoJS.enc.Utf8
    );
  }
  getGroupesByUser() {
    return this.http.post<Groupes[]>(this.baseUrl + 'Groupes/GroupesByUserId', this.u, this.headers).pipe();
  }
  InsertGroupe(g: Groupes) {
    return this.http.post<Groupes>(this.baseUrl + 'Groupes/PostGroupes', g, this.headers).pipe();
  }
  getUsersByGroupe(g: Groupes ) {
    return this.http.post<number[]>(this.baseUrl + 'UserssGroupes/GetUsersByGroupes', g, this.headers).pipe();
  }
  UpdateGroupe(g: Groupes) {
    return this.http.post<Groupes>(this.baseUrl + 'Groupes/UpdateGroupes', g, this.headers).pipe();
  }
}
