import { Groupes } from './../../../Models/Groupes.model';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { User} from 'src/app/Models/User.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/Services/User.service';
import { Router } from '@angular/router';
import { GroupesService } from 'src/app/Services/groupes.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/theme/shared/Modals/delete-dialog/delete-dialog.component';
@Component({
  selector: "app-groupes",
  templateUrl: "./groupes.component.html",
  styleUrls: ["./groupes.component.scss"],
})
export class GroupesComponent implements OnInit {
  public CurrentUser = JSON.parse(sessionStorage.getItem("user")) as User;
  public u: User[] = [];
  public g: Groupes[] = [];
  public user: User[] = [];
  GForm = new FormGroup({
    Name: new FormControl("", [Validators.required]),
  });
  constructor(
    public Uservice: UserService,
    private router: Router,
    public Gservice: GroupesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    localStorage.setItem("grp",null);
    if (localStorage.getItem("LoggedIn") === "true") {
      if (localStorage.getItem("IsAdmin") === "0") {
        this.router.navigateByUrl("/Dashboard/default");
      }else{
      this.u = [];
      this.GetAllUsers();
      this.g = [];
      this.GetGroupesByUser();
      }
    } else {
      this.router.navigateByUrl("/auth/signin");
      localStorage.setItem("LoggedIn", "false");
    }
  }
  InsertGroupes() {
    if (this.GForm.valid) {
    let grp = new Groupes();
    grp.Name = this.GForm.value.Name;
    this.getSelectedUsers();
    grp.Users = this.user;
    this.Gservice.InsertGroupe(grp)
      .toPromise()
      .then((res) => {
        this.g = [];
        this.GetGroupesByUser();
      });
    }else{
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            "Please Fill the field before !!",
        },
      });
    }
  }
  GetAllUsers() {
    this.Uservice.getAllUsers()
      .toPromise()
      .then((res) => {
        if (res !== null) {
          this.u = res;
        } else {
          this.u = null;
        }
      });
  }
  GetGroupesByUser() {
    this.Gservice.getGroupes()
      .toPromise()
      .then((res) => {
        if (res !== null) {
          this.g = res;
        } else {
          this.g = null;
        }
      });
  }
  GetGroupesFromPage() {
    this.user = [];
    this.u.forEach((x) => {
      let cb = document.getElementById(x.Id.toString()) as HTMLInputElement;
      if (cb.checked) {
        this.user.push(x);
      }
    });
  }
  GetUsersFromGroupes(g1: Groupes) {
    this.user = [];
    localStorage.setItem("grp", g1.Id.toString());
    this.u.forEach((element) => {
      if (element.Id != this.CurrentUser.Id) {
        let cb = document.getElementById(
          element.Id.toString()
        ) as HTMLInputElement;
        cb.checked = false;
      }
    });
    this.Gservice.getUsersByGroupe(g1)
      .toPromise()
      .then((res) => {
        if (res != null) {
          res.forEach((element) => {
            this.user.push(new User(element, null, null));
          });
          this.user.forEach((element) => {
            let cb = document.getElementById(
              element.Id.toString()
            ) as HTMLInputElement;
            cb.checked = true;
          }, this.GForm.setValue({ Name: g1.Name }));
        }
      });
  }
  getSelectedUsers() {
    this.user = [];
    this.u.forEach((element) => {
      if (element.Id != this.CurrentUser.Id) {
        let cb = document.getElementById(
          element.Id.toString()
        ) as HTMLInputElement;
        if (cb.checked) {
          this.user.push(new User(element.Id, "null", "null"));
        }
      }
    });
  }
  updateGrp() {
    if (this.GForm.valid && localStorage.getItem("grp") !== "null") {
    let grp = new Groupes();
    grp.Id = parseInt(localStorage.getItem("grp"));
    grp.Name = this.GForm.value.Name;
    this.getSelectedUsers();
    grp.Users = this.user;
    this.Gservice.UpdateGroupe(grp)
      .toPromise()
      .then((res) => {
        this.g = [];
        this.GetGroupesByUser();
      });
    }else{
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            "Please select a groupe before !!",
        },
      });
    }
  }
  DropGrp() {
    let grp = new Groupes();

    if (localStorage.getItem("grp") !== "null") {
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            "Do you realy want to delete the " + this.GForm.value.Name + " groupe ?",
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          grp.Id = parseInt(localStorage.getItem("grp"));
          grp.Name = this.GForm.value.Name;
          this.Gservice.DropGroupe(grp)
            .toPromise()
            .then((res) => {
              this.g = [];
              this.GetGroupesByUser();
              localStorage.setItem("grp",null);
            });
        }
      });
    }else if (localStorage.getItem("grp") == "null"){
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          Text:
            "Please select a groupe before",
        },
      });
    }
  }
}
