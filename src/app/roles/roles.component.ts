import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Permission, PermissionsService } from '@app/services/permissions.service';
import { AuthenticationService, TokenUser } from '@app/services/authentication.service';
import { Role, RolesService } from '@app/services/roles.service';
import { PermissionEnum } from '@app/auth.guard';
import { EditedRole } from './role/role.component';
import { LoadingService } from '@app/loading.service';

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
    private authenticationService: AuthenticationService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.permissionsService
      .getAll()
      .pipe(first())
      .subscribe(permissions => {
        this.permissions = permissions.permissions;
        this.waitCount--;
        if (this.waitCount === 0) {
          this.loading = false;
          this.loadingService.stopLoading();
        }
      });
    this.rolesService
      .getAll()
      .pipe(first())
      .subscribe(roles => {
        this.roles = roles.roles;
        this.waitCount--;
        if (this.waitCount === 0) {
          this.loading = false;
          this.loadingService.stopLoading();
        }
      });
    this.authenticationService.user.subscribe(user => { this.user = user; });
  }
  
  get canEdit() {
    return !!this.user?.permissions.includes(PermissionEnum.ROLES_EDIT);
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
        this.loadingService.startLoading();
        this.rolesService
          .getAll()
          .pipe(first())
          .subscribe({
            next: roles => {
              this.roles = roles.roles;
              this.newRole = undefined;
              this.loadingService.stopLoading();
            },
            error: error => {
              this.loadingService.stopLoading();
              this.error = error;
            }
          }
        );
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
          this.loadingService.startLoading();
          this.rolesService
            .getAll()
            .pipe(first())
            .subscribe({
              next: roles => {
                this.roles = roles.roles;
                this.loadingService.stopLoading();
              },
              error: error => {
                this.loadingService.stopLoading();
                this.error = error;
              }
            }
          );
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
