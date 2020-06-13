import { element } from 'protractor';

import { FoldersService } from './../../../Services/folders.service';
import { Folders } from './../../../Models/Folders.model';

import { Passwords } from './../../../Models/Passwords.model';
import { PasswordsService } from './../../../Services/passwords.service';
import { WebSitesService } from './../../../Services/web-sites.service';
import { Websites } from './../../../Models/WebSites.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/Models/User.model';
import { FileElement } from 'src/app/theme/shared/file-explorer/model/file-element';
import { Observable } from 'rxjs';
import { FileService } from 'src/app/Services/file.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  public us=JSON.parse(sessionStorage.getItem("user"))as User;
  public t:Websites[];
  public f:Folders[];
  public p:Passwords[];
  IdFld:number;
  pass:Passwords;
  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;
  constructor(private Pservice: PasswordsService,private Gservice: WebSitesService, private router: Router,public fileService:FileService,private foldersService:FoldersService) { }
  PassForm = new FormGroup({
    Login : new FormControl('', [Validators.required]),
    Password : new FormControl('', [Validators.required]),
    Website : new FormControl('', [Validators.required]),
    Folder : new FormControl('', [Validators.required])
    //Role : new FormControl('', /*[Validators.required]*/)
    });
  ngOnInit(): void {
    if (localStorage.getItem('LoggedIn') === 'true') {
      this.GetWebsites();
      this.f = [];
      this.getFolders();
      this.p =[];
      this.getPasswords();
    } else {
      this.router.navigateByUrl('/auth/signin');
      localStorage.setItem('LoggedIn', 'false');
    }
  }
  GetWebsites(){
    this.Gservice.GetWebSitesByUser(this.us).subscribe((res: any) => {
      if (res !== null) {
        this.t=res;
      } else {
        this.t=null;
      }
    });
  }
  InsertPass(){
    this.pass=new Passwords();
    this.pass.Login=this.PassForm.value.Login;
    this.pass.Value=this.PassForm.value.Password;
    this.pass.IdFldr=parseInt(this.PassForm.value.Folder);
    this.pass.IdGrp=null;
    this.pass.IdUser=this.us.Id;
    this.pass.IdWs=this.PassForm.value.Website.Id;
    this.Pservice.InsertPass(this.pass).subscribe();
  }
  addFolder(folder: { name: string }, CurrentId: number) {
    this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' }, CurrentId);
    console.log(this.currentRoot);
    this.updateFileElementQuery();
  }
  getFolders(){
    this.foldersService.getFoldersByUser().toPromise().then((res: any) => {
      if (res !== null) {
        this.f=res;
        this.addFolderFile();
        let l=(this.f.length)-1;
      this.IdFld=this.f[l].Id;
      } else {
        this.f=null;
      }
    });
  }
  getPasswords(){
    this.Pservice.getPassworsds().toPromise().then((res: any) => {
      if (res !== null) {
        this.p=res;
        this.addPasswordFile();
      } else {
        this.p=null;
      }
    });
  }
  addFolderFile(){
    this.f.forEach(element=>{
      let e = this.fileService.fromfolderToFile(element);
      this.fileService.addExist(e);
      this.updateFileElementQuery();}
    );
  }
  addPasswordFile(){
    this.p.forEach(psd=>{
      let e = this.fileService.fromPasswordToFile(psd);
      this.fileService.addExist(e);
      console.log(this.currentRoot);
      this.updateFileElementQuery();}
    );
  }
  removeElement(element: FileElement) {
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }
  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }
  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }
  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
