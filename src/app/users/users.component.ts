import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthenticationService, TokenUser } from '@app/services/authentication.service';
import { UserService, User, UserPost } from '@app/services/user.service';
import { EditedUser } from './user/user.component';
import { PermissionEnum } from '@app/auth.guard';
import { Role, RolesService } from '@app/services/roles.service';
import { LoadingService } from '@app/loading.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  loading: boolean = true;
  waitCount: number = 2;

  private user?: TokenUser;

  newUser?: User; 
  users: User[] = [];

  roles: Role[] = [];

  error: string = "";

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private rolesService: RolesService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.authService.user.subscribe(u => {this.user = u});
    this.userService.getAll().pipe(first()).subscribe(
      users => {
        this.users = users.users;
        this.waitCount--;
        if (this.waitCount === 0) {
          this.loading = false;
          this.loadingService.stopLoading();
        }
      }
    )
    this.rolesService.getAll().pipe(first()).subscribe(
      roles => {
        this.roles = roles.roles;
        this.waitCount--;
        if (this.waitCount === 0) {
          this.loading = false;
          this.loadingService.stopLoading();
        }
      }
    )
  }

  get canEdit() {
    return !!this.user?.permissions.includes(PermissionEnum.USERS_EDIT);
  }

  add() {
    this.newUser = {
      id: 0,
      login: "login",
      role: {
        code: "admin",
        name: ""
      }
    }
  }

  onEdit(user: EditedUser) {
    let observer = {
      next: () => {
        this.loadingService.startLoading();
        this.userService.getAll().pipe(first()).subscribe(
          users => {
            this.users = users.users;
            this.newUser = undefined;
            this.loadingService.stopLoading();
          }
        );
      },
      error: (error: string) => {
        this.error = error;
      }
    };

    if (!this.newUser) {
      this.userService.put(user.id, {
        ...user,
        role: user.role.code
      }).pipe(first()).subscribe(observer);
    } else {
      this.userService.post({
        ...user,
        role: user.role.code
      }).pipe(first()).subscribe(observer);
    }
  }

  onDelete(deletedUser: User) {
    if (!this.newUser) {
      this.userService.delete(deletedUser.id).pipe(first()).subscribe({
        next: () => {
          this.loadingService.startLoading();
          this.userService.getAll().pipe(first()).subscribe(
            users => {
              this.users = users.users;
              this.loadingService.stopLoading();
            }
          )
        },
        error: error => {
          this.error = error;
        }
      });
    } else {
      this.newUser = undefined;
    }
  }
}
