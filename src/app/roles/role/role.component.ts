import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionEnum } from '@app/auth.guard';
import { TokenUser } from '@app/models';
import { AuthenticationService } from '@app/services/authentication.service';
import { Permission } from '@app/services/permissions.service';
import { Role, RolesService } from '@app/services/roles.service';
import { first } from 'rxjs/operators';

export interface PermissionChecked extends Permission {
  checked: boolean;
}

export interface PermissionsGroup {
  checked: boolean;
  permissions: PermissionChecked[];
}

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  
  @Input() role?: Role;
  @Input() allPermissions: Permission[] = [];
  
  user?: TokenUser;

  code: string = "";
  name: string = "";

  allChecked: boolean = false;
  permissionsGroup?: PermissionsGroup;

  error = '';

  constructor(
    private authenticationService: AuthenticationService,
    private rolesService: RolesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authenticationService.user.subscribe(user => this.user = user)
    this.dropForm();
  }

  dropForm() {
    this.permissionsGroup = {
      checked: false,
      permissions: this.allPermissions.map(p => {
        return {
          name: p.name,
          code: p.code,
          checked: this.hasPermission(p)
        }
      })
    }
    if (this.role) {
      this.code = this.role.code;
      this.name = this.role.name;
    }
    this.permissionsGroup.checked = this.permissionsGroup.permissions.every(p => p.checked);
    this.allChecked = this.permissionsGroup.checked;
    this.error = '';
  }

  save() {
    if (this.role && this.permissionsGroup) {
      this.rolesService.put(
        this.role.code,
        {
          code: this.code,
          name: this.name,
          permissions: this.permissionsGroup.permissions
            .filter(permission => permission.checked)
            .map(permission => permission.code)
        }
      ).pipe(first()).subscribe({
        next: () => {
          this.reloadCurrentRoute();
        },
        error: error => {
          this.error = error;
        }
      })
    }
  }

  delete() {
    if (this.role) this.rolesService.delete(this.role.code).pipe(first()).subscribe({
      next: () => {
        this.reloadCurrentRoute();
      },
      error: error => {
        this.error = error;
      }
    });
  }

  hasPermission(permission: Permission): boolean {
    return !!this.role?.permissions.some(p => p.code === permission.code)
  }

  get canAdd() {
    return this.user?.permissions.includes(PermissionEnum.ROLES_ADD);
  }

  get canEdit() {
    return this.user?.permissions.includes(PermissionEnum.ROLES_EDIT);
  }

  updateAllChecked() {
    this.allChecked = !!this.permissionsGroup?.permissions.every(p => p.checked);
  }

  someComplete(): boolean {
    if (!this.permissionsGroup) return false;
    return this.permissionsGroup.permissions.filter(p => p.checked).length > 0 && !this.allChecked;
  }

  setAll(status: boolean) {
    this.allChecked = status;
    if (!this.permissionsGroup) {
      return;
    }
    this.permissionsGroup.permissions.forEach(p => p.checked = status);
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
