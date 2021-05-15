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
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user?: User;
  oldUser?: User;

  roles?: Role[];

  error: string = '';

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private loadingService: LoadingService,
    private rolesService: RolesService
  ) {}

  get canViewRoles() {
    return this.authService.hasPemission(PermissionEnum.ROLES_VIEW);
  }

  get canEdit() {
    return this.authService.hasPemission(PermissionEnum.USERS_EDIT);
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.route.paramMap.subscribe((params) => {
      const user_id = params.get('user_id');
      if (!user_id || !+user_id) {
        this.router.navigate(['notfound']);
      }
      if (this.canViewRoles) {
        this.rolesService
          .getAll()
          .toPromise()
          .then((roles) => {
            this.roles = roles.roles;
          });
      }
      this.usersService
        .get(+user_id!)
        .toPromise()
        .then((user) => {
          this.user = user;
          this.oldUser = JSON.parse(JSON.stringify(user));
          if (!this.canViewRoles)
            this.roles = [{ ...user.role, permissions: [] }];
          this.loadingService.stopLoading();
        })
        .catch((error) => {
          this.loadingService.stopLoading();
          if (error.status === 404) this.router.navigate(['notfound']);
          else this.error = error.error.detail;
        });
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
        .put(this.user.id, {
          ...this.user,
          role: this.user.role.code,
          password: this.user.password ? this.user.password : undefined,
        })
        .subscribe(() => {
          this.router.navigate(['/users']);
        });
    }
  }

  delete() {
    if (this.user) {
      this.usersService.delete(this.user.id).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }
}
