import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthenticationService } from '@services/authentication.service';

export enum PermissionEnum {
  PERMISSIONS_VIEW = 'permissions:view',

  ROLES_ADD = 'roles:add',
  ROLES_EDIT = 'roles:edit',
  ROLES_VIEW = 'roles:view',
  
  USERS_ADD = 'users:add',
  USERS_EDIT = 'users:edit',
  USERS_VIEW = 'users:view',
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.authenticationService.userValue;
    if (!user) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const routePermissions: PermissionEnum[] | undefined= route.data.permissions;
    if (routePermissions 
      && !routePermissions.some(permission => user.permissions.indexOf(permission) !== -1)
    ) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }  
}
