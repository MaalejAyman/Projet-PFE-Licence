import { GroupesService } from "./../../../Services/groupes.service";
import { Groupes } from "./../../../Models/Groupes.model";

import { FoldersService } from "./../../../Services/folders.service";
import { Folders } from "./../../../Models/Folders.model";

import { Passwords } from "./../../../Models/Passwords.model";
import { PasswordsService } from "./../../../Services/passwords.service";
import { WebSitesService } from "./../../../Services/web-sites.service";
import { Websites } from "./../../../Models/WebSites.model";
import { Component, OnInit, DoCheck } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/Models/User.model";
import { FileElement } from "src/app/theme/shared/file-explorer/model/file-element";
import { Observable } from "rxjs";
import { FileService } from "src/app/Services/file.service";
import { ThrowStmt } from "@angular/compiler";
import * as CryptoJS from "crypto-js";
import { parse } from "path";

@Component({
  selector: "app-password",
  templateUrl: "./password.component.html",
  styleUrls: ["./password.component.scss"],
})
export class PasswordComponent implements OnInit {
  public us = JSON.parse(sessionStorage.getItem("user")) as User;
  public t: Websites[];
  public f: Folders[];
  public p: Passwords[];
  public Sp: Passwords[];
  public g: Groupes[];
  public gt: number[];
  public psd: string[];
  SharedFolder:Folders;
  IdFld: number;
  pass: Passwords;
  CurrentId: number;
  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;
  constructor(
    private Pservice: PasswordsService,
    private Wservice: WebSitesService,
    private router: Router,
    public fileService: FileService,
    private foldersService: FoldersService,
    private GService: GroupesService
  ) { }
  PassForm = new FormGroup({
    Login: new FormControl("", [Validators.required]),
    Password: new FormControl("", [Validators.required]),
    Website: new FormControl("", [Validators.required]),
  });
  ngOnInit(): void {
    if (localStorage.getItem("LoggedIn") === "true") {
      this.t = [];
      this.GetWebsites();
      this.f = [];
      this.getFolders();

      this.p = [];
      this.getPasswords();
      this.Sp = [];
      this.getSharedPasswords();
      this.g = [];
      this.GetGroupes();
    } else {
      this.router.navigateByUrl("/auth/signin");
      localStorage.setItem("LoggedIn", "false");
    }
  }
  GetWebsites() {
    this.Wservice.GetWebSitesByUser(this.us).subscribe((res: any) => {
      if (res !== null) {
        this.t = res;
      } else {
        this.t = null;
      }
    });
  }
  GetGroupes() {
    this.GService.getGroupesByUser().subscribe((res: any) => {
      if (res !== null) {
        this.g = res;
      } else {
        this.g = null;
      }
    });
  }
  InsertPass() {
    this.pass = new Passwords();
    this.pass.Login = this.PassForm.value.Login;
    this.pass.Value = this.PassForm.value.Password;
    if (this.currentRoot == null) {
      this.pass.IdFldr = null;
    } else {
      // tslint:disable-next-line: radix
      this.pass.IdFldr = parseInt(this.currentRoot.id);
    }
    this.pass.IdGrp = null;
    this.pass.IdUser = this.us.Id;
    this.pass.IdWs = this.PassForm.value.Website.Id;
    this.pass=this.Pservice.CryptPass(this.pass);
    this.GetGroupesFromPage(this.pass);
    this.pass.Groupes = this.gt;
    this.pass.PasswordCrypPubs = this.psd;
    this.Pservice.InsertPass(this.pass)
      .toPromise()
      .then((res) => {
        // Success
        this.getPasswords();
        this.updateFileElementQuery();
      });
  }
  UpdatePass() {
    this.pass = new Passwords();
    // tslint:disable-next-line: radix
    this.pass.Id = parseInt(localStorage.getItem("passId"));
    this.pass.Login = this.PassForm.value.Login;
    this.pass.Value = this.PassForm.value.Password;
    if (this.currentRoot == null) {
      this.pass.IdFldr = null;
    } else {
      // tslint:disable-next-line: radix
      this.pass.IdFldr = parseInt(this.currentRoot.id);
    }
    this.pass.IdGrp = null;
    this.pass.IdUser = this.us.Id;
    this.pass.IdWs = this.PassForm.value.Website.Id;
    this.pass=this.Pservice.CryptPass(this.pass);
    this.GetGroupesFromPage(this.pass);
    this.pass.Groupes = this.gt;
    this.pass.PasswordCrypPubs = this.psd;
    this.Pservice.UpdatePass(this.pass)
      .toPromise()
      .then((res) => {
        // Success
        this.getPasswords();
        this.updateFileElementQuery();
      });
  }
  GetGroupesFromPage(p:Passwords) {
    this.psd = [];
    this.gt = [];
    this.g.forEach((x) => {
      let cb = document.getElementById(x.Id.toString()) as HTMLInputElement;
      if (cb.checked) {
        this.gt.push(x.Id);
        let cryp = CryptoJS.AES.encrypt(
          this.PassForm.value.Password,
          p.Value
        ).toString();
        this.psd.push(cryp);
      }
    });
  }
  addFolder(folder: { name: string }) {
    this.foldersService
      .getLastID()
      .toPromise()
      .then((res) => {
        this.CurrentId = res;
      });
    let e = this.fileService.add(
      {
        isFolder: true,
        name: folder.name,
        parent: this.currentRoot ? this.currentRoot.id : "root",
      },
      this.CurrentId
    );
    this.foldersService
      .InsertFolder(this.fileService.fromFileToFolder(e))
      .subscribe();
    console.log(this.currentRoot);
    this.updateFileElementQuery();
  }
  getFolders() {
    this.foldersService
      .getFoldersByUser()
      .toPromise()
      .then((res) => {
        if (res !== null) {
          this.f = res;
          this.addFolderFile();
          let l = this.f.length - 1;
          this.IdFld = this.f[l].Id;
          this.setSharedFolder();
        } else {
          this.f = null;
        }
      });
  }
  getPasswords() {
    this.Pservice.getPassworsds()
      .toPromise()
      .then((res) => {
        if (res !== null) {
          this.p = res;
          this.addPasswordFile();
        } else {
          this.p = null;
        }
      });
  }
  getSharedPasswords() {
    this.Pservice.getSharedPassworsds()
      .toPromise()
      .then((res) => {
        if (res !== null) {
          this.Sp = res;
          this.addSharedPasswordFile();
        } else {
          this.p = null;
        }
      });
  }
  addFolderFile() {
    this.f.forEach((element) => {
      let e = this.fileService.fromfolderToFile(element);
      this.fileService.addExist(e);
      this.updateFileElementQuery();
    });
  }
  addPasswordFile() {
    this.p.forEach((psd) => {
      let e = this.fileService.fromPasswordToFile(psd);
      this.fileService.addExist(e);
      this.updateFileElementQuery();
    });
  }
  addPassFile(psd: Passwords) {
    let e = this.fileService.fromPasswordToFile(psd);
    this.fileService.addExist(e);
    console.log(this.currentRoot);
    this.updateFileElementQuery();
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
    this.fileElements = this.fileService.queryInFolder(
      this.currentRoot ? this.currentRoot.id : "root"
    );
  }
  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === "root") {
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
    let p = path ? path : "";
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : "";
    let split = p.split("/");
    split.splice(split.length - 2, 1);
    p = split.join("/");
    return p;
  }
  FillFields(passid: string) {
    this.pass = new Passwords();
    if(passid!=null){
    this.pass = this.passFromId(passid);
    localStorage.setItem("passId", this.pass.Id.toString());
    let isshared:boolean=false;
    let ws: Websites;
    this.Sp.forEach((e)=>{
      if(e.Id=this.pass.Id){
        isshared=true;
      }
    });
    ws = new Websites();
    this.t.forEach((element) => {
      if (element.Id == this.pass.IdWs) {
        ws = element;
      }
    });
    if(!isshared){
    this.PassForm.setValue({
      Login: this.pass.Login,
      Password: this.Pservice.Decryptage(this.pass.Value),
      Website: ws,
    });
    }else{
      {
        this.PassForm.setValue({
          Login: this.pass.Login,
          Password: this.Pservice.DecryptageShared(this.pass),
          Website: ws,
        });
        }
    }
    this.g.forEach((element) => {
      if (this.pass.Groupes.indexOf(element.Id) != -1) {
        let cb = document.getElementById(
          element.Id.toString()
        ) as HTMLInputElement;
        cb.checked = true;
      } else {
        let cb = document.getElementById(
          element.Id.toString()
        ) as HTMLInputElement;
        cb.checked = false;
      }
    });
  }
  }
  passFromId(passID: string): any {
    let x: Passwords;
    x = new Passwords();
    this.p.forEach((element) => {
      if (element.Id == parseInt(passID)) {
        x = element;
      }
    });
    this.Sp.forEach((element) => {
      if (element.Id == parseInt(passID)) {
        x = element;
      }
    });
    return x;
  }
  setSharedFolder(){
    this.f.forEach((f1)=>{
      if(f1.Name=="Shared"){
        this.SharedFolder=f1;
      }
    })
  }
  addSharedPasswordFile() {
    this.Sp.forEach((psd) => {
      let e = this.fileService.fromSharedPasswordToFile(psd,this.SharedFolder.Id);
      this.fileService.addExist(e);
      this.updateFileElementQuery();
    });
  }
}
