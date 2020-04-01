import { UserService } from 'src/app/Services/User.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/Models/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  test: boolean;
  SignInForm = new FormGroup({
    Login : new FormControl('', [Validators.required]),
    Password : new FormControl('', [Validators.required])
  });
  resp: User;
  log: User;
  Users: User[];
  public t: boolean ;
  public str;
  constructor(private service: UserService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedIn') === 'true') {
      this.router.navigateByUrl('/Dashboard/default');
    } else {
      this.router.navigateByUrl('/auth/signin');
      localStorage.setItem('LoggedIn', 'false');
    }
    // this.test = false;
    this.log = new User(0, '', '');
    this.resp = new User(0, '', '');
    this.str = '';
  }
  onLoginChange() {
    this.str = '';
    if (this.SignInForm.valid) {
      this.validateToDoModel();
      this.service.Auth(this.log).subscribe((res: any) => {
        if (res !== null) {
        this.resp.Id = res.id;
        this.resp.Login = res.login;
        this.resp.Password = res.password;
        sessionStorage.setItem('user', JSON.stringify(this.resp));
        localStorage.setItem('LoggedIn', 'true');
        this.router.navigateByUrl('/Dashboard/default');
        } else {
          this.str = 'please check the login details !!';
          this.emptyFields();
        }
      });
    }
  }
  validateToDoModel() {
    this.log.Login = this.SignInForm.value.Login;
    this.log.Password = this.SignInForm.value.Password;
  }
  emptyFields() {
    this.SignInForm.setValue({Login: '', Password: ''});
  }
}
