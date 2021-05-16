import { Component, OnInit } from '@angular/core';
import { catchError, first, mergeMap } from 'rxjs/operators';

import {
  Permission,
  PermissionsService,
} from '@app/services/permissions.service';
import {
  AuthenticationService,
  TokenUser,
} from '@app/services/authentication.service';
import { Role, RolesService } from '@app/services/roles.service';
import { PermissionEnum } from '@app/auth.guard';
import { EditedRole } from './role/role.component';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  user?: TokenUser;
  roles: Role[] = [];
  permissions: Permission[] = [];

  newRole?: Role;

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private authenticationService: AuthenticationService,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.permissionsService
      .getAll()
      .pipe(
        mergeMap((permissions) => {
          this.permissions = permissions.permissions;
          return this.rolesService.getAll();
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

  get canEdit() {
    return this.authenticationService.hasPemission(PermissionEnum.ROLES_EDIT);
  }

  add() {
    this.newRole = {
      code: 'new_role',
      name: 'Новая роль',
      permissions: [],
    };
  }

  edit(editedRole: EditedRole) {
    let editResult: Observable<Object>;
    if (this.newRole) {
      editResult = this.rolesService.post({
        ...editedRole,
        permissions: editedRole.permissions.map(
          (permission) => permission.code
        ),
      });
    } else {
      editResult = this.rolesService.put(editedRole.oldCode, {
        ...editedRole,
        permissions: editedRole.permissions.map(
          (permission) => permission.code
        ),
      });
    }

    editResult
      .pipe(mergeMap(() => this.rolesService.getAll()))
      .pipe(
        catchError((error) => {
          this.loadingService.stopLoading();
          this.notificationsService.error(error);
          return throwError(error);
        })
      )
      .subscribe((roles) => {
        this.roles = roles.roles;
        this.newRole = undefined;
        this.loadingService.stopLoading();
      });
  }

  delete(deletedRole: EditedRole) {
    if (this.newRole) {
      this.newRole = undefined;
      return;
    }
    this.rolesService
      .delete(deletedRole.oldCode)
      .pipe(mergeMap(() => this.rolesService.getAll()))
      .pipe(
        catchError((error) => {
          this.loadingService.stopLoading();
          this.notificationsService.error(error);
          return throwError(error);
        })
      )
      .subscribe((roles) => {
        this.roles = roles.roles;
        this.loadingService.stopLoading();
      });
  }
}
