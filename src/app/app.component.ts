import { Component } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { TokenUser } from '@app/models'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mis-frontend';
  user?: TokenUser;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
    return this.user && this.user.role.code === 'admin';
  }

  logout() {
    this.authenticationService.logout();
  }
}
