import { Passwords } from './../Models/Passwords.model';
import { Folders } from './../Models/Folders.model';
import { Injectable } from '@angular/core';

import { v4 } from 'uuid';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FileElement } from '../theme/shared/file-explorer/model/file-element';

export interface IFileService {
  add(fileElement: FileElement, CurrentId: number);
  addExist(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
  fromfolderToFile(f: Folders): FileElement;
}

@Injectable()
export class FileService implements IFileService {

  constructor() {}
  private map = new Map<string, FileElement>();

  private querySubject: BehaviorSubject<FileElement[]>;

  add(fileElement: FileElement, CurrentId: number) {
    fileElement.id = CurrentId + '';
    CurrentId++;
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }
  addExist(fileElement: FileElement) {
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  delete(id: string) {
    this.map.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
  }
  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
  fromfolderToFile(f: Folders): FileElement {
    let file = new FileElement();
    file.id = f.Id.toString();
    file.isFolder = true;
    file.name = f.Name;
    if (f.IdParentFolder !== null) {
    file.parent = f.IdParentFolder.toString();
    } else {
      file.parent = 'root';
    }
    return file;
  }
  fromPasswordToFile(f: Passwords): FileElement {
    let file = new FileElement();
    file.id = f.Id.toString()  + 'p';
    file.isFolder = false;
    file.name = f.Login;
    if (f.IdFldr !== null) {
    file.parent = f.IdFldr.toString();
    } else {
      file.parent = 'root';
    }
    return file;
  }
}
