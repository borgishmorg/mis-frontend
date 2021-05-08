import { Component, OnInit } from '@angular/core';
import { PermissionEnum } from '@app/auth.guard';
import { TokenUser, User } from '@app/models';
import { AuthenticationService } from '@app/services/authentication.service';
import { Permission, PermissionsService } from '@app/services/permissions.service';
import { Role, RolesService } from '@app/services/roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  loading: boolean = true;
  user?: TokenUser;
  roles: Role[] = [];
  permissions: Permission[] = [];

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.permissionsService.getAll().subscribe(permissions => this.permissions = permissions.permissions)
    this.rolesService.getAll().subscribe(roles => this.roles = roles.roles)
    this.authenticationService.user.subscribe(user => this.user = user)
    this.loading = false;
  }

  checkPermission(permission: Permission, permissions: Permission[]): boolean {
    return permissions.some(p => p.code === permission.code)
  }

  get canEdit() {
    return this.user?.permissions.includes(PermissionEnum.ROLES_EDIT);
  }
}
