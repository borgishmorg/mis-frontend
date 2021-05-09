import { Component } from '@angular/core';

import { AuthenticationService, TokenUser } from '@services/authentication.service';
import { PermissionEnum } from '@app/auth.guard'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mis-frontend';
  user?: TokenUser;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  get canSeeAdmin() {
    return this.user?.permissions.indexOf(PermissionEnum.USERS_VIEW) !== -1;
  }

  get canSeeRoles() {
    return this.user?.permissions.indexOf(PermissionEnum.ROLES_VIEW) !== -1;
  }

  get canSeeUsers() {
    return this.user?.permissions.indexOf(PermissionEnum.USERS_VIEW) !== -1;
  }

  logout() {
    this.authenticationService.logout();
  }
}
