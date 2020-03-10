import { User } from 'src/app/Models/User.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { UserService } from 'src/app/Services/User.service';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent implements OnInit {
  SignUpForm = new FormGroup({
    Login : new FormControl('', [Validators.required]),
    Password : new FormControl('', [Validators.required]),
    Confirm_Password : new FormControl('', [Validators.required])
  });
  resp: User;
  log: User;
  Users: User[];
  public test = 'test';
  public str;
  constructor(private service: UserService, private router: Router) { }

  ngOnInit() {
    this.log = new User(0, '', '');
    this.resp = new User(0, '', '');
    this.str = '';
  }
  onSubmit() {
    // tslint:disable-next-line: max-line-length
    if (this.SignUpForm.valid && this.SignUpForm.value.Password === this.SignUpForm.value.Confirm_Password) {
   this.register();
  } else {

    /*if (this.SignUpForm.value.Login === '') {
      this.str += 'Please Fill the Login field !!';
    }
    if (this.SignUpForm.value.Password === '') {
      this.str += '\r\nPlease Fill the Password field !!';
    }*/
    if (this.SignUpForm.value.Password !== this.SignUpForm.value.Confirm_Password) {
      this.str = '\r\nThe password field and the Confirm password field must be the same !!';
    }
    // alert(str);
  }
 }
 register() {
   if (this.SignUpForm.valid) {
    this.validateToDoModel();
    this.service.postUser(this.log).subscribe(
      (res: any) => {
        this.resp.Login = res.login;
        this.resp.Password = res.password;
        this.resp = this.service.DecryptUser(this.resp);
        this.router.navigateByUrl('/auth/signin');
      }
     );
   }

 }
   validateToDoModel() {
     this.log.Login = this.SignUpForm.value.Login;
     this.log.Password = this.SignUpForm.value.Password;
 }

}
