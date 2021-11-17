import { GroupesComponent } from './groupes.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupesRoutingModule } from './groupes-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@NgModule({
  declarations: [GroupesComponent],
  imports: [
    CommonModule,
    GroupesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FormsModule
  ]
})
export class GroupesModule { }
