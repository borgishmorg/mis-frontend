import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { PermissionEnum } from '@app/auth.guard';
import { User, UsersService } from '@services/user.service';
import { Role, RolesService } from '@app/services/roles.service';
import { LoadingService } from '@app/loading.service';

export interface EditedUser extends User {
  password?: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
})
export class NewUserComponent implements OnInit {
  user?: User;
  oldUser?: User;

  roles?: Role[];

  error: string = '';

  constructor(
    private router: Router,
    private usersService: UsersService,
    private loadingService: LoadingService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.rolesService
      .getAll()
      .toPromise()
      .then((roles) => {
        this.roles = roles.roles;
        this.user = {
          id: -1,
          login: 'login',
          password: 'password',
          role: this.roles[0],
        };
        this.oldUser = JSON.parse(JSON.stringify(this.user));
        this.loadingService.stopLoading();
      });
  }

  back() {
    this.router.navigate(['/users']);
  }

  discard() {
    this.user = JSON.parse(JSON.stringify(this.oldUser));
    this.error = '';
  }

  save() {
    if (this.user) {
      this.usersService
        .post({
          ...this.user,
          role: this.user.role.code,
          password: this.user.password,
        })
        .subscribe(() => {
          this.router.navigate(['/users']);
        });
    }
  }
}
