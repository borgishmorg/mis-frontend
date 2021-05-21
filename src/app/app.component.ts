import { Component } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { PermissionEnum } from '@app/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'mis-frontend';

  constructor(public authenticationService: AuthenticationService) {}

  get canSeePatients() {
    return this.authenticationService.hasPemission(
      PermissionEnum.PATIENTS_VIEW
    );
  }

  get canSeeRoles() {
    return this.authenticationService.hasPemission(PermissionEnum.ROLES_VIEW);
  }

  get canSeeUsers() {
    return this.authenticationService.hasPemission(PermissionEnum.USERS_VIEW);
  }

  logout() {
    this.authenticationService.logout();
  }
}
