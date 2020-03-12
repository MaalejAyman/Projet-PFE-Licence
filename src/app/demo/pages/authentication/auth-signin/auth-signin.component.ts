import { UserService } from 'src/app/Services/User.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  constructor(private service: UserService) { }

  ngOnInit() {
    // this.test = false;
  }
  /*onLoginChange() {
    this.test = this.service.checkLogin(this.SignInForm.value.Login);
  }*/
}
