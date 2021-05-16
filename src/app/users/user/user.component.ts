import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { PermissionEnum } from '@app/auth.guard';
import { User, UsersService } from '@services/user.service';
import { Role, RolesService } from '@app/services/roles.service';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

export interface EditedUser extends User {
  password?: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user?: User;
  oldUser?: User;

  roles?: Role[];

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private loadingService: LoadingService,
    private rolesService: RolesService,
    private notificationsService: NotificationsService
  ) {}

  get canViewRoles() {
    return this.authService.hasPemission(PermissionEnum.ROLES_VIEW);
  }

  get canEdit() {
    return this.authService.hasPemission(PermissionEnum.USERS_EDIT);
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.route.paramMap
      .pipe(
        mergeMap((params) => {
          const user_id = params.get('user_id');
          if (!user_id || !+user_id) return throwError('');
          return this.usersService.get(+user_id);
        })
      )
      .pipe(
        catchError((error) => {
          this.router.navigate(['notfound']);
          return throwError(error);
        })
      )
      .pipe(
        mergeMap((user) => {
          this.user = user;
          this.oldUser = JSON.parse(JSON.stringify(user));
          if (this.canViewRoles) return this.rolesService.getAll();
          return of({ roles: [{ ...user.role, permissions: [] }] });
        })
      )
      .pipe(
        catchError((error) => {
          this.notificationsService.error(error);
          return throwError(error);
        })
      )
      .subscribe((roles) => {
        this.roles = roles.roles;
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
        .put(this.user.id, {
          ...this.user,
          role: this.user.role.code,
          password: this.user.password ? this.user.password : undefined,
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

  delete() {
    if (this.user) {
      this.usersService
        .delete(this.user.id)
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
