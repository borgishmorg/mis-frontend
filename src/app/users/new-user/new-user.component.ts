import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@services/user.service';
import { Role, RolesService } from '@app/services/roles.service';
import { LoadingService } from '@app/services/loading.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationsService } from '@app/services/notifications.service';

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

  constructor(
    private router: Router,
    private usersService: UsersService,
    private loadingService: LoadingService,
    private rolesService: RolesService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.rolesService
      .getAll()
      .pipe(
        catchError((error) => {
          this.notificationsService.error(error);
          return throwError(error);
        })
      )
      .subscribe((roles) => {
        this.roles = roles.roles;
        this.user = {
          id: -1,
          login: 'login',
          password: 'password',
          first_name: 'Имя',
          surname: 'Фамилия',
          blocked: false,
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
  }

  save() {
    if (this.user) {
      this.usersService
        .post({
          ...this.user,
          role: this.user.role.code,
          password: this.user.password,
        })
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            return throwError(error);
          })
        )
        .subscribe(() => {
          this.router.navigate(['/users']);
        });
    }
  }
}
