import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({ 
  templateUrl: 'home.component.html', 
  styleUrls: ['home.component.css'] 
})
export class HomeComponent {
  loading = false;
  user?: User;
  userFromApi?: User;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.userValue){
      this.user = this.authenticationService.userValue;
      this.loading = true;
      this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
        this.loading = false;
        this.userFromApi = user;
      });
    }
  }
}