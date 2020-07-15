import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordRoutingModule } from './password-routing.module';
import { PasswordComponent } from './password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FileExplorerComponent } from 'src/app/theme/shared/file-explorer/file-explorer.component';
import { MatOptionModule } from '@angular/material/core';


@NgModule({
  declarations: [PasswordComponent],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MatOptionModule,
    FormsModule
  ]
})
export class PasswordModule { }
