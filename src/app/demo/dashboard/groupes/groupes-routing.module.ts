import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupesComponent } from './groupes.component';

const routes: Routes = [
  {
    path: '',
    component: GroupesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupesRoutingModule { }
