import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { AuthenticationService } from '@services/authentication.service';

export enum PermissionEnum {
  PERMISSIONS_VIEW = 'permissions:view',

  ROLES_EDIT = 'roles:edit',
  ROLES_VIEW = 'roles:view',

  USERS_EDIT = 'users:edit',
  USERS_VIEW = 'users:view',

  PATIENTS_EDIT = 'patients:edit',
  PATIENTS_VIEW = 'patients:view',

  EXAMINATIONS_EDIT = 'examinations:edit',
  EXAMINATIONS_VIEW = 'examinations:view',

  THERAPIST_EXAMINATIONS_EDIT = 'examinations:therapist:edit',
  THERAPIST_EXAMINATIONS_VIEW = 'examinations:therapist:view',

  SURGEON_EXAMINATIONS_EDIT = 'examinations:surgeon:edit',
  SURGEON_EXAMINATIONS_VIEW = 'examinations:surgeon:view',

  ORTHOPEDIST_EXAMINATIONS_EDIT = 'examinations:orthopedist:edit',
  ORTHOPEDIST_EXAMINATIONS_VIEW = 'examinations:orthopedist:view',
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.authenticationService.userValue;
    if (!user) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    const routePermissions: PermissionEnum[] | undefined =
      route.data.permissions;
    if (
      routePermissions &&
      !routePermissions.some((permission) =>
        user.permissions.includes(permission)
      )
    ) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
