import { Notes } from './../Models/notes.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/User.model';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  public u = JSON.parse(sessionStorage.getItem('user')) as User;
  public key = this.u.Password;
  constructor(private http: HttpClient) {}
  baseUrl = 'https://localhost:44331/api/';
  headers = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  GetNotesByUser(): Observable<Notes[]> {
    return this.http
      .post<Notes[]>(
        this.baseUrl + 'Notes/NotesByUserId',
        this.u,
        this.headers
      )
      .pipe();
  }
  public Decryptage(str: string, key: string): string {
    return CryptoJS.AES.decrypt(str.trim(), key.trim()).toString(
      CryptoJS.enc.Utf8
    );
  }
  public Cryptage(str: string, key: string): string {
    return CryptoJS.AES.encrypt(str.trim(), key.trim()).toString();
  }
  public hashString(str: string) {
    const md5 = new Md5();
    return md5.appendStr(str).end();
  }
  public InsertNotes(n: Notes) {
    n.IdUser = this.u.Id;
    return this.http.post<number>(this.baseUrl + 'Notes/PostNotes', n, this.headers).pipe();
  }
  public UpdateNotes(n: Notes) {
    n.IdUser = this.u.Id;
    return this.http.post<Notes>(this.baseUrl + 'Notes/UpdateNotes', n, this.headers).pipe();
  }
  public DropNotes(n: Notes) {
    return this.http.post<number>(this.baseUrl + 'Notes/DeleteNotes', n, this.headers).pipe();
  }
}
