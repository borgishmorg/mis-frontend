import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthenticationService, TokenUser } from '@app/services/authentication.service';
import { Permission } from '@app/services/permissions.service';
import { Role } from '@app/services/roles.service';
import { PermissionEnum } from '@app/auth.guard';

export interface EditedRole extends Role {
  oldCode: string;
}

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
export class RoleComponent implements OnInit, OnDestroy {
  
  @Input() role?: Role;
  oldRole?: Role;
  @Input() allPermissions: Permission[] = [];
  
  @Output() editedRole = new EventEmitter<EditedRole>();
  @Output() deletedRole = new EventEmitter<EditedRole>();

  user?: TokenUser;
  userSubscription?: Subscription;

  allChecked: boolean = false;
  permissionsGroup: PermissionsGroup = {
    checked: false,
    permissions: []
  };

  error = '';

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.role) {
      this.oldRole = {
        code: this.role.code,
        name: this.role.name,
        permissions: this.role.permissions
      }
    }
    
    this.userSubscription = this.authenticationService.user.subscribe(user => {this.user = user});
    this.dropForm();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
    Object.assign(this.role, this.oldRole);
    this.permissionsGroup.checked = this.permissionsGroup.permissions.every(p => p.checked);
    this.allChecked = this.permissionsGroup.checked;
    this.error = '';
  }

  save() {
    if (this.role && this.oldRole) {
      this.editedRole.emit({
        ...this.role,
        oldCode: this.oldRole.code,
        permissions: this.permissionsGroup.permissions.filter(permission => permission.checked)
      });
    }
  }

  delete() {
    if (this.role && this.oldRole) {
      this.deletedRole.emit({
        oldCode: this.oldRole.code,
        ...this.role
      });
    }
  }

  hasPermission(permission: Permission): boolean {
    return !!this.role?.permissions.some(p => p.code === permission.code)
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
}
