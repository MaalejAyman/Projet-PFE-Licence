import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'default',
        loadChildren: () => import('./Home/default.module').then(m => m.DefaultModule)
      },
      {
        path: 'Passwords',
        loadChildren: () => import('./Password/Password.module').then(m => m.PasswordModule)
      },
      {
        path: 'Groupes',
        loadChildren: () => import('./Groupes/Groupes.module').then(m => m.GroupesModule)
      },
      {
        path: 'Websites',
        loadChildren: () => import('./Website/Website.module').then(m => m.WebsiteModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
