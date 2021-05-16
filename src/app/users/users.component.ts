import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication.service';
import { UsersService, User } from '@app/services/user.service';
import { PermissionEnum } from '@app/auth.guard';
import { LoadingService } from '@app/services/loading.service';
import { Router } from '@angular/router';
import { NotificationsService } from '@app/services/notifications.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(
    private usersService: UsersService,
    private authService: AuthenticationService,
    private loadingService: LoadingService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {}

  get canAdd() {
    return (
      this.authService.hasPemission(PermissionEnum.USERS_EDIT) &&
      this.authService.hasPemission(PermissionEnum.ROLES_VIEW)
    );
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.usersService
      .getAll()
      .toPromise()
      .then((users) => {
        this.users = users.users;
        this.loadingService.stopLoading();
      })
      .catch((error) => {
        this.notificationsService.error(error);
      });
  }

  add() {
    this.router.navigate(['/users/new']);
  }
}
