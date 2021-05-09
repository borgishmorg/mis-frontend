import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthenticationService, TokenUser } from '@app/services/authentication.service';
import { UserService, User } from '@app/services/user.service';
import { EditedUser } from './user/user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  loading: boolean = true;

  private user?: TokenUser;

  users: User[] = [];

  error: string = "";

  constructor(
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(u => {this.user = u});
    this.userService.getAll().pipe(first()).subscribe(
      users => {
        this.users = users.users;
        this.loading = false;
      }
    )
  }

  onEdit(editedUser: EditedUser) {
    /*
    let observer = {
      next: () => {
        this.loading = true;
        this.rolesService
          .getAll()
          .pipe(first())
          .subscribe(roles => {
            this.roles = roles.roles;
            this.loading = false;
            this.newRole = undefined;
          });
      },
      error: (error: string) => {
        this.error = error;
      }
    };

    if(!this.newRole){
      this.rolesService.put(
        editedRole.oldCode,
        {
          ...editedRole,
          permissions: editedRole.permissions.map(permission => permission.code)
        }
      ).pipe(first()).subscribe(observer)
    } else {
      this.rolesService.post({
        ...editedRole,
        permissions: editedRole.permissions.map(permission => permission.code)
      }).pipe(first()).subscribe(observer)
    }
    */
  }

  onDelete(deletedUser: User) {
    this.userService.delete(deletedUser.id).pipe(first()).subscribe({
      next: () => {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(
          users => {
            this.users = users.users;
            this.loading = false;
          }
        )
      },
      error: error => {
        this.error = error;
      }
    });
  }
}
