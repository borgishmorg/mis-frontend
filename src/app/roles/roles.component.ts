import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Permission, PermissionsService } from '@app/services/permissions.service';
import { AuthenticationService, TokenUser } from '@app/services/authentication.service';
import { Role, RolesService } from '@app/services/roles.service';
import { PermissionEnum } from '@app/auth.guard';
import { EditedRole } from './role/role.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  loading: boolean = true;
  private waitCount: number = 2;

  user?: TokenUser;
  roles: Role[] = [];
  permissions: Permission[] = [];
  
  newRole?: Role;

  error: string = "";

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.permissionsService
      .getAll()
      .pipe(first())
      .subscribe(permissions => {
        this.permissions = permissions.permissions;
        this.loading = !!--this.waitCount;
      });
    this.rolesService
      .getAll()
      .pipe(first())
      .subscribe(roles => {
        this.roles = roles.roles;
        this.loading = !!--this.waitCount;
      });
    this.authenticationService.user.subscribe(user => { this.user = user; });
  }
  
  get canAdd() {
    return !!this.user?.permissions.includes(PermissionEnum.ROLES_ADD);
  }

  add() {
    this.newRole = {
      code: "new_role",
      name: "Новая роль",
      permissions: []
    }
  }

  onEdit(editedRole: EditedRole) {
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
  }

  onDelete(deletedRole: EditedRole) {
    if (!this.newRole) {
      this.rolesService.delete(deletedRole.oldCode).pipe(first()).subscribe({
        next: () => {
          this.loading = true;
          this.rolesService
            .getAll()
            .pipe(first())
            .subscribe(roles => {
              this.roles = roles.roles;
              this.loading = false;
            });
        },
        error: error => {
          this.error = error;
        }
      });
    } else {
      this.newRole = undefined;
    }
  }
}
