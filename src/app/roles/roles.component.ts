import { Component, OnInit } from '@angular/core';
import { PermissionEnum } from '@app/auth.guard';
import { TokenUser } from '@app/models';
import { AuthenticationService } from '@app/services/authentication.service';
import { Permission, PermissionsService } from '@app/services/permissions.service';
import { Role, RolesService } from '@app/services/roles.service';
import { first } from 'rxjs/operators';

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
  
  newRole?: Role;

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
        this.permissions = permissions.permissions
      })
    this.rolesService
      .getAll()
      .pipe(first())
      .subscribe(roles => {
        this.roles = roles.roles
      })
    this.authenticationService.user
      .pipe(first())
      .subscribe(user => {
        this.user = user
    })
    this.loading = false;
  }
  
  get canAdd() {
    return this.user?.permissions.includes(PermissionEnum.ROLES_ADD);
  }

  add() {
    this.newRole = {
      code: "new_role",
      name: "Новая роль",
      permissions: []
    }
  }
}
