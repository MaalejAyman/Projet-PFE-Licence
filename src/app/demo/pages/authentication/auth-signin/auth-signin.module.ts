import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSigninRoutingModule } from './auth-signin-routing.module';
import { AuthSigninComponent } from './auth-signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    AuthSigninRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [AuthSigninComponent]
})
export class AuthSigninModule { }
