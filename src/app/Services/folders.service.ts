import { Folders } from './../Models/Folders.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/User.model';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {

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
  getFoldersByUser() {
    return this.http.post<Folders[]>(this.baseUrl + 'Folders/FoldersByUserId', this.u, this.headers).pipe();
  }
  InsertFolder(f: Folders) {
    return this.http.post<Folders>(this.baseUrl + 'Folders/PostFolders', f, this.headers).pipe();
  }
  getLastID() {
    return this.http.post<number>(this.baseUrl + 'Folders/GetLastID', 'null' ).pipe();
  }
  RenameFolder(f: Folders) {
    return this.http.post<number>(this.baseUrl + 'Folders/RenameFolders', f, this.headers).pipe();
  }
  MoveFolder(f: Folders) {
    return this.http.post<number>(this.baseUrl + 'Folders/MoveFolders', f, this.headers).pipe();
  }
  DropFolder(f: Folders) {
    return this.http.post<number>(this.baseUrl + 'Folders/DeleteFolders', f, this.headers).pipe();
  }
}
