import { WebSitesService } from './../../../Services/web-sites.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Websites } from 'src/app/Models/WebSites.model';
import { User } from 'src/app/Models/User.model';
import { throwIfEmpty } from 'rxjs/operators';
import { DeleteDialogComponent } from 'src/app/theme/shared/Modals/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: "app-website",
  templateUrl: "./website.component.html",
  styleUrls: ["./website.component.scss"],
})
export class WebsiteComponent implements OnInit {
  public us = JSON.parse(sessionStorage.getItem("user")) as User;
  public ws: Websites;
  WForm = new FormGroup({
    Name: new FormControl("", [Validators.required]),
    Link: new FormControl("", [Validators.required]),
  });
  w: Websites[];
  constructor(private wservice: WebSitesService, public dialog: MatDialog,private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem("LoggedIn") === "true") {
      if (localStorage.getItem("IsAdmin") === "0") {
        this.router.navigateByUrl("/Dashboard/default");
      }else{
        this.w = [];
        this.GetWebsitesByUser();
      }
    } else {
      this.router.navigateByUrl("/auth/signin");
      localStorage.setItem("LoggedIn", "false");
    }
  }

  insertWS() {
    this.GetSW();
    this.wservice
      .InsertWS(this.ws)
      .toPromise()
      .then((res) => {
        this.w = [];
        this.GetWebsitesByUser();
      });
  }
  updateWS() {
    this.GetUpdateSW();
    this.wservice
      .UpdateWS(this.ws)
      .toPromise()
      .then((res) => {
        this.w = [];
        this.GetWebsitesByUser();
      });
  }
  GetWebsitesByUser() {
    this.wservice
      .GetWebSites()
      .toPromise()
      .then((res) => {
        if (res != null) {
          this.w = res;
        }
      });
  }
  FillFields(WS: Websites) {
    this.WForm.setValue({
      Name: WS.Name,
      Link: WS.Link,
    });
    localStorage.setItem("WSId", WS.Id.toString());
  }
  GetSW() {
    this.ws = new Websites();
    this.ws.Name = this.WForm.value.Name;
    this.ws.Link = this.WForm.value.Link;
  }
  GetUpdateSW() {
    this.ws = new Websites();
    this.ws.Id = parseInt(localStorage.getItem("WSId"));
    this.ws.Name = this.WForm.value.Name;
    this.ws.Link = this.WForm.value.Link;
  }
  emptyFields() {
    this.WForm.setValue({
      Name: "",
      Link: "",
    });
  }
  DeleteWebSites() {
    if (localStorage.getItem("WSId") != null) {
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            "Do you realy want to delete the " +
            this.WForm.value.Name +
            " Website ?",
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.GetUpdateSW();
          this.wservice
            .DropWS(this.ws)
            .toPromise()
            .then((res) => {
              if (res == 0) {
                let dialogRef = this.dialog.open(DeleteDialogComponent, {
                  data: {
                    Text:
                      "Please make sure to unlink all your login informations from this website !!",
                  },
                });
              }else{
                this.w = [];
                this.GetWebsitesByUser();
              }
            });
          this.emptyFields();
        }
      });
    }
  }
}
