import { User } from 'src/app/Models/User.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { UserService } from 'src/app/Services/User.service';
@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent implements OnInit {
  LoginForm = new FormGroup({
    Login : new FormControl(''),
    Password : new FormControl(''),
    Status : new FormControl('')
  });
  resp: User;
  log: User;
  Users: User[];
  public test = 'test';
  constructor(private service: UserService) { }

  ngOnInit() {
    this.log = new User(0, '', '');
    this.resp = new User(0, '', '');
  }
  onSubmit() {
   this.register();
 }
 register() {
   if (this.LoginForm.valid) {
    this.validateToDoModel();
    this.service.postUser(this.log).subscribe(
      (res: any) => {
        this.resp.Login = res.Login;
        this.resp.Password = res.Password;
        this.resp = this.service.DecryptUser(this.resp);
      },
    success => {
      alert('sent !!');
    }
     );
   }

 }
   validateToDoModel() {
     this.log.Login = this.LoginForm.value.Login;
     this.log.Password = this.LoginForm.value.Password;
 }

}
