import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@services/authentication.service';
import { UserService } from '@services/user.service';
import { User, TokenUser } from '@app/models';

@Component({ 
  templateUrl: 'home.component.html', 
  styleUrls: ['home.component.css'] 
})
export class HomeComponent {
  loading = false;
  userFromApi?: User;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.userValue){
      this.loading = true;
      this.userService.get(
        this.authenticationService.userValue.id
      ).pipe(first()).subscribe(user => {
        this.loading = false;
        this.userFromApi = user;
      });
    }
  }
}