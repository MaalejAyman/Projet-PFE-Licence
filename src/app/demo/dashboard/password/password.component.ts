import { Passwords } from './../../../Models/Passwords.model';
import { PasswordsService } from './../../../Services/passwords.service';
import { WebSitesService } from './../../../Services/web-sites.service';
import { Websites } from './../../../Models/WebSites.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupesService } from 'src/app/Services/groupes.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/Models/User.model';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  public us=JSON.parse(sessionStorage.getItem("user"))as User;
  public t:Websites[];
  pass:Passwords;
  constructor(private Pservice: PasswordsService,private Gservice: WebSitesService, private router: Router) { }
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

}
