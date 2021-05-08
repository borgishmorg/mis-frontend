import { Component } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { TokenUser } from '@app/models'
import { Permission } from '@app/auth.guard'

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
    return this.user?.permissions.indexOf(Permission.USERS_VIEW) !== -1;
  }

  logout() {
    this.authenticationService.logout();
  }
}
