import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mis-frontend';
  user?: User;

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
