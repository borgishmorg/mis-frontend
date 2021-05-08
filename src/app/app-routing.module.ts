import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '@app/admin/admin.component';
import { HomeComponent } from '@app/home/home.component';
import { LoginComponent } from '@app/login/login.component';
import { RolesComponent } from '@app/roles/roles.component';
import { AuthGuard, PermissionEnum } from '@app/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ PermissionEnum.PERMISSIONS_VIEW ] }
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ PermissionEnum.ROLES_VIEW ] }
  },
  {
    path: 'login',
    component: LoginComponent
  },

  // otherwise redirect to home
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
